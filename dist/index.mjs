// src/index.ts
import path from "path";
import fs from "fs";
import { globSync } from "glob";
import { minimatch } from "minimatch";
import c from "ansi-colors";
function sassGlobImports(options = {}) {
  const FILE_REGEX = /\.s[c|a]ss(\?direct)?$/;
  const IMPORT_REGEX = /^([ \t]*(?:\/\*.*)?)@(import|use)\s+["']([^"']+\*[^"']*(?:\.scss|\.sass)?)["'];?([ \t]*(?:\/[/*].*)?)$/gm;
  let filePath = "";
  let fileName = "";
  function isSassOrScss(filename) {
    return !fs.statSync(filename).isDirectory() && path.extname(filename).match(/\.sass|\.scss/i);
  }
  const transform = (src) => {
    const isSass = fileName.endsWith(".sass");
    const searchBases = [filePath];
    const ignorePaths = options.ignorePaths || [];
    let contentLinesCount = src.split("\n").length;
    let result;
    for (let i = 0; i < contentLinesCount; i++) {
      result = [...src.matchAll(IMPORT_REGEX)];
      if (result.length) {
        const [importRule, startComment, importType, globPattern, endComment] = result[0];
        let files = [];
        let basePath = "";
        for (let i2 = 0; i2 < searchBases.length; i2++) {
          basePath = searchBases[i2];
          files = globSync(path.join(basePath, globPattern), {
            cwd: "./"
          }).sort((a, b) => a.localeCompare(b, "en"));
          const globPatternWithoutWildcard = globPattern.split("*")[0];
          if (globPatternWithoutWildcard.length) {
            const directoryExists = fs.existsSync(path.join(basePath, globPatternWithoutWildcard));
            if (!directoryExists) {
              console.warn(c.yellow(`Sass Glob Import: Directories don't exist for the glob pattern "${globPattern}"`));
            }
          }
          if (files.length > 0) {
            break;
          }
        }
        let imports = [];
        files.forEach((filename, index) => {
          if (isSassOrScss(filename)) {
            filename = path.relative(basePath, filename).replace(/\\/g, "/");
            filename = filename.replace(/^\//, "");
            if (!ignorePaths.some((ignorePath) => {
              return minimatch(filename, ignorePath);
            })) {
              let namespaceExport = "";
              if (importType === "use" && options.namespace) {
                let namespace = "";
                if (typeof options.namespace === "function") {
                  const computedNamespace = options.namespace(filename, index);
                  namespace = typeof computedNamespace === "string" ? computedNamespace : "";
                } else if (typeof options.namespace === "string") {
                  namespace = options.namespace;
                }
                if (namespace.length) {
                  namespaceExport = ` as ${namespace}`;
                }
              }
              imports.push(`@${importType} "` + filename + '"' + namespaceExport + (isSass ? "" : ";"));
            }
          }
        });
        if (startComment) {
          imports.unshift(startComment);
        }
        if (endComment) {
          imports.push(endComment);
        }
        const replaceString = imports.join("\n");
        src = src.replace(importRule, replaceString);
      }
    }
    return src;
  };
  return {
    name: "sass-glob-import",
    enforce: "pre",
    transform(src, id) {
      let result = {
        code: src,
        map: null
        // provide source map if available
      };
      if (FILE_REGEX.test(id)) {
        fileName = path.basename(id);
        filePath = path.dirname(id);
        result.code = transform(src);
      }
      return result;
    }
  };
}
export {
  sassGlobImports as default
};
