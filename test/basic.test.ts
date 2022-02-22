import { it, describe, expect } from 'vitest';
import sassGlobImportPlugin from '../src';

const original = `
@import "files/*.scss";
`;

describe('it correctly converts glob patterns to inline imports', () => {
  const plugin: any = sassGlobImportPlugin();

  it('for SCSS', () => {
    const expected = `
@import "files/_file-a.scss";
@import "files/_file-b.scss";
`;
    const path = __dirname + '/virtual-file.scss';
    expect(plugin.transform(original, path)?.code).toEqual(expected);
  });

  it('for Sass', () => {
    const expected = `
@import "files/_file-a.scss"
@import "files/_file-b.scss"
`;
    const path = __dirname + '/virtual-file.sass';
    expect(plugin.transform(original, path)?.code).toEqual(expected);
  });
});