# Agent notes

Project conventions that the code does not make obvious. See `CONTRIBUTING.md` for setup and commit format.

## Testing

- `pnpm test` runs `tsc` and vitest. `vitest.config.ts` is standalone and does not load vite-plugin-monkey.
- `node --test` does not work here. Use vitest, mock browser-only modules with `vi.mock` and stub `location` with `vi.stubGlobal`.
- To check a change on the live chatgpt.com, use the browser-test skill in `.agents/skills/browser-test/`.

## Real conversations

Never commit a real conversation, and do not quote one in docs, tests, comments or commit messages. Write neutral text of your own instead.

- Keep raw exports outside the repository root, or `pnpm lint` reports thousands of errors on them.
- Turn one into a fixture with `scripts/sanitize-conversation.mjs`. Before committing, read the strings it reports as unknown and check that no CJK or non-placeholder text is left.
- Derive expected values from the raw data, not from what the new code outputs.

## Data comes from the API

Exports read the conversation API or data the page already holds, such as React Router `loaderData` in `src/page.ts`. Do not scrape the DOM for content. The project started DOM-based and kept breaking whenever ChatGPT changed its UI. When structured data is missing, fail with a clear error instead of falling back to DOM heuristics.

## Text export stays light

"Copy Text" is for quick sharing in chat apps, so it leaves out thinking and the source list on purpose. Do not wire `KEY_THINKING_ENABLED` or `KEY_SOURCES_ENABLED` into `src/exporter/text.ts`.

## ChatGPT layout variants

ChatGPT A/B tests its layout, so different users see different variants at the same time. Fixing only the variant in front of you breaks everyone else.

- Note `Added YYYY-MM-DD` on every new selector or mount point and keep it for at least 30 days. The rule is also at the top of `src/main.tsx`.
- Remove an old one only while already working nearby, and only after checking that no variant still renders it.
- Mount the menu on every surface that can show it instead of picking one. Variants can sit in the DOM together, with the hidden one marked `inert`.
- If injected UI disappears right away, check whether it landed inside an `inert` variant.

## UI styles

The exporter owns its styles and does not use ChatGPT's classes. Tailwind classes that ChatGPT stops using drop out of its build without notice.

- Use `ce-` kebab-case class names. No Tailwind utilities and no generic names like `Button`.
- Map ChatGPT tokens to `--ce-*` only in `src/ui/theme.css`, each with a fallback. Components use `--ce-*` only.
- Add `ce-root` to every root we render, such as the sidebar container, hover card and dialog, so the reset applies.
- Wrap the whole reset selector in `:where()`. A bare `:is()` brings its highest specificity along and overrides component classes.
- `.ce-range` needs `appearance: auto`, and the reset must not set its background, or the range input loses its native look.
- Prefix keyframes with `ce-` so they do not collide with the page's.
- `scripts/browser-test/export.mjs` finds menu items by `.ce-menu-item`. Rename both together.
