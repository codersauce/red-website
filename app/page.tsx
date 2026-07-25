import Image from "next/image";
import { headers } from "next/headers";
import { FiArrowRight, FiDownload, FiExternalLink } from "react-icons/fi";
import AgentShowcase from "./components/AgentShowcase";
import InstallPicker from "./components/InstallPicker";
import ProductShowcase from "./components/ProductShowcase";
import ReleaseVersion from "./components/ReleaseVersion";
import { SiteFooter, SiteNav } from "./components/SiteChrome";
import { releaseVersion } from "./installers.generated";
import { resolvePublicOrigin } from "./public-origin";

const features = [
  {
    tag: "LSP",
    name: "Language servers",
    description: "Completion, go-to-definition, rename, diagnostics, and inlay hints from the language servers already on your PATH.",
  },
  {
    tag: "TREE-SITTER",
    name: "Syntax-aware editing",
    description: "Bundled grammars bring structural highlighting and text objects to the languages you use every day.",
  },
  {
    tag: "THEMES",
    name: "Theme gallery",
    description: "Browse and preview the bundled themes live. No plugin manager and no restart required.",
  },
  {
    tag: "HUSK",
    name: "Embedded plugins",
    description: "Red's own typed scripting language powers built-in tools while keeping the default experience self-contained.",
  },
];

const shortcuts = [
  ["Space ?", "discover commands"],
  ["Ctrl-p", "find a file"],
  ["Space /", "search the project"],
  ["Space A", "ask the agent"],
  [":AgentReview", "review proposals"],
  ["Space t", "browse themes"],
];

export default async function Home() {
  const origin = resolvePublicOrigin(await headers());

  return <main>
    <div className="nav-wrap"><div className="page-shell"><SiteNav /></div></div>

    <section className="hero page-shell" id="top">
      <div className="version-pill"><ReleaseVersion fallback={releaseVersion} /> · Codex review workflow <FiArrowRight className="inline-icon arrow-icon" aria-hidden="true" /></div>
      <h1>The editor that respects<br className="desktop-break" /> your muscle memory</h1>
      <p>Red is a modern modal editor for people who think in Vim. Fast editing, language intelligence, themes, and embedded plugins—ready without a setup ritual.</p>
      <div className="hero-actions">
        <a className="primary-button" href="#install">Install Red</a>
        <a className="secondary-button" href="https://github.com/codersauce/red/releases/latest" target="_blank" rel="noreferrer">
          <FiDownload className="button-icon download-icon" aria-hidden="true" /> Download a release
        </a>
      </div>
      <div className="hero-install"><InstallPicker origin={origin} /></div>
      <div className="hero-image theme-image">
        <Image className="theme-image-light" src="/editing-light.png" width={2104} height={1724} alt="Red editing Rust with inline type hints in a light theme" priority unoptimized />
        <Image className="theme-image-dark" src="/editing-dark.png" width={2104} height={1724} alt="Red editing Rust with inline type hints in a dark theme" priority unoptimized />
      </div>
    </section>

    <section className="section page-shell" id="features">
      <header className="section-heading">
        <p className="section-kicker">Everything you need</p>
        <h2>Batteries included</h2>
        <p>Capable defaults in one Rust binary. Extend Red when you want to, not because you have to.</p>
      </header>
      <div className="feature-grid">
        {features.map((feature) => <article className="feature-card" key={feature.tag}>
          <span>{feature.tag}</span>
          <h3>{feature.name}</h3>
          <p>{feature.description}</p>
        </article>)}
      </div>
    </section>

    <section className="showcase-section">
      <div className="section page-shell">
        <header className="section-heading">
          <p className="section-kicker">Stay on the keyboard</p>
          <h2>Everything is a keystroke away</h2>
          <p>Find files, search the project, discover commands, switch themes, and ask the language server without losing your place.</p>
        </header>
        <ProductShowcase />
      </div>
    </section>

    <section className="split-section section page-shell" id="agent">
      <div className="split-copy">
        <p className="section-kicker">Codex integration</p>
        <h2>Agent edits you can actually trust</h2>
        <p>Ask Codex without leaving your buffer. Suggested writes arrive as isolated proposals, ready for you to inspect before anything reaches your files.</p>
        <div className="command-list">
          <div><kbd>Space A</kbd><span>Ask with editor context</span></div>
          <div><kbd>:AgentReview</kbd><span>Review pending proposals</span></div>
        </div>
        <a className="text-link" href="https://github.com/codersauce/red/blob/master/docs/AGENT_WORKFLOW.md" target="_blank" rel="noreferrer">
          Read the agent workflow docs <FiExternalLink className="inline-icon external-link-icon" aria-hidden="true" />
        </a>
      </div>
      <AgentShowcase />
    </section>

    <section className="familiar-section">
      <div className="split-section section page-shell">
        <figure className="framed-image">
          <Image src="/editor-dark.png" width={2104} height={1724} alt="Red welcome screen with command shortcuts" unoptimized />
        </figure>
        <div className="split-copy">
          <p className="section-kicker">Familiar from the first file</p>
          <h2>Feels like home on day one</h2>
          <p>Red follows Vim&apos;s modal grammar across the editing operations it supports, then adds discoverable project, language, Git, theme, and agent tools.</p>
          <div className="shortcut-list">
            {shortcuts.map(([key, action]) => <div key={key}><kbd>{key}</kbd><span>{action}</span></div>)}
          </div>
          <a className="text-link" href="https://github.com/codersauce/red/blob/master/docs/VIM_COMPATIBILITY.md" target="_blank" rel="noreferrer">
            View the compatibility matrix <FiExternalLink className="inline-icon external-link-icon" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>

    <section className="install-section section page-shell" id="install">
      <p className="section-kicker">Ready when you are</p>
      <h2>Up and running in a minute</h2>
      <p>Red ships as a self-contained binary for macOS, Linux, and Windows. Supported desktop systems are detected automatically, and you can choose another method at any time.</p>
      <InstallPicker origin={origin} wide />
      <div className="install-links">
        <a href="https://github.com/codersauce/red/releases/latest" target="_blank" rel="noreferrer">
          <FiDownload className="inline-icon download-icon" aria-hidden="true" /> Prebuilt archives
        </a>
        <a href="/docs#installation">Installation guide <FiArrowRight className="inline-icon arrow-icon" aria-hidden="true" /></a>
      </div>
    </section>

    <SiteFooter />
  </main>;
}
