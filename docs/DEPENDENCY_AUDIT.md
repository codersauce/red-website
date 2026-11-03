# Website dependency audit

Checked on 2026-10-23 for the Red v0.10.0 website update. Rerun the audits before
publication; advisory counts are a snapshot.

`npm audit --omit=dev` reported one critical finding in Next.js 16.4.0
([GHSA-2464-fhr4-w9xw](https://github.com/advisories/GHSA-2464-fhr4-w9xw),
[GHSA-p3m5-59mp-jv5r](https://github.com/advisories/GHSA-p3m5-59mp-jv5r) and
[GHSA-673q-mjm6-r5xr](https://github.com/advisories/GHSA-673q-mjm6-r5xr)).
Next.js is pinned to 16.4.3, which fixes them, and the production audit now
reports zero vulnerabilities. The upgrade changes only the `next` and `@next/*`
packages.

## Bundled runtime

- Next.js is updated to 16.4.3 (16.4.0 on 2026-10-12, along with the affected
  indirect production dependencies).
- React, React DOM, and `react-server-dom-webpack` are aligned at 19.2.8. The
  server renderer is bundled despite being listed as a development dependency;
  this version fixes [GHSA-wx67-qw84-cm4g](https://github.com/advisories/GHSA-wx67-qw84-cm4g).
- `image-size` is overridden to 2.0.4 because Vinext 0.0.50 pins affected 2.0.2.
  The patched version addresses the
  [image parser advisories](https://github.com/advisories/GHSA-5p2g-fcmc-qvqq).
- The indirect `fflate` dependency is updated to a patched compatible release.

## Remaining toolchain findings

The Wrangler, Miniflare, Vite development server, WebSocket, Undici, Sharp,
and esbuild findings concern local tooling. The deployed
[Worker entry](../worker/index.ts) uses Cloudflare's request handler and
`IMAGES` binding for image transformations; it does not run the local
development server or use Sharp for its public image endpoint. The
[Vite configuration](../vite.config.ts) loads the Cloudflare tooling for builds
and local previews.

The remaining Babel, Browserslist, glob/brace parser, YAML, URI parser, and
ESLint findings affect processing of repository files during builds and linting.
They remain visible in the full audit and require separate toolchain maintenance.
This assessment does not dismiss their risks to local development or builds with
untrusted inputs.
