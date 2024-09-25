import { Plugin } from 'vite';

interface PluginOptions {
    ignorePaths?: string[];
}

declare function sassGlobImports(options?: PluginOptions): Plugin;

export { sassGlobImports as default };
