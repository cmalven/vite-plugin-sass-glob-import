export interface PluginOptions {
  ignorePaths?: string[],
}

export interface TransformResult {
  code: string,
  map: null,
}
