# RED website

Marketing site for [RED](https://github.com/codersauce/red), the modal terminal
editor for the agent era. Built on [vinext](https://github.com/cloudflare/vinext)
(Next-compatible app router on Vite) and deployed as a Cloudflare Worker.

## Prerequisites

- Node.js `>=22.13.0`

## Development

```bash
npm install
npm run dev     # local dev server
npm run build   # production build (dist/)
npm test        # installer drift check + build + SSR assertions
npm run lint
```

## Layout

- `app/` — the landing page, documentation, release highlights, layout, global styles, and 404
- `public/` — static assets: editor captures, OG image, favicon, and the
  installers (`install.sh`, `install.ps1`, `installers.json`)
- `worker/index.ts` — Cloudflare Worker entry (image optimization + app router)
- `scripts/sync-installers.mjs` — syncs installers from `codersauce/red`
- `tests/rendered-html.test.mjs` — asserts on real SSR output of the built worker

## Installer sync

The install scripts served at `/install.sh` and `/install.ps1` are vendored
from the [`codersauce/red`](https://github.com/codersauce/red) repository and
pinned to a commit in `public/installers.json`:

```bash
npm run sync:installers -- --ref <published release commit>   # sync only an actually published release
npm run check:installers                        # CI drift guard (part of npm test)
```

The sync also regenerates `app/installers.generated.ts`, which feeds the
release version shown across the landing page, documentation, release highlights,
and structured metadata. Always pin the latest **published** release; work from
Red main belongs under the explicitly labeled "Coming next" sections until the
release is public. Keep `app/release-content.ts` aligned with the reviewed
`release/campaign.toml` in the Red repository.

## Deployment

Hosting is driven by `.openai/hosting.json`; `npm run build` packages the site
metadata into `dist/.openai/` via `build/sites-vite-plugin.ts`. There is no
`wrangler.jsonc` — the deploy config is generated into `dist/server/`.
