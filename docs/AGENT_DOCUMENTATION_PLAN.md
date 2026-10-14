# Agent-readable Red documentation

Make Red's documentation easy for coding agents to discover and retrieve as accurate, version-aware Markdown. This plan was accepted for implementation on October 14, 2026. It is based on `/tmp/handoff.txt`; execution evidence is recorded in the accompanying validation and evaluation documents.

**Recommendation: deliver two PRs.** First ship generated Markdown, discovery, View/Copy Markdown controls, and the agent guide. Then add content negotiation in a dependent PR, giving its HTTP and caching behavior a separate review. Both deliveries stop at ready-for-review PRs and a publication handoff.

## Starting point and scope

- Remote syntax-highlighting branch currently points to `4a7d64affbd0c659bf941985376afab020b9c02e`; remote `main` is still `1341588d78dd6181d8533cbb8fc89dd7278939de`. No PR currently exists for the syntax branch. The user reports deployment complete; deployment and branch integration remain separate facts.
- Before implementation, fetch remote state and create durable sibling worktree `/Users/felipe.coury/code/red-website.fcoury-agent-docs`, branch `fcoury/agent-docs`, using `wt` if practical. Base it on the syntax branch if still unmerged; describe that dependency in the PR. If integrated, use refreshed `main`.
- Preserve the deployed highlighting behavior, including highlighted inline commands/expressions and neutral paths/filenames.
- The website documents Red `v0.9.0`, with installer source revision `eb5e2b6be15325abd12adbfac816f7844afff42c`. The inspected Red checkout is older, so fetch and inspect the pinned release revision before authoring command/API claims.
- Exclude a platform migration, independently maintained Markdown corpus, MCP server, search/vector infrastructure, generated skill packages, and `/llms-full.txt` from this delivery.
- No merging or deployment is part of this handoff.

## PR 1: explicit exports, discovery, and agent guidance

### 1. Prove conversion on the JSON-RPC guide

**Keep JSX authoritative and generate after the Vinext build.** Import the built Worker and render documentation locally with the canonical origin, following the existing [rendered-HTML test harness](../tests/rendered-html.test.mjs). No production fetches or separate JSX renderer are needed.

Use a maintained HTML-to-Markdown AST pipeline, provisionally `rehype-parse` → focused semantic transformations → `rehype-remark` → `remark-gfm` / `remark-stringify`. Keep conversion dependencies in the build tooling. [rehype-remark](https://github.com/rehypejs/rehype-remark) provides the HTML-to-Markdown AST bridge, with [remark-gfm](https://github.com/remarkjs/remark-gfm) supporting tables.

Start with `/docs/plugins/json-rpc`, then the installation page to cover installer variants. Select actual article content and add only the semantic annotations needed by these rules:

- Preserve title, description, headings, lists, prerequisites, version requirements, meaningful image descriptions, tables, and callouts. Represent callouts as labelled blockquotes.
- Read code text directly from the parsed code element without trimming. Remove token wrappers while preserving their text. Use `data-language`, so Husk stays `husk` even when its visual grammar is Rust. Choose fences that safely contain embedded backticks.
- Keep every language and installer panel, including hidden panels, under explicit language/platform labels. Remove shell prompt decorations, copy buttons, and status UI.
- Preserve inline code and keyboard notation. Remove decorative step numerals so ordered lists do not acquire duplicate numbers.
- Exclude shell navigation, pagination, scripts, and styles. Preserve the landing page's substantive topic links even though their HTML currently uses `<nav>`.
- Preserve explicit fragment anchors, including landing-page IDs that differ from automatic Markdown slugs. Rewrite a fragment link to Markdown only when its target is verified; otherwise retain its valid canonical HTML target. Avoid adding unused anchors across every page.

**Proof gate:** review the rendered Markdown and compare parsed Markdown code values with source code values, including trailing whitespace, Unicode, quotes, and embedded fences. Do not expand the exporter until fidelity works without a parallel documentation corpus or broad source rewrites.

### 2. Generate the entire documentation set

- Extract the existing route/title/description/group metadata into one lightweight shared manifest used by the documentation registry, exporter, and discovery index. Include the separately implemented `/docs` landing page and new `/docs/for-agents` page explicitly.
- Render every manifest entry at `https://getred.dev`, convert it, and emit generated assets after the application build. Fail the build for missing pages, conversion failures, or invalid generated links.
- Include concise metadata: title, canonical HTML URL, website source revision, and documented Red release derived from existing installer metadata. Distinguish website revision from Red release/source revision. Mark development builds with uncommitted changes as such; publication uses a clean exact commit.
- Preserve existing page-specific tested baselines. Release metadata alone does not justify saying the whole corpus was tested against that release.
- Make links absolute and canonical. Prefer generated Markdown destinations for internal documentation links, with validated fragment handling. Preserve external links and image descriptions.

### 3. Serve an explicit, predictable URL contract

| Public URL | Behavior |
| --- | --- |
| `/docs.md` | Documentation landing page |
| `/docs/<slug>.md` | Corresponding guide, including `/docs/for-agents.md` |
| `/llms.txt` | Generated task-oriented Markdown index |
| Known Markdown URL with trailing `/` | 308 redirect to canonical form, preserving query string |
| Unknown documentation Markdown URL | HTTP 404 with a short Markdown body linking to canonical `/llms.txt` |

Omit `/docs/index.md` initially. Serve Markdown with `Content-Type: text/markdown; charset=utf-8`. Support GET and HEAD, explicitly returning no HEAD body; reject other methods on export endpoints with 405 and `Allow: GET, HEAD`.

Add a narrow route handler before Vinext delegation in [worker/index.ts](../worker/index.ts). Store backing files under `dist/client/_generated/docs/` and map public URLs to these assets through `env.ASSETS`; do not place files at matching public `/docs*.md` asset paths. This keeps the Worker in charge of headers and errors despite Cloudflare's default asset-first routing. These backing paths are an implementation detail, not protected content. [Cloudflare routing documentation](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/)

Explicit exports use `Cache-Control: public, max-age=0, must-revalidate` and validators for the Markdown bytes. Forward conditional requests to backing assets and retain the correct representation headers. Verify the actual packaged ASSETS binding: the current generated Wrangler configuration specifies an asset directory without an explicit binding.

### 4. Add discovery and page controls

- Generate `/llms.txt` from the manifest: short Red summary, release-compatibility guidance, task groups, one-line descriptions, and primarily `.md` links. Keep detailed instructions in linked pages. Treat [llms.txt](https://llmstxt.org/) as an open convention, without promising universal discovery or search effects.
- Add **View Markdown** and **Copy Markdown** to the landing page and all guides. Copy fetches the same `.md` response, with accessible loading/success/failure feedback. Preserve code and installer copy behavior.
- Add each page's HTML alternate link with type `text/markdown`, plus a visible discovery link to `/llms.txt` in the docs shell.
- Keep conversion tooling and document bodies out of client JavaScript; copy only needs the page's Markdown URL.

### 5. Write `/docs/for-agents`

Keep this guide around 600–900 words, with a small decision table and links to complete tutorials. Label it distinctly from `/docs/agent`, which documents Red's built-in Agent feature.

Cover version identification; user configuration versus project files versus installed executables; CLI versus editor commands versus plugin APIs; observable validation; and failure diagnosis. Use TypeScript + ESLint + external Prettier and a minimal JSON-RPC plugin as task routes. Describe JSON-RPC as communication with a Red-launched plugin, with documented limitations.

Verify every command and API statement against the pinned release source. In particular, check the tutorial's `red_api = "^0.19.0"` against the documented release and replace mutable protocol references with appropriate release-pinned links. Distinguish Red release, plugin host API, and transport protocol versions. Preserve the TypeScript guide's existing historical test baseline rather than silently upgrading its claims.

## PR 2: negotiated Markdown responses

**Reuse the generated bytes and keep the existing no-store policy on canonical documentation URLs.** Explicit `.md` URLs remain the cacheable retrieval path. No new CDN representation cache is required initially.

- Restrict negotiation to GET/HEAD on canonical documentation pages. Bypass assets, actions, `.rsc`, `_rsc`, and framework-specific requests before media selection.
- Respect media specificity, quality values, and `q=0`. Missing Accept and equally preferred wildcard requests remain HTML; select Markdown when it is preferred. Return 406 when neither supported representation is acceptable.
- Return exactly the explicit endpoint's Markdown bytes and representation validators. Never reuse HTML ETag, Content-Length, or encoding metadata for Markdown.
- Preserve the full existing `Vary` set and include `Accept`, including on conditional responses. Current HTML responses already vary on Accept and RSC dimensions.
- Preserve `Cache-Control: no-store, must-revalidate` for canonical HTML and negotiated Markdown. Any future CDN caching optimization requires a demonstrated representation-specific cache key; `Vary` alone is not deployment evidence.
- Test GET, bodyless HEAD, matching/unmatched validators, weak/list ETags, 304, preference ties, q=0, unsupported media, and repeated alternating HTML/Markdown requests.

## Validation and acceptance

Use the built Worker for behavioral checks. Extend the existing harness with a filesystem-backed ASSETS adapter, then add a focused real Worker/assets runtime smoke test so routing, bindings, and asset validators are exercised beyond mocks.

Required coverage:

- Every manifest page and `/llms.txt` link resolves, including the landing page and agent guide; rewritten links and fragments are valid.
- Every exported code block preserves text and actual language. Compare parsed Markdown with rendered source and include independent fixtures for Unicode, indentation, tabs, quotes, trailing newlines, and embedded backticks.
- Both Python/Node variants, all installers, tables, callouts, prerequisites, and version requirements survive; site chrome and highlighting markup do not.
- Explicit route MIME, redirects, malformed/encoded paths, 404, 405, HEAD, and conditionals behave as specified.
- HTML, syntax highlighting, language tabs, and both existing and new copy controls work. Inspect representative pages in light/dark themes at desktop and narrow widths; verify copy output against the served export.
- PR 2 adds its negotiation, framework bypass, and cache-isolation matrix.

Run `npm run lint`, `npm run typecheck`, and `npm test` on each final PR head. Record manual browser evidence separately from automated results.

Run three fresh-agent evaluations, each beginning with only the served `/llms.txt` URL and its task: configure TypeScript + ESLint + external Prettier; create/install a minimal JSON-RPC plugin; diagnose a concrete plugin startup failure. Give no repository context to the evaluator. Record fetched pages, proposed commands, accuracy against release source, unsupported assumptions, and documentation gaps. If execution is unavailable, retain the exact prompts and mark evaluation unperformed.

## Review and publication handoff

Each PR should explain its scope, base-branch dependency, URL contract, generation path, cache behavior, and freshness model. Include test and evaluation results, limitations, successful/missing-page curl examples, and the exact reviewed commit.

Prepare a separate publication checklist: refresh source state, push the exact approved commit, build/test that commit, reuse the existing Sites project and public audience, and verify the published Markdown, HTML, discovery, negotiation, release page, and installer metadata on all five hosts: `getred.dev`, `getrededitor.com`, `rededitor.dev`, `rededitor.app`, and `red-editor.fcoury.chatgpt.site`. Execution requires a later deployment request.

**Implementation sequence:** prove JSON-RPC and installer conversion, complete PR 1, then implement and validate negotiation in a dependent PR.

## Open questions

No product decision blocks this proposal. Implementation must resolve two proof points: lossless conversion of the hardest examples and actual ASSETS behavior in the packaged Worker. The proof gate and runtime smoke test above make both explicit acceptance requirements.

## Planning locations

- Plan saved in `/Users/felipe.coury/code/red-website`, branch `fcoury/docs-syntax-highlighting`; no PR exists for that branch at planning time.
- Red source inspected read-only in `/Users/felipe.coury/code/red`, branch `main`; that checkout is older than the documented release.
- Implementation uses `/Users/felipe.coury/code/red-website.fcoury-agent-docs`, branch `fcoury/agent-docs`, based on the preserved syntax-highlighting commit.
