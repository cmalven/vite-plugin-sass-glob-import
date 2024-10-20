import { Plugin } from 'vite';

interface PluginOptions {
    ignorePaths?: string[];
    namespace?: string | ((filepath: string, index: number) => string);
}

declare function sassGlobImports(options?: PluginOptions): Plugin;

export { sassGlobImports as default };
