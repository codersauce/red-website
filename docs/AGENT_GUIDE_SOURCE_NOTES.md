# Agent guide source verification

`app/docs/_components/ForAgents.tsx` was checked against Red release source
`eb5e2b6be15325abd12adbfac816f7844afff42c`, the revision recorded by the website's
installer metadata. This is source verification, not a claim that the guide's
workflows were executed against a freshly built editor. The existing TypeScript
tutorial retains its separately recorded compatibility baseline.

All source references below are relative to
[that Red revision](https://github.com/codersauce/red/tree/eb5e2b6be15325abd12adbfac816f7844afff42c).

| Guide claim | Source evidence |
| --- | --- |
| Application v0.9.0, host API 0.19.0 | `Cargo.toml:1-4`; `src/plugin/registry.rs:244` |
| `--version`, `--help`, `--check-config`, `--self-check` | Clap `Args` in `src/cli.rs:12-37`; dispatch in `src/main.rs:129-147` |
| Multi-LSP and standalone RPC introduced in v0.9.0 | `CHANGELOG.md:5-33` |
| `red update --check` | `src/cli.rs:98-112` |
| `red plugin install --path` and `red plugin list` | `src/cli.rs:154-187` |
| Configuration directory and non-empty XDG override | `src/config.rs:1656-1675` |
| Custom server replaces one built-in entry | `src/config.rs:1572-1581` |
| Default TypeScript executable, selectors, arguments | `src/config.rs:1469-1481` |
| Server process uses configured command directly | `src/lsp/client.rs:186-197` |
| Formatter project tool lookup precedes PATH | `src/formatter.rs:49-76` |
| External formatting precedes LSP in auto mode; observable message | `src/editor.rs:32090-32131` |
| `:messages` and `:languages reload` | `src/editor.rs:17552-17574` |
| Child process, package working directory, no shell | `src/plugin/registry.rs:825-846`; `docs/RPC_PLUGIN_PROTOCOL.md:35-41` |
| Newline framing; stdout/stderr distinction | `docs/RPC_PLUGIN_PROTOCOL.md:80-96` |
| Exact command/event agreement and initialized ordering | `src/plugin/registry.rs:2399-2447`; `src/plugin/rpc.rs:624-645`; `docs/RPC_PLUGIN_PROTOCOL.md:166-205` |
| Typed, limited host API; no generic host-action escape hatch | `docs/RPC_PLUGIN_PROTOCOL.md:650-687` |
| Application error versus quarantine | `docs/RPC_PLUGIN_PROTOCOL.md:689-700` |

The guide links to the existing installation, configuration, TypeScript/ESLint,
JSON-RPC, and troubleshooting pages for complete procedures and their validation
results. The protocol and complete example links are pinned to the verified
release revision, so future `main` changes cannot silently change their contract.

When advancing the website's release metadata, review these pins and the fixed
v0.9.0 compatibility statement. Do not infer a new tested baseline from a version
bump alone. Keep application, host API, and transport protocol versions separate.
