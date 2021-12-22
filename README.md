# vite-plugin-sass-glob-import

> Use glob syntax for imports in your main Sass or SCSS file.

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

**Note:** Glob imports only work in a top-level file, not within imported files.

```scss
// In src/styles/main.scss

@import 'vars/**/*.scss';
@import 'utils/**/*.scss';
@import 'objects/**/*.scss';
```

The above will be transformed into something like the following before Vite processes it with Sass:

```scss
@import 'vars/var-a.scss';
@import 'vars/var-b.scss';
@import 'utils/utils-a.scss';
@import 'utils/utils-b.scss';
@import 'objects/objects-a.scss';
@import 'objects/objects-b.scss';
@import 'objects/objects-c.scss';
```

