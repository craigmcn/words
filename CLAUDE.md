# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Build for development (output: ./tmp)
npm run serve        # Build + start browser-sync dev server at localhost:3080
npm run build        # Build for production (output: ./dist)
npm run build:netlify  # Build for Netlify deployment (output: ./netlify)
npm run lint         # Lint src and test JS files
npm run lint:fix     # Lint and auto-fix src and test JS files
npm test             # Run Jest test suite
npm run test:watch   # Run Jest in watch mode
```

## Architecture

This is a vanilla JS browser game — a word tile app based on Wonderful Word Weaving. The build pipeline uses **Gulp + Browserify + Babel**, compiling ES module source into a single `scripts.js` bundle.

### Build pipeline

- **Styles:** `src/styles/**/*.scss` → compiled via `gulp-sass`, output to `{env}/css/`
- **Scripts:** `src/scripts/index.js` (entry) → bundled by Browserify with Babelify, optionally uglified for non-dev envs, output to `{env}/js/scripts.js`
- **Vendor CSS:** `albert.min.css` and `tippy.js/dist/tippy.css` copied to `{env}/css/`
- **HTML/manifest:** copied as-is
- **Service worker:** `src/sw.js` with `{buildtime}` placeholder replaced at build time

The `--env` flag drives output directory and minification: `development` → `./tmp`, `production` → `./dist`, `netlify` → `./netlify` (also outputs a `./netlify/words/` subdirectory copy for Netlify routing).

### Game state

All game state is persisted to `localStorage` under the key `game` (see `STORAGEID` in [src/scripts/game.js](src/scripts/game.js)). The state shape is:

```js
{
  letters: [{ letter: string, used: boolean }, ...],  // 32 rolled dice results
  grid: {
    height: number,
    width: number,
    rows: string[][]  // 2D array of placed letter values
  }
}
```

Two UI preferences are also stored separately: `compress` (hide header/footer) and `iconsOnly` (hide button text labels).

### Script modules

- **`game.js`** — core state: `dice` array (32 dice × 6 faces), `getGame`/`setGame` localStorage helpers, `initialize` (restore from storage on load), `roll` (new game)
- **`letters.js`** — renders the letter tile list (`#letters__list`); `buildLetters` rolls dice or restores from storage, `updateLetter` marks a tile used/unused
- **`grid.js`** — renders and mutates the word grid (`#words__grid tbody`); handles add row/column operations and re-indexes cell `data-row`/`data-col` attributes after structural changes
- **`dragDrop.js`** — drag-and-drop (and touch equivalent) between the letter list and grid cells; calls `updateGrid`/`updateLetter`/`setComplete` to keep DOM and storage in sync
- **`keyboard.js`** — `Ctrl+` keyboard shortcuts mirroring the toolbar buttons
- **`toggle.js`** — header/footer visibility and icon-only button mode, persisted to localStorage
- **`cleanup.js`** — removes obsolete localStorage keys from a prior naming scheme
- **`serviceWorker.js`** — registers `sw.js` for offline support

### Tests

Jest + jsdom. Test files live in `test/`. Run with `npm test`.

- **`test/setup.js`** — global DOM fixture (header, footer, letter list, grid, toggle buttons) loaded before each test file so module-level DOM queries in source files resolve correctly
- **`test/game.test.js`** — dice structure, `defaultGame`, `getGame`/`setGame`, `setComplete`
- **`test/cleanup.test.js`** — legacy localStorage key removal
- **`test/grid.test.js`** — height/width accessors, `updateGrid`, cell/row creation, `addRow*`/`addColumn*`
- **`test/toggle.test.js`** — header/footer and button-text toggles, localStorage persistence, `swapIcons`
- **`test/keyboard.test.js`** — all `Ctrl+` shortcuts dispatch the correct function (modules mocked)

`babel.config.js` applies `@babel/preset-env` in the `test` environment only (targets current Node); the gulp build is unaffected.

### Code style

ESLint enforces: single quotes, no semicolons, 4-space indent (`SwitchCase: 1`), trailing commas on multiline, `arrow-parens` only when required for block bodies.
