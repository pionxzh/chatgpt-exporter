---
name: browser-test
description: Test the built userscript on the real chatgpt.com in a dedicated Chrome over CDP. Inject dist, trigger exports, collect the downloads and inspect them. Use when verifying a change in the live app, reproducing an export or screenshot bug, or measuring why a screenshot differs from the page.
---

# Browser test

Run the current `dist/chatgpt.user.js` on the live chatgpt.com without
Tampermonkey. Everything goes through CDP on a Chrome started only for
testing. The scripts need Node 22+.

The scripts live in `scripts/browser-test/`. Run every command below from
the repository root.

## Setup

1. `scripts/browser-test/start-chrome.sh` starts Chrome with CDP on port 9222 and a
   separate profile in `~/.chrome-chatgpt-test`, or reuses the one that is
   running. The default binary path is macOS; set `CHROME_BIN` elsewhere.
2. The first time, and whenever the session expires or Cloudflare shows a
   challenge, the maintainer logs in by hand. Everything else is automatic.

## Loop

```sh
pnpm build
node scripts/browser-test/inject.mjs --reload    # reload the tab, inject the new build
node scripts/browser-test/eval.mjs -e "return location.href"
node scripts/browser-test/export.mjs Screenshot  # or Markdown, HTML, "Copy Text", ...
node scripts/browser-test/export.mjs JSON "OpenAI Official Format"
```

- `inject.mjs` loads the `@require` libraries, a localStorage GM shim and
  the build. A reload drops it. Navigating by clicking the sidebar keeps it.
  It refuses to inject twice; pass `--reload`.
- `eval.mjs` runs an async function body in the page and prints the
  result. Strings print raw, so large output such as a base64 PNG can be
  piped to a file.
- `click.mjs "<text>" [--selector css] [--hover]` clicks or hovers the first
  visible element with that exact text through CDP input events. Unlike
  `el.click()`, this counts as a user gesture, so hover cards, menus and
  ChatGPT's own controls react as they do for a person. It fails when
  something else covers the element, such as a menu or modal left open.
- `console.mjs [--seconds 5] [-e "<body>"]` prints console messages,
  uncaught exceptions and browser errors such as CSP or failed loads. It
  replays what Chrome kept from before it started, then listens. With
  `-e`, it runs the body after listening starts.
- `export.mjs` clicks a menu item, waits for the download and unpacks
  zips. Output goes to the system temp dir by default. Exports contain real
  conversations: never commit them. The JSON item opens a dialog, so name
  the format too: `JSON "OpenAI Official Format"`. It stops early when the
  page shows an alert instead, such as "Please start a conversation first"
  on the home page.
- Chrome lets a tab download only once without a user gesture. Later
  downloads wait on a prompt in the address bar that a page screenshot does
  not show, so a script sees no file and no error. `export.mjs` avoids it
  with CDP `Browser.setDownloadBehavior`, which saves into its own folder
  while its connection is open. To download any other way, such as an
  `a.click()` through `eval.mjs`, open the same CDP session first. After
  that call the check stays off and files go back to `~/Downloads` until
  Chrome restarts, so restart it to reproduce the block.
- `measure-text.mjs` compares the width of text on the page and inside an
  SVG image. See below.
- `ui-shot.mjs` opens one exporter UI state (`page`, `menu`, `setting`,
  `export`, `json`) and screenshots it. See UI changes below.
- `readme-hero.mjs` shoots the README hero images. See README hero below.

To open a conversation, click it in the sidebar, which keeps the injected
build: `node scripts/browser-test/click.mjs "Title" --selector "nav a"`.

Every script answers JavaScript dialogs: alerts and `beforeunload` are
accepted, `confirm` and `prompt` are dismissed, so a test never confirms
Archive or Delete by accident. Set `CDP_DIALOG=accept` to accept them. Each
dialog is printed to stderr as `[dialog] ...`.

## Inspecting output

- Crop with ffmpeg: `ffmpeg -i in.png -vf crop=W:H:X:Y out.png`. Do not use
  `sips -c`, which ignores the offset and crops from the center.
- Screenshots are 2x. A turn at list offset N CSS px sits near 2N in the image.
- macOS ImageIO (Preview, `sips`) cannot open PNGs taller than about 65k px.

## UI changes

Compare every UI change before and after, in both themes. Capture the
baseline before editing, since the old build is gone once you rebuild:

```sh
pnpm build && node scripts/browser-test/inject.mjs --reload
for t in light dark; do
  for s in menu setting export json; do
    node scripts/browser-test/ui-shot.mjs $s --theme $t --out /tmp/ui/before-$s-$t.png
  done
  node scripts/browser-test/ui-shot.mjs setting --theme $t --scroll bottom --out /tmp/ui/before-setting2-$t.png
done
# edit, rebuild, reinject, then repeat with after-*.png and compare the pairs
```

- `--theme` flips `<html>` only, not the account setting, and lasts until
  the tab reloads.
- Check the collapsed rail too. Toggle the sidebar with `click.mjs`; a
  synthetic `click()` does not toggle it. Hover states also need
  `click.mjs --hover`.
- Toggling settings in the dialog writes them to the test profile. Put them
  back when done.
- To match a ChatGPT control, find the live one and read its computed
  style instead of guessing. Settings > Security and login has switches in
  both states; Library cards show checkboxes on hover.
- Run `git checkout dist/chatgpt.user.js` before committing. CI builds dist.

## README hero

Each README shows `docs/readme/hero-<code>-<light|dark>.png` through a
`<picture>`, so GitHub picks the image for the reader's theme. Reshoot them
when the layout or the menu changes:

```sh
pnpm build
node scripts/browser-test/readme-hero.mjs          # all languages, into docs/readme
node scripts/browser-test/readme-hero.mjs fr ko    # only some
```

- Collapse ChatGPT's sidebar first, so no chat titles show. The script
  stages the rest: it replaces the greeting, which can include the user's
  name, hides the suggestions under the composer, which come from the
  user's calendar and apps, and swaps the avatar for the OpenAI logo. Look
  at every image before committing anyway.
- It switches ChatGPT's UI language in Settings and the exporter's
  language for each shot, then sets both back to automatic. Check that
  the account is back on "Auto detect" if a run fails.
- Greetings and ChatGPT's option labels live in `LANGUAGES` at the top of
  the script. A greeting should read like one of ChatGPT's own, short and
  conversational, not a slogan. The exporter has no Korean locale, so the
  Korean hero keeps the English menu.
- Add a language there, in the README language bars and as a README file.

## Screenshot bugs

SnapDOM freezes each box at its page size and rasterizes the copy as an SVG
`<foreignObject>` image. When text measures differently inside the image,
shrink-to-fit boxes wrap, clip or overlap. Measure before guessing:

```sh
node scripts/browser-test/measure-text.mjs "中文字寬測試" "🥒 Hello" --weight 600
```

Known gaps, both fixed in `src/exporter/image.ts`:

- macOS `system-ui` tracks its CJK fallback to 15.34px per glyph at 16px on
  the page, but not in the image (16px). Fixed by `matchCjkMetrics`.
- Chrome widens emoji below 24px in the image (16px becomes 20px) while the
  glyph stays the same size. Fixed by `pinEmojiWidths`.

Reproduce in this real Chrome before trusting a headless result. Headless
Chrome has different fonts, and a fix found there may not hold here.

Other things that look like bugs but are not:

- Timestamps only show when enabled in settings (`body[data-time-format]`).
- Empty gray image cards can be ChatGPT's own. Check the conversation JSON
  for `"hidden_reason": "insufficient_images"`.
- Third-party images without CORS headers cannot be read from the page. The
  exporter draws placeholders for them by design.

## Gotchas

- `local()` in `@font-face` matches PostScript names such as
  `PingFangTC-Regular`, not family names.
- Styles and fonts a test adds to `<head>` stay until the tab reloads, and a
  failed `FontFace` keeps rejecting later `document.fonts.load` calls.
- Export All hits the conversation API once per chat. Keep test runs small.
- A dialog that opens while no script is connected blocks the page, and a
  later connection cannot answer it. Close the tab and open a new one:
  `curl -s http://127.0.0.1:9222/json/list` for its id, then
  `curl -s http://127.0.0.1:9222/json/close/<id>` and
  `curl -s -X PUT "http://127.0.0.1:9222/json/new?https://chatgpt.com/"`.
