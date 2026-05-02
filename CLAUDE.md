# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev             # Start Vite dev server at localhost:3080
yarn build           # Build for production (output: ./dist)
yarn build:netlify   # Build for Netlify deployment (output: ./netlify + ./netlify/words/)
yarn preview         # Preview production build at localhost:3080
yarn lint            # Lint src and test JS files
yarn lint:fix        # Lint and auto-fix src and test JS files
yarn test            # Run Vitest test suite (single run)
yarn test:watch      # Run Vitest in watch mode
yarn coverage        # Run Vitest with coverage report
```

## Architecture

This is a vanilla JS browser game — a word tile app based on Wonderful Word Weaving. The build pipeline uses **Vite 8 + Sass**, compiling ES module source into a single `scripts.js` bundle.

### Build pipeline

- **Entry:** `src/index.html` — Vite root is `src/`
- **Styles:** `src/styles/styles.scss` and `src/styles/albert.min.css` linked from HTML; `tippy.js/dist/tippy.css` imported via JS; all merged into `{env}/css/index.css`
- **Scripts:** `src/scripts/index.js` → bundled by Vite/Rollup → `{env}/js/index.js`
- **Service worker:** `src/sw.js` with `{buildtime}` placeholder replaced by a custom Vite plugin at build time → `{env}/sw.js`
- **Static:** `src/site.webmanifest` → `{env}/assets/site.webmanifest`

The `--mode netlify` flag outputs to `./netlify`; a post-build script (`scripts/copy-netlify.mjs`) copies everything to `./netlify/words/` for Netlify routing under the `/words/` sub-path.

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

Vitest + jsdom. Test files live in `test/`. Run with `yarn test`.

- **`test/setup.js`** — global DOM fixture (header, footer, letter list, grid, toggle buttons) loaded before each test file so module-level DOM queries in source files resolve correctly
- **`test/game.test.js`** — dice structure, `defaultGame`, `getGame`/`setGame`, `setComplete`
- **`test/cleanup.test.js`** — legacy localStorage key removal
- **`test/grid.test.js`** — height/width accessors, `updateGrid`, cell/row creation, `addRow*`/`addColumn*`
- **`test/toggle.test.js`** — header/footer and button-text toggles, localStorage persistence, `swapIcons`
- **`test/keyboard.test.js`** — all `Ctrl+` shortcuts dispatch the correct function (modules mocked via `vi.mock`)

Vitest is configured in `vite.config.js` (`test.globals: true`, `test.environment: 'jsdom'`). No separate `babel.config.js` or `jest.config.js`.

### Code style

ESLint enforces: single quotes, no semicolons, 4-space indent (`SwitchCase: 1`), trailing commas on multiline, `arrow-parens` only when required for block bodies.
