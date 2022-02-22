var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
var path = require("path");
var fs = require("fs");
var glob = require("glob");
var minimatch = require("minimatch");
function src_default(options = {}) {
  const FILE_REGEX = /\.s[c|a]ss(\?direct)?$/;
  const IMPORT_REGEX = /^([ \t]*(?:\/\*.*)?)@import\s+["']([^"']+\*[^"']*(?:\.scss|\.sass)?)["'];?([ \t]*(?:\/[/*].*)?)$/gm;
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
      result = IMPORT_REGEX.exec(src);
      if (result !== null) {
        const [importRule, startComment, globPattern, endComment] = result;
        let files = [];
        let basePath = "";
        for (let i2 = 0; i2 < searchBases.length; i2++) {
          basePath = searchBases[i2];
          files = glob.sync(path.join(basePath, globPattern), {
            cwd: "./"
          });
          if (files.length > 0) {
            break;
          }
        }
        let imports = [];
        files.forEach((filename) => {
          if (isSassOrScss(filename)) {
            filename = path.normalize(filename).replace(basePath, "");
            filename = filename.replace(/^\//, "");
            if (!ignorePaths.some((ignorePath) => {
              return minimatch(filename, ignorePath);
            })) {
              imports.push('@import "' + filename + '"' + (isSass ? "" : ";"));
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
module.exports = __toCommonJS(src_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
