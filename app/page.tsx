import Image from "next/image";
import { releaseVersion } from "./installers.generated";
import InstallPicker from "./components/InstallPicker";
import PreviewTabs from "./components/PreviewTabs";

const shortcuts = [
  ["Space ?", "discover every command"],
  ["Ctrl-p", "find a file"],
  ["Space A", "ask the agent"],
  [":AgentReview", "review proposals"],
  ["Space t", "change the theme"],
  ["Space G", "open git status"],
];

export default function Home() {
  return <main>
    <nav className="nav shell">
      <a className="brand" href="#top" aria-label="Red home"><span className="brand-name">red</span><span className="dot" /></a>
      <div className="nav-links"><a href="#editor">Editor</a><a href="#trust">Agent workflow</a><a href="#start">Get started</a></div>
      <a className="nav-github" href="https://github.com/codersauce/red" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
    </nav>

    <section className="hero" id="top">
      <div className="hero-grid shell">
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse" /> {releaseVersion} · built in Rust</div>
          <h1>The modal editor<br /><em>for the agent era.</em></h1>
          <p className="lead">Fast, familiar editing with modern code intelligence and a safer way to work with agents. One binary. No required configuration. Your files stay yours.</p>
          <div className="hero-actions">
            <InstallPicker />
            <a className="release" href="https://github.com/codersauce/red/releases/latest" target="_blank" rel="noreferrer">Download a release <span aria-hidden="true">→</span></a>
          </div>
          <p className="platforms">macOS <span /> Linux <span /> Windows</p>
        </div>
        <div className="hero-shot">
          <div className="hero-shot-bar"><span className="preview-dot" /><span>src/editor/rendering.rs</span><span className="hero-shot-note">real capture · Ghostty</span></div>
          <Image src="/ghostty-code.jpg" width={1208} height={704} alt="Red editing its Rust rendering pipeline with the project file tree open and the NORMAL-mode status bar visible" priority unoptimized />
        </div>
      </div>
    </section>

    <PreviewTabs />

    <section className="statement shell"><p>Familiar motions. <span>Modern instincts.</span></p><small>modal editing · tree-sitter · language servers · embedded plugins</small></section>

    <section className="features shell">
      <article className="feature large"><span className="index">01 / EDIT</span><h2>Stay in flow.</h2><p>Vim-inspired modes, motions, text objects, splits, and pickers feel immediately familiar. Tree-sitter highlighting and asynchronous language tools keep pace as projects grow.</p><div className="mode-row"><span className="mode active">NORMAL</span><span className="mode">INSERT</span><span className="mode">VISUAL</span><span className="mode">COMMAND</span></div></article>
      <article className="feature"><span className="index">02 / NAVIGATE</span><h2>Find the signal.</h2><p>Jump to definitions, references, symbols, diagnostics, files, or commands without leaving the keyboard.</p><div className="finder"><span className="red">›</span><span>render_window_rows</span><kbd>Ctrl-p</kbd></div></article>
      <article className="feature"><span className="index">03 / EXTEND</span><h2>Make it yours.</h2><p>Bundled Husk plugins power the file tree, project search, and theme browser. Defaults work on day one; configuration stays optional.</p><div className="tokens"><span className="green">tree</span><span className="amber">search</span><span className="cyan">themes</span><span className="magenta">plugins</span></div></article>
    </section>

    <section className="capture-grid shell" aria-label="Navigation previews">
      <figure><Image src="/ghostty-picker-demo.jpg" width={1208} height={704} unoptimized alt="Red file picker showing its rendering source and a live buffer preview" /><figcaption><span>FIND SOURCE FILES</span><kbd>Ctrl-p</kbd></figcaption></figure>
      <figure><Image src="/ghostty-commands-demo.jpg" width={1208} height={704} unoptimized alt="Red command palette showing real Git hunk actions and shortcuts" /><figcaption><span>DISCOVER COMMANDS</span><kbd>Space ?</kbd></figcaption></figure>
    </section>

    <section className="trust shell" id="trust">
      <div className="trust-copy"><span className="eyebrow"><span className="pulse" /> agent workflow</span><h2>Let the agent help.<br /><em>Keep the final say.</em></h2><p>Red can give an agent the context it needs, including unsaved buffers, while staging every suggested write in an isolated proposal filesystem. Review the diff, then accept or reject it explicitly.</p><blockquote>every agent edit is a proposal —<br />nothing touches your files until you accept it</blockquote></div>
      <div className="trust-side">
        <figure className="trust-shot"><Image src="/ghostty-agent.jpg" width={1208} height={704} unoptimized alt="Red agent prompt asking a contextual question over the editor highlighter source" /><figcaption><span>ASK WITH SOURCE CONTEXT</span><kbd>Space A</kbd></figcaption></figure>
        <div className="trust-steps"><div><span>01</span><h3>Ask</h3><p>Open the agent from the editor with the right workspace context.</p><kbd>Space A</kbd></div><div><span>02</span><h3>Review</h3><p>Inspect attributed changes as clear, isolated proposals.</p><kbd>:AgentReview</kbd></div><div><span>03</span><h3>Decide</h3><p>Accept what helps. Reject what does not. Nothing is silently applied.</p><kbd>your call</kbd></div></div>
      </div>
    </section>

    <section className="shortcuts shell"><header><span className="index">A FEW KEYS TO START</span><h2>Hands on the keyboard.</h2></header><div className="shortcut-grid">{shortcuts.map(([key, description]) => <div className="shortcut" key={key}><kbd>{key}</kbd><span>{description}</span><i>↵</i></div>)}</div></section>

    <section className="start shell" id="start"><span className="start-dot" /><p className="start-kicker">READY WHEN YOU ARE</p><h2>Open a file.<br /><em>Start editing.</em></h2><p className="start-copy">Install the self-contained binary and get a capable editor without a setup ritual. Red is early and actively evolving—bring curiosity, and keep backups for critical work.</p><InstallPicker wide /><div className="start-links"><a href="https://github.com/codersauce/red/releases/latest" target="_blank" rel="noreferrer">prebuilt binaries <span>→</span></a><a href="https://github.com/codersauce/red" target="_blank" rel="noreferrer">read the docs <span>→</span></a><a href="https://discord.gg/5PWvAUNRHU" target="_blank" rel="noreferrer">join the community <span>→</span></a></div></section>

    <footer className="footer shell"><a className="brand" href="#top" aria-label="Back to top"><span className="brand-name">red</span><span className="dot" /></a><p>Rusty Editor · MIT licensed · made in the open</p><a href="https://github.com/codersauce/red" target="_blank" rel="noreferrer">github.com/codersauce/red <span>↗</span></a></footer>
  </main>;
}
