"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => sassGlobImports
});
module.exports = __toCommonJS(src_exports);
var import_path = __toESM(require("path"));
var import_fs = __toESM(require("fs"));
var import_glob = require("glob");
var import_minimatch = require("minimatch");
var import_ansi_colors = __toESM(require("ansi-colors"));
function sassGlobImports(options = {}) {
  const FILE_REGEX = /\.s[c|a]ss(\?direct)?$/;
  const IMPORT_REGEX = /^([ \t]*(?:\/\*.*)?)@(import|use)\s+["']([^"']+\*[^"']*(?:\.scss|\.sass)?)["'];?([ \t]*(?:\/[/*].*)?)$/gm;
  let filePath = "";
  let fileName = "";
  function isSassOrScss(filename) {
    return !import_fs.default.statSync(filename).isDirectory() && import_path.default.extname(filename).match(/\.sass|\.scss/i);
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
          files = (0, import_glob.globSync)(import_path.default.join(basePath, globPattern), {
            cwd: "./"
          });
          files.sort();
          const globPatternWithoutWildcard = globPattern.split("*")[0];
          if (globPatternWithoutWildcard.length) {
            const directoryExists = import_fs.default.existsSync(import_path.default.join(basePath, globPatternWithoutWildcard));
            if (!directoryExists) {
              console.warn(import_ansi_colors.default.yellow(`Sass Glob Import: Directories don't exist for the glob pattern "${globPattern}"`));
            }
          }
          if (files.length > 0) {
            break;
          }
        }
        let imports = [];
        files.forEach((filename) => {
          if (isSassOrScss(filename)) {
            filename = import_path.default.relative(basePath, filename).replace(/\\/g, "/");
            filename = filename.replace(/^\//, "");
            if (!ignorePaths.some((ignorePath) => {
              return (0, import_minimatch.minimatch)(filename, ignorePath);
            })) {
              imports.push(`@${importType} "` + filename + '"' + (isSass ? "" : ";"));
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
        fileName = import_path.default.basename(id);
        filePath = import_path.default.dirname(id);
        result.code = transform(src);
      }
      return result;
    }
  };
}
