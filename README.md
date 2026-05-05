# Words: a word tile game

A word tile game based on [Wonderful Word Weaving](http://wonderfulwordweaving.com/). Roll 32 letter dice and arrange them on a grid to spell as many words as you can — horizontally or vertically.

## How to play

1. Click **Roll the dice!** to roll your letters.
2. **Drag** letters from the list on the left onto the grid to spell words.
3. Words can read left-to-right or top-to-bottom.
4. Try to use all 32 letters. The letter list signals when every tile has been placed.

**To remove a letter from the grid:** drag it back off the grid (onto the letter list area).

**To replace a letter in a cell:** drag a new letter directly onto an occupied cell — the displaced letter automatically returns to the list.

Your game is saved automatically. If you close the tab and come back, your grid will be right where you left it.

## Controls

| Button | Keyboard | Action |
|---|---|---|
| Roll the dice! | `Ctrl + Enter` | Roll new letters and start a fresh game |
| Reset the grid | `Ctrl + Home` | Clear the grid (keeps the same letters) |
| Add top row | `Ctrl + ↑` | Add a row above the grid |
| Add bottom row | `Ctrl + ↓` | Add a row below the grid |
| Add left column | `Ctrl + ←` | Add a column to the left of the grid |
| Add right column | `Ctrl + →` | Add a column to the right of the grid |
| Toggle header, footer | `Ctrl + Del` | Hide/show the header and footer for more space |
| Toggle button text | `Ctrl + Space` | Switch the toolbar between text labels and icons only |

The grid starts at 10×10. Add rows and columns as needed to fit longer words or more complex arrangements.

## Installation

Words works in any modern browser and can be installed as an app. Look for the install prompt in your browser's address bar or menu to add it to your home screen or desktop for offline use.

## Development

**Stack:** Vanilla JS · Vite 8 · Sass · Vitest · ESLint · Husky · Yarn 4 · Node 24

```bash
yarn dev        # Dev server at localhost:3080 (HMR)
yarn build      # Production build → dist/
yarn preview    # Preview production build at localhost:3080
yarn lint       # Lint src and test files
yarn lint:fix   # Lint and auto-fix
yarn test       # Run test suite (single run)
yarn test:watch # Run tests in watch mode
yarn coverage   # Run tests with coverage report
```

A pre-commit hook (husky) runs `yarn lint && yarn test` automatically before each commit.

## Testing

51 tests across 5 files using Vitest + jsdom. Tests live in `test/` and cover game state, grid mutations, toggle persistence, keyboard shortcuts, and localStorage cleanup.

```bash
yarn test
```

## Deployment

Deployed to [craigmcn.com/words](https://www.craigmcn.com/words/) via Netlify. The production build outputs to `netlify/` and is also copied to `netlify/words/` for Netlify routing under the `/words/` sub-path.

```bash
yarn build:netlify
```
