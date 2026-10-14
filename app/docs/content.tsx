/* eslint-disable react/no-unescaped-entities */

import type { ReactNode } from "react";
import Link from "next/link";
import { CodeBlock, InlineCode } from "./_components/Code";
import HighlightedInstallPicker from "./_components/HighlightedInstallPicker";
import LanguageTabs from "./_components/LanguageTabs";

import ForAgents from "./_components/ForAgents";
import { docMetadata, type DocMetadata } from "./manifest";
export { docNavigation, type DocPageId } from "./manifest";

export type DocPageDefinition = DocMetadata & {
  render: (context: { origin: string }) => ReactNode;
};

export const docPages: DocPageDefinition[] = [
  {
    ...docMetadata("install"),
    render: ({ origin }) => <>
      <section>
        <h2>Choose an installation method</h2>
        <p>The install scripts support Apple Silicon and Intel Macs, x86-64 glibc Linux, and 64-bit x86-64 Windows. Homebrew is also available on macOS and Linux.</p>
        <HighlightedInstallPicker origin={origin} wide />
      </section>

      <section>
        <h2>What the installer does</h2>
        <p>The shell and PowerShell installers download the release archive for your platform, compare it with the published SHA-256 checksum, install the binary, and run Red&apos;s self-check. They also enable managed updates for your standalone installation.</p>
        <p>Already have Red? See <Link href="/docs/getting-started/updating">Update Red</Link> for manual updates and migrating an older installation.</p>
        <ul>
          <li>On macOS and Linux, the default destination is <code>~/.local/bin/red</code>.</li>
          <li>On Windows, the default destination is <code>%LOCALAPPDATA%\Programs\Red\bin\red.exe</code>. The installer adds that directory to your user PATH.</li>
        </ul>
        <aside className="docs-callout"><strong>Linux support</strong><span>The release archive targets x86-64 glibc Linux. Linux ARM64 and musl-based distributions currently require a source build.</span></aside>
      </section>

      <section>
        <h2>Check the installation</h2>
        <p>Open a new terminal if the <InlineCode language="shell">red</InlineCode> command is not available immediately, then run:</p>
        <CodeBlock language="shell">{`red --version\nred --self-check`}</CodeBlock>
        <p>The self-check lists the bundled plugins and finishes with <code>red self-check ok</code>. Agent support is optional and has its own setup check.</p>
      </section>

      <section>
        <h2>Open a project</h2>
        <CodeBlock language="shell">red -r path/to/project</CodeBlock>
        <p>Red works without a configuration file. The default configuration, plugins, and themes are embedded in the binary.</p>
        <p><Link className="text-link" href="/docs/getting-started/first-session">Continue with your first session</Link></p>
      </section>
    </>,
  },
  {
    ...docMetadata("updating"),
    render: ({ origin }) => <>
      <section>
        <h2>Check and install a release</h2>
        <p>Official standalone installations support macOS Intel and Apple Silicon, x86-64 glibc Linux, and x86-64 Windows. Check for a newer stable release without changing your executable:</p>
        <CodeBlock language="shell">red update --check</CodeBlock>
        <p>Install the latest stable release:</p>
        <CodeBlock language="shell">red update</CodeBlock>
        <p>Inside the editor, run <kbd>:update</kbd> or choose <strong>Update Red</strong> in the command palette. You can continue editing while the update worker runs.</p>
        <p>The updater verifies the archive's published SHA-256 checksum, candidate version, and bundled runtime before replacing the executable. Restart your editing sessions to use the new version. If a detached session is active, save and stop it before updating.</p>
      </section>
      <section>
        <h2>Migrate an older standalone installation</h2>
        <p>If you installed Red before v0.8.2, extracted an archive manually, or see an unmanaged-installation message, rerun the official installer once into your existing directory. It writes the installation receipt and lock file needed for managed updates. Save and close Red first, including detached sessions.</p>
        <h3>macOS and Linux</h3>
        <p>Use your existing install directory. This example uses the default <code>~/.local/bin</code>:</p>
        <CodeBlock language="shell">{`curl --proto '=https' --tlsv1.2 -fsSL ${origin}/install.sh -o /tmp/red-install.sh\nRED_INSTALL_DIR="$HOME/.local/bin" sh /tmp/red-install.sh`}</CodeBlock>
        <h3>Windows</h3>
        <p>Replace <InlineCode language="powershell">-InstallDir</InlineCode> if you use a directory other than the default:</p>
        <CodeBlock language="powershell">{`$installer = Join-Path $env:TEMP "red-install.ps1"\nInvoke-WebRequest ${origin}/install.ps1 -OutFile $installer\n& $installer -InstallDir (Join-Path $env:LOCALAPPDATA "Programs\\Red\\bin")`}</CodeBlock>
        <p>Run <InlineCode language="shell">red --version</InlineCode> and <InlineCode language="shell">red update --check</InlineCode> to verify your installation.</p>
      </section>
      <section>
        <h2>Homebrew and source builds</h2>
        <p>For Homebrew, run:</p>
        <CodeBlock language="shell">{`brew update\nbrew upgrade codersauce/tap/red`}</CodeBlock>
        <p>Source builds use your existing build and install process. The standalone updater refuses to replace executables it doesn't own.</p>
      </section>
      <section>
        <h2>Disable daily checks</h2>
        <p>Red checks for a newer stable release once per day by default and only notifies you. Installation requires your command. To disable automatic checks, add this to <code>~/.config/red/config.toml</code> and restart Red:</p>
        <CodeBlock language="toml">{`[updates]\nmode = "off"`}</CodeBlock>
        <p><InlineCode language="shell">red update --check</InlineCode>, <InlineCode language="shell">red update</InlineCode>, and <kbd>:update</kbd> remain available.</p>
        <p><Link className="text-link" href="/docs/getting-started/first-session">Continue with your first session</Link></p>
      </section>
    </>,
  },
  {
    ...docMetadata("first-session"),
    render: () => <>
      <section>
        <h2>Start Red</h2>
        <p>Open a file, or set the workspace root explicitly:</p>
        <CodeBlock language="shell">{`red src/main.rs\nred -r path/to/project`}</CodeBlock>
        <p>The first interactive launch opens Red&apos;s welcome screen. Press <kbd>Esc</kbd> to enter the editor, or start the guided tour. The tour uses a disposable practice buffer and simulated Git and Agent screens; it doesn&apos;t change your repository or start Codex.</p>
        <CodeBlock language="red-command">{`:tutorial\n:tutorial quick`}</CodeBlock>
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
  { ...docMetadata("for-agents"), render: () => <ForAgents /> },
  {
    ...docMetadata("navigation"),
    render: () => <>
      <section>
        <h2>Open files and projects</h2>
        <CodeBlock language="shell">{`red src/main.rs\nred src/main.rs src/lib.rs\nred -r path/to/project src/main.rs`}</CodeBlock>
        <p>The <InlineCode language="shell">-r</InlineCode> option sets the workspace root explicitly. Inside Red, press <kbd>Ctrl-p</kbd> for the file picker, <kbd>Ctrl-j</kbd> or <kbd>Space b</kbd> for open buffers, and <kbd>Ctrl-e</kbd> for the file tree.</p>
        <p>Add a line number to a file-picker query to open that location. For example, <code>render:240</code> opens the selected matching file at line 240.</p>
        <p>Press <kbd>Alt-p</kbd> or <kbd>F4</kbd> in the file, buffer, or project-search picker to hide or restore its preview. Your query and selection stay in place while long paths get more room.</p>
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
    ...docMetadata("search"),
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
        <p>Press <kbd>Space g</kbd> to open project search. Type a query, move through matches with the arrow keys or <kbd>Ctrl-n</kbd>/<kbd>Ctrl-p</kbd>, and press <kbd>Enter</kbd> to open a result. Project search runs <InlineCode language="shell">rg</InlineCode>, so install ripgrep if Red reports that the process is unavailable.</p>
      </section>

      <section>
        <h2>Search the file tree</h2>
        <p>Press <kbd>Ctrl-e</kbd> to open the file tree, then <kbd>/</kbd> to search paths recursively. <kbd>Enter</kbd> opens a file or reveals a directory, <kbd>Ctrl-Enter</kbd> reveals without opening, and <kbd>Esc</kbd> restores the tree. Press <kbd>D</kbd> to search only directories, <kbd>f</kbd> to keep a filter, and <kbd>Ctrl-x</kbd> to clear it.</p>
      </section>

      <section>
        <h2>Replace text</h2>
        <CodeBlock language="red-command">{`:%s/old/new/g\n:%s/(old)-([0-9]+)/$1-$2/g\n:'<,'>s/old/new/gc`}</CodeBlock>
        <p>Red supports the current line, the whole buffer with <code>%</code>, numeric line ranges, and the last Visual selection. Add <code>g</code> for every match on a line, <code>i</code> for case-insensitive matching, or <code>c</code> to confirm each replacement.</p>
        <aside className="docs-callout"><strong>Replacement syntax</strong><span>Captures use Rust forms such as <code>$1</code> and <code>$name</code>. Use <code>\r</code> to split a line. Vim magic modes and expression replacements aren't supported.</span></aside>
      </section>
    </>,
  },
  {
    ...docMetadata("windows"),
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
        <h2>Browse directories in a buffer</h2>
        <p>Run <InlineCode language="shell">red .</InlineCode> or open a directory with <InlineCode language="red-command">:e path/to/dir</InlineCode>. Move and search with normal editor keys, press <kbd>Enter</kbd> to open an entry, and press <kbd>-</kbd> to go to the parent directory. Use <kbd>R</kbd> to refresh the listing. Directory buffers are read-only and stay in the buffer list so you can return to them.</p>
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
    ...docMetadata("languages"),
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
        <CodeBlock language="toml">{`[formatting]\non_save = false\non_paste = false`}</CodeBlock>
        <p>When format-on-save is pending, <kbd>:wq</kbd> waits for the save before exiting. Red stays open if the save fails or the buffer changes during formatting.</p>
      </section>

      <section>
        <h2>Add or override a server</h2>
        <CodeBlock language="toml">{`[lsp.servers.go]\ncommand = "gopls"\nlanguage_id = "go"\nfile_extensions = ["go"]\nroot_markers = ["go.mod", ".git"]`}</CodeBlock>
        <p>Restart Red after changing a server definition, or run <kbd>:languages reload</kbd> after changing a unified language definition.</p>
        <p>Starting with <strong>v0.9.0</strong>, multiple configured servers with overlapping file extensions or filenames attach to the same buffer automatically, combining diagnostics and code actions while routing completion, hover, and navigation by server capability. <Link className="text-link" href="/docs/languages/typescript-eslint">Configure TypeScript and ESLint together</Link></p>
      </section>

      <section>
        <h2>Install a language pack</h2>
        <p>Open <strong>Language packs</strong> from the command palette, or use the CLI:</p>
        <CodeBlock language="shell">{`red plugin catalog\nred plugin install --catalog go-language\nred plugin install --catalog python-language --trust-native-grammars`}</CodeBlock>
        <p>Native Tree-sitter grammars execute inside the editor. Installing a pack doesn't approve them automatically; trust only the exact verified grammar bytes you intend to load.</p>
        <CodeBlock language="shell">{`red language trust LANGUAGE_ID\nred language untrust LANGUAGE_ID`}</CodeBlock>
      </section>
    </>,
  },
  {
    ...docMetadata("typescript-eslint"),
    render: () => <>
      <section>
        <h2>Goal and required Red version</h2>
        <aside className="docs-callout"><strong>Available in Red v0.9.0 and later</strong><span>Use <strong>Red v0.9.0 or later</strong> to attach multiple language servers to a single document. In Red v0.8.2 and earlier, only one matching server attaches to each file.</span></aside>
        <p>This guide configures <code>typescript-language-server</code> and <code>vscode-eslint-language-server</code> to work together in the same <code>.ts</code>, <code>.tsx</code>, <code>.js</code>, or <code>.jsx</code> buffer while keeping Prettier as the external formatter. TypeScript serves completion, hover, signature help, symbols, and go-to-definition; ESLint publishes lint diagnostics and rule code actions alongside TypeScript's own diagnostics and quick fixes.</p>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Layer</th><th>Where it lives</th><th>Responsibility</th></tr></thead>
          <tbody>
            <tr><td>Embedded in Red</td><td>Red binary</td><td>Tree-sitter syntax support for JS, JSX, TS, and TSX, plus a default <code>typescript</code> server definition</td></tr>
            <tr><td>Server executables</td><td>Your <code>PATH</code></td><td><code>typescript-language-server</code> and <code>vscode-eslint-language-server</code> installed separately from Red</td></tr>
            <tr><td>Red user configuration</td><td><code>~/.config/red/config.toml</code> or <code>$XDG_CONFIG_HOME/red/config.toml</code></td><td>ESLint server registration, ESLint <code>workspace/configuration</code> settings, and optional external formatter definitions</td></tr>
            <tr><td>Project workspace</td><td>Project directory</td><td><code>package.json</code>, local <code>node_modules</code> (<code>eslint</code>, <code>typescript</code>, <code>prettier</code>), <code>tsconfig.json</code>, <code>eslint.config.js</code>, and <code>prettier.config.js</code></td></tr>
          </tbody>
        </table></div>
        <p>Red does not automatically discover or register ESLint from a project's <code>eslint.config.js</code> or <code>package.json</code>. Once matching servers are configured in <code>config.toml</code>, Red attaches all of them automatically without an extra multi-LSP flag. Each server's <code>root_markers</code> only select the workspace root directory passed to that server; they do not install or register a server.</p>
      </section>

      <section>
        <h2>Install the required tools</h2>
        <p>Keep language-server binaries on <code>PATH</code> separate from the packages installed inside your project's <code>node_modules</code>.</p>
        <h3>1. Install the language-server executables on PATH</h3>
        <p>Install <code>typescript-language-server</code>, <code>typescript</code>, and <code>vscode-langservers-extracted</code> (which provides <code>vscode-eslint-language-server</code>):</p>
        <CodeBlock language="shell">{`npm install -g typescript-language-server@6.0.1 typescript@6.0.3 vscode-langservers-extracted@4.8.0\nwhich typescript-language-server\nwhich vscode-eslint-language-server\ntypescript-language-server --version`}</CodeBlock>
        <p>Installing <code>typescript</code> alone provides <code>tsc</code> and <code>tsserver</code>, not the <code>typescript-language-server</code> executable that Red launches.</p>
        <h3>2. Install project dependencies</h3>
        <p><code>vscode-eslint-language-server</code> loads ESLint from the project's local <code>node_modules</code>, and <code>typescript-language-server</code> uses the workspace TypeScript compiler when present. Inside your project directory, install the compiler, linter, and formatter:</p>
        <CodeBlock language="shell">npm install --save-dev eslint@10.4.1 @eslint/js@10.0.1 typescript-eslint@8.60.1 typescript@6.0.3 prettier@3.8.3</CodeBlock>
        <aside className="docs-callout"><strong>Tested compatibility baseline</strong><span>The steps in this guide were verified against the v0.9.0 implementation (<code>bf2c2039d</code>) on Node.js <code>v24.22.0</code> with <code>vscode-langservers-extracted</code> <code>4.8.0</code>, <code>typescript-language-server</code> <code>6.0.1</code>, TypeScript <code>6.0.3</code>, ESLint <code>10.4.1</code>, <code>@eslint/js</code> <code>10.0.1</code>, <code>typescript-eslint</code> <code>8.60.1</code>, and Prettier <code>3.8.3</code>. Other recent versions that use stdio LSP and ESLint flat configs follow the same setup, though diagnostic text and rule actions can vary across ESLint and plugin releases.</span></aside>
      </section>

      <section>
        <h2>Create a small TypeScript + ESLint project</h2>
        <p>If you want a self-contained project to verify the setup before opening a larger repository, create a directory with the following files and install the devDependencies above.</p>
        <p><code>package.json</code>:</p>
        <CodeBlock language="json">{`{\n  "name": "red-ts-eslint-demo",\n  "private": true,\n  "type": "module",\n  "devDependencies": {\n    "@eslint/js": "10.0.1",\n    "eslint": "10.4.1",\n    "prettier": "3.8.3",\n    "typescript": "6.0.3",\n    "typescript-eslint": "8.60.1"\n  }\n}`}</CodeBlock>
        <p><code>tsconfig.json</code>:</p>
        <CodeBlock language="json">{`{\n  "compilerOptions": {\n    "target": "ES2022",\n    "module": "NodeNext",\n    "moduleResolution": "NodeNext",\n    "strict": true,\n    "noUnusedLocals": true\n  },\n  "include": ["src"]\n}`}</CodeBlock>
        <p><code>eslint.config.js</code>:</p>
        <CodeBlock language="javascript">{`import js from '@eslint/js';\nimport { defineConfig } from 'eslint/config';\nimport ts from 'typescript-eslint';\n\nexport default defineConfig(\n  js.configs.recommended,\n  ts.configs.recommended,\n);`}</CodeBlock>
        <p><code>prettier.config.js</code>:</p>
        <CodeBlock language="javascript">{`export default {\n  singleQuote: true,\n  semi: true,\n};`}</CodeBlock>
        <p><code>src/index.ts</code>:</p>
        <CodeBlock language="typescript">{`export const test = 'variable test';\nconst unusedTest = 'unused variable test';`}</CodeBlock>
        <p>Confirm that ESLint reports <code>@typescript-eslint/no-unused-vars</code> on <code>src/index.ts</code> from the terminal:</p>
        <CodeBlock language="shell">npx eslint src/index.ts</CodeBlock>
      </section>

      <section>
        <h2>Configure Red</h2>
        <p>Red reads its user configuration from <code>$XDG_CONFIG_HOME/red/config.toml</code> when <code>XDG_CONFIG_HOME</code> is set and non-empty, or <code>~/.config/red/config.toml</code> otherwise. Because Red already embeds a default <code>typescript</code> server definition for <code>.ts</code>, <code>.tsx</code>, <code>.js</code>, <code>.mjs</code>, <code>.cjs</code>, and <code>.jsx</code>, the primary setup keeps that built-in TypeScript server and adds ESLint plus Prettier:</p>
        <CodeBlock language="toml">{`[formatting]\nprovider = "auto"\n\n[languages.typescript.formatter]\nname = "Prettier"\ncommand = "prettier"\nargs = ["--stdin-filepath", "{file}"]\nroot_markers = ["prettier.config.js", "package.json", ".git"]\n\n[lsp.servers.eslint]\ncommand = "vscode-eslint-language-server"\nargs = ["--stdio"]\ndocuments = [\n  { language_id = "javascript", file_extensions = ["js", "mjs", "cjs"] },\n  { language_id = "javascriptreact", file_extensions = ["jsx"] },\n  { language_id = "typescript", file_extensions = ["ts"] },\n  { language_id = "typescriptreact", file_extensions = ["tsx"] },\n]\nroot_markers = ["eslint.config.js", "package.json", ".git"]\n\n[lsp.servers.eslint.settings.""]\nvalidate = "on"\nrun = "onType"\npackageManager = "npm"\nworkingDirectory = { mode = "auto" }\nnodePath = ""\nuseESLintClass = false\nquiet = false\noptions = {}\nexperimental = {}\nformat = false\nonIgnoredFiles = "off"\nrulesCustomizations = []\ncodeActionOnSave = { mode = "all" }\nproblems = { shortenToSingleLine = false }\n\n[lsp.servers.eslint.settings."".codeAction]\ndisableRuleComment = { enable = true, location = "separateLine", commentStyle = "line" }\nshowDocumentation = { enable = true }`}</CodeBlock>
        <p>The <InlineCode language="toml">[lsp.servers.eslint.settings.&quot;&quot;]</InlineCode> and <InlineCode language="toml">[lsp.servers.eslint.settings.&quot;&quot;.codeAction]</InlineCode> tables are required by <code>vscode-eslint-language-server</code>. After initialization, the server sends a <code>workspace/configuration</code> request with <InlineCode language="toml">section = &quot;&quot;</InlineCode>; Red returns the contents of <InlineCode language="toml">settings.&quot;&quot;</InlineCode>. Without that table, Red replies with <InlineCode language="json">null</InlineCode> and the ESLint server does not validate buffers or offer rule-disable code actions.</p>
        <h3>Merge into an existing config.toml safely</h3>
        <ul>
          <li><strong>Avoid duplicate TOML table headers.</strong> If your <code>config.toml</code> already has <InlineCode language="toml">[formatting]</InlineCode>, <InlineCode language="toml">[languages.typescript.formatter]</InlineCode>, or <InlineCode language="toml">[lsp.servers.eslint]</InlineCode>, merge the keys into the existing table instead of adding a second header with the same name.</li>
          <li><strong>Keep the built-in TypeScript server unless you need to customize it.</strong> Omit <InlineCode language="toml">[lsp.servers.typescript]</InlineCode> so Red uses its embedded definition. Writing a partial <InlineCode language="toml">[lsp.servers.typescript]</InlineCode> table replaces the built-in entry as a unit and drops any omitted fields or extensions.</li>
        </ul>
        <h3>Advanced: override the built-in TypeScript server</h3>
        <p>If you need to customize <code>typescript-language-server</code> arguments, environment variables, or root markers, include the complete definition so you preserve Red&apos;s default selectors (including <code>.mjs</code> and <code>.cjs</code>) and root markers:</p>
        <CodeBlock language="toml">{`[lsp.servers.typescript]\ncommand = "typescript-language-server"\nargs = ["--stdio"]\ndocuments = [\n  { language_id = "javascript", file_extensions = ["js", "mjs", "cjs"] },\n  { language_id = "javascriptreact", file_extensions = ["jsx"] },\n  { language_id = "typescript", file_extensions = ["ts"] },\n  { language_id = "typescriptreact", file_extensions = ["tsx"] },\n]\nroot_markers = ["package.json", "tsconfig.json", "jsconfig.json", ".git"]`}</CodeBlock>
        <p>Validate your configuration from the terminal:</p>
        <CodeBlock language="shell">red --check-config</CodeBlock>
        <p>Restart Red after changing server definitions or installing server executables. For changes limited to unified language definitions, such as external formatters, you can reload those definitions inside Red:</p>
        <CodeBlock language="red-command">:languages reload</CodeBlock>
      </section>

      <section>
        <h2>Use the right language IDs and selectors</h2>
        <p>Red uses two distinct sets of identifiers for JavaScript and TypeScript files: LSP <code>language_id</code> values sent to language servers in <code>textDocument/didOpen</code>, and Red&apos;s own <InlineCode language="toml">[languages.ID]</InlineCode> table names used for syntax and external formatters.</p>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Extension</th><th>LSP <code>documents</code> <code>language_id</code></th><th>Red <InlineCode language="toml">[languages.ID]</InlineCode> key</th></tr></thead>
          <tbody>
            <tr><td><code>.js</code>, <code>.mjs</code>, <code>.cjs</code></td><td><code>javascript</code></td><td><code>javascript</code></td></tr>
            <tr><td><code>.jsx</code></td><td><code>javascriptreact</code></td><td><code>jsx</code></td></tr>
            <tr><td><code>.ts</code></td><td><code>typescript</code></td><td><code>typescript</code></td></tr>
            <tr><td><code>.tsx</code></td><td><code>typescriptreact</code></td><td><code>tsx</code></td></tr>
          </tbody>
        </table></div>
        <p>Keep separate entries in <code>documents</code> for each extension rather than mapping <InlineCode language="toml">language_id = &quot;typescriptreact&quot;</InlineCode> to <InlineCode language="toml">[&quot;js&quot;, &quot;jsx&quot;, &quot;ts&quot;, &quot;tsx&quot;]</InlineCode>. Each attached server receives the <code>language_id</code> from the matching selector entry when a file opens.</p>
        <p>If you also format <code>.tsx</code>, <code>.js</code>, and <code>.jsx</code> files with Prettier, add matching formatter tables under Red&apos;s language keys (<InlineCode language="toml">[languages.tsx.formatter]</InlineCode>, <InlineCode language="toml">[languages.javascript.formatter]</InlineCode>, and <InlineCode language="toml">[languages.jsx.formatter]</InlineCode>) using the same Prettier command and arguments.</p>
      </section>

      <section>
        <h2>How Red routes requests across attached servers</h2>
        <ul>
          <li><strong>Attachment and lifecycle:</strong> Every configured server whose <code>documents</code> selector matches the file attaches to the buffer. Each attached server receives open, change, save, and close notifications with its own <code>language_id</code>, workspace root, and document version counter.</li>
          <li><strong>Diagnostics:</strong> Push and pull diagnostics remain scoped to the server that produced them and are combined for display. An empty diagnostic report, server reload, or crash clears only that server&apos;s diagnostics.</li>
          <li><strong>Code actions:</strong> Pressing <kbd>Space .</kbd> or <kbd>Space c a</kbd> queries every attached server that advertises <code>codeActionProvider</code>, sending each server only the diagnostics it owns. Red merges the returned actions into one picker and routes the selected edit or command back to its originating server.</li>
          <li><strong>Single-result requests:</strong> Completion, hover, go-to-definition, references, document and workspace symbols, signature help, inlay hints, and rename go to the first ready attached server that advertises the required capability. When multiple attached servers advertise the same capability, Red uses the server configuration name (<InlineCode language="toml">[lsp.servers.NAME]</InlineCode>) in alphabetical order as the tie-breaker. Because <code>eslint</code> does not advertise hover, completion, definition, or symbol providers, those requests go to <code>typescript</code> even though <code>eslint</code> sorts first alphabetically.</li>
        </ul>
      </section>

      <section>
        <h2>Verify TypeScript and ESLint in the same buffer</h2>
        <ol className="docs-steps">
          <li><span>1</span><div><strong>Open the file.</strong><p>From the project directory, run <InlineCode language="shell">red -r . src/index.ts</InlineCode>.</p></div></li>
          <li><span>2</span><div><strong>Check TypeScript hover.</strong><p>Move to <code>test</code> on line 1 (<kbd>w</kbd> <kbd>w</kbd>) and press <kbd>K</kbd>. Red displays the hover popup from <code>typescript-language-server</code> (<InlineCode language="typescript">const test: &quot;variable test&quot;</InlineCode>). Press <kbd>Esc</kbd> to close the popup.</p></div></li>
          <li><span>3</span><div><strong>Check TypeScript completion.</strong><p>Press <kbd>G</kbd> then <kbd>o</kbd> to open a new line, and type <InlineCode language="typescript">test.</InlineCode> (or press <kbd>Ctrl-Space</kbd>). String members from <code>typescript-language-server</code> such as <code>slice</code>, <code>trim</code>, and <code>length</code> appear in the completion menu. Press <kbd>Esc</kbd> and <kbd>u</kbd> to undo the test line.</p></div></li>
          <li><span>4</span><div><strong>Check combined diagnostics.</strong><p>Move to <code>unusedTest</code> on line 2 (<kbd>gg</kbd> <kbd>j</kbd> <kbd>w</kbd>) and press <kbd>D</kbd> (or press <kbd>Space d</kbd> to open the workspace diagnostics picker). Both diagnostics appear for <code>unusedTest</code>: ESLint&apos;s <code>&apos;unusedTest&apos; is assigned a value but never used.</code> (<code>@typescript-eslint/no-unused-vars</code>) and TypeScript&apos;s <code>&apos;unusedTest&apos; is declared but its value is never read.</code> (<code>6133</code>).</p></div></li>
        </ol>
      </section>

      <section>
        <h2>Apply an ESLint code action</h2>
        <p>With the cursor on <code>unusedTest</code> on line 2, press <kbd>Space .</kbd> or <kbd>Space c a</kbd>. The code-action picker lists actions from both attached servers, including ESLint&apos;s rule actions and TypeScript&apos;s quick fixes.</p>
        <p>Choose <strong>Disable @typescript-eslint/no-unused-vars for this line</strong> and press <kbd>Enter</kbd>. Red applies the workspace edit from <code>vscode-eslint-language-server</code>:</p>
        <CodeBlock language="typescript">{`export const test = 'variable test';\n// eslint-disable-next-line @typescript-eslint/no-unused-vars\nconst unusedTest = 'unused variable test';`}</CodeBlock>
        <p>ESLint&apos;s <code>@typescript-eslint/no-unused-vars</code> error clears immediately, while TypeScript&apos;s own unused-variable diagnostic on <code>unusedTest</code> remains until the variable is read or removed.</p>
      </section>

      <section>
        <h2>Keep Prettier formatting</h2>
        <p>External formatters remain independent of language-server attachments. With <InlineCode language="toml">formatting.provider = &quot;auto&quot;</InlineCode> (the default) and <InlineCode language="toml">[languages.typescript.formatter]</InlineCode> configured for Prettier, pressing <kbd>Space f</kbd> runs Prettier instead of formatting through either language server. Saving with <kbd>:w</kbd> also formats when <InlineCode language="toml">formatting.on_save = true</InlineCode>; preserve the user&apos;s existing preference.</p>
        <p>Red looks for <code>prettier</code> in the project&apos;s <code>node_modules/.bin</code> before searching <code>PATH</code>, and passes the current buffer over stdin with <InlineCode language="shell">--stdin-filepath &#123;file&#125;</InlineCode>. Setting <InlineCode language="toml">format = false</InlineCode> under <InlineCode language="toml">[lsp.servers.eslint.settings.&quot;&quot;]</InlineCode> also prevents ESLint from advertising LSP formatting if Red ever falls back to LSP formatting.</p>
        <p>To verify, change single quotes to double quotes on line 1 (<InlineCode language="typescript">export const test = &quot;variable test&quot;;</InlineCode>) and press <kbd>Space f</kbd>. Red rewrites the line to single quotes and reports <code>formatted with Prettier</code>.</p>
      </section>

      <section>
        <h2>Troubleshoot common setup failures</h2>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Symptom</th><th>Cause and fix</th></tr></thead>
          <tbody>
            <tr><td>TypeScript works, but ESLint diagnostics never appear</td><td>Confirm <InlineCode language="shell">which vscode-eslint-language-server</InlineCode> succeeds on <code>PATH</code> (note that <code>~</code> is not expanded in <code>command</code>). When ESLint cannot start, Red isolates the failure so TypeScript completion, hover, and diagnostics keep working; check <kbd>Space m</kbd> (<kbd>:messages</kbd>) and <code>red.log</code> in your Red configuration directory. After installing a previously missing executable, restart Red so the cached startup failure is cleared.</td></tr>
            <tr><td><InlineCode language="shell">red --check-config</InlineCode> reports an error or LSP is disabled</td><td>Duplicate TOML headers such as two <InlineCode language="toml">[lsp.servers.eslint]</InlineCode> tables make the file malformed (<code>CFG002</code>) and start Red in its fail-closed fallback profile with LSP disabled. An invalid field inside one server table reports <code>CFG102</code> and disables only that server. Fix the reported line and re-run <InlineCode language="shell">red --check-config</InlineCode>.</td></tr>
            <tr><td><code>.tsx</code> or <code>.jsx</code> files miss diagnostics, or <code>.ts</code> files parse as JSX</td><td>Check the <code>documents</code> array on both servers. Map <code>.ts</code> to <code>typescript</code>, <code>.tsx</code> to <code>typescriptreact</code>, <code>.js</code>/<code>.mjs</code>/<code>.cjs</code> to <code>javascript</code>, and <code>.jsx</code> to <code>javascriptreact</code>.</td></tr>
            <tr><td>ESLint server starts, but reports no diagnostics or code actions</td><td>Run <InlineCode language="shell">npx eslint src/index.ts</InlineCode> in the project root to verify local <code>node_modules/eslint</code> and <code>eslint.config.js</code> outside Red. Then confirm <InlineCode language="toml">[lsp.servers.eslint.settings.&quot;&quot;]</InlineCode> and <InlineCode language="toml">[lsp.servers.eslint.settings.&quot;&quot;.codeAction]</InlineCode> are present in <code>config.toml</code> so <code>workspace/configuration</code> does not return <InlineCode language="json">null</InlineCode>.</td></tr>
            <tr><td>TypeScript completion and hover stop working after editing <code>config.toml</code></td><td>A <InlineCode language="toml">[lsp.servers.typescript]</InlineCode> table in <code>config.toml</code> replaces Red&apos;s embedded <code>typescript</code> server entry in full, and a <InlineCode language="toml">[languages.typescript.lsp]</InlineCode> block without <InlineCode language="toml">server = &quot;eslint&quot;</InlineCode> also writes to the <code>typescript</code> server key. Remove your custom <InlineCode language="toml">[lsp.servers.typescript]</InlineCode> block to restore Red&apos;s built-in default, or use the complete override shown in the advanced section above.</td></tr>
          </tbody>
        </table></div>
      </section>

      <section>
        <h2>Use the same pattern for other language servers</h2>
        <p>You can attach any combination of language servers to the same file type by giving each server its own <InlineCode language="toml">[lsp.servers.NAME]</InlineCode> table with overlapping <code>file_extensions</code> or <code>filenames</code> selectors:</p>
        <ul>
          <li>Diagnostics from all attached servers merge automatically while keeping per-server ownership.</li>
          <li>Code actions aggregate across every attached server that advertises <code>codeActionProvider</code>.</li>
          <li>Single-result requests go to the first ready attached server that advertises the capability, using the server key name (<code>NAME</code>) in alphabetical order as a tie-breaker when more than one server supports the same request. Red does not guess a universally &ldquo;best&rdquo; server beyond capability checks and configuration-name order, so name server keys intentionally or disable overlapping capabilities in a secondary server&apos;s settings when two servers advertise the same single-result feature.</li>
        </ul>
        <p><Link className="text-link" href="/docs/languages">Return to Language tools</Link></p>
      </section>
    </>,
  },
  {
    ...docMetadata("git"),
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
    ...docMetadata("agent"),
    render: () => <>
      <section>
        <h2>Set up Codex</h2>
        <p>Agent features require Codex CLI 0.144.1 or newer. Install Codex, authenticate it, and run Red's offline prerequisite check:</p>
        <CodeBlock language="shell">{`codex login\nred --agent-check --strict`}</CodeBlock>
        <p>Red starts <InlineCode language="shell">codex app-server --stdio</InlineCode> when the first Agent session needs it. If startup fails, Red keeps your prompt so you can fix the setup and retry.</p>
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
        <p>Paths must remain inside the physical workspace. Red rejects traversal, symlinks, special files, protected paths, stale revisions, and unsafe writes. Secret-like paths are excluded unless you set <InlineCode language="toml">allow_sensitive_paths = true</InlineCode> under <InlineCode language="toml">[agent]</InlineCode>.</p>
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
    ...docMetadata("configuration"),
    render: () => <>
      <section>
        <h2>Start with a small file</h2>
        <p>Red works without a configuration file. On macOS and Linux, create <code>~/.config/red/config.toml</code> when you want to override a default. The welcome screen can create a starter file without replacing existing settings.</p>
        <CodeBlock language="toml">{`theme = "red.json"\nscrolloff = 8\n\n[search]\nignorecase = true\nsmartcase = true\n\n[keys.normal]\n"Ctrl-s" = "Save"`}</CodeBlock>
        <p>Your file is layered over Red's embedded configuration, so it doesn't need to repeat unchanged settings.</p>
      </section>

      <section>
        <h2>Check a change</h2>
        <CodeBlock language="shell">{`red --check-config\nred -c 'wrap = false' path/to/file`}</CodeBlock>
        <p><InlineCode language="shell">--check-config</InlineCode> validates the effective user configuration and exits. The repeatable <InlineCode language="shell">-c</InlineCode> option applies a TOML override for one invocation.</p>
      </section>

      <section>
        <h2>Common sections</h2>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Section</th><th>Controls</th></tr></thead>
          <tbody>
            <tr><td>Top level</td><td>Theme, wrapping, scrolling, line numbers, release notes, diagnostics, and disabled plugins</td></tr>
            <tr><td><InlineCode language="toml">[search]</InlineCode></td><td>Incremental search, highlighting, wrapping, and case behavior</td></tr>
            <tr><td><InlineCode language="toml">[completion]</InlineCode></td><td>Automatic completion, buffer words, prefix length, and menu timing</td></tr>
            <tr><td><InlineCode language="toml">[agent]</InlineCode></td><td>Codex command, inline review behavior, followed tool calls, and explicitly enabled integrations</td></tr>
            <tr><td><InlineCode language="toml">[keys.MODE]</InlineCode></td><td>Mode-specific keybindings and chords</td></tr>
            <tr><td><InlineCode language="toml">[languages.ID]</InlineCode></td><td>Detection, comments, indentation, grammar, and language-server settings</td></tr>
            <tr><td><InlineCode language="toml">[plugin_config.ID]</InlineCode></td><td>Settings owned by an enabled plugin</td></tr>
          </tbody>
        </table></div>
        <p><a className="text-link" href="https://github.com/codersauce/red/blob/main/default_config.toml" target="_blank" rel="noreferrer">Open the commented default configuration</a></p>
      </section>
    </>,
  },
  {
    ...docMetadata("keybindings"),
    render: () => <>
      <section>
        <h2>Find the current binding first</h2>
        <p>Press <kbd>F1</kbd> for keyboard help in the current context, or <kbd>Space ?</kbd> for the command palette. Both surfaces show effective bindings after your overrides are applied.</p>
      </section>

      <section>
        <h2>Map an action</h2>
        <CodeBlock language="toml">{`[keys.normal]\n"Ctrl-s" = "Save"\n"u" = "Undo"\n\n[keys.insert]\n"Ctrl-s" = "Save"`}</CodeBlock>
        <p>Each mode has its own table. A Normal-mode mapping doesn't change what the same key types in Insert mode.</p>
      </section>

      <section>
        <h2>Use sequences, chords, and plugin commands</h2>
        <CodeBlock language="toml">{`[keys.normal]\n"a" = [{ EnterMode = "Insert" }, "MoveRight"]\n"g" = { "d" = "GoToDefinition" }\n"Ctrl-j" = { PluginCommand = "BufferPicker" }`}</CodeBlock>
        <p>Normal-mode bindings are inherited by Visual modes unless you add an explicit binding under <InlineCode language="toml">[keys.visual]</InlineCode>. Red rejects ambiguous plugin leader mappings instead of silently discarding one.</p>
      </section>

      <section>
        <h2>Control prefix hints</h2>
        <CodeBlock language="toml">{`[key_hints]\nenabled = true\ndelay_ms = 250`}</CodeBlock>
        <p>Pause after a configured prefix such as <kbd>Space</kbd>, <kbd>Ctrl-w</kbd>, or <kbd>g</kbd> to see the available continuations.</p>
      </section>

      <section>
        <h2>Diagnose terminal shortcuts</h2>
        <CodeBlock language="shell">red keys</CodeBlock>
        <p>The diagnostic shows how the current terminal reports key combinations without opening a document or starting Codex. Use <kbd>Ctrl+J</kbd> as the portable newline in Agent composers when a terminal doesn't distinguish modified Enter keys.</p>
      </section>
    </>,
  },
  {
    ...docMetadata("themes"),
    render: () => <>
      <section>
        <h2>Browse themes</h2>
        <p>Press <kbd>Space t</kbd> or choose <strong>Browse themes</strong> from the command palette. Moving through the picker previews each theme. <kbd>Esc</kbd> restores the original; <kbd>Enter</kbd> selects and persists the highlighted theme.</p>
      </section>

      <section>
        <h2>Set a theme directly</h2>
        <CodeBlock language="toml">theme = "red.json"</CodeBlock>
        <p>Add the filename to <code>config.toml</code>. Run <InlineCode language="shell">red --runtime-files</InlineCode> to list every visible theme and its source.</p>
      </section>

      <section>
        <h2>Customize a bundled theme</h2>
        <CodeBlock language="shell">{`red --eject themes/red.json\nred --runtime-files`}</CodeBlock>
        <p>The ejected file is placed in the <code>themes</code> directory under Red's configuration directory. A user file shadows the bundled theme with the same name until you remove it. Use <InlineCode language="shell">--eject-force</InlineCode> only when you intend to replace an existing custom copy.</p>
      </section>
    </>,
  },
  {
    ...docMetadata("plugins"),
    render: () => <>
      <section>
        <h2>Inspect what Red loaded</h2>
        <CodeBlock language="shell">{`red --runtime-files\nred --self-check\nred plugin list`}</CodeBlock>
        <p><InlineCode language="shell">--runtime-files</InlineCode> shows visible plugins and themes with their source. <InlineCode language="shell">--self-check</InlineCode> reports the activation status of bundled plugins. <InlineCode language="shell">red plugin list</InlineCode> lists installed external packages.</p>
      </section>

      <section>
        <h2>Install a package</h2>
        <CodeBlock language="shell">{`red plugin catalog\nred plugin install --catalog go-language\nred plugin install owner/repository\nred plugin install --path ~/code/my-red-plugin`}</CodeBlock>
        <p>Catalog packages use immutable release archives with recorded checksums. GitHub and local-path sources remain explicitly unreviewed. Installing a package never grants implicit approval to execute a native Tree-sitter grammar.</p>
      </section>

      <section>
        <h2>Run plugins written in other languages</h2>
        <p>Starting with Red v0.9.0, external plugins can run as JSON-RPC processes over stdio. They can provide commands, panels, pickers, statusline content, and checked document edits. Install and manage these packages with the same <InlineCode language="shell">red plugin</InlineCode> commands as Husk packages; install any interpreter or executable required by the package separately.</p>
        <p><a className="text-link" href="https://github.com/codersauce/red/blob/v0.9.0/docs/RPC_PLUGIN_PROTOCOL.md" target="_blank" rel="noreferrer">Read the JSON-RPC plugin protocol</a></p>
      </section>

      <section>
        <h2>Try JSON Workbench</h2>
        <p>JSON Workbench is an example JSON-RPC plugin for live jq previews, result exploration, and undoable transformations. It requires Python 3.9 or newer and <code>jq</code> on <code>PATH</code>. Install it separately from the versioned Red examples:</p>
        <CodeBlock language="shell">{`git clone --branch v0.9.0 --depth 1 https://github.com/codersauce/red.git red-plugin-examples\nred plugin install --path ./red-plugin-examples/examples/rpc-json-workbench`}</CodeBlock>
        <p>Restart Red, open a JSON file, and run <InlineCode language="red-command">:JsonWorkbench</InlineCode>. Edit the query document, run <InlineCode language="red-command">:JsonRun</InlineCode>, or enable <InlineCode language="red-command">:JsonLive</InlineCode> for previews as you edit. Use <InlineCode language="red-command">:JsonApply</InlineCode> to apply a successful result, <InlineCode language="red-command">:JsonUndo</InlineCode> to restore the source, and <InlineCode language="red-command">:JsonCancel</InlineCode> to stop a live or panel preview. Foreground <InlineCode language="red-command">:JsonRun</InlineCode> and <InlineCode language="red-command">:JsonQuery</InlineCode> commands finish or reach their query timeout before another command can run in that plugin.</p>
        <p><a className="text-link" href="https://github.com/codersauce/red/blob/v0.9.0/examples/rpc-json-workbench/README.md" target="_blank" rel="noreferrer">See JSON Workbench commands and configuration</a></p>
      </section>

      <section>
        <h2>Enable, update, or remove a package</h2>
        <CodeBlock language="shell">{`red plugin disable replay\nred plugin enable replay\nred plugin update replay\nred plugin update --all\nred plugin remove replay\nred plugin remove replay --purge`}</CodeBlock>
        <p>Ordinary removal preserves the plugin's namespaced data for a later reinstall. <InlineCode language="shell">--purge</InlineCode> deletes that data as well. Failed updates leave the previous installation active.</p>
      </section>

      <section>
        <h2>Customize a bundled plugin</h2>
        <CodeBlock language="shell">red --eject plugins/fidget.hk</CodeBlock>
        <p>The copy in your configuration directory shadows the bundled file. Remove the copy to return to the version shipped with Red.</p>
        <p>Husk plugins that spawn processes through the host API need an explicit allowlist:</p>
        <CodeBlock language="toml">{`[plugin_permissions.project_search]\nprocess = ["rg"]`}</CodeBlock>
        <p>Starting with <strong>v0.9.0</strong>, external packages can also declare a standalone <InlineCode language="toml">[rpc]</InlineCode> process in <code>red-plugin.toml</code> and talk to Red over newline-delimited JSON-RPC 2.0 in any language. <Link className="text-link" href="/docs/plugins/json-rpc">Write a JSON-RPC plugin in Python or Node.js</Link></p>
      </section>
    </>,
  },
  {
    ...docMetadata("json-rpc-plugins"),
    render: () => <>
      <section>
        <h2>Overview and required Red version</h2>
        <aside className="docs-callout"><strong>Available in Red v0.9.0 and later</strong><span>Use <strong>Red v0.9.0 or later</strong> for standalone JSON-RPC plugins and the <code>0.19.0</code> host API surface. They are not included in Red v0.8.2.</span></aside>
        <p>A JSON-RPC plugin is an external package with a <code>red-plugin.toml</code> manifest and a child process that speaks JSON-RPC 2.0 over UTF-8 standard input and output. Red remains the owner of buffers, undo history, focus, panels, and sessions; your process requests attributed operations through Red&apos;s versioned <code>red/*</code> host methods.</p>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Rule</th><th>Protocol version 1 behavior</th></tr></thead>
          <tbody>
            <tr><td>Framing</td><td>One compact UTF-8 JSON object per line (<code>\n</code>) on <code>stdin</code> and <code>stdout</code>. Do <strong>not</strong> use LSP <code>Content-Length</code> headers or JSON-RPC batch arrays.</td></tr>
            <tr><td>Standard output</td><td>Reserved strictly for JSON-RPC messages. Write logs and diagnostics to <code>stderr</code>; Red retains the last 16 KiB of <code>stderr</code> when reporting a failure.</td></tr>
            <tr><td>Host API &amp; protocol</td><td>Declare <InlineCode language="toml">red_api = &quot;^0.19.0&quot;</InlineCode> in <code>red-plugin.toml</code> and return <InlineCode language="json">&quot;protocol_version&quot;: 1</InlineCode> from <code>initialize</code>.</td></tr>
            <tr><td>Handshake agreement</td><td><code>initialize</code> must return the exact commands and events declared under <InlineCode language="toml">[activation]</InlineCode> in <code>red-plugin.toml</code>, with no missing or extra entries. Wait for the <code>initialized</code> notification before calling any <code>red/*</code> method.</td></tr>
            <tr><td>Identifiers &amp; revisions</td><td>Document revisions, <code>document_id</code>, and <code>transaction_id</code> are <strong>decimal strings</strong> on the wire so JavaScript does not lose precision above <InlineCode language="javascript">Number.MAX_SAFE_INTEGER</InlineCode>. Keep them as strings.</td></tr>
            <tr><td>Text coordinates</td><td>Zero-based lines and <strong>Unicode-scalar</strong> character offsets (half-open ranges)—neither UTF-8 byte offsets nor JavaScript UTF-16 code units.</td></tr>
          </tbody>
        </table></div>
        <p>This tutorial walks through a complete plugin in both <strong>Python</strong> (3.9+ using the standard library; executable <code>python3</code> on macOS/Linux and <code>python</code> on Windows) and <strong>Node.js</strong> (18+ using built-in <code>node:process</code> and <code>node:readline</code>; executable <code>node</code> on all platforms). Switch languages at any step:</p>
      </section>

      <section>
        <h2>1. Create and install a minimal plugin</h2>
        <p>Start with a package directory containing <code>red-plugin.toml</code> and one script file. Red launches <InlineCode language="toml">[rpc].command</InlineCode> with the package directory as its working directory and passes <code>args</code> directly without a shell.</p>
        <LanguageTabs
          label="Minimal plugin files"
          python={<>
            <p>Directory layout and <code>red-plugin.toml</code> (uses <code>python3</code> on macOS/Linux and <code>python</code> on Windows via <InlineCode language="toml">[rpc.commands]</InlineCode>):</p>
            <CodeBlock language="text">{`rpc-hello-plugin/\n├── red-plugin.toml\n└── plugin.py`}</CodeBlock>
            <CodeBlock language="toml">{`schema_version = 1\n\n[plugin]\nid = "rpc-hello"\nname = "RPC Hello"\nversion = "0.1.0"\nred_api = "^0.19.0"\n\n[rpc]\ncommand = "python3"\nargs = ["plugin.py"]\n\n[rpc.commands]\naarch64-pc-windows-msvc = "python"\nx86_64-pc-windows-msvc = "python"\n\n[activation]\ncommands = ["RpcHello"]`}</CodeBlock>
            <p>Create <code>plugin.py</code> with the initialization handshake, <code>shutdown</code>/<code>exit</code> lifecycle, and <code>RpcHello</code> command:</p>
            <CodeBlock language="python">{`#!/usr/bin/env python3\nimport json\nimport sys\n\n\ndef send(message):\n    print(json.dumps(message, separators=(",", ":")), flush=True)\n\n\ndef send_error(message, detail):\n    if "id" in message:\n        send({"jsonrpc": "2.0", "id": message["id"], "error": {"code": -32000, "message": detail}})\n\n\ninitialized = False\n\nfor line in sys.stdin:\n    message = json.loads(line)\n    method = message.get("method")\n    if method == "initialize":\n        send({\n            "jsonrpc": "2.0",\n            "id": message["id"],\n            "result": {\n                "protocol_version": 1,\n                "commands": [\n                    {\n                        "name": "RpcHello",\n                        "metadata": {"title": "Hello from RPC", "arguments": True},\n                    }\n                ],\n                "events": [],\n            },\n        })\n    elif method == "initialized":\n        initialized = True\n    elif method == "shutdown":\n        send({"jsonrpc": "2.0", "id": message["id"], "result": None})\n    elif method == "exit":\n        sys.exit(0)\n    elif method == "command/execute":\n        name = message["params"].get("raw_args") or "Red"\n        send({\n            "jsonrpc": "2.0",\n            "id": message["id"],\n            "result": {"message": f"Hello, {name}, from Python RPC!"},\n        })`}</CodeBlock>
            <p>Install the package locally and verify it appears in Red&apos;s package list:</p>
            <CodeBlock language="shell">{`red plugin install --path ./rpc-hello-plugin\nred plugin list`}</CodeBlock>
          </>}
          node={<>
            <p>Directory layout and <code>red-plugin.toml</code> (uses <code>node</code> on macOS, Linux, and Windows):</p>
            <CodeBlock language="text">{`rpc-hello-node-plugin/\n├── red-plugin.toml\n└── plugin.mjs`}</CodeBlock>
            <CodeBlock language="toml">{`schema_version = 1\n\n[plugin]\nid = "rpc-hello-node"\nname = "RPC Hello (Node.js)"\nversion = "0.1.0"\nred_api = "^0.19.0"\n\n[rpc]\ncommand = "node"\nargs = ["plugin.mjs"]\n\n[activation]\ncommands = ["RpcHello"]`}</CodeBlock>
            <p>Create <code>plugin.mjs</code> with the initialization handshake, <code>shutdown</code>/<code>exit</code> lifecycle, and <code>RpcHello</code> command:</p>
            <CodeBlock language="javascript">{`#!/usr/bin/env node\nimport process from "node:process";\nimport readline from "node:readline";\n\nfunction send(message) {\n  process.stdout.write(\`\${JSON.stringify(message)}\\n\`);\n}\n\nlet initialized = false;\nconst lines = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });\n\nfor await (const line of lines) {\n  if (!line) continue;\n  const message = JSON.parse(line);\n  const method = message.method;\n  if (method === "initialize") {\n    send({\n      jsonrpc: "2.0",\n      id: message.id,\n      result: {\n        protocol_version: 1,\n        commands: [\n          {\n            name: "RpcHello",\n            metadata: { title: "Hello from RPC", arguments: true },\n          },\n        ],\n        events: [],\n      },\n    });\n  } else if (method === "initialized") {\n    initialized = true;\n  } else if (method === "shutdown") {\n    send({ jsonrpc: "2.0", id: message.id, result: null });\n  } else if (method === "exit") {\n    process.exit(0);\n  } else if (method === "command/execute") {\n    const name = message.params.raw_args || "Red";\n    send({\n      jsonrpc: "2.0",\n      id: message.id,\n      result: { message: \`Hello, \${name}, from Node.js RPC!\` },\n    });\n  }\n}`}</CodeBlock>
            <p>Install the package locally and verify it appears in Red&apos;s package list:</p>
            <CodeBlock language="shell">{`red plugin install --path ./rpc-hello-node-plugin\nred plugin list`}</CodeBlock>
          </>}
        />
        <p>Open Red, run <kbd>:RpcHello world</kbd>, and confirm Red displays <code>Hello, world, from Python RPC!</code> (or <code>Hello, world, from Node.js RPC!</code>). Commands return <InlineCode language="json">null</InlineCode> for silent completion or <InlineCode language="json">&#123;&quot;message&quot;: &quot;...&quot;&#125;</InlineCode> to publish an informational message. Returning a JSON-RPC <code>error</code> object reports a warning and leaves the plugin connection active.</p>
      </section>

      <section>
        <h2>2. Read the current document</h2>
        <p>When a command handler calls a <code>red/*</code> host method, it sends a JSON-RPC request on <code>stdout</code> and waits for the matching response on <code>stdin</code>. While waiting, your receive loop must continue servicing one-way notifications (such as <code>event/notify</code> or <code>picker/event</code>), reject unexpected re-entrant requests as busy, and respond to <code>shutdown</code>/<code>exit</code> so the process never deadlocks.</p>
        <p>Add <code>&quot;RpcDocument&quot;</code> to <InlineCode language="toml">[activation].commands</InlineCode> and your <code>initialize</code> command list, then call <code>red/DocumentSnapshot</code>:</p>
        <LanguageTabs
          label="Document snapshot helper and handler"
          python={<CodeBlock language="python">{`def read_messages():\n    global initialized, last_event\n    for line in sys.stdin:\n        message = json.loads(line)\n        method = message.get("method")\n        if method == "initialized":\n            initialized = True\n        elif method == "event/notify":\n            last_event = message["params"]\n        elif method == "shutdown":\n            send({"jsonrpc": "2.0", "id": message["id"], "result": None})\n        elif method == "exit":\n            sys.exit(0)\n        else:\n            yield message\n\n\ndef request_host(method, params):\n    if not initialized:\n        raise RuntimeError("cannot call host methods before initialized")\n    request_id = f"plugin-{next(request_ids)}"\n    send({"jsonrpc": "2.0", "id": request_id, "method": method, "params": params})\n    for response in incoming:\n        if "method" in response:\n            send_error(response, "plugin is busy waiting for a host response")\n            continue\n        if response.get("id") != request_id:\n            raise RuntimeError("unexpected host response")\n        if "error" in response:\n            raise RuntimeError(response["error"]["message"])\n        return response["result"]\n    raise RuntimeError("host closed stdin while awaiting response")\n\n\n# Inside command/execute:\nelif command == "RpcDocument":\n    document = request_host("red/DocumentSnapshot", {})\n    path = document["path"] or "[scratch]"\n    result = {\n        "message": (\n            f"Current document: {path} @ revision {document['revision']} "\n            f"({len(document['text'])} chars)"\n        )\n    }`}</CodeBlock>}
          node={<CodeBlock language="javascript">{`function scalarLength(text) {\n  return Array.from(text).length;\n}\n\nasync function requestHost(method, params) {\n  if (!initialized) {\n    throw new Error("cannot call host methods before initialized");\n  }\n  const requestId = \`plugin-\${nextRequestId++}\`;\n  send({ jsonrpc: "2.0", id: requestId, method, params });\n  while (true) {\n    const { value: response, done } = await incoming.next();\n    if (done) {\n      throw new Error("host closed stdin while awaiting response");\n    }\n    if (Object.prototype.hasOwnProperty.call(response, "method")) {\n      sendError(response, "plugin is busy waiting for a host response");\n      continue;\n    }\n    if (response.id !== requestId) {\n      throw new Error("unexpected host response");\n    }\n    if (Object.prototype.hasOwnProperty.call(response, "error")) {\n      throw new Error(response.error.message);\n    }\n    return response.result;\n  }\n}\n\n// Inside command/execute:\n} else if (command === "RpcDocument") {\n  const document = await requestHost("red/DocumentSnapshot", {});\n  const path = document.path || "[scratch]";\n  const chars = scalarLength(document.text);\n  result = {\n    message: \`Current document: \${path} @ revision \${document.revision} (\${chars} chars)\`,\n  };`}</CodeBlock>}
        />
        <p>Notice how the Node.js version uses <InlineCode language="javascript">Array.from(document.text).length</InlineCode> rather than <InlineCode language="javascript">document.text.length</InlineCode>, and calls <InlineCode language="javascript">incoming.next()</InlineCode> inside <code>requestHost</code> so returning a host response does not close the outer <InlineCode language="javascript">for await</InlineCode> generator. On a buffer containing <InlineCode language="javascript">const icon = &quot;🦀&quot;;\nsecond line\n</InlineCode>, both Python and Node.js report <code>(30 chars)</code> in Unicode scalar values.</p>
      </section>

      <section>
        <h2>3. Display and close a text panel</h2>
        <p>Plugins can open a host-rendered text panel with a connection-local ID using <code>red/TextPanelCreate</code>, replace its Markdown or syntax-highlighted code blocks with <code>red/TextPanelSetContent</code>, focus it with <code>red/TextPanelFocus</code>, and close it with <code>red/TextPanelDispose</code>.</p>
        <LanguageTabs
          label="Text panel commands"
          python={<CodeBlock language="python">{`elif command == "RpcPanel":\n    request_host(\n        "red/TextPanelCreate",\n        {"id": "python-preview", "side": "right", "width": 36, "title": "Python RPC"},\n    )\n    request_host(\n        "red/TextPanelSetContent",\n        {\n            "id": "python-preview",\n            "blocks": [\n                {\n                    "id": "welcome",\n                    "kind": "agent",\n                    "format": "markdown",\n                    "text": "# Language-agnostic panel\\n\\nRendered by Red from a **Python** JSON-RPC plugin.",\n                }\n            ],\n        },\n    )\n    request_host("red/TextPanelFocus", {"id": "python-preview"})\n    result = None\nelif command == "RpcPanelClose":\n    request_host("red/TextPanelDispose", {"id": "python-preview"})\n    result = None`}</CodeBlock>}
          node={<CodeBlock language="javascript">{`} else if (command === "RpcPanel") {\n  await requestHost("red/TextPanelCreate", {\n    id: "node-preview",\n    side: "right",\n    width: 36,\n    title: "Node.js RPC",\n  });\n  await requestHost("red/TextPanelSetContent", {\n    id: "node-preview",\n    blocks: [\n      {\n        id: "welcome",\n        kind: "agent",\n        format: "markdown",\n        text: "# Language-agnostic panel\\n\\nRendered by Red from a **Node.js** JSON-RPC plugin.",\n      },\n    ],\n  });\n  await requestHost("red/TextPanelFocus", { id: "node-preview" });\n} else if (command === "RpcPanelClose") {\n  await requestHost("red/TextPanelDispose", { id: "node-preview" });`}</CodeBlock>}
        />
        <p>Run <kbd>:RpcPanel</kbd> to open and focus the right-hand panel, then <kbd>:RpcPanelClose</kbd> to dispose it. Panel IDs belong to the active connection: if your plugin is reloaded, disabled, or disconnected, Red disposes its panels automatically.</p>
      </section>

      <section>
        <h2>4. Apply and undo an edit safely</h2>
        <p>Red never lets plugins mutate buffer memory directly. Instead, request a snapshot with <InlineCode language="javascript">include_document_id: true</InlineCode>, compute your edit ranges in zero-based Unicode-scalar coordinates, and send <code>red/DocumentApply</code> with the snapshot&apos;s decimal-string <code>document_id</code>, <code>expected_revision</code>, and optional <code>expected_text</code> preimage. Red validates every range and preimage before recording one undoable transaction attributed to your plugin.</p>
        <LanguageTabs
          label="Apply and undo handlers"
          python={<CodeBlock language="python">{`elif command == "RpcApply":\n    document = request_host("red/DocumentSnapshot", {"include_document_id": True})\n    suffix = message["params"].get("raw_args") or ""\n    if suffix:\n        first_line = document.get("text", "").split("\\n", 1)[0].rstrip("\\r")\n        edit = {\n            "range": {\n                "start": {"line": 0, "character": 0},\n                "end": {"line": 0, "character": len(first_line)},\n            },\n            "text": f"{first_line} {suffix}",\n            "expected_text": first_line,\n        }\n    else:\n        edit = {\n            "range": {\n                "start": {"line": 0, "character": 0},\n                "end": {"line": 0, "character": 0},\n            },\n            "text": "# Edited by Python RPC\\n",\n            "expected_text": "",\n        }\n    applied = request_host(\n        "red/DocumentApply",\n        {\n            "document_id": document["document_id"],\n            "expected_revision": document["revision"],\n            "label": "RPC example edit",\n            "edits": [edit],\n        },\n    )\n    last_transaction_id = applied["transaction_id"]\n    last_document_id = document["document_id"]\n    result = {"message": f"RPC edit applied @ {applied['revision']}"}\nelif command == "RpcUndo":\n    if last_transaction_id is None:\n        raise RuntimeError("RpcApply has no transaction to undo")\n    undone = request_host(\n        "red/DocumentUndo",\n        {"document_id": last_document_id, "transaction_id": last_transaction_id},\n    )\n    last_transaction_id = None\n    result = {"message": f"RPC edit undone @ {undone['revision']}"}`}</CodeBlock>}
          node={<CodeBlock language="javascript">{`} else if (command === "RpcApply") {\n  const document = await requestHost("red/DocumentSnapshot", {\n    include_document_id: true,\n  });\n  const suffix = message.params.raw_args || "";\n  let edit;\n  if (suffix) {\n    const firstLine = (document.text || "").split("\\n", 1)[0].replace(/\\r$/, "");\n    edit = {\n      range: {\n        start: { line: 0, character: 0 },\n        end: { line: 0, character: scalarLength(firstLine) },\n      },\n      text: \`\${firstLine} \${suffix}\`,\n      expected_text: firstLine,\n    };\n  } else {\n    edit = {\n      range: {\n        start: { line: 0, character: 0 },\n        end: { line: 0, character: 0 },\n      },\n      text: "# Edited by Node.js RPC\\n",\n      expected_text: "",\n    };\n  }\n  const applied = await requestHost("red/DocumentApply", {\n    document_id: document.document_id,\n    expected_revision: document.revision,\n    label: "RPC example edit",\n    edits: [edit],\n  });\n  lastTransactionId = applied.transaction_id;\n  lastDocumentId = document.document_id;\n  result = { message: \`RPC edit applied @ \${applied.revision}\` };\n} else if (command === "RpcUndo") {\n  if (lastTransactionId === null) {\n    throw new Error("RpcApply has no transaction to undo");\n  }\n  const undone = await requestHost("red/DocumentUndo", {\n    document_id: lastDocumentId,\n    transaction_id: lastTransactionId,\n  });\n  lastTransactionId = null;\n  result = { message: \`RPC edit undone @ \${undone.revision}\` };`}</CodeBlock>}
        />
        <p>Test both Unicode-aware range replacement and undo on a file whose first line is <InlineCode language="javascript">const icon = &quot;🦀&quot;;</InlineCode>:</p>
        <ol className="docs-steps">
          <li><span>1</span><div><strong>Apply a suffix edit.</strong><p>Run <kbd>:RpcApply // crab</kbd>. Even though <code>🦀</code> is two UTF-16 code units in JavaScript and four UTF-8 bytes, both plugins compute Unicode-scalar offset <code>17</code> and rewrite line 1 to <InlineCode language="javascript">const icon = &quot;🦀&quot;; // crab</InlineCode>.</p></div></li>
          <li><span>2</span><div><strong>Undo the transaction.</strong><p>Run <kbd>:RpcUndo</kbd> (or press <kbd>u</kbd> in Normal mode). Red reverts the transaction and restores <InlineCode language="javascript">const icon = &quot;🦀&quot;;</InlineCode>.</p></div></li>
          <li><span>3</span><div><strong>Check error recovery.</strong><p>Run <kbd>:RpcUndo</kbd> a second time. The plugin returns a JSON-RPC error (<code>RpcApply has no transaction to undo</code>), Red shows it as a warning, and the plugin remains active for the next command. Likewise, if the buffer changes before <code>red/DocumentApply</code>, Red rejects the stale revision with error <code>-32002</code> without modifying the buffer.</p></div></li>
        </ol>
      </section>

      <section>
        <h2>5. Handle events, lifecycle, and complete package files</h2>
        <p>Protocol version 1 delivers three low-frequency global editor events when declared in both <InlineCode language="toml">[activation].events</InlineCode> and <code>initialize</code>: <code>editor:ready</code>, <code>file:opened</code>, and <code>file:saved</code>. Each arrives as a one-way <code>event/notify</code> notification with <InlineCode language="json">&#123;&quot;name&quot;: &quot;file:saved&quot;, &quot;payload&quot;: &#123;&quot;file&quot;: &quot;...&quot;, &quot;buffer_index&quot;: 0, &quot;document_id&quot;: 42&#125;&#125;</InlineCode>.</p>
        <p>The complete packages below use the v0.9.0 protocol. The Python package matches <a href="https://github.com/codersauce/red/tree/eb5e2b6be15325abd12adbfac816f7844afff42c/examples/rpc-hello-plugin" target="_blank" rel="noreferrer"><code>examples/rpc-hello-plugin</code></a>; the Node.js version implements the same operations, including configuration, persistent storage, statusline, picker, panel, document apply/undo, and <code>file:saved</code> event tracking:</p>
        <LanguageTabs
          label="Complete runnable plugin package"
          python={<>
            <p><code>rpc-hello-plugin/red-plugin.toml</code>:</p>
            <CodeBlock language="toml">{`schema_version = 1\n\n[plugin]\nid = "rpc-hello"\nname = "RPC Hello"\nversion = "0.1.0"\nred_api = "^0.19.0"\n\n[rpc]\ncommand = "python3"\nargs = ["plugin.py"]\n\n[rpc.commands]\naarch64-pc-windows-msvc = "python"\nx86_64-pc-windows-msvc = "python"\n\n[activation]\ncommands = ["RpcApply", "RpcConfig", "RpcDocument", "RpcHello", "RpcLastEvent", "RpcPanel", "RpcPanelClose", "RpcPicker", "RpcStatusline", "RpcStatuslineClear", "RpcStorage", "RpcStorageClear", "RpcUndo"]\nevents = ["file:saved"]`}</CodeBlock>
            <p><code>rpc-hello-plugin/plugin.py</code>:</p>
            <CodeBlock language="python">{`#!/usr/bin/env python3\nimport itertools\nimport json\nimport sys\n\n\ndef send(message):\n    print(json.dumps(message, separators=(",", ":")), flush=True)\n\n\ndef send_error(message, detail):\n    if "id" in message:\n        send({"jsonrpc": "2.0", "id": message["id"], "error": {"code": -32000, "message": detail}})\n\n\ndef read_messages():\n    """Service notifications and lifecycle messages during every receive loop."""\n    global initialized, last_event\n    for line in sys.stdin:\n        message = json.loads(line)\n        method = message.get("method")\n        if method == "initialized":\n            initialized = True\n        elif method == "event/notify":\n            last_event = message["params"]\n        elif method == "picker/event":\n            picker = message["params"]\n            last_event = {\n                "name": f"picker:{picker['event']}",\n                "payload": {"file": picker["id"]},\n            }\n        elif method == "shutdown":\n            send({"jsonrpc": "2.0", "id": message["id"], "result": None})\n        elif method == "exit":\n            sys.exit(0)\n        else:\n            yield message\n\n\ndef request_host(method, params):\n    if not initialized:\n        raise RuntimeError("cannot call host methods before initialized")\n    request_id = f"plugin-{next(request_ids)}"\n    send({"jsonrpc": "2.0", "id": request_id, "method": method, "params": params})\n    for response in incoming:\n        if "method" in response:\n            send_error(response, "plugin is busy waiting for a host response")\n            continue\n        if response.get("id") != request_id:\n            raise RuntimeError("unexpected host response")\n        if "error" in response:\n            raise RuntimeError(response["error"]["message"])\n        return response["result"]\n    raise RuntimeError("host closed stdin while awaiting response")\n\n\ninitialized = False\nlast_transaction_id = None\nlast_document_id = None\nlast_event = None\nrequest_ids = itertools.count(1)\nincoming = read_messages()\n\nfor message in incoming:\n    method = message.get("method")\n    if method == "initialize":\n        send({\n            "jsonrpc": "2.0",\n            "id": message["id"],\n            "result": {\n                "protocol_version": 1,\n                "commands": [\n                    {"name": "RpcHello", "metadata": {"title": "Hello from RPC", "arguments": True}},\n                    {"name": "RpcDocument", "metadata": {"title": "Show current RPC document"}},\n                    {"name": "RpcConfig", "metadata": {"title": "Show this RPC plugin's configuration"}},\n                    {"name": "RpcApply", "metadata": {"title": "Apply an RPC document edit", "arguments": True}},\n                    {"name": "RpcLastEvent", "metadata": {"title": "Show the last RPC editor event"}},\n                    {"name": "RpcPicker", "metadata": {"title": "Open an RPC picker"}},\n                    {"name": "RpcPanel", "metadata": {"title": "Open an RPC text panel"}},\n                    {"name": "RpcPanelClose", "metadata": {"title": "Close the RPC text panel"}},\n                    {"name": "RpcStatusline", "metadata": {"title": "Set the RPC statusline"}},\n                    {"name": "RpcStatuslineClear", "metadata": {"title": "Clear the RPC statusline"}},\n                    {"name": "RpcStorage", "metadata": {"title": "Increment persistent RPC storage"}},\n                    {"name": "RpcStorageClear", "metadata": {"title": "Clear persistent RPC storage"}},\n                    {"name": "RpcUndo", "metadata": {"title": "Undo the last RPC edit"}},\n                ],\n                "events": ["file:saved"],\n            },\n        })\n    elif method == "command/execute":\n        try:\n            command = message["params"]["name"]\n            if command == "RpcConfig":\n                config = request_host("red/ConfigGet", {})\n                result = {"message": f"RPC config: {json.dumps(config, separators=(',', ':'))}"}\n            elif command == "RpcDocument":\n                document = request_host("red/DocumentSnapshot", {})\n                path = document["path"] or "[scratch]"\n                result = {\n                    "message": (\n                        f"Current document: {path} @ revision {document['revision']} "\n                        f"({len(document['text'])} chars)"\n                    )\n                }\n            elif command == "RpcApply":\n                document = request_host("red/DocumentSnapshot", {"include_document_id": True})\n                suffix = message["params"].get("raw_args") or ""\n                if suffix:\n                    first_line = document.get("text", "").split("\\n", 1)[0].rstrip("\\r")\n                    edit = {\n                        "range": {\n                            "start": {"line": 0, "character": 0},\n                            "end": {"line": 0, "character": len(first_line)},\n                        },\n                        "text": f"{first_line} {suffix}",\n                        "expected_text": first_line,\n                    }\n                else:\n                    edit = {\n                        "range": {\n                            "start": {"line": 0, "character": 0},\n                            "end": {"line": 0, "character": 0},\n                        },\n                        "text": "# Edited by Python RPC\\n",\n                        "expected_text": "",\n                    }\n                applied = request_host(\n                    "red/DocumentApply",\n                    {\n                        "document_id": document["document_id"],\n                        "expected_revision": document["revision"],\n                        "label": "RPC example edit",\n                        "edits": [edit],\n                    },\n                )\n                last_transaction_id = applied["transaction_id"]\n                last_document_id = document["document_id"]\n                result = {"message": f"RPC edit applied @ {applied['revision']}"}\n            elif command == "RpcUndo":\n                if last_transaction_id is None:\n                    raise RuntimeError("RpcApply has no transaction to undo")\n                undone = request_host(\n                    "red/DocumentUndo",\n                    {"document_id": last_document_id, "transaction_id": last_transaction_id},\n                )\n                last_transaction_id = None\n                result = {"message": f"RPC edit undone @ {undone['revision']}"}\n            elif command == "RpcLastEvent":\n                if last_event is None:\n                    raise RuntimeError("no RPC editor event has been received")\n                event_file = last_event["payload"].get("file", "[scratch]")\n                result = {"message": f"Last RPC event: {last_event['name']} ({event_file})"}\n            elif command == "RpcPicker":\n                request_host(\n                    "red/PickerOpen",\n                    {\n                        "id": "python-choice",\n                        "title": "Python RPC picker",\n                        "items": [\n                            {"id": "alpha", "label": "Alpha"},\n                            {"id": "beta", "label": "Beta", "detail": "second choice"},\n                            {"id": "gamma", "label": "Gamma", "data": {"rank": 3}},\n                        ],\n                    },\n                )\n                result = None\n            elif command == "RpcPanel":\n                request_host(\n                    "red/TextPanelCreate",\n                    {"id": "python-preview", "side": "right", "width": 36, "title": "Python RPC"},\n                )\n                request_host(\n                    "red/TextPanelSetContent",\n                    {\n                        "id": "python-preview",\n                        "blocks": [\n                            {\n                                "id": "welcome",\n                                "kind": "agent",\n                                "format": "markdown",\n                                "text": "# Language-agnostic panel\\n\\nRendered by Red from a **Python** JSON-RPC plugin.",\n                            }\n                        ],\n                    },\n                )\n                request_host("red/TextPanelFocus", {"id": "python-preview"})\n                result = None\n            elif command == "RpcPanelClose":\n                request_host("red/TextPanelDispose", {"id": "python-preview"})\n                result = None\n            elif command == "RpcStatusline":\n                request_host("red/StatuslineSet", {"text": "Python RPC ready", "side": "right"})\n                result = None\n            elif command == "RpcStatuslineClear":\n                request_host("red/StatuslineClear", {})\n                result = None\n            elif command == "RpcStorage":\n                count = request_host("red/StorageGet", {"key": "count"})\n                count = count + 1 if isinstance(count, int) else 1\n                request_host("red/StorageSet", {"key": "count", "value": count})\n                result = {"message": f"Persistent RPC count: {count}"}\n            elif command == "RpcStorageClear":\n                request_host("red/StorageDelete", {"key": "count"})\n                result = {"message": "Persistent RPC count cleared"}\n            else:\n                name = message["params"]["raw_args"] or "Red"\n                result = {"message": f"Hello, {name}, from Python RPC!"}\n            send({"jsonrpc": "2.0", "id": message["id"], "result": result})\n        except RuntimeError as error:\n            send_error(message, str(error))`}</CodeBlock>
          </>}
          node={<>
            <p><code>rpc-hello-node-plugin/red-plugin.toml</code>:</p>
            <CodeBlock language="toml">{`schema_version = 1\n\n[plugin]\nid = "rpc-hello-node"\nname = "RPC Hello (Node.js)"\nversion = "0.1.0"\nred_api = "^0.19.0"\n\n[rpc]\ncommand = "node"\nargs = ["plugin.mjs"]\n\n[activation]\ncommands = ["RpcApply", "RpcConfig", "RpcDocument", "RpcHello", "RpcLastEvent", "RpcPanel", "RpcPanelClose", "RpcPicker", "RpcStatusline", "RpcStatuslineClear", "RpcStorage", "RpcStorageClear", "RpcUndo"]\nevents = ["file:saved"]`}</CodeBlock>
            <p><code>rpc-hello-node-plugin/plugin.mjs</code>:</p>
            <CodeBlock language="javascript">{`#!/usr/bin/env node\nimport process from "node:process";\nimport readline from "node:readline";\n\nfunction send(message) {\n  process.stdout.write(\`\${JSON.stringify(message)}\\n\`);\n}\n\nfunction sendError(message, detail) {\n  if (Object.prototype.hasOwnProperty.call(message, "id")) {\n    send({\n      jsonrpc: "2.0",\n      id: message.id,\n      error: { code: -32000, message: detail },\n    });\n  }\n}\n\nfunction scalarLength(text) {\n  return Array.from(text).length;\n}\n\nlet initialized = false;\nlet lastTransactionId = null;\nlet lastDocumentId = null;\nlet lastEvent = null;\nlet nextRequestId = 1;\n\nasync function* readMessages() {\n  const lines = readline.createInterface({\n    input: process.stdin,\n    crlfDelay: Infinity,\n  });\n  for await (const line of lines) {\n    if (!line) continue;\n    const message = JSON.parse(line);\n    const method = message.method;\n    if (method === "initialized") {\n      initialized = true;\n    } else if (method === "event/notify") {\n      lastEvent = message.params;\n    } else if (method === "picker/event") {\n      const picker = message.params;\n      lastEvent = {\n        name: \`picker:\${picker.event}\`,\n        payload: { file: picker.id },\n      };\n    } else if (method === "shutdown") {\n      send({ jsonrpc: "2.0", id: message.id, result: null });\n    } else if (method === "exit") {\n      process.exit(0);\n    } else {\n      yield message;\n    }\n  }\n}\n\nconst incoming = readMessages();\n\nasync function requestHost(method, params) {\n  if (!initialized) {\n    throw new Error("cannot call host methods before initialized");\n  }\n  const requestId = \`plugin-\${nextRequestId++}\`;\n  send({ jsonrpc: "2.0", id: requestId, method, params });\n  while (true) {\n    const { value: response, done } = await incoming.next();\n    if (done) {\n      throw new Error("host closed stdin while awaiting response");\n    }\n    if (Object.prototype.hasOwnProperty.call(response, "method")) {\n      sendError(response, "plugin is busy waiting for a host response");\n      continue;\n    }\n    if (response.id !== requestId) {\n      throw new Error("unexpected host response");\n    }\n    if (Object.prototype.hasOwnProperty.call(response, "error")) {\n      throw new Error(response.error.message);\n    }\n    return response.result;\n  }\n}\n\nfor await (const message of incoming) {\n  const method = message.method;\n  if (method === "initialize") {\n    send({\n      jsonrpc: "2.0",\n      id: message.id,\n      result: {\n        protocol_version: 1,\n        commands: [\n          { name: "RpcHello", metadata: { title: "Hello from RPC", arguments: true } },\n          { name: "RpcDocument", metadata: { title: "Show current RPC document" } },\n          { name: "RpcConfig", metadata: { title: "Show this RPC plugin's configuration" } },\n          { name: "RpcApply", metadata: { title: "Apply an RPC document edit", arguments: true } },\n          { name: "RpcLastEvent", metadata: { title: "Show the last RPC editor event" } },\n          { name: "RpcPicker", metadata: { title: "Open an RPC picker" } },\n          { name: "RpcPanel", metadata: { title: "Open an RPC text panel" } },\n          { name: "RpcPanelClose", metadata: { title: "Close the RPC text panel" } },\n          { name: "RpcStatusline", metadata: { title: "Set the RPC statusline" } },\n          { name: "RpcStatuslineClear", metadata: { title: "Clear the RPC statusline" } },\n          { name: "RpcStorage", metadata: { title: "Increment persistent RPC storage" } },\n          { name: "RpcStorageClear", metadata: { title: "Clear persistent RPC storage" } },\n          { name: "RpcUndo", metadata: { title: "Undo the last RPC edit" } },\n        ],\n        events: ["file:saved"],\n      },\n    });\n  } else if (method === "command/execute") {\n    try {\n      const command = message.params.name;\n      let result = null;\n      if (command === "RpcConfig") {\n        const config = await requestHost("red/ConfigGet", {});\n        result = { message: \`RPC config: \${JSON.stringify(config)}\` };\n      } else if (command === "RpcDocument") {\n        const document = await requestHost("red/DocumentSnapshot", {});\n        const path = document.path || "[scratch]";\n        const chars = scalarLength(document.text);\n        result = {\n          message: \`Current document: \${path} @ revision \${document.revision} (\${chars} chars)\`,\n        };\n      } else if (command === "RpcApply") {\n        const document = await requestHost("red/DocumentSnapshot", {\n          include_document_id: true,\n        });\n        const suffix = message.params.raw_args || "";\n        let edit;\n        if (suffix) {\n          const firstLine = (document.text || "").split("\\n", 1)[0].replace(/\\r$/, "");\n          edit = {\n            range: {\n              start: { line: 0, character: 0 },\n              end: { line: 0, character: scalarLength(firstLine) },\n            },\n            text: \`\${firstLine} \${suffix}\`,\n            expected_text: firstLine,\n          };\n        } else {\n          edit = {\n            range: {\n              start: { line: 0, character: 0 },\n              end: { line: 0, character: 0 },\n            },\n            text: "# Edited by Node.js RPC\\n",\n            expected_text: "",\n          };\n        }\n        const applied = await requestHost("red/DocumentApply", {\n          document_id: document.document_id,\n          expected_revision: document.revision,\n          label: "RPC example edit",\n          edits: [edit],\n        });\n        lastTransactionId = applied.transaction_id;\n        lastDocumentId = document.document_id;\n        result = { message: \`RPC edit applied @ \${applied.revision}\` };\n      } else if (command === "RpcUndo") {\n        if (lastTransactionId === null) {\n          throw new Error("RpcApply has no transaction to undo");\n        }\n        const undone = await requestHost("red/DocumentUndo", {\n          document_id: lastDocumentId,\n          transaction_id: lastTransactionId,\n        });\n        lastTransactionId = null;\n        result = { message: \`RPC edit undone @ \${undone.revision}\` };\n      } else if (command === "RpcLastEvent") {\n        if (lastEvent === null) {\n          throw new Error("no RPC editor event has been received");\n        }\n        const eventFile = lastEvent.payload?.file ?? "[scratch]";\n        result = { message: \`Last RPC event: \${lastEvent.name} (\${eventFile})\` };\n      } else if (command === "RpcPicker") {\n        await requestHost("red/PickerOpen", {\n          id: "node-choice",\n          title: "Node.js RPC picker",\n          items: [\n            { id: "alpha", label: "Alpha" },\n            { id: "beta", label: "Beta", detail: "second choice" },\n            { id: "gamma", label: "Gamma", data: { rank: 3 } },\n          ],\n        });\n      } else if (command === "RpcPanel") {\n        await requestHost("red/TextPanelCreate", {\n          id: "node-preview",\n          side: "right",\n          width: 36,\n          title: "Node.js RPC",\n        });\n        await requestHost("red/TextPanelSetContent", {\n          id: "node-preview",\n          blocks: [\n            {\n              id: "welcome",\n              kind: "agent",\n              format: "markdown",\n              text: "# Language-agnostic panel\\n\\nRendered by Red from a **Node.js** JSON-RPC plugin.",\n            },\n          ],\n        });\n        await requestHost("red/TextPanelFocus", { id: "node-preview" });\n      } else if (command === "RpcPanelClose") {\n        await requestHost("red/TextPanelDispose", { id: "node-preview" });\n      } else if (command === "RpcStatusline") {\n        await requestHost("red/StatuslineSet", { text: "Node.js RPC ready", side: "right" });\n      } else if (command === "RpcStatuslineClear") {\n        await requestHost("red/StatuslineClear", {});\n      } else if (command === "RpcStorage") {\n        const current = await requestHost("red/StorageGet", { key: "count" });\n        const count = Number.isInteger(current) ? current + 1 : 1;\n        await requestHost("red/StorageSet", { key: "count", value: count });\n        result = { message: \`Persistent RPC count: \${count}\` };\n      } else if (command === "RpcStorageClear") {\n        await requestHost("red/StorageDelete", { key: "count" });\n        result = { message: "Persistent RPC count cleared" };\n      } else {\n        const name = message.params.raw_args || "Red";\n        result = { message: \`Hello, \${name}, from Node.js RPC!\` };\n      }\n      send({ jsonrpc: "2.0", id: message.id, result });\n    } catch (error) {\n      sendError(message, error instanceof Error ? error.message : String(error));\n    }\n  }\n}`}</CodeBlock>
          </>}
        />
        <p>Save a file with <kbd>:w</kbd> and run <kbd>:RpcLastEvent</kbd> to see <code>Last RPC event: file:saved (...)</code>. While Red is running, saving or touching <code>red-plugin.toml</code> in a local path install hot-reloads the plugin: Red validates the replacement process first, swaps it in, and disposes any panels, pickers, statusline items, or document watches owned by the previous connection.</p>
      </section>

      <section>
        <h2>6. Configure and distribute the plugin</h2>
        <h3>User configuration and persistent storage</h3>
        <p>Users configure settings in <code>~/.config/red/config.toml</code> under <InlineCode language="toml">[plugin_config.OWNER]</InlineCode>, where <code>OWNER</code> is the plugin&apos;s registration name (by default, <InlineCode language="toml">[plugin].id</InlineCode>):</p>
        <CodeBlock language="toml">{`[plugin_config.rpc-hello]\ngreeting = "hello"`}</CodeBlock>
        <p><code>red/ConfigGet</code> returns that table as JSON (or <InlineCode language="json">null</InlineCode> when unset), and <code>red/StorageGet</code>, <code>red/StorageSet</code>, and <code>red/StorageDelete</code> persist up to 1 MiB of JSON per key across editor restarts in Red&apos;s preferences store.</p>
        <h3>Environment filtering and explicit grants</h3>
        <p>Red starts RPC child processes with a cleared environment and inherits only baseline OS variables (<code>HOME</code>, <code>PATH</code>, <code>USER</code>, <code>LOGNAME</code>, <code>SHELL</code>, <code>TMPDIR</code>/<code>TMP</code>/<code>TEMP</code>, <code>LANG</code>, <code>LC_ALL</code>, <code>TERM</code>, <code>SSH_AUTH_SOCK</code>, <code>XDG_*</code>, and Windows system paths). Users can grant specific environment variables in <code>~/.config/red/config.toml</code>:</p>
        <CodeBlock language="toml">{`[plugin_permissions.rpc-hello]\ninherit_env = ["MY_SERVICE_TOKEN"]`}</CodeBlock>
        <p>A package manifest cannot grant itself environment variables. Keep in mind that RPC plugins run as supervised native child processes: environment filtering prevents accidental secret leakage, not operating-system sandboxing.</p>
        <h3>Local install, GitHub repositories, and target-specific artifacts</h3>
        <CodeBlock language="shell">{`red plugin install --path ./rpc-hello-plugin\nred plugin install owner/repository\nred plugin update rpc-hello\nred plugin disable rpc-hello\nred plugin enable rpc-hello\nred plugin remove rpc-hello`}</CodeBlock>
        <p>For compiled plugins that should not require a language runtime on the user&apos;s machine, omit <code>command</code> and declare per-target GitHub release binaries with SHA-256 digests under <InlineCode language="toml">[rpc.artifacts.TARGET]</InlineCode>:</p>
        <CodeBlock language="toml">{`[plugin]\nid = "document-tools"\nname = "Document Tools"\nversion = "0.1.0"\nred_api = "^0.19.0"\n\n[rpc]\nargs = []\n\n[rpc.artifacts.aarch64-apple-darwin]\nurl = "https://github.com/example/document-tools/releases/download/v0.1.0/document-tools-aarch64-apple-darwin"\nsha256 = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"`}</CodeBlock>
        <p>Red selects <InlineCode language="toml">[rpc.commands.TARGET]</InlineCode> first, then <code>rpc.command</code>, then <InlineCode language="toml">[rpc.artifacts.TARGET]</InlineCode>. GitHub installs and updates verify the SHA-256 digest and 128 MiB ceiling before swapping the package; local <InlineCode language="shell">--path</InlineCode> installs use local commands without downloading release artifacts.</p>
      </section>

      <section>
        <h2>7. Troubleshoot common failures</h2>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Symptom</th><th>Cause and fix</th></tr></thead>
          <tbody>
            <tr><td>Plugin fails to start or executable is not found</td><td>A bare <code>command</code> (such as <code>python3</code> or <code>node</code>) resolves on <code>PATH</code>; a command containing <code>/</code> or <code>\</code> resolves relative to the package root without a shell or <code>~</code> expansion. On Windows, add <InlineCode language="toml">[rpc.commands]</InlineCode> entries mapping <code>x86_64-pc-windows-msvc</code> and <code>aarch64-pc-windows-msvc</code> to <code>&quot;python&quot;</code> when <InlineCode language="toml">command = &quot;python3&quot;</InlineCode>.</td></tr>
            <tr><td>Plugin is quarantined during <code>initialize</code></td><td>The <code>commands</code> and <code>events</code> arrays returned by <code>initialize</code> must match <InlineCode language="toml">[activation].commands</InlineCode> and <InlineCode language="toml">[activation].events</InlineCode> in <code>red-plugin.toml</code> exactly, with no extra or missing items, and <code>red_api</code> must be <code>&quot;^0.19.0&quot;</code>.</td></tr>
            <tr><td>Plugin disconnects immediately after logging debug text</td><td>Standard output is reserved for newline-delimited JSON-RPC messages. Any <InlineCode language="python">print(...)</InlineCode> or <InlineCode language="javascript">console.log(...)</InlineCode> debug output on <code>stdout</code> breaks framing and quarantines the plugin. Log to <code>stderr</code> (<InlineCode language="python">print(..., file=sys.stderr)</InlineCode> or <InlineCode language="javascript">console.error(...)</InlineCode>) and inspect <kbd>Space m</kbd> (<kbd>:messages</kbd>) or <code>~/.config/red/red.log</code>.</td></tr>
            <tr><td>Host method returns <code>-32601</code> (method not found) or <code>-32602</code> (invalid params)</td><td>The JSON-RPC protocol exposes the typed v1 <code>red/*</code> methods listed in <code>initialize.params.host_methods</code>, not arbitrary internal Husk <InlineCode language="husk">red::execute</InlineCode> actions. Check method names and parameter keys against the protocol reference; application errors leave the connection active.</td></tr>
            <tr><td><code>red/DocumentApply</code> fails with <code>-32002</code> or <code>-32003</code></td><td><code>-32002</code> means the buffer&apos;s revision changed after <code>red/DocumentSnapshot</code>; take a fresh snapshot before retrying. <code>-32003</code> means an edit range or <code>expected_text</code> preimage did not match—in JavaScript, compute character indices with <InlineCode language="javascript">Array.from(text).length</InlineCode> (Unicode scalar values) instead of <InlineCode language="javascript">text.length</InlineCode> (UTF-16 code units), and keep <code>revision</code>, <code>document_id</code>, and <code>transaction_id</code> as strings.</td></tr>
            <tr><td>Command hangs for 30 seconds and times out</td><td>The command handler either called a <code>red/*</code> method before receiving the <code>initialized</code> notification or blocked waiting for a response without reading from <code>stdin</code>. Ensure your request helper reads from the active <code>stdin</code> loop while awaiting the host reply.</td></tr>
          </tbody>
        </table></div>
        <p><a className="text-link" href="https://github.com/codersauce/red/blob/eb5e2b6be15325abd12adbfac816f7844afff42c/docs/RPC_PLUGIN_PROTOCOL.md" target="_blank" rel="noreferrer">Open the complete JSON-RPC protocol specification</a></p>
      </section>
    </>,
  },
  {
    ...docMetadata("husk"),
    render: () => <>
      <section>
        <h2>Create the smallest plugin</h2>
        <p>Husk is Red's embedded scripting language. Place <code>hello.hk</code> in the <code>plugins</code> directory under Red's configuration directory, then register the filename in <code>config.toml</code>:</p>
        <CodeBlock language="toml">{`[plugins]\nhello = "hello.hk"`}</CodeBlock>
        <CodeBlock language="husk">{`#[red::command(\n    name = "HelloWorld",\n    title = "Say hello",\n    category = "Example",\n)]\nfn hello_world() {\n    red::execute("Print", "Hello from Husk");\n}`}</CodeBlock>
        <p>The command is available as <kbd>:HelloWorld</kbd> and through the command palette.</p>
      </section>

      <section>
        <h2>Keep plugin state</h2>
        <CodeBlock language="husk">{`struct PluginState {\n    count: i64,\n}\n\n#[red::state]\nfn initial_state() -> PluginState {\n    return PluginState { count: 0 };\n}`}</CodeBlock>
        <p>Read private state with <InlineCode language="husk">red::state()</InlineCode> and update named fields with <InlineCode language="husk">red::state_patch(...)</InlineCode>. Use declaration attributes for commands, fixed events, configuration, and lifecycle hooks; keep <InlineCode language="husk">red::on</InlineCode> for event names known only at runtime.</p>
      </section>

      <section>
        <h2>Use the host boundary</h2>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Function</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><InlineCode language="husk">red::execute</InlineCode></td><td>Request a fire-and-forget editor action</td></tr>
            <tr><td><InlineCode language="husk">red::request</InlineCode></td><td>Request data and receive one typed callback</td></tr>
            <tr><td><InlineCode language="husk">red::on</InlineCode></td><td>Subscribe to an editor event</td></tr>
            <tr><td><InlineCode language="husk">red::state</InlineCode></td><td>Read the plugin's private typed record</td></tr>
            <tr><td><InlineCode language="husk">red::state_patch</InlineCode></td><td>Update selected state fields</td></tr>
            <tr><td><InlineCode language="husk">red::log</InlineCode></td><td>Write diagnostic information to Red's log</td></tr>
          </tbody>
        </table></div>
        <p>Red remains the owner of buffers, undo history, focus, confirmations, sessions, and filesystem reconciliation. Plugins request attributed operations through the versioned host API rather than changing editor state directly.</p>
        <p><a className="text-link" href="https://github.com/codersauce/red/blob/eb5e2b6be15325abd12adbfac816f7844afff42c/docs/PLUGIN_API.md" target="_blank" rel="noreferrer">Open the complete host API reference</a></p>
      </section>

      <section>
        <h2>Use the standalone Husk CLI</h2>
        <p>The Husk CLI is built separately from the Red editor binary:</p>
        <CodeBlock language="shell">{`cargo install --path crates/husk-cli\nhusk check script.hk\nhusk run script.hk\nhusk test path/to/package\nhusk repl`}</CodeBlock>
        <p>Standalone Husk grants no ambient filesystem, network, environment, process, clock, or random access. Embedders add capabilities explicitly.</p>
      </section>
    </>,
  },
  {
    ...docMetadata("sessions"),
    render: () => <>
      <section>
        <h2>Keep a live session running</h2>
        <p>Detach and attach are available on macOS and Linux. Start a named session:</p>
        <CodeBlock language="shell">red --detach=refactor src/main.rs</CodeBlock>
        <p>The terminal attaches immediately. Press <kbd>Ctrl-\</kbd> to leave the TUI while the editor, unsaved buffers, plugins, language servers, running shell jobs, and Codex app-server process stay alive.</p>
        <CodeBlock language="shell">{`red --attach refactor\nred --stop refactor`}</CodeBlock>
        <p>Only one TUI can attach at a time. Sessions are local to the current OS user and use a private Unix socket rather than a TCP port. Windows supports recovery but not detach and attach.</p>
      </section>

      <section>
        <h2>Use the default session name</h2>
        <CodeBlock language="shell">red --detach src/main.rs</CodeBlock>
        <p>Without an explicit name, Red uses <code>default</code>. Named sessions require the <InlineCode language="shell">--detach=NAME</InlineCode> form so a filename can't be mistaken for a session name.</p>
      </section>

      <section>
        <h2>Restore after a crash</h2>
        <CodeBlock language="shell">red --resume</CodeBlock>
        <p>Recovery is available on every supported platform. Red restores the newest valid snapshot, including dirty buffers, window layout, cursors, registers, marks, undo history, and Agent conversation state. Restored dirty text stays in memory; Red doesn't write it to disk until you save.</p>
        <aside className="docs-callout"><strong>Don't resume a running editor</strong><span>Interactive owners don't currently hold an exclusive recovery lock. Use <InlineCode language="shell">--attach</InlineCode> for a live detached owner and <InlineCode language="shell">--resume</InlineCode> only after the owner has stopped.</span></aside>
      </section>

      <section>
        <h2>Know which recovery path applies</h2>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Situation</th><th>Use</th><th>What happens</th></tr></thead>
          <tbody>
            <tr><td>Terminal or SSH disconnect</td><td><InlineCode language="shell">red --attach NAME</InlineCode></td><td>Reconnects to the same live editor owner</td></tr>
            <tr><td>Editor or machine stopped</td><td><InlineCode language="shell">red --resume</InlineCode></td><td>Loads the newest valid atomic snapshot</td></tr>
            <tr><td>Normal clean exit</td><td><InlineCode language="shell">red</InlineCode> in the same directory</td><td>Restores clean file-backed buffers, views, and split layout</td></tr>
          </tbody>
        </table></div>
      </section>
    </>,
  },
  {
    ...docMetadata("cli"),
    render: () => <>
      <section>
        <h2>Open the editor</h2>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Command</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><InlineCode language="shell">red [FILES...]</InlineCode></td><td>Open zero or more files</td></tr>
            <tr><td><InlineCode language="shell">red .</InlineCode> or <InlineCode language="shell">red PATH/TO/DIR</InlineCode></td><td>Browse a directory in a read-only editor buffer</td></tr>
            <tr><td><InlineCode language="shell">red -r PATH [FILES...]</InlineCode></td><td>Set the workspace root before opening files</td></tr>
            <tr><td><InlineCode language="shell">red -c TOML [FILES...]</InlineCode></td><td>Apply a repeatable inline configuration override</td></tr>
            <tr><td><InlineCode language="shell">red --version</InlineCode></td><td>Print the installed version</td></tr>
            <tr><td><InlineCode language="shell">red --help</InlineCode></td><td>Print the generated command reference</td></tr>
          </tbody>
        </table></div>
      </section>

      <section>
        <h2>Check the installation and configuration</h2>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Command</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><InlineCode language="shell">red --self-check</InlineCode></td><td>Validate the bundled runtime and plugins</td></tr>
            <tr><td><InlineCode language="shell">red update --check</InlineCode></td><td>Check for a newer stable release without replacing the executable</td></tr>
            <tr><td><InlineCode language="shell">red update</InlineCode></td><td>Install the latest stable release for an official standalone installation</td></tr>
            <tr><td><InlineCode language="shell">red --check-config</InlineCode></td><td>Validate the effective user configuration</td></tr>
            <tr><td><InlineCode language="shell">red --agent-check</InlineCode></td><td>Report Codex prerequisites without installing anything</td></tr>
            <tr><td><InlineCode language="shell">red --agent-check --strict</InlineCode></td><td>Exit nonzero when Agent editing isn't ready</td></tr>
            <tr><td><InlineCode language="shell">red keys</InlineCode></td><td>Show the keyboard protocol and decoded key events</td></tr>
          </tbody>
        </table></div>
      </section>

      <section>
        <h2>Inspect and eject runtime assets</h2>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Command</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><InlineCode language="shell">red --runtime-files</InlineCode></td><td>List visible plugins and themes with their sources</td></tr>
            <tr><td><InlineCode language="shell">red --eject ASSET</InlineCode></td><td>Copy a bundled plugin or theme into the configuration directory</td></tr>
            <tr><td><InlineCode language="shell">red --eject-force ASSET</InlineCode></td><td>Replace an existing user copy</td></tr>
          </tbody>
        </table></div>
      </section>

      <section>
        <h2>Manage sessions</h2>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Command</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><InlineCode language="shell">red --detach[=NAME] [FILES...]</InlineCode></td><td>Start a detachable owner and attach this terminal</td></tr>
            <tr><td><InlineCode language="shell">red --attach NAME</InlineCode></td><td>Attach to a local live session</td></tr>
            <tr><td><InlineCode language="shell">red --stop NAME</InlineCode></td><td>Stop a local live session</td></tr>
            <tr><td><InlineCode language="shell">red --resume</InlineCode></td><td>Restore the latest crash-recovery snapshot</td></tr>
          </tbody>
        </table></div>
      </section>

      <section>
        <h2>Manage packages and languages</h2>
        <CodeBlock language="shell">{`red plugin catalog\nred plugin install [OWNER/REPOSITORY]\nred plugin install --path DIRECTORY\nred plugin install --catalog ID\nred plugin list\nred plugin update ID\nred plugin update --all\nred plugin disable ID\nred plugin enable ID\nred plugin remove ID [--purge]\n\nred language trust LANGUAGE_OR_PATH\nred language untrust LANGUAGE_OR_PATH\nred language check-indent FIXTURES.json`}</CodeBlock>
      </section>
    </>,
  },
  {
    ...docMetadata("vim"),
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
          <li>Shell commands are non-interactive. <InlineCode language="red-command">:read !</InlineCode>, <InlineCode language="red-command">:write !</InlineCode>, and Normal-mode filter operators aren't supported.</li>
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
    ...docMetadata("troubleshooting"),
    render: () => <>
      <section>
        <h2>Start with the narrow check</h2>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Problem</th><th>First check</th></tr></thead>
          <tbody>
            <tr><td>Red doesn't start or bundled tools are missing</td><td><InlineCode language="shell">red --self-check</InlineCode></td></tr>
            <tr><td>Configuration fails to load</td><td><InlineCode language="shell">red --check-config</InlineCode></td></tr>
            <tr><td>A plugin or theme looks stale or missing</td><td><InlineCode language="shell">red --runtime-files</InlineCode></td></tr>
            <tr><td>Codex can't start from Red</td><td><InlineCode language="shell">red --agent-check --strict</InlineCode></td></tr>
            <tr><td>A modified Enter shortcut doesn't arrive</td><td><InlineCode language="shell">red keys</InlineCode></td></tr>
            <tr><td>A language server doesn't respond</td><td>Confirm its executable is on <code>PATH</code>, then reopen a matching file</td></tr>
            <tr><td>A previous editor stopped with unsaved work</td><td><InlineCode language="shell">red --resume</InlineCode></td></tr>
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
          <li><strong>A bundled theme or plugin behaves like an older copy:</strong> a file in your configuration directory may be shadowing the embedded asset. Check <InlineCode language="shell">red --runtime-files</InlineCode>, then remove or replace the ejected copy.</li>
          <li><strong>An Agent prompt failed to start:</strong> update Codex, run <InlineCode language="shell">codex login</InlineCode>, then retry the preserved prompt.</li>
          <li><strong>Shift+Enter behaves like Enter:</strong> use <kbd>Ctrl+J</kbd> for a newline and run <InlineCode language="shell">red keys</InlineCode> to see what the terminal sends.</li>
          <li><strong>A dirty file changed on disk:</strong> run <kbd>:diffdisk</kbd>; use <kbd>:e!</kbd>, <kbd>:w file</kbd>, or <kbd>:w!</kbd> only after choosing which version to keep.</li>
          <li><strong>Detach isn't available on Windows:</strong> use <InlineCode language="shell">red --resume</InlineCode> for crash recovery. Live detach and attach currently require macOS or Linux.</li>
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
