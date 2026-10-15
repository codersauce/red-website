# Fresh-agent documentation evaluation

Three independent agents began with only `http://127.0.0.1:8788/llms.txt` and a task prompt, without repository, source, or memory access. Canonical `https://getred.dev` links were retrieved through the local preview by substituting only the origin. All documentation requests succeeded. These evaluations assessed retrieval and the accuracy of proposed instructions; they did not install packages, change user configuration, or run Red. Automated tests and browser checks are separate evidence.

## TypeScript, ESLint, and external Prettier

Prompt: A user on Red v0.9.0 wants TypeScript and ESLint diagnostics/code actions together while keeping external Prettier formatting. Produce setup and observable validation steps, preserving existing configuration and distinguishing user configuration, project files, and external executables.

Retrieved, in order: `/llms.txt`, `/docs/for-agents.md`, `/docs/languages/typescript-eslint.md`, `/docs/configuration.md`, `/docs/languages.md`, `/docs/reference/cli.md`, `/docs/troubleshooting.md`.

Result: correctly retained the built-in TypeScript server, configured overlapping ESLint selectors and empty-section settings, distinguished global language-server executables from project dependencies, retained external Prettier with auto formatting, and warned against duplicate TOML tables. Proposed validation covered TypeScript hover/completion, both diagnostic sources, an ESLint-owned code action, and the `formatted with Prettier` message. It distinguished the historical tested baseline from the current release metadata.

Gaps found and addressed: the language guide and tutorial differed about restarting after server-definition changes; the tutorial now explicitly requires restarting for those changes. The tutorial's save-formatting statement now respects `formatting.on_save`. Existing npm/ESM example assumptions remain explicit rather than promising equivalent migration instructions for every package manager.

## Minimal JSON-RPC plugin

Prompt: Discover how to create a minimal standalone Python or Node.js JSON-RPC plugin for Red v0.9.0, including complete files, installation, and a command greeting its argument.

Retrieved: `/llms.txt`, `/docs/for-agents.md`, `/docs/plugins/json-rpc.md`, `/docs/plugins.md`, `/docs/reference/cli.md`, then the pinned RPC protocol reference. The web tool could not open the GitHub reference once; curl/raw retrieval succeeded. Tool output truncation did not prevent retrieval of the complete minimal example.

Result: produced a complete Python manifest and script with `red_api = "^0.19.0"`, protocol 1 initialization, exact command registration, newline-delimited/flush-safe output, lifecycle handling, and no premature host calls. Proposed `red plugin install --path`, package listing, and `:RpcHello world` with the correct expected greeting. Correctly treated the plugin as an editor-owned child process.

Gaps found and addressed: expanded example links referenced mutable `main`. The Python example and protocol/Husk API references are now release-pinned. The pinned release contains no Node example directory, so that broken external reference was removed; the complete embedded Node implementation remains available. The process-allowlist paragraph now explicitly concerns Husk host API calls.

## Plugin startup diagnosis

Prompt: A listed Python RPC plugin fails on command invocation with invalid-JSON/protocol errors. It prints `starting plugin...` to stdout before reading initialization, then emits JSON lines. Diagnose the stage, propose the smallest correction, and give observable validation steps.

Retrieved: `/llms.txt`, `/docs/for-agents.md`, `/docs/plugins/json-rpc.md`, `/docs/troubleshooting.md`, `/docs/plugins.md`, then a targeted re-fetch of the RPC tutorial after tool output truncation.

Result: correctly diagnosed protocol framing during startup, moved the diagnostic print to stderr, distinguished installation from successful initialization, and proposed restarting Red, invoking the declared command twice, and inspecting new messages/log errors. It did not invent a remote-control interface or require the stderr banner to appear in editor notifications.

Remaining limitation: the guide documents manifest-triggered reload but does not promise script-edit-only reload or precise quarantine recovery behavior. The evaluation used restart as the documented, observable recovery procedure. Actual editor execution remains unperformed in these evaluations.
