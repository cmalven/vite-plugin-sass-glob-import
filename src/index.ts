import { PluginOptions, TransformResult } from './types';
import { Plugin } from "vite";

const path = require('path');
const fs = require('fs');
const glob = require('glob');
const minimatch = require('minimatch');

export default function (options: PluginOptions = {}): Plugin {
  // Regular expressions to match against
  const FILE_REGEX = /\.s[c|a]ss(\?direct)?$/;
  const IMPORT_REGEX = /^([ \t]*(?:\/\*.*)?)@import\s+["']([^"']+\*[^"']*(?:\.scss|\.sass)?)["'];?([ \t]*(?:\/[/*].*)?)$/gm;

  // Path to the directory of the file being processed
  let filePath = '';

  // Name of the file being processed
  let fileName = '';

  function isSassOrScss(filename: string) {
    return (!fs.statSync(filename).isDirectory() && path.extname(filename).match(/\.sass|\.scss/i));
  }

  const transform = (src: string): string => {
    // Determine if this is Sass (vs SCSS) based on file extension
    const isSass = fileName.endsWith('.sass');

    // Store base locations
    const searchBases = [filePath];

    // Ignore paths
    const ignorePaths = options.ignorePaths || [];

    // Get each line of src
    let contentLinesCount = src.split('\n').length;

    let result;

    // Loop through each line
    for (let i = 0; i < contentLinesCount; i++) {
      // Find any glob import patterns on the line
      result = IMPORT_REGEX.exec(src);

      if (result !== null) {
        const [importRule, startComment, globPattern, endComment] = result;

        let files = [];
        let basePath = '';
        for (let i = 0; i < searchBases.length; i++) {
          basePath = searchBases[i];

          files = glob.sync(path.join(basePath, globPattern), {
            cwd: './',
          });

          if (files.length > 0) {
            break;
          }
        }

        let imports = [];

        files.forEach((filename: string) => {
          if (isSassOrScss(filename)) {
            // Remove parent base path
            filename = path.normalize(filename).replace(basePath, '');
            // Remove leading slash
            filename = filename.replace(/^\//, '');
            if (!ignorePaths.some((ignorePath: string) => {
              return minimatch(filename, ignorePath);
            })) {
              // remove parent base path
              imports.push('@import "' + filename + '"' + (isSass ? '' : ';'));
            }
          }
        });

        if (startComment) {
          imports.unshift(startComment);
        }

        if (endComment) {
          imports.push(endComment);
        }

        const replaceString = imports.join('\n');
        src = src.replace(importRule, replaceString);
      }
    }

    // Return the transformed source
    return src;
  };

  return {
    name: 'sass-glob-import',
    enforce: 'pre',

    transform(src: string, id: string): TransformResult {
      let result: TransformResult = {
        code: src,
        map: null, // provide source map if available
      }

      if (FILE_REGEX.test(id)) {
        fileName = path.basename(id);
        filePath = path.dirname(id);

        result.code = transform(src);
      }

      return result;
    },
  };
}
