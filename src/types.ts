export interface PluginOptions {
  ignorePaths?: string[],
  namespace?: string | ((filepath: string, index: number) => string)
}

export interface TransformResult {
  code: string,
  map: null,
}