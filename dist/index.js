var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => sassGlobImports
});
var import_path = __toESM(require("path"));
var import_fs = __toESM(require("fs"));
var import_glob = __toESM(require("glob"));
var import_minimatch = __toESM(require("minimatch"));
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
          files = import_glob.default.sync(import_path.default.join(basePath, globPattern), {
            cwd: "./"
          });
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
              return (0, import_minimatch.default)(filename, ignorePath);
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
module.exports = __toCommonJS(src_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
