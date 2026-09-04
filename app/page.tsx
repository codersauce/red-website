import Image from "next/image";
import { headers } from "next/headers";
import { FiArrowRight, FiDownload, FiExternalLink } from "react-icons/fi";
import AgentShowcase from "./components/AgentShowcase";
import InstallPicker from "./components/InstallPicker";
import ProductShowcase from "./components/ProductShowcase";
import ReleaseVersion from "./components/ReleaseVersion";
import { SiteFooter, SiteNav } from "./components/SiteChrome";
import { releaseVersion } from "./installers.generated";
import { releaseHighlights } from "./release-content";
import { resolvePublicOrigin } from "./public-origin";

const features = [
  {
    tag: "AGENT",
    name: "An agent inside your editor",
    description: "Keep a persistent Codex conversation connected to open buffers, unsaved work, diagnostics, and source context.",
  },
  {
    tag: "INLINE",
    name: "Help beside the source",
    description: "Review, explain, or refactor a focused piece of code without trading your editor for a chat window.",
  },
  {
    tag: "VIM",
    name: "Your hands already know it",
    description: "Use familiar motions, operators, text objects, macros, registers, splits, and keyboard-first commands.",
  },
  {
    tag: "LSP + GIT",
    name: "One binary, ready to work",
    description: "Language intelligence, Tree-sitter, project search, Git, themes, and embedded plugins ship together.",
  },
];

const shortcuts = [
  ["Space ?", "discover commands"],
  ["Ctrl-p", "find a file"],
  ["Space /", "search the project"],
  ["Space A", "open the Agent workspace"],
  ["Space i", "review or refactor inline"],
  ["Space t", "browse themes"],
];

export default async function Home() {
  const origin = resolvePublicOrigin(await headers());

  return <main>
    <div className="nav-wrap"><div className="page-shell"><SiteNav /></div></div>

    <section className="hero page-shell" id="top">
      <div className="version-pill"><ReleaseVersion fallback={releaseVersion} /> · Vim muscle memory meets editor-aware agents <FiArrowRight className="inline-icon arrow-icon" aria-hidden="true" /></div>
      <h1>The modal editor for<br className="desktop-break" /> the agent era</h1>
      <p>Vim muscle memory, a Codex agent that understands your open buffers, and focused inline assistance—ready in one Rust binary.</p>
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
        <p className="section-kicker">Made for the way you work</p>
        <h2>The whole workflow, built in</h2>
        <p>Vim fluency, editor-aware agents, and capable defaults in one self-contained Rust binary.</p>
      </header>
      <div className="feature-grid">
        {features.map((feature) => <article className="feature-card" key={feature.tag}>
          <span>{feature.tag}</span>
          <h3>{feature.name}</h3>
          <p>{feature.description}</p>
        </article>)}
      </div>
    </section>

    <section className="split-section section page-shell" id="agent">
      <div className="split-copy">
        <p className="section-kicker">Codex integration</p>
        <h2>An agent that knows what you are editing</h2>
        <p>The Agent sees the source, selection, diagnostics, and unsaved buffers you are working with. Its revision-checked changes are applied through Red and saved to disk.</p>
        <p>Prefer a smaller scope? Inline assistance keeps code changes unsaved and undoable; wider proposals require your explicit review.</p>
        <div className="command-list">
          <div><kbd>Space A</kbd><span>Open a persistent Agent conversation</span></div>
          <div><kbd>Space i</kbd><span>Review or refactor beside your code</span></div>
          <div><kbd>Space H</kbd><span>Return to inline-assist history</span></div>
        </div>
        <a className="text-link" href="https://github.com/codersauce/red/blob/main/docs/AGENT_WORKFLOW.md" target="_blank" rel="noreferrer">
          Read the agent workflow docs <FiExternalLink className="inline-icon external-link-icon" aria-hidden="true" />
        </a>
      </div>
      <AgentShowcase />
    </section>

    <section className="showcase-section">
      <div className="section page-shell">
        <header className="section-heading">
          <p className="section-kicker">Stay on the keyboard</p>
          <h2>Everything is a keystroke away</h2>
          <p>Move between your Agent, files, project search, commands, language intelligence, and themes without leaving the keyboard.</p>
        </header>
        <ProductShowcase />
      </div>
    </section>

    <section className="section page-shell" id="release-highlights">
      <header className="section-heading">
        <p className="section-kicker">New in Red v0.7.0</p>
        <h2>Follow your Agent into the source</h2>
        <p>Source-linked walkthroughs, focused inline help, and multi-cursor editing are ready in the latest release.</p>
      </header>
      <div className="feature-grid">
        {releaseHighlights.map((story) => <article className="feature-card" key={story.tag}>
          <span>{story.tag}</span>
          <h3>{story.title}</h3>
          <p>{story.description}</p>
        </article>)}
      </div>
      <div className="release-preview-link"><a className="text-link" href="/releases">See release highlights <FiArrowRight className="inline-icon arrow-icon" aria-hidden="true" /></a></div>
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
          <a className="text-link" href="https://github.com/codersauce/red/blob/main/docs/VIM_COMPATIBILITY.md" target="_blank" rel="noreferrer">
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
