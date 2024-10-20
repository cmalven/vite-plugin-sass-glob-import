import { it, describe, expect, vi } from 'vitest';
import sassGlobImportPlugin from '../src';

let source = `
body {}
@use "namespaces/*.scss";
@import "files/*.scss";
`;

describe('it correctly applies namespace string', () => {
  const plugin: any = sassGlobImportPlugin({
    namespace: '*'
  });

  it('for SCSS', () => {
    const expected = `
body {}
@use "namespaces/_name-a.scss" as *;
@use "namespaces/_name-b.scss" as *;
@import "files/_file-a.scss";
@import "files/_file-b.scss";
`;
    const path = __dirname + '/virtual-file.scss';
    expect(plugin.transform(source, path)?.code).toEqual(expected);
  });

  it('for Sass', () => {
    const expected = `
body {}
@use "namespaces/_name-a.scss" as *
@use "namespaces/_name-b.scss" as *
@import "files/_file-a.scss"
@import "files/_file-b.scss"
`;
    const path = __dirname + '/virtual-file.sass';
    expect(plugin.transform(source, path)?.code).toEqual(expected);
  });
});

describe('it correctly applies namespace function', () => {
  const plugin: any = sassGlobImportPlugin({
    namespace(filepath){
      return filepath.split('-')[1].replace('.scss', '')
    }
  });

  it('for SCSS', () => {
    const expected = `
body {}
@use "namespaces/_name-a.scss" as a;
@use "namespaces/_name-b.scss" as b;
@import "files/_file-a.scss";
@import "files/_file-b.scss";
`;
    const path = __dirname + '/virtual-file.scss';
    expect(plugin.transform(source, path)?.code).toEqual(expected);
  });

  it('for Sass', () => {
    const expected = `
body {}
@use "namespaces/_name-a.scss" as a
@use "namespaces/_name-b.scss" as b
@import "files/_file-a.scss"
@import "files/_file-b.scss"
`;
    const path = __dirname + '/virtual-file.sass';
    expect(plugin.transform(source, path)?.code).toEqual(expected);
  });
});

describe('it doesn’t apply an empty namespace', () => {
  const plugin: any = sassGlobImportPlugin({
    namespace: ''
  });

  it('for SCSS', () => {
    const expected = `
body {}
@use "namespaces/_name-a.scss";
@use "namespaces/_name-b.scss";
@import "files/_file-a.scss";
@import "files/_file-b.scss";
`;
    const path = __dirname + '/virtual-file.scss';
    expect(plugin.transform(source, path)?.code).toEqual(expected);
  });

  it('for Sass', () => {
    const expected = `
body {}
@use "namespaces/_name-a.scss"
@use "namespaces/_name-b.scss"
@import "files/_file-a.scss"
@import "files/_file-b.scss"
`;
    const path = __dirname + '/virtual-file.sass';
    expect(plugin.transform(source, path)?.code).toEqual(expected);
  });
});

describe('it has access to the glob file index', () => {
  const plugin: any = sassGlobImportPlugin({
    namespace(filepath, index){
      return filepath.replace('.scss', '').split('-')[1] + index
    }
  });

  it('for SCSS', () => {
    const expected = `
body {}
@use "namespaces/_name-a.scss" as a0;
@use "namespaces/_name-b.scss" as b1;
@import "files/_file-a.scss";
@import "files/_file-b.scss";
`;
    const path = __dirname + '/virtual-file.scss';
    expect(plugin.transform(source, path)?.code).toEqual(expected);
  });

  it('for Sass', () => {
    const expected = `
body {}
@use "namespaces/_name-a.scss" as a0
@use "namespaces/_name-b.scss" as b1
@import "files/_file-a.scss"
@import "files/_file-b.scss"
`;
    const path = __dirname + '/virtual-file.sass';
    expect(plugin.transform(source, path)?.code).toEqual(expected);
  });
});
