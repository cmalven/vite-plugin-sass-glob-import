import { Plugin } from "vite";

//#region src/types.d.ts
interface PluginOptions {
  ignorePaths?: string[];
}
//#endregion
//#region src/index.d.ts
declare function sassGlobImports(options?: PluginOptions): Plugin;
//#endregion
export { sassGlobImports as default };