# vite-plugin-sass-glob-import

> Use glob syntax for @import or @use in your main Sass or SCSS file.

## Install

```shell
npm i -D vite-plugin-sass-glob-import
```

```js
// In vite.config.js

import { defineConfig } from 'vite'
import sassGlobImports from 'vite-plugin-sass-glob-import';

export default defineConfig({
  plugins: [
    sassGlobImports()
  ]
});
```

## Usage

**Note:** Globbing only work in a top-level file, not within referenced files.

```scss
// In src/styles/main.scss

@use 'vars/**/*.scss';
@import 'utils/**/*.scss';
@import 'objects/**/*.scss';
```

The above will be transformed into something like the following before Vite processes it with Sass:

```scss
@use 'vars/var-a.scss';
@use 'vars/var-b.scss';
@import 'utils/utils-a.scss';
@import 'utils/utils-b.scss';
@import 'objects/objects-a.scss';
@import 'objects/objects-b.scss';
@import 'objects/objects-c.scss';
```

## Options

### Namespace

Dart Sass use the last components of the `@use` URL when it comes to set a default namespace. Using globs might end up with namespace collision if multiple files have the same name in different folders.

A simple trick is to set the `namespace` option to `"*"` to make all `@use` global.

```js
// In vite.config.js

import { defineConfig } from 'vite'
import sassGlobImports from 'vite-plugin-sass-glob-import';

export default defineConfig({
  plugins: [
    sassGlobImports({
      namespace: '*'
    })
  ]
});
```

This can also end up with some variables collision. Another possibility is to set the `namespace` option to a function that receive the current `@use` URL and its index in the glob

```js
// In vite.config.js

import { defineConfig } from 'vite'
import sassGlobImports from 'vite-plugin-sass-glob-import';

export default defineConfig({
  plugins: [
    sassGlobImports({
      namespace(filepath, index){
        return filepath.replace('.scss').split('/').at(-3);
      }
    })
  ]
});
```
