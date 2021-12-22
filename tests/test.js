const sassGlobImportPlugin = require('../dist');

const original = `
@import "files/*.scss";
`;

describe('it correctly converts glob patterns to inline imports', () => {
  const plugin = sassGlobImportPlugin();

  test('for SCSS', () => {
    const expected = `
@import "files/_file-a.scss";
@import "files/_file-b.scss";
`;
    const path = __dirname + '/virtual-file.scss';
    return expect(plugin.transform(original, path).code).toEqual(expected);
  });

  test('for Sass', () => {
    const expected = `
@import "files/_file-a.scss"
@import "files/_file-b.scss"
`;
    const path = __dirname + '/virtual-file.sass';
    return expect(plugin.transform(original, path).code).toEqual(expected);
  });
});