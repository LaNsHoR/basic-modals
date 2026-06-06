# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`basic-modals` is an ultra-lightweight, dependency-light library of promise-based HTML modals: `alert`, `confirm`, `prompt`, and `veil`. It is published to npm and consumed both via `require('basic-modals')` (CommonJS) and as a browser global `window.BasicModals`. The entire implementation lives in two files.

## Commands

```bash
npm test                  # jest with coverage (config is in package.json; jsdom env declared per-test-file)
npx jest -t "render basic alert"   # run a single test by name
npm run start:dev         # webpack-dev-server on http://localhost:9000, serving tests/index.html
```

There is no separate build/lint step. `npm run start:dev` bundles `src/index.js` into `tests/modals.js` (gitignored) via webpack and serves `tests/index.html` as a manual playground. The published package ships `src/` directly (the `files` whitelist is `["src"]`; `main` is `src/index.js` and the `exports` map points both `import` and `require` at it), so consumers bundle the source themselves — there is no dist build to produce.

Tests must declare `@jest-environment jsdom` at the top of the file. jsdom does not implement `<dialog>.showModal()`/`.close()`, so `tests/index.test.js` mocks them in `beforeAll` — any new test file exercising modals needs the same mock.

## Architecture

### veil is the base primitive (the key idea)

Everything is built on `veil()`. `veil` creates a full-screen native `<dialog>`, opens it with `showModal()` (so it lives in the browser top layer with a real `::backdrop`, focus-trap, and Escape handling), and centers its `content`. `content` is either a string (rendered as big centered text) or any `HTMLElement` inserted as-is.

`veil` returns `{ dialog, close, closed }` — **not a promise** — because it's the low-level building block:
- `close(value)` calls `dialog.close(value)` and returns `closed`.
- `closed` resolves with the dialog's `returnValue` *after* the CSS fade-out finishes and the node is removed from the DOM. The removal is delayed by reading `transitionDuration` off the computed style, so the fade plays out before the node leaves.

`alert`/`confirm`/`prompt` are thin wrappers: `build_modal(type, ...)` constructs a `<div class="BasicModalsBox BasicModals<Type>">` card and hands it to `veil` as `content`. Each wrapper wires up buttons whose `onclick` calls `close('ok'|'yes'|'no'|'cancel'|'accept')`, then translates `closed` into the public promise contract (e.g. confirm maps `'yes'`→`true`, `'no'`→`false`, `'cancel'`/Escape→reject-or-false).

### Per-type class convention (don't collapse it)

There is a deliberate, pre-2.0.0-restored convention where **every modal kind has its own root + box class** so each can be themed independently:
- veil root `<dialog>`: `BasicModalsVeil` (standalone), or `BasicModalsVeilAlert` / `BasicModalsVeilConfirm` / `BasicModalsVeilPrompt` for the wrappers. The wrappers get their root class via the `veil_class` option passed into `veil` (an internal-only option).
- inner card: `BasicModalsBox` + `BasicModals<Type>` (`BasicModalsAlert`, etc.).

In `src/style.js`, the four veil roots are styled together through the `veils(suffix)` helper, which expands `veil_classes` into a comma-joined selector list. When adding a new veil-rooted modal, add its class to `veil_classes` so it inherits the shared overlay/backdrop/fade rules.

### Defaults system

`defaults` is exported and mutable — consumers override per-modal-per-parameter (`defaults.alert.button_ok_content = '...'`). Each modal merges `{ ...defaults_original[type], ...defaults[type], ...parameters }`. `defaults_original` is a deep-frozen-by-copy snapshot taken at load so that even if a consumer wipes a key out of `defaults`, the built-in fallback still applies. Preserve this three-way merge when adding parameters: add the new key to both the `defaults` object and the destructure.

### CSS is built in JS

Styles live in `src/style.js` as a JS object and are injected via `CSS(style)` from `html-css-builder` (the sole runtime dependency). Injection is **lazy and guarded**: `inject_styles()` runs once on the first modal open and is a no-op when `document` is undefined, so importing the module in a non-DOM environment (SSR: plain Node, Next, Remix) doesn't crash. The browser global `window.BasicModals` is likewise assigned only when `window` exists. The fade relies on `@starting-style` and `transition ... allow-discrete` (nested at-rules), which is why `html-css-builder >= 0.2.0` is required. Selectors are plain CSS strings (camelCase property keys); nesting like `@starting-style` is expressed as a nested object.

### Argument polymorphism

Every modal accepts either a string shorthand or an options object — e.g. `alert('hi')` is normalized to `alert({ message: 'hi' })` at the top of each function. Keep this `typeof options == 'string'` normalization when touching signatures.

### prompt's two modes

`prompt` has a legacy single-input mode (resolves to a string) and an `inputs` mode: pass `{ name: HTMLElement }` and it renders each element in a `.BasicModalsInputs` container, collecting only those with a `.value` into `fields`, and resolves to `{ name: value }`. `validate` is correspondingly either a single function (applied to every field) or `{ name: fn }` per-field. Elements without a `.value` (separators, labels) are rendered but excluded from results and validation. On dismissal the promise rejects with a reason — `'cancel'` (cancel button) or `'escape'` (Escape key) — so consumers must attach a `.catch`.
