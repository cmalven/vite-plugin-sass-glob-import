import { it, describe, expect, vi } from 'vitest';
import sassGlobImportPlugin from '../src';

let source = `
body {}
@import "files/*.scss";
`;

describe('it correctly converts glob patterns to inline imports', () => {
  const plugin: any = sassGlobImportPlugin();

  it('for SCSS', () => {
    const expected = `
body {}
@import "files/_file-a.scss";
@import "files/_file-b.scss";
`;
    const path = __dirname + '/virtual-file.scss';
    expect(plugin.transform(source, path)?.code).toEqual(expected);
  });

  it('for Sass', () => {
    const expected = `
body {}
@import "files/_file-a.scss"
@import "files/_file-b.scss"
`;
    const path = __dirname + '/virtual-file.sass';
    expect(plugin.transform(source, path)?.code).toEqual(expected);
  });

  it('with @use', () => {
    let source = `
body {}
@use "files/*.scss";
`;
    const expected = `
body {}
@use "files/_file-a.scss";
@use "files/_file-b.scss";
`;
    const path = __dirname + '/virtual-file.scss';
    expect(plugin.transform(source, path)?.code).toEqual(expected);
  });
});

describe('it warns for invalid glob paths', () => {
  const plugin: any = sassGlobImportPlugin();

  it('for SCSS', () => {
    let source = `
body {}
@use "foo/**/*.scss";
`;
    const expected = `
body {}

`;
    const path = __dirname + '/virtual-file.scss';
    vi.spyOn(console, 'warn');
    expect(plugin.transform(source, path)?.code).toEqual(expected);
    expect(console.warn).toHaveBeenCalledTimes(1);
  });
});
