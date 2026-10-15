/* eslint-disable react/no-unescaped-entities */

import Callout from "./Callout";
import { CodeBlock, InlineCode } from "./Code";
import LanguageTabs from "./LanguageTabs";
import { excerpt, excerpts, outlinePlugin } from "../examples";

const ts = outlinePlugin.typescript.source;
const py = outlinePlugin.python.source;
const protocolUrl = "https://github.com/codersauce/red/blob/eb5e2b6be15325abd12adbfac816f7844afff42c/docs/RPC_PLUGIN_PROTOCOL.md";

export default function JsonRpcGuide() {
  return <>
    <section>
      <h2 id="what-youll-build">What you'll build</h2>
      <Callout title="Available in Red v0.9.0 and later">Use <strong>Red v0.9.0 or later</strong> for standalone JSON-RPC plugins and the <code>0.19.0</code> host API surface. They are not included in Red v0.8.2.</Callout>
      <p>This guide builds <strong>Markdown Outline</strong>, a plugin that shows a live outline of the Markdown file you're editing and keeps its table of contents up to date. Along the way it uses most of Red's host API: document snapshots and watches, text panels with buttons, transactional edits and undo, the statusline, the clipboard, pickers, configuration, storage, and editor events.</p>
      <CodeBlock language="text">{`README.md                      │ Outline  [t TOC] [c Copy] [u Undo] [x]\n# Bucket                       │ • Bucket\n                               │   • Install\nA token bucket for Rust.       │   • Usage\n                               │     • Configure\n<!-- toc -->                   │   • License\n- [Install](#install)          │\n- [Usage](#usage)              │\n  - [Configure](#configure)    │\n- [License](#license)          │\n<!-- tocstop -->               │\n                               │\n## Install                     │\nNORMAL  README.md                               § 5 headings · 39 words`}</CodeBlock>
      <p>A JSON-RPC plugin is a package with a <code>red-plugin.toml</code> manifest and a program that Red starts as a child process. They talk in JSON-RPC 2.0 over standard input and output. Red keeps ownership of buffers, undo history, focus, panels, and sessions; your process asks for each operation through a versioned <code>red/*</code> host method.</p>
      <div className="docs-table-wrap"><table>
        <thead><tr><th>Rule</th><th>Protocol version 1 behavior</th></tr></thead>
        <tbody>
          <tr><td>Framing</td><td>One compact UTF-8 JSON object per line (<code>\n</code>) on <code>stdin</code> and <code>stdout</code>. Do <strong>not</strong> use LSP <code>Content-Length</code> headers or JSON-RPC batch arrays.</td></tr>
          <tr><td>Standard output</td><td>Reserved strictly for JSON-RPC messages. Write logs and diagnostics to <code>stderr</code>; Red retains the last 16 KiB of <code>stderr</code> when reporting a failure.</td></tr>
          <tr><td>Host API &amp; protocol</td><td>Declare <InlineCode language="toml">red_api = &quot;^0.19.0&quot;</InlineCode> in <code>red-plugin.toml</code> and return <InlineCode language="json">&quot;protocol_version&quot;: 1</InlineCode> from <code>initialize</code>.</td></tr>
          <tr><td>Handshake agreement</td><td><code>initialize</code> must return the exact commands and events declared under <InlineCode language="toml">[activation]</InlineCode> in <code>red-plugin.toml</code>, with no missing or extra entries. Wait for the <code>initialized</code> notification before calling any <code>red/*</code> method.</td></tr>
          <tr><td>Identifiers &amp; revisions</td><td>Document revisions, <code>document_id</code>, and <code>transaction_id</code> are <strong>decimal strings</strong> on the wire so JavaScript does not lose precision above <InlineCode language="javascript">Number.MAX_SAFE_INTEGER</InlineCode>. Keep them as strings.</td></tr>
          <tr><td>Text coordinates</td><td>Zero-based lines and <strong>Unicode-scalar</strong> character offsets (half-open ranges), neither UTF-8 byte offsets nor JavaScript UTF-16 code units.</td></tr>
        </tbody>
      </table></div>
      <p>Every step shows <strong>TypeScript</strong> and <strong>Python</strong>. The TypeScript version runs directly with <InlineCode language="shell">node plugin.ts</InlineCode>: Node.js 22.18 and later strip the types when loading the file, so there is no build step and no dependency to install. The Python version needs Python 3.9 or later and uses only the standard library. Pick a language once; the tabs stay in sync.</p>
    </section>

    <section>
      <h2 id="1-create-the-package-and-a-first-command">1. Create the package and a first command</h2>
      <p>A package is a directory with <code>red-plugin.toml</code> and your program. Red runs <InlineCode language="toml">[rpc].command</InlineCode> with the package directory as its working directory and passes <code>args</code> directly, without a shell. Start with one command that reads the current document and counts its headings:</p>
      <LanguageTabs
        label="First plugin files"
        typescript={<>
          <CodeBlock language="text">{`markdown-outline/\n├── red-plugin.toml\n└── plugin.ts`}</CodeBlock>
          <CodeBlock language="toml" title="markdown-outline/red-plugin.toml">{outlinePlugin.firstCommand.typescript.manifest.trimEnd()}</CodeBlock>
          <CodeBlock language="typescript" title="markdown-outline/plugin.ts">{outlinePlugin.firstCommand.typescript.source.trimEnd()}</CodeBlock>
        </>}
        python={<>
          <CodeBlock language="text">{`markdown-outline/\n├── red-plugin.toml\n└── plugin.py`}</CodeBlock>
          <CodeBlock language="toml" title="markdown-outline/red-plugin.toml">{outlinePlugin.firstCommand.python.manifest.trimEnd()}</CodeBlock>
          <CodeBlock language="python" title="markdown-outline/plugin.py">{outlinePlugin.firstCommand.python.source.trimEnd()}</CodeBlock>
        </>}
      />
      <p>Red sends <code>initialize</code> first. The plugin answers with protocol version 1 and the commands it declared under <InlineCode language="toml">[activation]</InlineCode>. Each <kbd>:Outline</kbd> arrives as a <code>command/execute</code> request. To read the document, the plugin sends its own request, <code>red/DocumentSnapshot</code>, with a fresh <code>id</code>, and Red answers with that same <code>id</code>. On <code>shutdown</code> the plugin replies, and on <code>exit</code> it stops.</p>
      <p>Install the package from its parent directory and check that Red lists it:</p>
      <CodeBlock language="shell">{`red plugin install --path ./markdown-outline\nred plugin list`}</CodeBlock>
      <p>Open a Markdown file such as a README and run <kbd>:Outline</kbd>. Red shows a message like <code>README.md has 7 headings</code>. If the file has a fenced shell example, that count is probably one too high: a <code># comment</code> inside a code block looks like a heading to a simple pattern. The next step fixes that.</p>
      <p>Red reloads a path install when <code>red-plugin.toml</code> changes. After editing the program, save the manifest again (or <InlineCode language="shell">touch</InlineCode> it) to pick up the change without restarting Red.</p>
    </section>

    <section>
      <h2 id="2-find-the-headings">2. Find the headings</h2>
      <p>Markdown headings start with one to six <code>#</code> characters and a space, except inside fenced code blocks. The parser tracks fences (three or more backticks or tildes, closed by the same character at least as many times), removes optional closing <code>#</code> characters, and records each heading's line number. Step 4 uses those line numbers to place the table of contents.</p>
      <LanguageTabs
        label="Heading parser"
        typescript={<CodeBlock language="typescript">{excerpts(ts, ["function parseHeadings", "function nestedList"])}</CodeBlock>}
        python={<CodeBlock language="python">{excerpts(py, ["FENCE =", "HEADING =", "def parse_headings", "def nested_list"])}</CodeBlock>}
      />
      <p>Splitting on <code>\n</code> gives the same zero-based line numbers that Red uses for edits. <code>nestedList</code> renders headings as a Markdown list, indented relative to the shallowest heading, which the panel in the next step displays.</p>
    </section>

    <section>
      <h2 id="3-show-a-live-outline-in-a-panel">3. Show a live outline in a panel</h2>
      <p>Now <kbd>:Outline</kbd> opens a panel. <code>red/TextPanelCreate</code> creates it with an ID that only your connection can use, and <code>red/TextPanelSetContent</code> replaces its blocks; a block with <InlineCode language="json">&quot;format&quot;: &quot;markdown&quot;</InlineCode> renders the nested list. <code>red/StatuslineSet</code> sets the plugin's single statusline item. When the plugin stops or reloads, Red removes its panels and statusline item for you.</p>
      <p>To keep the outline current, the plugin watches the document. Ask for the snapshot with <InlineCode language="json">&quot;include_document_id&quot;: true</InlineCode>, then call <code>red/DocumentWatch</code> with that ID. Red collects changes for 50 ms and sends one <code>document/event</code> notification with <InlineCode language="json">&quot;event&quot;: &quot;changed&quot;</InlineCode>. The event only says that something changed, so the plugin reads the document again. Install the watch before reading, so an edit made in between still produces an event. A plugin can watch two documents at a time; this one follows a single file and releases the previous watch when you switch.</p>
      <LanguageTabs
        label="Outline panel and document watch"
        typescript={<CodeBlock language="typescript">{`${excerpts(ts, ["async function snapshot", "async function openOutline", "async function refresh", "async function closeOutline"])}\n\n// In dispatch():\n${excerpt(ts, 'case "document/event":', 'case "panel/event":')}`}</CodeBlock>}
        python={<CodeBlock language="python">{`${excerpts(py, ["def snapshot", "def open_outline", "def refresh", "def close_outline"])}\n\n# In handle():\n${excerpt(py, 'elif method == "document/event":', 'elif method == "panel/event":')}`}</CodeBlock>}
      />
      <p>Watching changes how the program reads messages. In step 1, nothing could arrive while the plugin waited for a reply. Now a <code>document/event</code> can arrive at any moment, including while a handler is waiting for Red. The TypeScript version delivers each response as soon as it arrives and runs handlers one at a time through a queue. The Python version keeps reading while it waits and handles everything else afterward:</p>
      <LanguageTabs
        label="Message handling"
        typescript={<CodeBlock language="typescript">{excerpts(ts, ["function callHost", "let work =", "function enqueue"])}</CodeBlock>}
        python={<CodeBlock language="python">{excerpts(py, ["def call_host", "def main"])}</CodeBlock>}
      />
      <p>Run <kbd>:Outline</kbd> and add a <code>## heading</code>. The panel and the statusline update as you type. Closing the file sends <InlineCode language="json">&quot;event&quot;: &quot;closed&quot;</InlineCode>, and the plugin closes the panel.</p>
    </section>

    <section>
      <h2 id="4-write-the-table-of-contents">4. Write the table of contents</h2>
      <p>Plugins never change buffer memory directly. <code>red/DocumentApply</code> takes the snapshot's <code>document_id</code> and <code>expected_revision</code> and a list of edits. Each edit has a range in zero-based lines and Unicode-scalar characters and an optional <code>expected_text</code>, the exact text it replaces. Red checks every range and preimage before changing anything, then applies the batch as one undo step attributed to the plugin, keeping dirty state, undo history, and language servers in sync.</p>
      <p>The first <kbd>:OutlineToc</kbd> inserts a list between <code>&lt;!-- toc --&gt;</code> and <code>&lt;!-- tocstop --&gt;</code> markers, just before the first section. Later runs replace what is between the markers and pass the current list as <code>expected_text</code>, so Red rejects the edit if the list changed after the snapshot. Anchors follow GitHub's rules: lowercase, punctuation removed, spaces turned into hyphens, and repeated titles numbered.</p>
      <LanguageTabs
        label="Table of contents"
        typescript={<CodeBlock language="typescript">{excerpts(ts, ["function slugs", "function tocEntries", "function tableOfContents", "async function updateToc", "async function undoToc"])}</CodeBlock>}
        python={<CodeBlock language="python">{excerpts(py, ["def slugs", "def toc_entries", "def table_of_contents", "def update_toc", "def undo_toc"])}</CodeBlock>}
      />
      <p>Run <kbd>:OutlineToc</kbd> in a README:</p>
      <CodeBlock language="text">{`<!-- toc -->\n- [Install](#install)\n- [Usage](#usage)\n  - [Configure](#configure)\n- [License](#license)\n<!-- tocstop -->`}</CodeBlock>
      <p>The change is an ordinary undo step, so <kbd>u</kbd> in the document reverts it. <code>red/DocumentUndo</code> lets the plugin revert its own transaction, and Red allows that only while it is still the document's latest change. Both calls pass <InlineCode language="json">&quot;allow_inactive&quot;: true</InlineCode> so they still reach the document when the panel has focus. If Red answers <code>-32002</code>, the document changed after the snapshot; read it again and retry. <code>-32003</code> means a range or <code>expected_text</code> did not match.</p>
    </section>

    <section>
      <h2 id="5-add-panel-buttons">5. Add panel buttons</h2>
      <p>The <code>actions</code> passed to <code>red/TextPanelCreate</code> become header buttons, panel shortcuts, and <kbd>F1</kbd> entries. When someone uses one, Red sends a <code>panel/event</code> notification with the action ID, and it sends <InlineCode language="json">&quot;action&quot;: &quot;close&quot;</InlineCode> for the panel's own close gesture too. <code>red/TextPanelSetActions</code> updates the buttons without resetting the panel's content or scroll position; the plugin uses it to enable Undo after a table of contents change. Red's panels already use some keys, such as <kbd>y</kbd> to copy the selected block, so choose others for your actions.</p>
      <p>Copy uses <code>red/ClipboardWrite</code>, which can only write and is meant for an explicit action like a button. <code>red/MessageShow</code> confirms the result with a short message.</p>
      <LanguageTabs
        label="Panel actions"
        typescript={<CodeBlock language="typescript">{`${excerpts(ts, ["function panelActions", "async function copyToc", "async function onPanelAction"])}\n\n// In dispatch():\n${excerpt(ts, 'case "panel/event":', 'case "picker/event":')}`}</CodeBlock>}
        python={<CodeBlock language="python">{`${excerpts(py, ["def panel_actions", "def copy_toc", "def on_panel_action"])}\n\n# In handle():\n${excerpt(py, 'elif method == "panel/event":', 'elif method == "picker/event":')}`}</CodeBlock>}
      />
      <p>Move focus to the panel with <kbd>Ctrl-w l</kbd>, then press <kbd>t</kbd> to write the table of contents, <kbd>c</kbd> to copy it, <kbd>u</kbd> to undo the change, or <kbd>q</kbd> to close the panel.</p>
    </section>

    <section>
      <h2 id="6-add-settings-a-picker-and-editor-events">6. Add settings, a picker, and editor events</h2>
      <p>Users configure plugins in Red's <code>config.toml</code>, under <InlineCode language="toml">[plugin_config.OWNER]</InlineCode>, where <code>OWNER</code> is the name the plugin was installed under (its <InlineCode language="toml">[plugin].id</InlineCode> by default). <code>red/ConfigGet</code> returns that table, or <InlineCode language="json">null</InlineCode> when there is none:</p>
      <CodeBlock language="toml" title="~/.config/red/config.toml">{`[plugin_config.markdown-outline]\nmax_depth = 3\nauto_open = true`}</CodeBlock>
      <p><kbd>:OutlineDepth</kbd> opens a picker with <code>red/PickerOpen</code>. The request returns right away; the choice arrives later as a <code>picker/event</code> notification, either <code>selected</code> with the item or <code>cancelled</code>. The plugin saves the chosen depth with <code>red/StorageSet</code>. Stored values are JSON, survive restarts, and here take precedence over <code>max_depth</code>.</p>
      <p>With <code>auto_open</code>, the outline opens by itself when you open a Markdown file. The plugin declares the <code>file:opened</code> event in <InlineCode language="toml">[activation].events</InlineCode> and in its <code>initialize</code> response, and Red delivers it as an <code>event/notify</code> notification. Red starts the plugin on demand for a declared event, so a plugin that listens to <code>file:opened</code> starts the first time you open any file. Version 1 also offers <code>editor:ready</code> and <code>file:saved</code>.</p>
      <LanguageTabs
        label="Settings, picker, and events"
        typescript={<CodeBlock language="typescript">{`${excerpts(ts, ["async function loadSettings", "async function runCommand", "async function onPicked"])}\n\n// In dispatch():\n${excerpt(ts, 'case "event/notify":', 'case "document/event":')}`}</CodeBlock>}
        python={<CodeBlock language="python">{`${excerpts(py, ["def load_settings", "def run_command", "def on_picked"])}\n\n# In handle():\n${excerpt(py, 'elif method == "event/notify":', 'elif method == "document/event":')}`}</CodeBlock>}
      />
      <p>Here is the complete package. These are the same files the website's test suite runs against a scripted stand-in for Red on every build, and you can also <a href="https://github.com/codersauce/red-website/tree/main/examples/markdown-outline" target="_blank" rel="noreferrer">view the source on GitHub</a>.</p>
      <LanguageTabs
        label="Complete plugin package"
        typescript={<>
          <CodeBlock language="toml" title="markdown-outline/red-plugin.toml">{outlinePlugin.typescript.manifest.trimEnd()}</CodeBlock>
          <CodeBlock language="typescript" title="markdown-outline/plugin.ts">{outlinePlugin.typescript.source.trimEnd()}</CodeBlock>
        </>}
        python={<>
          <CodeBlock language="toml" title="markdown-outline/red-plugin.toml">{outlinePlugin.python.manifest.trimEnd()}</CodeBlock>
          <CodeBlock language="python" title="markdown-outline/plugin.py">{outlinePlugin.python.source.trimEnd()}</CodeBlock>
        </>}
      />
    </section>

    <section>
      <h2 id="7-install-reload-and-distribute">7. Install, reload, and distribute</h2>
      <p>A path install runs your files in place. While Red is running, saving or touching <code>red-plugin.toml</code> reloads the plugin: Red starts and validates the new process first, swaps it in, and disposes the panels, pickers, statusline item, and document watches the old process owned.</p>
      <CodeBlock language="shell">{`red plugin install --path ./markdown-outline\nred plugin install owner/repository\nred plugin update markdown-outline\nred plugin disable markdown-outline\nred plugin enable markdown-outline\nred plugin remove markdown-outline`}</CodeBlock>
      <h3>Environment filtering and explicit grants</h3>
      <p>Red starts RPC child processes with a cleared environment and inherits only baseline OS variables (<code>HOME</code>, <code>PATH</code>, <code>USER</code>, <code>LOGNAME</code>, <code>SHELL</code>, <code>TMPDIR</code>/<code>TMP</code>/<code>TEMP</code>, <code>LANG</code>, <code>LC_ALL</code>, <code>TERM</code>, <code>SSH_AUTH_SOCK</code>, <code>XDG_*</code>, and Windows system paths). Users who want a plugin to see another variable grant it in their own configuration:</p>
      <CodeBlock language="toml">{`[plugin_permissions.markdown-outline]\ninherit_env = ["MY_SERVICE_TOKEN"]`}</CodeBlock>
      <p>A package manifest cannot grant itself environment variables. RPC plugins run as supervised native child processes: environment filtering prevents accidental secret leakage, not operating-system sandboxing.</p>
      <h3>Compiled plugins and release artifacts</h3>
      <p>For plugins that should not need a language runtime on the user's machine, omit <code>command</code> and declare per-target GitHub release binaries with SHA-256 digests under <InlineCode language="toml">[rpc.artifacts.TARGET]</InlineCode>:</p>
      <CodeBlock language="toml">{`[plugin]\nid = "document-tools"\nname = "Document Tools"\nversion = "0.1.0"\nred_api = "^0.19.0"\n\n[rpc]\nargs = []\n\n[rpc.artifacts.aarch64-apple-darwin]\nurl = "https://github.com/example/document-tools/releases/download/v0.1.0/document-tools-aarch64-apple-darwin"\nsha256 = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"`}</CodeBlock>
      <p>Red selects <InlineCode language="toml">[rpc.commands.TARGET]</InlineCode> first, then <code>rpc.command</code>, then <InlineCode language="toml">[rpc.artifacts.TARGET]</InlineCode>. GitHub installs and updates verify the SHA-256 digest and 128 MiB ceiling before swapping the package; local <InlineCode language="shell">--path</InlineCode> installs use local commands without downloading release artifacts.</p>
    </section>

    <section>
      <h2 id="use-another-language">Use another language</h2>
      <p>The protocol doesn't depend on TypeScript or Python. Any program that reads and writes JSON lines can be a Red plugin, as long as it:</p>
      <ul>
        <li>reads <code>stdin</code> line by line and writes one compact JSON object per line to <code>stdout</code>, flushing after each, with logs on <code>stderr</code>;</li>
        <li>answers <code>initialize</code> with <InlineCode language="json">&quot;protocol_version&quot;: 1</InlineCode> and exactly its declared commands and events, then waits for <code>initialized</code> before calling <code>red/*</code> methods;</li>
        <li>gives every request a unique <code>id</code> and keeps reading while it waits, because notifications can arrive before the response;</li>
        <li>answers <code>shutdown</code> and exits on <code>exit</code>; and</li>
        <li>keeps revisions and IDs as strings and counts characters as Unicode scalars.</li>
      </ul>
      <p>Compiled languages such as Rust or Go can ship per-target binaries as release artifacts, as described in step 7. The <a href={protocolUrl} target="_blank" rel="noreferrer">protocol reference</a> lists every method, error code, and limit.</p>
    </section>

    <section>
      <h2 id="8-troubleshoot-common-failures">8. Troubleshoot common failures</h2>
      <div className="docs-table-wrap"><table>
        <thead><tr><th>Symptom</th><th>Cause and fix</th></tr></thead>
        <tbody>
          <tr><td>A command does nothing the first time, then reports <code>unknown command</code></td><td>Red stopped the plugin for this session, which it calls quarantine. Common causes: <code>initialize</code> did not answer within 5 seconds, or its commands did not match the manifest. Red writes the reason to <code>red.log</code> in its configuration directory (for example <code>~/.config/red/red.log</code>). Fix the cause, then save <code>red-plugin.toml</code> to reload or restart Red. Node.js version managers whose shims download a runtime on first use can exceed the 5-second limit; run <InlineCode language="shell">node --version</InlineCode> once in a terminal first.</td></tr>
          <tr><td>Plugin fails to start or the executable is not found</td><td>A bare <code>command</code> such as <code>node</code> or <code>python3</code> resolves on <code>PATH</code>; a command containing <code>/</code> or <code>\</code> resolves relative to the package root, without a shell or <code>~</code> expansion. On Windows, add <InlineCode language="toml">[rpc.commands]</InlineCode> entries such as <InlineCode language="toml">x86_64-pc-windows-msvc = &quot;python&quot;</InlineCode>.</td></tr>
          <tr><td>Node.js reports an unknown <code>.ts</code> extension or a syntax error at a type annotation</td><td>Running <code>.ts</code> files directly needs Node.js 22.18 or later. Upgrade Node.js, or on 22.6 through 22.17 set <InlineCode language="toml">args = [&quot;--experimental-strip-types&quot;, &quot;plugin.ts&quot;]</InlineCode>.</td></tr>
          <tr><td>Plugin disconnects right after printing debug text</td><td>Standard output is reserved for JSON-RPC messages. Any <InlineCode language="javascript">console.log(...)</InlineCode> or <InlineCode language="python">print(...)</InlineCode> on <code>stdout</code> breaks the framing. Log to <code>stderr</code> with <InlineCode language="javascript">console.error(...)</InlineCode> or <InlineCode language="python">print(..., file=sys.stderr)</InlineCode>.</td></tr>
          <tr><td>A panel shortcut doesn't reach the plugin</td><td>Red's panels reserve some keys for themselves, such as <kbd>y</kbd> to copy the selected block. Choose a different <code>key</code> for the action.</td></tr>
          <tr><td>Host method returns <code>-32601</code> (method not found) or <code>-32602</code> (invalid params)</td><td>The protocol exposes the typed version 1 <code>red/*</code> methods listed in <code>initialize.params.host_methods</code>, not Red's internal commands. Unknown parameter keys are rejected; check names against the protocol reference.</td></tr>
          <tr><td><code>red/DocumentApply</code> fails with <code>-32002</code> or <code>-32003</code></td><td><code>-32002</code> means the document changed after <code>red/DocumentSnapshot</code>; take a fresh snapshot before retrying. <code>-32003</code> means a range or <code>expected_text</code> did not match. In JavaScript, count characters with <InlineCode language="javascript">Array.from(text).length</InlineCode>, not <InlineCode language="javascript">text.length</InlineCode>.</td></tr>
          <tr><td>Command times out after 30 seconds</td><td>The handler called a <code>red/*</code> method before <code>initialized</code>, or it waited for a response without reading <code>stdin</code>. Keep reading while you wait, as in step 3.</td></tr>
        </tbody>
      </table></div>
      <p><a className="text-link" href={protocolUrl} target="_blank" rel="noreferrer">Open the complete JSON-RPC protocol specification</a></p>
    </section>
  </>;
}
