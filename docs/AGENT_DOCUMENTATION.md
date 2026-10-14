# Agent-readable documentation

Documentation remains authored in JSX. A build generates Markdown for the landing page and every guide from the built Worker's locally rendered HTML, using the same shared metadata registry as navigation. No production scraping or request-time conversion is involved.

## URL contract

| URL | Representation |
| --- | --- |
| `/docs.md` | Documentation landing page |
| `/docs/<slug>.md` | The corresponding guide |
| `/docs/for-agents.md` | Guidance for coding agents working with Red |
| `/llms.txt` | Task-oriented index with descriptions and Markdown links |

GET and HEAD work without JavaScript, cookies, or authentication. Responses use `Content-Type: text/markdown; charset=utf-8`; HEAD has no body. Known export URLs with a trailing slash redirect with 308, preserving the query string. `/docs/index.md` is not an alias. Unknown documentation Markdown paths return HTTP 404 with a Markdown index link. Unsupported methods on known exports return 405 with `Allow: GET, HEAD`. Malformed encoding returns 400.

The human documentation pages advertise their Markdown alternate and link to `/llms.txt`. View Markdown opens the export; Copy Markdown fetches those same bytes. The separate `/docs/agent` page still describes Red's built-in Agent feature.

Canonical HTML URLs continue to return HTML in this first delivery. Accept negotiation is a separate dependent change.

## Build, routing, and freshness

`npm run build` builds Vinext, then runs `scripts/generate-docs.mjs`. The generator reads `app/docs/manifest.ts`, requests each page from the built Worker with `Accept: text/html` and the canonical origin, and converts only the article content through maintained HTML/Markdown AST tooling. Semantic handling preserves hidden Python/Node panels, installer platforms, callouts, tables, explicit anchors, and literal code. Husk retains its actual language label independently of its Rust highlighting grammar.

The build validates internal documentation links and fragments and roundtrips every fenced code value/language through a Markdown parser. Unknown links, missing pages, and lossy code conversion fail the build. Generated output lives only in `dist/client/_generated/docs/`; stale exports are replaced on each successful generation.

The Worker maps public URLs to these backing assets through the explicit ASSETS binding. Keeping the files away from their public route paths prevents asset-first routing from bypassing response headers and error handling. A missing backing file or HTML fallback produces a 503 rather than a false-success document.

Explicit exports use `Cache-Control: public, max-age=0, must-revalidate`. Asset ETags describe the Markdown representation. The Worker supplements the asset binding's conditional handling for weak, list, and wildcard `If-None-Match` values, including HEAD. Last-Modified is preserved when supplied by the asset binding; the actual local Worker assets smoke exposed ETags rather than Last-Modified.

Each exported page records its title, canonical HTML URL, website Git revision, dirty-build marker when applicable, documented release, and installer source revision. The Git checkout is required during generation. Release information comes from `public/installers.json`; it does not change a page's historical tested baseline. Source/API statements for the new guide are recorded in [source verification notes](AGENT_GUIDE_SOURCE_NOTES.md).

## Verification

Run from the intended checkout:

```sh
npm ci
npm run lint
npm run typecheck
npm test
```

`npm test` checks installer synchronization, builds the application and exports, and exercises the built Worker. Coverage includes every export/index link, alternate/discovery links, exact code values and language labels, all tab/installer variants, Markdown errors, conditional requests, and existing HTML/highlighting behavior.

For actual Worker/assets and browser checks, start Wrangler after the build completes. On sandboxed macOS, polling and a project-local registry avoid file-watcher/registry restrictions:

```sh
CHOKIDAR_USEPOLLING=true \
WRANGLER_REGISTRY_PATH="$PWD/.wrangler/registry" \
WRANGLER_LOG_PATH=.wrangler/wrangler.log \
npx wrangler dev --config dist/server/wrangler.json --port 8788 --ip 127.0.0.1
```

Stop the preview before rebuilding: replacing `dist` while Wrangler watches it can temporarily remove required modules. Restart it after the complete build.

```sh
curl -i http://127.0.0.1:8788/docs/plugins/json-rpc.md
curl -I http://127.0.0.1:8788/docs.md
curl -i http://127.0.0.1:8788/docs/missing.md
curl -i 'http://127.0.0.1:8788/docs.md/?download=1'
curl -i http://127.0.0.1:8788/llms.txt
```

The first implementation passed 27 automated tests, generated 22 pages plus the index, and verified 80 code blocks. Eighteen additional checks exercised the real local Worker/assets runtime, including the conditional behavior that differed from the filesystem test adapter. Browser and fresh-agent evidence are reported separately in the PR; the three retrieval/task evaluations are recorded in [the evaluation report](AGENT_DOCUMENTATION_EVALUATION.md). Those evaluations did not execute Red itself.

## Publication checklist

Merging does not publish this site. Deployment is a separate requested Sites operation.

1. Select the approved source commit, including any required predecessor PR. Record `git rev-parse HEAD` and require a clean worktree.
2. Run the checks and build above on that exact commit. Confirm the exported source revision matches and contains no uncommitted-changes marker.
3. Push that exact source state. Reuse the project in `.openai/hosting.json` and preserve its public audience. Package the matching tested `dist` build and hosting metadata.
4. After publication, test Markdown pages/index, missing-page status, HTML alternates and controls, HEAD/conditionals, and any included negotiation behavior on `getred.dev`, `getrededitor.com`, `rededitor.dev`, `rededitor.app`, and `red-editor.fcoury.chatgpt.site`.
5. Verify HTML and Markdown requests cannot cross-contaminate cache responses. Recheck `/releases`, `/installers.json`, `/install.sh`, and `/install.ps1` against the existing release metadata.

No merge or deployment is performed as part of this implementation handoff.
