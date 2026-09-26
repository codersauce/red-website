/* eslint-disable react/no-unescaped-entities */

import type { ReactNode } from "react";
import Link from "next/link";
import InstallPicker from "../components/InstallPicker";

export type DocPageId =
  | "overview"
  | "install"
  | "first-session"
  | "navigation"
  | "search"
  | "windows"
  | "languages"
  | "git"
  | "agent"
  | "configuration"
  | "keybindings"
  | "themes"
  | "plugins"
  | "husk"
  | "sessions"
  | "cli"
  | "vim"
  | "troubleshooting";

export interface DocPageDefinition {
  id: DocPageId;
  slug: string;
  href: string;
  section: string;
  title: string;
  description: string;
  render: (context: { origin: string }) => ReactNode;
}

export const docNavigation = [
  {
    label: "Getting started",
    items: [
      { id: "overview" as const, label: "Overview", href: "/docs" },
      { id: "install" as const, label: "Install Red", href: "/docs/getting-started/install" },
      { id: "first-session" as const, label: "First session", href: "/docs/getting-started/first-session" },
    ],
  },
  {
    label: "Editor",
    items: [
      { id: "navigation" as const, label: "Navigate and edit", href: "/docs/editor/navigation" },
      { id: "search" as const, label: "Search and replace", href: "/docs/editor/search" },
      { id: "windows" as const, label: "Buffers and windows", href: "/docs/editor/windows" },
      { id: "languages" as const, label: "Language tools", href: "/docs/languages" },
      { id: "git" as const, label: "Git", href: "/docs/git" },
    ],
  },
  {
    label: "Agent",
    items: [
      { id: "agent" as const, label: "Agent and inline assist", href: "/docs/agent" },
    ],
  },
  {
    label: "Customize",
    items: [
      { id: "configuration" as const, label: "Configuration", href: "/docs/configuration" },
      { id: "keybindings" as const, label: "Keybindings", href: "/docs/keybindings" },
      { id: "themes" as const, label: "Themes", href: "/docs/themes" },
      { id: "plugins" as const, label: "Plugins", href: "/docs/plugins" },
      { id: "husk" as const, label: "Husk", href: "/docs/husk" },
    ],
  },
  {
    label: "Sessions",
    items: [
      { id: "sessions" as const, label: "Detach and recover", href: "/docs/sessions" },
    ],
  },
  {
    label: "Reference",
    items: [
      { id: "cli" as const, label: "Command line", href: "/docs/reference/cli" },
      { id: "vim" as const, label: "Vim compatibility", href: "/docs/reference/vim" },
      { id: "troubleshooting" as const, label: "Troubleshooting", href: "/docs/troubleshooting" },
    ],
  },
];

export const docPages: DocPageDefinition[] = [
  {
    id: "install",
    slug: "getting-started/install",
    href: "/docs/getting-started/install",
    section: "Getting started",
    title: "Install Red",
    description: "Install the Red binary for your platform, then check that its bundled runtime is ready.",
    render: ({ origin }) => <>
      <section>
        <h2>Choose an installation method</h2>
        <p>The install scripts support Apple Silicon and Intel Macs, x86-64 glibc Linux, and 64-bit x86-64 Windows. Homebrew is also available on macOS and Linux.</p>
        <InstallPicker origin={origin} wide />
      </section>

      <section>
        <h2>What the installer does</h2>
        <p>The shell and PowerShell installers download the release archive for your platform, compare it with the published SHA-256 checksum, install the binary, and run Red&apos;s self-check.</p>
        <ul>
          <li>On macOS and Linux, the default destination is <code>~/.local/bin/red</code>.</li>
          <li>On Windows, the default destination is <code>%LOCALAPPDATA%\Programs\Red\bin\red.exe</code>. The installer adds that directory to your user PATH.</li>
        </ul>
        <aside className="docs-callout"><strong>Linux support</strong><span>The release archive targets x86-64 glibc Linux. Linux ARM64 and musl-based distributions currently require a source build.</span></aside>
      </section>

      <section>
        <h2>Check the installation</h2>
        <p>Open a new terminal if the <code>red</code> command is not available immediately, then run:</p>
        <pre><code>{`red --version\nred --self-check`}</code></pre>
        <p>The self-check lists the bundled plugins and finishes with <code>red self-check ok</code>. Agent support is optional and has its own setup check.</p>
      </section>

      <section>
        <h2>Open a project</h2>
        <pre><code>red -r path/to/project</code></pre>
        <p>Red works without a configuration file. The default configuration, plugins, and themes are embedded in the binary.</p>
        <p><Link className="text-link" href="/docs/getting-started/first-session">Continue with your first session</Link></p>
      </section>
    </>,
  },
  {
    id: "first-session",
    slug: "getting-started/first-session",
    href: "/docs/getting-started/first-session",
    section: "Getting started",
    title: "Your first session",
    description: "Open a project, edit and save a file, and learn where Red keeps its commands and shortcuts.",
    render: () => <>
      <section>
        <h2>Start Red</h2>
        <p>Open a file, or set the workspace root explicitly:</p>
        <pre><code>{`red src/main.rs\nred -r path/to/project`}</code></pre>
        <p>The first interactive launch opens Red&apos;s welcome screen. Press <kbd>Esc</kbd> to enter the editor, or start the guided tour. The tour uses a disposable practice buffer and simulated Git and Agent screens; it doesn&apos;t change your repository or start Codex.</p>
        <pre><code>{`:tutorial\n:tutorial quick`}</code></pre>
      </section>

      <section>
        <h2>Edit and save a file</h2>
        <ol className="docs-steps">
          <li><span>1</span><div><strong>Find a file.</strong><p>Press <kbd>Ctrl-p</kbd>, type part of its name, and press <kbd>Enter</kbd>.</p></div></li>
          <li><span>2</span><div><strong>Enter Insert mode.</strong><p>Press <kbd>i</kbd> and type your change. Press <kbd>Esc</kbd> to return to Normal mode.</p></div></li>
          <li><span>3</span><div><strong>Save.</strong><p>Type <kbd>:w</kbd> and press <kbd>Enter</kbd>.</p></div></li>
          <li><span>4</span><div><strong>Leave Red.</strong><p>Type <kbd>:q</kbd> and press <kbd>Enter</kbd>. Use <kbd>:wq</kbd> to save and quit in one command.</p></div></li>
        </ol>
      </section>

      <section>
        <h2>Know which mode you are in</h2>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Mode</th><th>Enter with</th><th>Use it for</th></tr></thead>
          <tbody>
            <tr><td>Normal</td><td><kbd>Esc</kbd></td><td>Navigation and editing commands</td></tr>
            <tr><td>Insert</td><td><kbd>i</kbd>, <kbd>a</kbd>, or <kbd>o</kbd></td><td>Typing text</td></tr>
            <tr><td>Visual</td><td><kbd>v</kbd>, <kbd>V</kbd>, or <kbd>Ctrl-v</kbd></td><td>Selecting text</td></tr>
            <tr><td>Command</td><td><kbd>:</kbd></td><td>Named editor commands</td></tr>
          </tbody>
        </table></div>
      </section>

      <section>
        <h2>Find the next command</h2>
        <p>Press <kbd>Space ?</kbd> to open the command palette. It shows available commands, descriptions, and active keybindings. Press <kbd>F1</kbd> for keyboard help in the current editor, pane, or dialog.</p>
        <div className="docs-key-grid">
          <div><kbd>Ctrl-p</kbd><span>Find a project file</span></div>
          <div><kbd>Ctrl-e</kbd><span>Open the file tree</span></div>
          <div><kbd>Space g</kbd><span>Search project text</span></div>
          <div><kbd>Space G</kbd><span>Open the Git workspace</span></div>
          <div><kbd>Space t</kbd><span>Browse themes</span></div>
          <div><kbd>Space m</kbd><span>Open messages</span></div>
        </div>
      </section>
    </>,
  },
  {
    id: "navigation",
    slug: "editor/navigation",
    href: "/docs/editor/navigation",
    section: "Editor",
    title: "Navigate and edit",
    description: "Move through a project with Red's file tools and use its Vim-style editing model without guessing which commands are available.",
    render: () => <>
      <section>
        <h2>Open files and projects</h2>
        <pre><code>{`red src/main.rs\nred src/main.rs src/lib.rs\nred -r path/to/project src/main.rs`}</code></pre>
        <p>The <code>-r</code> option sets the workspace root explicitly. Inside Red, press <kbd>Ctrl-p</kbd> for the file picker, <kbd>Ctrl-j</kbd> or <kbd>Space b</kbd> for open buffers, and <kbd>Ctrl-e</kbd> for the file tree.</p>
        <p>Add a line number to a file-picker query to open that location. For example, <code>render:240</code> opens the selected matching file at line 240.</p>
      </section>

      <section>
        <h2>Move in Normal mode</h2>
        <div className="docs-key-grid">
          <div><kbd>h j k l</kbd><span>Move left, down, up, and right</span></div>
          <div><kbd>w b e</kbd><span>Move by word</span></div>
          <div><kbd>0 ^ $</kbd><span>Move to line boundaries</span></div>
          <div><kbd>gg / G</kbd><span>Move to the first or last line</span></div>
          <div><kbd>Ctrl-u / Ctrl-d</kbd><span>Move half a page</span></div>
          <div><kbd>Ctrl-o / Ctrl-i</kbd><span>Move backward or forward through jumps</span></div>
        </div>
        <p>Use <kbd>gj</kbd> and <kbd>gk</kbd> to move by displayed rows when long lines wrap.</p>
      </section>

      <section>
        <h2>Edit with motions</h2>
        <p>Operators combine with motions and text objects. <kbd>dw</kbd> deletes a word, <kbd>ci(</kbd> changes inside parentheses, and <kbd>y$</kbd> copies to the end of the line. Counts work with supported actions: <kbd>3dw</kbd> deletes three words.</p>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Keys</th><th>Result</th></tr></thead>
          <tbody>
            <tr><td><kbd>i</kbd>, <kbd>a</kbd>, <kbd>o</kbd></td><td>Enter Insert mode at common positions</td></tr>
            <tr><td><kbd>x</kbd>, <kbd>dd</kbd>, <kbd>D</kbd></td><td>Delete a character, line, or to line end</td></tr>
            <tr><td><kbd>u</kbd>, <kbd>Ctrl-r</kbd></td><td>Undo and redo</td></tr>
            <tr><td><kbd>p</kbd>, <kbd>P</kbd></td><td>Paste after or before the cursor</td></tr>
            <tr><td><kbd>.</kbd></td><td>Repeat the last completed change</td></tr>
            <tr><td><kbd>:w</kbd>, <kbd>:wa</kbd></td><td>Save the current file or all modified files</td></tr>
          </tbody>
        </table></div>
      </section>

      <section>
        <h2>Use syntax-aware movement</h2>
        <p>When the current language supplies structural queries, <kbd>]f</kbd> and <kbd>[f</kbd> move between functions, <kbd>]c</kbd> and <kbd>[c</kbd> move between classes, and <kbd>]m</kbd> and <kbd>[m</kbd> move between calls. Use <kbd>af</kbd>, <kbd>if</kbd>, <kbd>ac</kbd>, <kbd>ic</kbd>, <kbd>am</kbd>, or <kbd>im</kbd> as Visual selections or operator targets.</p>
      </section>

      <section>
        <h2>Edit repeated text with multiple cursors</h2>
        <p>Press <kbd>Ctrl-n</kbd> on a word to select it, then press it again to add the next occurrence. Use <kbd>q</kbd> to skip one match, <kbd>Q</kbd> to remove the active selection, and <kbd>n</kbd> or <kbd>N</kbd> to move through matches. Press <kbd>c</kbd>, type the replacement, and press <kbd>Esc</kbd>; one <kbd>u</kbd> undoes the complete multi-cursor edit.</p>
        <p><kbd>Ctrl-Up</kbd> and <kbd>Ctrl-Down</kbd> add vertical cursors while preserving display columns across tabs and spaces.</p>
      </section>
    </>,
  },
  {
    id: "search",
    slug: "editor/search",
    href: "/docs/editor/search",
    section: "Editor",
    title: "Search and replace",
    description: "Search one buffer, the whole project, or the file tree, and make controlled replacements with Red's regular-expression syntax.",
    render: () => <>
      <section>
        <h2>Search the current buffer</h2>
        <div className="docs-key-grid">
          <div><kbd>/</kbd><span>Search forward with a live preview</span></div>
          <div><kbd>?</kbd><span>Search backward</span></div>
          <div><kbd>n / N</kbd><span>Repeat in the same or opposite direction</span></div>
          <div><kbd>*</kbd><span>Search for the word under the cursor</span></div>
          <div><kbd>:noh</kbd><span>Clear search highlighting</span></div>
        </div>
        <p>Search patterns use Rust regular-expression syntax. Search history is shared between <kbd>/</kbd> and <kbd>?</kbd> and persists across restarts.</p>
      </section>

      <section>
        <h2>Search the project</h2>
        <p>Press <kbd>Space g</kbd> to open project search. Type a query, move through matches with the arrow keys or <kbd>Ctrl-n</kbd>/<kbd>Ctrl-p</kbd>, and press <kbd>Enter</kbd> to open a result. Project search runs <code>rg</code>, so install ripgrep if Red reports that the process is unavailable.</p>
      </section>

      <section>
        <h2>Search the file tree</h2>
        <p>Press <kbd>Ctrl-e</kbd> to open the file tree, then <kbd>/</kbd> to search paths recursively. <kbd>Enter</kbd> opens a file or reveals a directory, <kbd>Ctrl-Enter</kbd> reveals without opening, and <kbd>Esc</kbd> restores the tree. Press <kbd>D</kbd> to search only directories, <kbd>f</kbd> to keep a filter, and <kbd>Ctrl-x</kbd> to clear it.</p>
      </section>

      <section>
        <h2>Replace text</h2>
        <pre><code>{`:%s/old/new/g\n:%s/(old)-([0-9]+)/$1-$2/g\n:'<,'>s/old/new/gc`}</code></pre>
        <p>Red supports the current line, the whole buffer with <code>%</code>, numeric line ranges, and the last Visual selection. Add <code>g</code> for every match on a line, <code>i</code> for case-insensitive matching, or <code>c</code> to confirm each replacement.</p>
        <aside className="docs-callout"><strong>Replacement syntax</strong><span>Captures use Rust forms such as <code>$1</code> and <code>$name</code>. Use <code>\r</code> to split a line. Vim magic modes and expression replacements aren't supported.</span></aside>
      </section>
    </>,
  },
  {
    id: "windows",
    slug: "editor/windows",
    href: "/docs/editor/windows",
    section: "Editor",
    title: "Buffers and windows",
    description: "Arrange files in splits, move between editor and plugin panes, and resolve files that changed outside Red.",
    render: () => <>
      <section>
        <h2>Move between buffers</h2>
        <div className="docs-key-grid">
          <div><kbd>Ctrl-j</kbd><span>Open the buffer picker</span></div>
          <div><kbd>Space Space</kbd><span>Switch to the previous buffer</span></div>
          <div><kbd>Space n / Space p</kbd><span>Move through the buffer list</span></div>
          <div><kbd>:bn / :bp</kbd><span>Select the next or previous buffer</span></div>
          <div><kbd>:bd</kbd><span>Delete the current buffer</span></div>
          <div><kbd>:ls</kbd><span>List open buffers</span></div>
        </div>
      </section>

      <section>
        <h2>Arrange windows and panes</h2>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Keys</th><th>Action</th></tr></thead>
          <tbody>
            <tr><td><kbd>Ctrl-w s</kbd></td><td>Split horizontally</td></tr>
            <tr><td><kbd>Ctrl-w v</kbd></td><td>Split vertically</td></tr>
            <tr><td><kbd>Ctrl-w h/j/k/l</kbd></td><td>Move between editor windows and docked panes</td></tr>
            <tr><td><kbd>Ctrl-w H/J/K/L</kbd></td><td>Move the focused window or pane to an outer edge</td></tr>
            <tr><td><kbd>Ctrl-w &gt;/&lt;</kbd></td><td>Resize horizontally</td></tr>
            <tr><td><kbd>Ctrl-w +/-</kbd></td><td>Resize vertically</td></tr>
            <tr><td><kbd>Ctrl-w =</kbd></td><td>Balance splits or restore a pane's original size</td></tr>
            <tr><td><kbd>Ctrl-w z</kbd></td><td>Zoom the focused editor window or pane</td></tr>
            <tr><td><kbd>Ctrl-w c</kbd></td><td>Close the focused window</td></tr>
          </tbody>
        </table></div>
        <p>You can also drag editor and pane dividers with the mouse. Press <kbd>Esc</kbd> during a drag to cancel it.</p>
      </section>

      <section>
        <h2>Handle a file changed on disk</h2>
        <p>Red reloads a clean buffer when another program changes its file. If the buffer has unsaved edits, Red keeps your text and marks the conflict instead of overwriting either version.</p>
        <div className="docs-key-grid">
          <div><kbd>:diffdisk</kbd><span>Compare the buffer with the current disk version</span></div>
          <div><kbd>:e!</kbd><span>Discard local edits and reload from disk</span></div>
          <div><kbd>:w file</kbd><span>Save the buffer under another name</span></div>
          <div><kbd>:w!</kbd><span>Deliberately overwrite the changed disk file</span></div>
        </div>
        <p>Ordinary <kbd>:w</kbd> and <kbd>:wa</kbd> don't silently overwrite an external change.</p>
      </section>
    </>,
  },
  {
    id: "languages",
    slug: "languages",
    href: "/docs/languages",
    section: "Editor",
    title: "Language tools",
    description: "Use completion, diagnostics, navigation, formatting, and language packs for the files in your workspace.",
    render: () => <>
      <section>
        <h2>Use a language server</h2>
        <p>Red starts a configured server after you open a matching file. The built-in defaults cover Rust, Fish, Markdown, JavaScript and TypeScript, JSON, TOML, YAML, and Lua; those server executables must be installed separately and available on <code>PATH</code>. Red includes its own server for <code>.hk</code> and <code>.husk</code> files.</p>
        <div className="docs-key-grid">
          <div><kbd>K</kbd><span>Show hover documentation</span></div>
          <div><kbd>gd</kbd><span>Go to definition</span></div>
          <div><kbd>Ctrl-Space</kbd><span>Request completion</span></div>
          <div><kbd>Ctrl-k</kbd><span>Show signature help</span></div>
          <div><kbd>Ctrl-t</kbd><span>Find document symbols</span></div>
          <div><kbd>Space w</kbd><span>Find workspace symbols</span></div>
          <div><kbd>Space k</kbd><span>Find references</span></div>
          <div><kbd>Space .</kbd><span>Show code actions</span></div>
          <div><kbd>Space r</kbd><span>Rename a symbol</span></div>
          <div><kbd>Space f</kbd><span>Format the current document</span></div>
        </div>
      </section>

      <section>
        <h2>Completion and formatting</h2>
        <p>Completion combines words from open buffers with candidates from the active language server. Use the arrow keys or <kbd>Ctrl-n</kbd>/<kbd>Ctrl-p</kbd> to choose an item, <kbd>Tab</kbd> or <kbd>Enter</kbd> to accept it, and <kbd>Ctrl-e</kbd> to close the menu.</p>
        <p>Red formats supported documents when saving and reindents pasted code by default. Disable either behavior without disabling explicit formatting:</p>
        <pre><code>{`[formatting]\non_save = false\non_paste = false`}</code></pre>
      </section>

      <section>
        <h2>Add or override a server</h2>
        <pre><code>{`[lsp.servers.go]\ncommand = "gopls"\nlanguage_id = "go"\nfile_extensions = ["go"]\nroot_markers = ["go.mod", ".git"]`}</code></pre>
        <p>Restart Red after changing a server definition, or run <kbd>:languages reload</kbd> after changing a unified language definition.</p>
      </section>

      <section>
        <h2>Install a language pack</h2>
        <p>Open <strong>Language packs</strong> from the command palette, or use the CLI:</p>
        <pre><code>{`red plugin catalog\nred plugin install --catalog go-language\nred plugin install --catalog python-language --trust-native-grammars`}</code></pre>
        <p>Native Tree-sitter grammars execute inside the editor. Installing a pack doesn't approve them automatically; trust only the exact verified grammar bytes you intend to load.</p>
        <pre><code>{`red language trust LANGUAGE_ID\nred language untrust LANGUAGE_ID`}</code></pre>
      </section>
    </>,
  },
  {
    id: "git",
    slug: "git",
    href: "/docs/git",
    section: "Editor",
    title: "Work with Git",
    description: "Review changes, stage hunks or lines, write commits, and use repository operations without leaving Red.",
    render: () => <>
      <section>
        <h2>Open the Git workspace</h2>
        <p>Press <kbd>Space G</kbd>. The file list groups staged, unstaged, untracked, and conflicted paths. The detail pane follows the selected file and shows its diff.</p>
        <p>Use <kbd>Tab</kbd> or <kbd>Ctrl-w w</kbd> to switch panes. Press <kbd>?</kbd> or <kbd>F1</kbd> for the actions available in the focused pane.</p>
      </section>

      <section>
        <h2>Review and stage changes</h2>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Keys</th><th>Action</th></tr></thead>
          <tbody>
            <tr><td><kbd>[h</kbd>, <kbd>]h</kbd></td><td>Move between hunks</td></tr>
            <tr><td><kbd>v</kbd></td><td>Select changed lines</td></tr>
            <tr><td><kbd>s</kbd>, <kbd>u</kbd>, <kbd>x</kbd></td><td>Stage, unstage, or discard the selected line or range</td></tr>
            <tr><td><kbd>S</kbd>, <kbd>U</kbd>, <kbd>X</kbd></td><td>Stage, unstage, or discard the current hunk</td></tr>
            <tr><td><kbd>W</kbd></td><td>Toggle diff wrapping</td></tr>
            <tr><td><kbd>L</kbd></td><td>Open the complete patch in a scratch buffer</td></tr>
          </tbody>
        </table></div>
        <p>Discard operations ask for confirmation. Git authentication uses your existing SSH agent or credential helper.</p>
      </section>

      <section>
        <h2>Create a commit</h2>
        <p>Press <kbd>Space c c</kbd> to open the commit editor. Its first lines show the current branch and staged files. Write the message, then use <kbd>:w</kbd> or <kbd>:wq</kbd> to submit it. <kbd>:q</kbd> cancels.</p>
        <p>The commit menu can draft a message from the staged diff when Codex is installed and authenticated. Red places the draft in the editor so you can change it before committing.</p>
      </section>

      <section>
        <h2>Use repository operations</h2>
        <p>The workspace also exposes fetch, pull, push, branches, remotes, tags, stashes, worktrees, logs, reset, and interactive rebase. Open the action list with <kbd>?</kbd> instead of memorizing every binding.</p>
      </section>
    </>,
  },
  {
    id: "agent",
    slug: "agent",
    href: "/docs/agent",
    section: "Agent",
    title: "Agent and inline assist",
    description: "Set up Codex, use the full Agent workspace or a bounded inline request, and know when a change is saved to disk.",
    render: () => <>
      <section>
        <h2>Set up Codex</h2>
        <p>Agent features require Codex CLI 0.144.1 or newer. Install Codex, authenticate it, and run Red's offline prerequisite check:</p>
        <pre><code>{`codex login\nred --agent-check --strict`}</code></pre>
        <p>Red starts <code>codex app-server --stdio</code> when the first Agent session needs it. If startup fails, Red keeps your prompt so you can fix the setup and retry.</p>
      </section>

      <section>
        <h2>Use the Agent workspace</h2>
        <ol className="docs-steps">
          <li><span>1</span><div><strong>Open Agent.</strong><p>Press <kbd>Space A</kbd> or run <kbd>:Agent</kbd>.</p></div></li>
          <li><span>2</span><div><strong>Write the request.</strong><p>Press <kbd>Enter</kbd> to send. Use <kbd>Alt+Enter</kbd>, <kbd>Shift+Enter</kbd>, or <kbd>Ctrl+J</kbd> for a newline.</p></div></li>
          <li><span>3</span><div><strong>Follow the work.</strong><p>The transcript streams the response and groups tool activity for the turn. Press <kbd>Ctrl-c</kbd> to interrupt.</p></div></li>
          <li><span>4</span><div><strong>Inspect the result.</strong><p>Agent file writes pass through Red's revision-checked editor tools and are saved to disk. Use <kbd>:AgentHistory</kbd> to inspect attributed transactions.</p></div></li>
        </ol>
        <p>Press <kbd>Alt+m</kbd> in the Agent pane or run <kbd>:AgentModel</kbd> to choose the model and reasoning effort for that conversation. This doesn't change your global Codex settings.</p>
      </section>

      <section>
        <h2>Ask about the current code</h2>
        <p>Press <kbd>Space i</kbd> for inline assist. In Normal mode, Red targets the enclosing function when syntax information is available and otherwise uses the current line. Visual and Visual Line modes use the exact selection. Visual Block isn't supported.</p>
        <p>An exact edit can apply immediately while its original popup remains in the foreground. The result is one <strong>unsaved, undoable</strong> editor transaction. Background results and wider same-file proposals wait for review. In the diff, press <kbd>a</kbd> to apply or <kbd>d</kbd> to decline; <kbd>Enter</kbd> opens the review but doesn't approve it.</p>
        <aside className="docs-callout"><strong>Full Agent and inline assist write differently</strong><span>Full Agent file tools save their editor changes to disk. Inline code edits remain unsaved until you save the buffer. Comments and explanations don't change source text.</span></aside>
      </section>

      <section>
        <h2>Understand the boundary</h2>
        <p>Agent threads run with a read-only Codex sandbox and no native shell or direct file-edit path. Red supplies bounded tools for workspace files, open-buffer state, diagnostics, navigation, annotations, and revision-checked edits. Reads use the latest Red buffer contents, including unsaved changes.</p>
        <p>Paths must remain inside the physical workspace. Red rejects traversal, symlinks, special files, protected paths, stale revisions, and unsafe writes. Secret-like paths are excluded unless you set <code>allow_sensitive_paths = true</code> under <code>[agent]</code>.</p>
        <p>Configured MCP servers and Codex features are disabled unless you name them in <code>enabled_mcp_servers</code> or <code>enabled_codex_features</code>.</p>
      </section>

      <section>
        <h2>Return to earlier work</h2>
        <p>Press <kbd>Space H</kbd> or run <kbd>:InlineHistory</kbd> to browse inline prompts, answers, ready edits, and applied changes. Press <kbd>Space N</kbd> to reopen the latest completed inline result.</p>
        <p>Agent conversation state and inline history participate in Red's recovery snapshots. After a restart, Red resumes a persisted Codex thread when possible. If it can't, the old transcript remains visible as archived context and the next prompt begins a new session.</p>
      </section>
    </>,
  },
  {
    id: "configuration",
    slug: "configuration",
    href: "/docs/configuration",
    section: "Customize",
    title: "Configure Red",
    description: "Keep the embedded defaults and add only the settings you want to change.",
    render: () => <>
      <section>
        <h2>Start with a small file</h2>
        <p>Red works without a configuration file. On macOS and Linux, create <code>~/.config/red/config.toml</code> when you want to override a default. The welcome screen can create a starter file without replacing existing settings.</p>
        <pre><code>{`theme = "red.json"\nscrolloff = 8\n\n[search]\nignorecase = true\nsmartcase = true\n\n[keys.normal]\n"Ctrl-s" = "Save"`}</code></pre>
        <p>Your file is layered over Red's embedded configuration, so it doesn't need to repeat unchanged settings.</p>
      </section>

      <section>
        <h2>Check a change</h2>
        <pre><code>{`red --check-config\nred -c 'wrap = false' path/to/file`}</code></pre>
        <p><code>--check-config</code> validates the effective user configuration and exits. The repeatable <code>-c</code> option applies a TOML override for one invocation.</p>
      </section>

      <section>
        <h2>Common sections</h2>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Section</th><th>Controls</th></tr></thead>
          <tbody>
            <tr><td>Top level</td><td>Theme, wrapping, scrolling, line numbers, release notes, diagnostics, and disabled plugins</td></tr>
            <tr><td><code>[search]</code></td><td>Incremental search, highlighting, wrapping, and case behavior</td></tr>
            <tr><td><code>[completion]</code></td><td>Automatic completion, buffer words, prefix length, and menu timing</td></tr>
            <tr><td><code>[agent]</code></td><td>Codex command, inline review behavior, followed tool calls, and explicitly enabled integrations</td></tr>
            <tr><td><code>[keys.MODE]</code></td><td>Mode-specific keybindings and chords</td></tr>
            <tr><td><code>[languages.ID]</code></td><td>Detection, comments, indentation, grammar, and language-server settings</td></tr>
            <tr><td><code>[plugin_config.ID]</code></td><td>Settings owned by an enabled plugin</td></tr>
          </tbody>
        </table></div>
        <p><a className="text-link" href="https://github.com/codersauce/red/blob/main/default_config.toml" target="_blank" rel="noreferrer">Open the commented default configuration</a></p>
      </section>
    </>,
  },
  {
    id: "keybindings",
    slug: "keybindings",
    href: "/docs/keybindings",
    section: "Customize",
    title: "Change keybindings",
    description: "Map actions, action sequences, chords, and plugin commands without changing how keys behave in other modes.",
    render: () => <>
      <section>
        <h2>Find the current binding first</h2>
        <p>Press <kbd>F1</kbd> for keyboard help in the current context, or <kbd>Space ?</kbd> for the command palette. Both surfaces show effective bindings after your overrides are applied.</p>
      </section>

      <section>
        <h2>Map an action</h2>
        <pre><code>{`[keys.normal]\n"Ctrl-s" = "Save"\n"u" = "Undo"\n\n[keys.insert]\n"Ctrl-s" = "Save"`}</code></pre>
        <p>Each mode has its own table. A Normal-mode mapping doesn't change what the same key types in Insert mode.</p>
      </section>

      <section>
        <h2>Use sequences, chords, and plugin commands</h2>
        <pre><code>{`[keys.normal]\n"a" = [{ EnterMode = "Insert" }, "MoveRight"]\n"g" = { "d" = "GoToDefinition" }\n"Ctrl-j" = { PluginCommand = "BufferPicker" }`}</code></pre>
        <p>Normal-mode bindings are inherited by Visual modes unless you add an explicit binding under <code>[keys.visual]</code>. Red rejects ambiguous plugin leader mappings instead of silently discarding one.</p>
      </section>

      <section>
        <h2>Control prefix hints</h2>
        <pre><code>{`[key_hints]\nenabled = true\ndelay_ms = 250`}</code></pre>
        <p>Pause after a configured prefix such as <kbd>Space</kbd>, <kbd>Ctrl-w</kbd>, or <kbd>g</kbd> to see the available continuations.</p>
      </section>

      <section>
        <h2>Diagnose terminal shortcuts</h2>
        <pre><code>red keys</code></pre>
        <p>The diagnostic shows how the current terminal reports key combinations without opening a document or starting Codex. Use <kbd>Ctrl+J</kbd> as the portable newline in Agent composers when a terminal doesn't distinguish modified Enter keys.</p>
      </section>
    </>,
  },
  {
    id: "themes",
    slug: "themes",
    href: "/docs/themes",
    section: "Customize",
    title: "Choose and edit themes",
    description: "Preview bundled themes, keep a selection, or eject a JSON theme into your configuration directory.",
    render: () => <>
      <section>
        <h2>Browse themes</h2>
        <p>Press <kbd>Space t</kbd> or choose <strong>Browse themes</strong> from the command palette. Moving through the picker previews each theme. <kbd>Esc</kbd> restores the original; <kbd>Enter</kbd> selects and persists the highlighted theme.</p>
      </section>

      <section>
        <h2>Set a theme directly</h2>
        <pre><code>theme = "red.json"</code></pre>
        <p>Add the filename to <code>config.toml</code>. Run <code>red --runtime-files</code> to list every visible theme and its source.</p>
      </section>

      <section>
        <h2>Customize a bundled theme</h2>
        <pre><code>{`red --eject themes/red.json\nred --runtime-files`}</code></pre>
        <p>The ejected file is placed in the <code>themes</code> directory under Red's configuration directory. A user file shadows the bundled theme with the same name until you remove it. Use <code>--eject-force</code> only when you intend to replace an existing custom copy.</p>
      </section>
    </>,
  },
  {
    id: "plugins",
    slug: "plugins",
    href: "/docs/plugins",
    section: "Customize",
    title: "Manage plugins",
    description: "Inspect bundled plugins, install external packages, control their lifecycle, and keep native grammar approval explicit.",
    render: () => <>
      <section>
        <h2>Inspect what Red loaded</h2>
        <pre><code>{`red --runtime-files\nred --self-check\nred plugin list`}</code></pre>
        <p><code>--runtime-files</code> shows visible plugins and themes with their source. <code>--self-check</code> reports the activation status of bundled plugins. <code>red plugin list</code> lists installed external packages.</p>
      </section>

      <section>
        <h2>Install a package</h2>
        <pre><code>{`red plugin catalog\nred plugin install --catalog go-language\nred plugin install owner/repository\nred plugin install --path ~/code/my-red-plugin`}</code></pre>
        <p>Catalog packages use immutable release archives with recorded checksums. GitHub and local-path sources remain explicitly unreviewed. Installing a package never grants implicit approval to execute a native Tree-sitter grammar.</p>
      </section>

      <section>
        <h2>Enable, update, or remove a package</h2>
        <pre><code>{`red plugin disable replay\nred plugin enable replay\nred plugin update replay\nred plugin update --all\nred plugin remove replay\nred plugin remove replay --purge`}</code></pre>
        <p>Ordinary removal preserves the plugin's namespaced data for a later reinstall. <code>--purge</code> deletes that data as well. Failed updates leave the previous installation active.</p>
      </section>

      <section>
        <h2>Customize a bundled plugin</h2>
        <pre><code>red --eject plugins/fidget.hk</code></pre>
        <p>The copy in your configuration directory shadows the bundled file. Remove the copy to return to the version shipped with Red.</p>
        <p>Plugins that spawn processes need an explicit allowlist:</p>
        <pre><code>{`[plugin_permissions.project_search]\nprocess = ["rg"]`}</code></pre>
      </section>
    </>,
  },
  {
    id: "husk",
    slug: "husk",
    href: "/docs/husk",
    section: "Customize",
    title: "Write a Husk plugin",
    description: "Use Red's embedded Husk language to register commands, keep private state, and request editor-owned operations.",
    render: () => <>
      <section>
        <h2>Create the smallest plugin</h2>
        <p>Husk is Red's embedded scripting language. Place <code>hello.hk</code> in the <code>plugins</code> directory under Red's configuration directory, then register the filename in <code>config.toml</code>:</p>
        <pre><code>{`[plugins]\nhello = "hello.hk"`}</code></pre>
        <pre><code>{`#[red::command(\n    name = "HelloWorld",\n    title = "Say hello",\n    category = "Example",\n)]\nfn hello_world() {\n    red::execute("Print", "Hello from Husk");\n}`}</code></pre>
        <p>The command is available as <kbd>:HelloWorld</kbd> and through the command palette.</p>
      </section>

      <section>
        <h2>Keep plugin state</h2>
        <pre><code>{`struct PluginState {\n    count: i64,\n}\n\n#[red::state]\nfn initial_state() -> PluginState {\n    return PluginState { count: 0 };\n}`}</code></pre>
        <p>Read private state with <code>red::state()</code> and update named fields with <code>red::state_patch(...)</code>. Use declaration attributes for commands, fixed events, configuration, and lifecycle hooks; keep <code>red::on</code> for event names known only at runtime.</p>
      </section>

      <section>
        <h2>Use the host boundary</h2>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Function</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>red::execute</code></td><td>Request a fire-and-forget editor action</td></tr>
            <tr><td><code>red::request</code></td><td>Request data and receive one typed callback</td></tr>
            <tr><td><code>red::on</code></td><td>Subscribe to an editor event</td></tr>
            <tr><td><code>red::state</code></td><td>Read the plugin's private typed record</td></tr>
            <tr><td><code>red::state_patch</code></td><td>Update selected state fields</td></tr>
            <tr><td><code>red::log</code></td><td>Write diagnostic information to Red's log</td></tr>
          </tbody>
        </table></div>
        <p>Red remains the owner of buffers, undo history, focus, confirmations, sessions, and filesystem reconciliation. Plugins request attributed operations through the versioned host API rather than changing editor state directly.</p>
        <p><a className="text-link" href="https://github.com/codersauce/red/blob/main/docs/PLUGIN_API.md" target="_blank" rel="noreferrer">Open the complete host API reference</a></p>
      </section>

      <section>
        <h2>Use the standalone Husk CLI</h2>
        <p>The Husk CLI is built separately from the Red editor binary:</p>
        <pre><code>{`cargo install --path crates/husk-cli\nhusk check script.hk\nhusk run script.hk\nhusk test path/to/package\nhusk repl`}</code></pre>
        <p>Standalone Husk grants no ambient filesystem, network, environment, process, clock, or random access. Embedders add capabilities explicitly.</p>
      </section>
    </>,
  },
  {
    id: "sessions",
    slug: "sessions",
    href: "/docs/sessions",
    section: "Sessions",
    title: "Detach and recover",
    description: "Keep a live editor across terminal disconnects on macOS and Linux, or restore an atomic snapshot after the editor stops.",
    render: () => <>
      <section>
        <h2>Keep a live session running</h2>
        <p>Detach and attach are available on macOS and Linux. Start a named session:</p>
        <pre><code>red --detach=refactor src/main.rs</code></pre>
        <p>The terminal attaches immediately. Press <kbd>Ctrl-\</kbd> to leave the TUI while the editor, unsaved buffers, plugins, language servers, running shell jobs, and Codex app-server process stay alive.</p>
        <pre><code>{`red --attach refactor\nred --stop refactor`}</code></pre>
        <p>Only one TUI can attach at a time. Sessions are local to the current OS user and use a private Unix socket rather than a TCP port. Windows supports recovery but not detach and attach.</p>
      </section>

      <section>
        <h2>Use the default session name</h2>
        <pre><code>red --detach src/main.rs</code></pre>
        <p>Without an explicit name, Red uses <code>default</code>. Named sessions require the <code>--detach=NAME</code> form so a filename can't be mistaken for a session name.</p>
      </section>

      <section>
        <h2>Restore after a crash</h2>
        <pre><code>red --resume</code></pre>
        <p>Recovery is available on every supported platform. Red restores the newest valid snapshot, including dirty buffers, window layout, cursors, registers, marks, undo history, and Agent conversation state. Restored dirty text stays in memory; Red doesn't write it to disk until you save.</p>
        <aside className="docs-callout"><strong>Don't resume a running editor</strong><span>Interactive owners don't currently hold an exclusive recovery lock. Use <code>--attach</code> for a live detached owner and <code>--resume</code> only after the owner has stopped.</span></aside>
      </section>

      <section>
        <h2>Know which recovery path applies</h2>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Situation</th><th>Use</th><th>What happens</th></tr></thead>
          <tbody>
            <tr><td>Terminal or SSH disconnect</td><td><code>red --attach NAME</code></td><td>Reconnects to the same live editor owner</td></tr>
            <tr><td>Editor or machine stopped</td><td><code>red --resume</code></td><td>Loads the newest valid atomic snapshot</td></tr>
            <tr><td>Normal clean exit</td><td><code>red</code> in the same directory</td><td>Restores clean file-backed buffers, views, and split layout</td></tr>
          </tbody>
        </table></div>
      </section>
    </>,
  },
  {
    id: "cli",
    slug: "reference/cli",
    href: "/docs/reference/cli",
    section: "Reference",
    title: "Command-line reference",
    description: "Look up Red's editor, validation, runtime asset, Agent, session, plugin, language, and keyboard commands.",
    render: () => <>
      <section>
        <h2>Open the editor</h2>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Command</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>red [FILES...]</code></td><td>Open zero or more files</td></tr>
            <tr><td><code>red -r PATH [FILES...]</code></td><td>Set the workspace root before opening files</td></tr>
            <tr><td><code>red -c TOML [FILES...]</code></td><td>Apply a repeatable inline configuration override</td></tr>
            <tr><td><code>red --version</code></td><td>Print the installed version</td></tr>
            <tr><td><code>red --help</code></td><td>Print the generated command reference</td></tr>
          </tbody>
        </table></div>
      </section>

      <section>
        <h2>Check the installation and configuration</h2>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Command</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>red --self-check</code></td><td>Validate the bundled runtime and plugins</td></tr>
            <tr><td><code>red --check-config</code></td><td>Validate the effective user configuration</td></tr>
            <tr><td><code>red --agent-check</code></td><td>Report Codex prerequisites without installing anything</td></tr>
            <tr><td><code>red --agent-check --strict</code></td><td>Exit nonzero when Agent editing isn't ready</td></tr>
            <tr><td><code>red keys</code></td><td>Show the keyboard protocol and decoded key events</td></tr>
          </tbody>
        </table></div>
      </section>

      <section>
        <h2>Inspect and eject runtime assets</h2>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Command</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>red --runtime-files</code></td><td>List visible plugins and themes with their sources</td></tr>
            <tr><td><code>red --eject ASSET</code></td><td>Copy a bundled plugin or theme into the configuration directory</td></tr>
            <tr><td><code>red --eject-force ASSET</code></td><td>Replace an existing user copy</td></tr>
          </tbody>
        </table></div>
      </section>

      <section>
        <h2>Manage sessions</h2>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Command</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>red --detach[=NAME] [FILES...]</code></td><td>Start a detachable owner and attach this terminal</td></tr>
            <tr><td><code>red --attach NAME</code></td><td>Attach to a local live session</td></tr>
            <tr><td><code>red --stop NAME</code></td><td>Stop a local live session</td></tr>
            <tr><td><code>red --resume</code></td><td>Restore the latest crash-recovery snapshot</td></tr>
          </tbody>
        </table></div>
      </section>

      <section>
        <h2>Manage packages and languages</h2>
        <pre><code>{`red plugin catalog\nred plugin install [OWNER/REPOSITORY]\nred plugin install --path DIRECTORY\nred plugin install --catalog ID\nred plugin list\nred plugin update ID\nred plugin update --all\nred plugin disable ID\nred plugin enable ID\nred plugin remove ID [--purge]\n\nred language trust LANGUAGE_OR_PATH\nred language untrust LANGUAGE_OR_PATH\nred language check-indent FIXTURES.json`}</code></pre>
      </section>
    </>,
  },
  {
    id: "vim",
    slug: "reference/vim",
    href: "/docs/reference/vim",
    section: "Reference",
    title: "Vim compatibility",
    description: "See which Vim-style editing behaviors Red supports and where its defaults or command language intentionally differ.",
    render: () => <>
      <section>
        <h2>Supported editing model</h2>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Area</th><th>Red behavior</th></tr></thead>
          <tbody>
            <tr><td>Modes</td><td>Normal, Insert, Visual, Visual Line, Visual Block, and Command</td></tr>
            <tr><td>Motions</td><td>Basic, word, line, paragraph, sentence, find/till, screen-line, matching-bracket, and structural motions</td></tr>
            <tr><td>Operators</td><td>Delete, change, and yank with supported motions and text objects</td></tr>
            <tr><td>Text objects</td><td>Words, sentences, paragraphs, delimiters, quotes, calls, functions, classes, and comments</td></tr>
            <tr><td>Repeat</td><td>Counts, dot-repeat, macro recording and playback, undo branches, and jump lists</td></tr>
            <tr><td>Selections</td><td>Character, line, block, mouse, and multi-cursor editing with Unicode grapheme boundaries</td></tr>
            <tr><td>Search</td><td>Forward and backward search, history, substitution ranges, flags, and confirmation</td></tr>
            <tr><td>Windows</td><td>Split navigation, movement, resizing, balancing, zoom, and docked-pane focus</td></tr>
          </tbody>
        </table></div>
      </section>

      <section>
        <h2>Important differences</h2>
        <ul>
          <li>Search and substitution use Rust regular-expression syntax rather than Vim's regex dialect.</li>
          <li>Red implements a documented Ex subset and doesn't run Vimscript.</li>
          <li><kbd>Ctrl-e</kbd> opens the file tree, and <kbd>gW</kbd> toggles wrapping.</li>
          <li>Interactive named text-register selection such as <kbd>&quot;a</kbd> isn't implemented, though named registers work for macros.</li>
          <li>A confirmed substitute is one undoable transaction but doesn't become a dot-repeat recipe.</li>
          <li>Shell commands are non-interactive. <code>:read !</code>, <code>:write !</code>, and Normal-mode filter operators aren't supported.</li>
        </ul>
      </section>

      <section>
        <h2>Look up exact behavior</h2>
        <p>The versioned compatibility matrix records supported behavior, intentional differences, and items not yet supported.</p>
        <p><a className="text-link" href="https://github.com/codersauce/red/blob/main/docs/VIM_COMPATIBILITY.md" target="_blank" rel="noreferrer">Open the complete compatibility matrix</a></p>
      </section>
    </>,
  },
  {
    id: "troubleshooting",
    slug: "troubleshooting",
    href: "/docs/troubleshooting",
    section: "Reference",
    title: "Troubleshooting",
    description: "Use Red's focused checks to separate installation, configuration, runtime asset, language-server, Agent, keyboard, and recovery problems.",
    render: () => <>
      <section>
        <h2>Start with the narrow check</h2>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Problem</th><th>First check</th></tr></thead>
          <tbody>
            <tr><td>Red doesn't start or bundled tools are missing</td><td><code>red --self-check</code></td></tr>
            <tr><td>Configuration fails to load</td><td><code>red --check-config</code></td></tr>
            <tr><td>A plugin or theme looks stale or missing</td><td><code>red --runtime-files</code></td></tr>
            <tr><td>Codex can't start from Red</td><td><code>red --agent-check --strict</code></td></tr>
            <tr><td>A modified Enter shortcut doesn't arrive</td><td><code>red keys</code></td></tr>
            <tr><td>A language server doesn't respond</td><td>Confirm its executable is on <code>PATH</code>, then reopen a matching file</td></tr>
            <tr><td>A previous editor stopped with unsaved work</td><td><code>red --resume</code></td></tr>
          </tbody>
        </table></div>
      </section>

      <section>
        <h2>Read messages and logs</h2>
        <p>Press <kbd>Space m</kbd> or run <kbd>:messages</kbd> to browse editor notifications, command output, and recent errors. Red writes <code>red.log</code> in its configuration directory by default. Relative <code>log_file</code> paths are resolved from that directory.</p>
      </section>

      <section>
        <h2>Fix common problems</h2>
        <ul>
          <li><strong>Command not found after installation:</strong> open a new terminal or add the install directory printed by the installer to <code>PATH</code>.</li>
          <li><strong>Language tools are empty:</strong> install the configured server executable. Buffer-word completion still works without a server.</li>
          <li><strong>A bundled theme or plugin behaves like an older copy:</strong> a file in your configuration directory may be shadowing the embedded asset. Check <code>red --runtime-files</code>, then remove or replace the ejected copy.</li>
          <li><strong>An Agent prompt failed to start:</strong> update Codex, run <code>codex login</code>, then retry the preserved prompt.</li>
          <li><strong>Shift+Enter behaves like Enter:</strong> use <kbd>Ctrl+J</kbd> for a newline and run <code>red keys</code> to see what the terminal sends.</li>
          <li><strong>A dirty file changed on disk:</strong> run <kbd>:diffdisk</kbd>; use <kbd>:e!</kbd>, <kbd>:w file</kbd>, or <kbd>:w!</kbd> only after choosing which version to keep.</li>
          <li><strong>Detach isn't available on Windows:</strong> use <code>red --resume</code> for crash recovery. Live detach and attach currently require macOS or Linux.</li>
        </ul>
      </section>

      <section>
        <h2>Report a reproducible problem</h2>
        <p>Include your Red version, operating system, terminal, the smallest reproduction, and the relevant focused-check output. Remove private paths, source, prompts, and credentials before sharing logs.</p>
        <p><a className="text-link" href="https://github.com/codersauce/red/issues" target="_blank" rel="noreferrer">Open a GitHub issue</a></p>
      </section>
    </>,
  },
];

export const docPageBySlug = new Map(docPages.map((page) => [page.slug, page]));
