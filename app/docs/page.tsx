import type { Metadata } from "next";
import { headers } from "next/headers";
import { FaGithub } from "react-icons/fa6";
import { FiExternalLink } from "react-icons/fi";
import InstallPicker from "../components/InstallPicker";
import ReleaseVersion from "../components/ReleaseVersion";
import { SiteFooter, SiteNav } from "../components/SiteChrome";
import { releaseVersion } from "../installers.generated";
import { releaseHighlights } from "../release-content";
import { resolvePublicOrigin } from "../public-origin";

export const metadata: Metadata = {
  title: "Docs — red editor",
  description: "Install Red and learn its Vim-style editing, Codex Agent workspace, focused inline assistance, language intelligence, and Git workflows.",
  alternates: { canonical: "/docs" },
};

const navigation = [
  ["installation", "Installation"],
  ["quick-start", "Quick start"],
  ["keybindings", "Keybindings"],
  ["agent-workflow", "Agent workspace"],
  ["inline-assistance", "Inline assistance"],
  ["release-highlights", "v0.7.0 highlights"],
  ["themes", "Themes"],
  ["plugins", "Plugins"],
  ["configuration", "Configuration"],
];

const keybindings = [
  ["Space ?", "Search every available command and its active keybinding"],
  ["Ctrl-p", "Find a project file with a live preview"],
  ["Space /", "Search across the project"],
  ["Space G", "Open the Git workspace"],
  ["Space A", "Open a persistent Agent conversation with editor context"],
  ["Space i", "Review, explain, or refactor a focused piece of source"],
  ["Space H", "Revisit previous inline-assist results"],
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
        <a className="docs-source" href="https://github.com/codersauce/red/tree/main/docs" target="_blank" rel="noreferrer">
          <FaGithub className="inline-icon github-icon" aria-hidden="true" /> Full reference on GitHub
        </a>
      </aside>

      <article className="docs-content">
        <header>
          <p className="section-kicker">Getting started · <ReleaseVersion fallback={releaseVersion} /></p>
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
          <a className="text-link" href="https://github.com/codersauce/red/blob/main/docs/VIM_COMPATIBILITY.md" target="_blank" rel="noreferrer">
            Open the versioned Vim compatibility matrix <FiExternalLink className="inline-icon external-link-icon" aria-hidden="true" />
          </a>
        </section>

        <section id="agent-workflow">
          <h2>Agent workspace</h2>
          <p>Press <kbd>Space A</kbd> to open a persistent Codex conversation connected to the active source, selection, relevant diagnostics, and authoritative unsaved buffer contents.</p>
          <ol>
            <li><strong>Connect.</strong> Install Codex CLI 0.144.1 or newer, run <kbd>codex login</kbd>, and verify setup with <kbd>red --agent-check --strict</kbd>.</li>
            <li><strong>Ask.</strong> Describe the change or question without leaving the editor. Follow progress and continue the same conversation.</li>
            <li><strong>Understand the boundary.</strong> Agent changes are revision-checked, applied through Red&apos;s workspace-confined editor tools, and saved to disk.</li>
          </ol>
          <p>The full Agent saves accepted editor-tool writes. Inline assistance has a separate, smaller editing boundary.</p>
          <a className="text-link" href="https://github.com/codersauce/red/blob/main/docs/AGENT_WORKFLOW.md" target="_blank" rel="noreferrer">
            Read the complete Agent safety contract <FiExternalLink className="inline-icon external-link-icon" aria-hidden="true" />
          </a>
        </section>

        <section id="inline-assistance">
          <h2>Inline assistance</h2>
          <p>Press <kbd>Space i</kbd> to review, explain, or refactor code beside the source. Select text in Visual or Visual Line mode for an exact target, or start from Normal mode for the surrounding code.</p>
          <p>Applied inline code changes stay <strong>unsaved and undoable</strong>. Exact foreground edits may apply immediately unless disabled; background results and wider proposals require explicit review.</p>
          <p>Press <kbd>Space H</kbd> to revisit inline history, or continue in the full Agent when a task needs broader editor access.</p>
        </section>

        <section id="release-highlights">
          <h2>New in v0.7.0</h2>
          <p>These capabilities are included in the latest published release:</p>
          <ul>
            {releaseHighlights.map((story) => <li key={story.tag}><strong>{story.title}.</strong> {story.description}</li>)}
          </ul>
          <a className="text-link" href="/releases">View release highlights <FiExternalLink className="inline-icon external-link-icon" aria-hidden="true" /></a>
        </section>

        <section id="themes">
          <h2>Themes</h2>
          <p>Press <kbd>Space t</kbd> to browse the bundled gallery and preview themes live. The selected theme can be stored in your configuration.</p>
        </section>

        <section id="plugins">
          <h2>Plugins</h2>
          <p>Red includes a typed Husk runtime. Bundled Husk plugins power core tools such as the file tree, project search, Git workspace, theme browser, progress UI, and agent interface.</p>
          <a className="text-link" href="https://github.com/codersauce/red/blob/main/docs/PLUGIN_SYSTEM.md" target="_blank" rel="noreferrer">
            Explore the plugin system <FiExternalLink className="inline-icon external-link-icon" aria-hidden="true" />
          </a>
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
