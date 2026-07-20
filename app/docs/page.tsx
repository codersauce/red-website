import type { Metadata } from "next";
import { headers } from "next/headers";
import InstallPicker from "../components/InstallPicker";
import { SiteFooter, SiteNav } from "../components/SiteChrome";
import { releaseVersion } from "../installers.generated";
import { resolvePublicOrigin } from "../public-origin";

export const metadata: Metadata = {
  title: "Docs — red editor",
  description: "Install Red and learn the essential editor, language, theme, plugin, and agent workflows.",
  alternates: { canonical: "/docs" },
};

const navigation = [
  ["installation", "Installation"],
  ["quick-start", "Quick start"],
  ["keybindings", "Keybindings"],
  ["agent-workflow", "Agent workflow"],
  ["themes", "Themes"],
  ["plugins", "Plugins"],
  ["configuration", "Configuration"],
];

const keybindings = [
  ["Space ?", "Search every available command and its active keybinding"],
  ["Ctrl-p", "Find a project file with a live preview"],
  ["Space /", "Search across the project"],
  ["Space G", "Open the Git workspace"],
  ["Space A", "Ask the configured agent with editor context"],
  ["Space t", "Browse themes with a live preview"],
];

export default async function DocsPage() {
  const origin = resolvePublicOrigin(await headers());

  return <main>
    <div className="nav-wrap"><div className="page-shell"><SiteNav /></div></div>
    <div className="docs-layout page-shell">
      <aside>
        <p>Documentation</p>
        <nav aria-label="Documentation sections">
          {navigation.map(([id, label]) => <a href={`#${id}`} key={id}>{label}</a>)}
        </nav>
        <a className="docs-source" href="https://github.com/codersauce/red/tree/master/docs" target="_blank" rel="noreferrer">
          Full reference on GitHub ↗
        </a>
      </aside>

      <article className="docs-content">
        <header>
          <p className="section-kicker">Getting started · {releaseVersion}</p>
          <h1>Red documentation</h1>
          <p>Install the editor, open your first file, and discover the workflows that ship ready to use.</p>
        </header>

        <section id="installation">
          <h2>Installation</h2>
          <p>Red is distributed as a self-contained binary. Choose the detected method or switch platforms manually.</p>
          <InstallPicker origin={origin} wide />
          <p>The shell and PowerShell installers select a supported release archive, verify its published SHA-256 checksum, install Red, and run its built-in self-check.</p>
        </section>

        <section id="quick-start">
          <h2>Quick start</h2>
          <p>Open a file or directory from your terminal:</p>
          <pre><code>red path/to/file</code></pre>
          <p>On the first interactive run, Red can create a starter configuration. Declining is fine: the embedded defaults, plugins, and themes are enough to begin.</p>
          <pre><code>{`red --version\nred --self-check`}</code></pre>
        </section>

        <section id="keybindings">
          <h2>Keybindings</h2>
          <p>Red combines Vim-inspired modal editing with discoverable project commands.</p>
          <div className="docs-key-list">
            {keybindings.map(([key, description]) => <div key={key}><kbd>{key}</kbd><span>{description}</span></div>)}
          </div>
          <a className="text-link" href="https://github.com/codersauce/red/blob/master/docs/VIM_COMPATIBILITY.md" target="_blank" rel="noreferrer">Open the versioned Vim compatibility matrix →</a>
        </section>

        <section id="agent-workflow">
          <h2>Agent workflow</h2>
          <p>Red gives Codex bounded editor context—including unsaved buffers—while keeping suggested writes in an isolated proposal filesystem.</p>
          <ol>
            <li><strong>Ask.</strong> Press <kbd>Space A</kbd> with a selection or from the current buffer.</li>
            <li><strong>Review.</strong> Open <kbd>:AgentReview</kbd> to inspect pending changes.</li>
            <li><strong>Decide.</strong> Accept useful hunks and reject the rest. Nothing is silently written.</li>
          </ol>
          <a className="text-link" href="https://github.com/codersauce/red/blob/master/docs/AGENT_WORKFLOW.md" target="_blank" rel="noreferrer">Read the complete safety contract →</a>
        </section>

        <section id="themes">
          <h2>Themes</h2>
          <p>Press <kbd>Space t</kbd> to browse the bundled gallery and preview themes live. The selected theme can be stored in your configuration.</p>
        </section>

        <section id="plugins">
          <h2>Plugins</h2>
          <p>Red includes a typed Husk runtime. Bundled Husk plugins power core tools such as the file tree, project search, Git workspace, theme browser, progress UI, and agent interface.</p>
          <a className="text-link" href="https://github.com/codersauce/red/blob/master/docs/PLUGIN_SYSTEM.md" target="_blank" rel="noreferrer">Explore the plugin system →</a>
        </section>

        <section id="configuration">
          <h2>Configuration</h2>
          <p>Configuration is optional. Start with the generated file, then change only what you want to own.</p>
          <pre><code>{`# ~/.config/red/config.toml\n# Red's generated starter documents the available sections.`}</code></pre>
          <p>Run <kbd>red --self-check</kbd> whenever you want to verify the editor, configuration, and optional agent prerequisites.</p>
        </section>
      </article>
    </div>
    <SiteFooter />
  </main>;
}
