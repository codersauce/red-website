import Link from "next/link";
import { releaseVersion } from "../../installers.generated";
import { CodeBlock, InlineCode } from "./Code";

const releaseSource = "https://github.com/codersauce/red/blob/eb5e2b6be15325abd12adbfac816f7844afff42c";

export default function ForAgents() {
  return <>
    <section>
      <h2 id="start-with-the-installed-version">Start with the installed version</h2>
      <p>Use this page when helping a user install, configure, or extend Red. Red&apos;s built-in coding assistant has its own <Link className="text-link" href="/docs/agent">Agent guide</Link>. Find documentation through <a className="text-link" href="/llms.txt">the documentation index</a>; each guide is also available at its URL with <code>.md</code> appended.</p>
      <CodeBlock language="shell">{`red --version\nred --help`}</CodeBlock>
      <p>This website&apos;s release metadata identifies <strong>{releaseVersion}</strong>. Compare that with the installed version and read each guide&apos;s minimum-version note before applying instructions. Multiple language servers per document and standalone JSON-RPC plugins require Red v0.9.0 or later. Follow <Link className="text-link" href="/docs/getting-started/install">installation</Link> and <Link className="text-link" href="/docs/getting-started/updating">update instructions</Link> for the user&apos;s installation method. <InlineCode language="shell">red update --check</InlineCode> checks availability without replacing the executable.</p>
    </section>

    <section>
      <h2 id="identify-the-configuration-layer">Identify the configuration layer</h2>
      <div className="docs-table-wrap"><table>
        <thead><tr><th>Layer</th><th>What belongs there</th></tr></thead>
        <tbody>
          <tr><td>Red user configuration</td><td><code>$XDG_CONFIG_HOME/red/config.toml</code> when that variable is non-empty; otherwise <code>~/.config/red/config.toml</code>. Configure servers, formatters, keybindings, and plugin settings here.</td></tr>
          <tr><td>Project files</td><td>Keep <code>package.json</code>, <code>tsconfig.json</code>, <code>eslint.config.js</code>, <code>prettier.config.js</code>, and project dependencies in the workspace.</td></tr>
          <tr><td>External executables</td><td>Install language-server binaries and plugin interpreters separately. Embedded syntax support and a default server definition do not install the server executable.</td></tr>
        </tbody>
      </table></div>
      <p>Merge changes into existing TOML tables, then run <InlineCode language="shell">red --check-config</InlineCode>. A custom server table replaces its built-in entry as a unit, so preserve required selectors and arguments. See <Link className="text-link" href="/docs/configuration">configuration</Link> and <Link className="text-link" href="/docs/languages">language support</Link>.</p>
    </section>

    <section>
      <h2 id="choose-the-interface">Choose the interface</h2>
      <p>Use terminal commands for installation, package management, and configuration checks; use editor commands for interactive operations. For example, <InlineCode language="shell">red plugin list</InlineCode> runs in a terminal, while <InlineCode language="red-command">:languages reload</InlineCode> and <InlineCode language="red-command">:messages</InlineCode> run inside Red. Consult the <Link className="text-link" href="/docs/reference/cli">CLI reference</Link> and <Link className="text-link" href="/docs/sessions">session guide</Link>.</p>
      <p>Use the documented <Link className="text-link" href="/docs/plugins/json-rpc">JSON-RPC</Link> or <Link className="text-link" href="/docs/husk">Husk</Link> API to develop plugins. Red launches an RPC plugin as a child process and owns its editor resources. The protocol is not a general remote-control endpoint for arbitrary external clients and has no generic host-action escape hatch.</p>
    </section>

    <section>
      <h2 id="configure-typescript-eslint-and-prettier">Configure TypeScript, ESLint, and Prettier</h2>
      <p>Follow the complete <Link className="text-link" href="/docs/languages/typescript-eslint">TypeScript and ESLint guide</Link>, including its recorded compatibility baseline. Keep Red&apos;s built-in TypeScript server and register ESLint with overlapping document selectors. Install both server executables on <code>PATH</code>, and install ESLint, TypeScript, and Prettier in the project. ESLint also needs the guide&apos;s empty-section <code>workspace/configuration</code> settings.</p>
      <p>Retain external Prettier formatting with <InlineCode language="toml">formatting.provider = &quot;auto&quot;</InlineCode> and a language formatter definition. Formatter lookup checks the project&apos;s <code>node_modules/.bin</code> before <code>PATH</code>; do not assume language-server startup uses that same lookup. Add formatter definitions for the other language keys if editing JSX or TSX.</p>
      <p>Validate the config and restart Red after server-definition changes, then verify hover, completion, diagnostics from both servers, and an ESLint code action. With the guide&apos;s sample, changing quotes and pressing <kbd>Space f</kbd> should produce <code>formatted with Prettier</code>. Record the observed result, not just a successful config check.</p>
    </section>

    <section>
      <h2 id="create-and-validate-a-plugin">Create and validate a plugin</h2>
      <p>Start from the complete TypeScript or Python package in the <Link className="text-link" href="/docs/plugins/json-rpc">JSON-RPC tutorial</Link>, a Markdown outline and table of contents plugin. Red v0.9.0 uses host API <code>0.19.0</code> and protocol version <code>1</code>; these are distinct from Red&apos;s application version. Red v0.9.1 exposes host API <code>0.20.0</code> and retains support for <code>0.19.0</code> packages. Keep example manifests at the earliest API their features require. Use the tutorial&apos;s manifest and initialization response together. The TypeScript version needs Node.js 22.18 or later.</p>
      <CodeBlock language="shell">{`red plugin install --path ./markdown-outline\nred plugin list`}</CodeBlock>
      <p>Open a Markdown file in Red, run <InlineCode language="red-command">:Outline</InlineCode>, and confirm that the outline panel opens. Listing a package proves installation; invoking its command also exercises process startup and the handshake. If the command does not run, inspect <InlineCode language="red-command">:messages</InlineCode> and <code>red.log</code> in Red&apos;s configuration directory. On Red v0.9.1 and later, use <InlineCode language="red-command">:plugin-status</InlineCode> for the current session&apos;s diagnostic details.</p>
      <p>For more operations, read the <a className="text-link" href={`${releaseSource}/docs/RPC_PLUGIN_PROTOCOL.md`}>v0.9.0 protocol reference</a> and <a className="text-link" href={`${releaseSource}/examples/rpc-json-workbench/README.md`}>complete JSON Workbench example</a>. Match those references to the user&apos;s release before adopting newer APIs.</p>
    </section>

    <section>
      <h2 id="diagnose-the-failing-stage">Diagnose the failing stage</h2>
      <ul>
        <li><strong>Executable:</strong> a bare RPC command resolves on <code>PATH</code>; a command containing a path separator resolves inside the package. Arguments are passed without a shell or <code>~</code> expansion.</li>
        <li><strong>Manifest and handshake:</strong> check API compatibility and ensure returned commands/events match the activation declarations exactly. Wait for <code>initialized</code> before calling host methods.</li>
        <li><strong>Protocol:</strong> reserve stdout for newline-delimited JSON-RPC; log to stderr. Keep reading stdin while awaiting host responses.</li>
        <li><strong>Host method:</strong> check names and parameters against the protocol. Invalid arguments can return an error while the connection stays active; framing corruption can quarantine the plugin.</li>
      </ul>
      <p>On Red v0.9.1 and later, run <InlineCode language="red-command">:plugin-status</InlineCode> to inspect the current editor session. Quarantined or starting plugins appear with diagnostic details; a separate <InlineCode language="shell">red plugin list</InlineCode> process cannot report that live state.</p>
      <p>Read <InlineCode language="red-command">:messages</InlineCode> and <code>red.log</code> in Red&apos;s configuration directory. Use <InlineCode language="shell">red --self-check</InlineCode> for bundled-runtime problems and <InlineCode language="shell">red --check-config</InlineCode> for configuration failures. Follow the <Link className="text-link" href="/docs/troubleshooting">troubleshooting guide</Link> and the relevant tutorial&apos;s failure table. Record the version, exact command, observed error, and smallest reproduction before proposing a fix.</p>
    </section>
  </>;
}
