# Onboarding Guide

Welcome! This document explains how the Words codebase works, in plain English, for
developers who are new to the project (or new-ish to web development in general). It
complements [CLAUDE.md](../CLAUDE.md), which is a terse, current-state reference — this
doc is the guided tour that gets you to the point where CLAUDE.md makes sense at a glance.

If you just want the "what does each file do" cheat sheet, CLAUDE.md's Architecture
section already has that. This doc instead answers: _why is the code shaped this way,
and how do the pieces fit together when someone actually plays the game?_

---

## 1. What this app actually is

A single-page word game that runs entirely in the browser, based on
[Wonderful Word Weaving](http://wonderfulwordweaving.com/). You roll 32 letter dice and
drag the results onto a grid to spell words, horizontally or vertically. There's no
backend server and no network calls at all beyond loading the page — everything the game
needs (letters rolled, grid contents, UI preferences) lives in `localStorage` on your own
machine. Close the tab, come back later, and the game is exactly as you left it.

**No React, no Vue, no framework at all.** This is a deliberate, documented exception to
the rest of Craig's app repos (see the root `CLAUDE.md`'s "Key decisions" section) — for
a game this size, a virtual DOM and component tree would add ceremony without adding
value. Instead, plain JavaScript modules query the DOM directly (`document.getElementById`,
`querySelectorAll`, etc.) and mutate it whenever the game state changes.

## 2. The mental model: state lives in two places

Unlike a typical single-page app with one central store, Words keeps state in two spots
that are kept in sync by convention rather than by a framework:

1. **`localStorage`** — the source of truth that survives a page reload. One key, `game`
   (see `STORAGEID` in [`game.js`](../src/scripts/game.js)), holds a JSON blob shaped
   like:

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

   Two more keys, `compress` and `iconsOnly`, hold UI preferences (header/footer hidden,
   icon-only buttons) independently of game state.

2. **The DOM** — the actual `<li>` letter tiles and `<td>` grid cells the player sees and
   drags around. Every module that changes the game (rolling, dragging a letter, adding a
   row) does two things in the same function call: update the DOM _and_ write the new
   state back to `localStorage` via `setGame()`. There's no reactive binding — if you add
   a new way to mutate the grid, you're responsible for keeping both sides in sync
   yourself.

On page load, `initialize()` in `game.js` reads `localStorage` and rebuilds the DOM to
match (`buildLetters()`, `buildGrid()`). That's the only place state flows _from_ storage
_into_ the DOM; every other path flows the other way (DOM interaction → storage write).

## 3. Where to find things (by scenario)

Rather than reading every file top to bottom, it's usually faster to start from something
you want to change and follow the thread:

- **"I want to change what happens when you roll the dice"** → `game.js` (`roll`,
  `dice` array of 32 six-letter sets) and `letters.js` (`buildLetters`, which renders the
  `#letters__list`).
- **"I want to change how the grid resizes"** → `grid.js`. Adding/removing a row or
  column doesn't just insert a DOM row — it also re-indexes every remaining cell's
  `data-row`/`data-col` attributes, because `dragDrop.js` relies on those attributes to
  know which grid cell a drop landed on. If you add a new grid mutation, make sure it
  re-indexes too.
- **"I want to change drag-and-drop behavior"** → `dragDrop.js`. This handles both real
  drag events and the touch-equivalent (there's no native drag-and-drop on mobile
  browsers), and calls back into `grid.js`/`letters.js`/`game.js` to keep the DOM and
  storage consistent after a drop.
- **"I want to add a keyboard shortcut"** → `keyboard.js` (`handleKeyboard`), wired up
  in `index.js`. Shortcuts are all `Ctrl+<key>` combinations that call the same functions
  the toolbar buttons call — see the table in the root `README.md` for the current list.
- **"I want to change what's visible in compact/icon-only mode"** → `toggle.js`, which
  persists the `compress`/`iconsOnly` preferences and swaps icon/text button labels.
- **"I'm debugging a stale localStorage key from an old version of the game"** →
  `cleanup.js`, which removes obsolete keys from a prior naming scheme on load.
- **"I want to change offline/installable behavior"** → `serviceWorker.js` registers
  `src/sw.js`, which is built with a `{buildtime}` placeholder swapped in by a custom Vite
  plugin (see the Build pipeline section of CLAUDE.md) so the cache busts on every deploy.

`index.js` is the entry point that wires all of the above together: it registers DOM
event listeners for every toolbar button and keyboard shortcut, then calls `initialize()`
to restore the saved game and `tippy()` to activate tooltips.

## 4. Testing philosophy

Tests live in `test/` (not co-located with `src/`, unlike Craig's React/TS repos — see
`test/setup.js`, which builds a fixture DOM shared across every test file). Because there's
no framework, most tests directly call an exported function and then assert on DOM state
or `localStorage` — for example, `grid.test.js` calls `addRowTop()` and checks that a new
`<tr>` appeared with correctly re-indexed cells.

One test worth calling out: `test/accessibility.test.js` runs `axe-core` directly against
the real `src/index.html` markup rendered into jsdom — no Playwright browser needed to
catch most accessibility violations. `color-contrast` is disabled there because jsdom
doesn't perform layout, so it can't evaluate rendered contrast.

E2E tests (`e2e/words.spec.js`, Playwright) cover the handful of things a DOM-only test
can't verify convincingly — actual pointer-driven drag-and-drop, for instance — and only
run in CI, not as a pre-commit hook, since spinning up a browser is too slow for that.

## 5. A note on the vanilla-JS/no-TypeScript choice

If you're coming from Craig's other repos (`sudoku`, `colours`, etc.), you'll notice
`words` has no `.ts` files and the pre-commit hook skips `yarn tsc -b`. This isn't an
oversight — it's an intentional, documented exception (shared with `cryptogram`) for
small vanilla-JS games where there's no shared type surface large enough to justify the
migration cost. See the root `active_projects.md`'s "Exceptions" table for the full
rationale and the other repos it applies to.

---

That's the whole app. If something here goes stale as the code evolves, prefer updating
this file over letting it drift — but keep dated "what changed and why" write-ups out of
it; those belong in commit messages and PR descriptions, not this guide.
