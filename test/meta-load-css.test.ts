import { describe, expect, it, vi } from 'vitest';

import sassGlobImportPlugin from '../src';

let source = `
@use 'sass:meta';

body {
  @include meta.load-css("meta-load-css/*.scss");
}
`;

describe('it correctly converts glob patterns to inline meta load imports', () => {
  const plugin: any = sassGlobImportPlugin();

  it('for SCSS', () => {
    const expected = `
@use 'sass:meta';

body {
  @include meta.load-css("meta-load-css/_meta-load-css-a.scss");
  @include meta.load-css("meta-load-css/_meta-load-css-b.scss");
}
`;
    const path = __dirname + '/virtual-file.scss';
    expect(plugin.transform(source, path)?.code).toEqual(expected);
  });

  it('for Sass', () => {
    const expected = `
@use 'sass:meta'

body {
  @include meta.load-css("meta-load-css/_meta-load-css-a.scss")
  @include meta.load-css("meta-load-css/_meta-load-css-b.scss")
}
`;
    const path = __dirname + '/virtual-file.sass';
    expect(plugin.transform(source, path)?.code).toEqual(expected);
  });
});

describe('it warns for invalid glob paths', () => {
  const plugin: any = sassGlobImportPlugin();

  it('for SCSS', () => {
    let source = `
@use 'sass:meta';

body {
  @include meta.load-css("foo/*.scss");
}
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