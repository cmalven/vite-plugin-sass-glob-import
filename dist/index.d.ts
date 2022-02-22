import { Plugin } from 'vite';

interface PluginOptions {
    ignorePaths?: string[];
}

declare function export_default(options?: PluginOptions): Plugin;

export { export_default as default };
