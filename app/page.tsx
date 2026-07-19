"use client";

import { useState } from "react";

type Preview = "edit" | "agent" | "git";

const shortcuts = [
  ["Space ?", "discover every command"],
  ["Ctrl-p", "find a file"],
  ["Space A", "ask the agent"],
  [":AgentReview", "review proposals"],
  ["Space t", "change the theme"],
  ["Space G", "open git status"],
];

export default function Home() {
  const [preview, setPreview] = useState<Preview>("edit");
  const [copied, setCopied] = useState(false);

  async function copyInstall() {
    try {
      await navigator.clipboard.writeText("brew install codersauce/tap/red");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main>
      <nav className="nav shell">
        <a className="brand" href="#top" aria-label="Red home">
          <span className="brand-name">red</span><span className="dot" />
        </a>
        <div className="nav-links">
          <a href="#editor">Editor</a>
          <a href="#trust">Agent workflow</a>
          <a href="#start">Get started</a>
        </div>
        <a className="nav-github" href="https://github.com/codersauce/red" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
      </nav>

      <section className="hero shell" id="top">
        <div className="eyebrow"><span className="pulse" /> v0.1.1 · built in Rust</div>
        <div className="wordmark" aria-hidden="true">{`                 ╷\n╭──╮   ╭──╮   ╭──┤\n│      ├──╯   │  │\n╵      ╰──╴   ╰──╯`}<span> ●</span></div>
        <h1>The modal editor<br /><em>for the agent era.</em></h1>
        <p className="lead">Fast, familiar editing with modern code intelligence and a safer way to work with agents. One binary. No required configuration. Your files stay yours.</p>
        <div className="hero-actions">
          <button className="install" onClick={copyInstall} aria-label="Copy Homebrew install command">
            <span className="prompt">$</span><code>brew install codersauce/tap/red</code><span className="copy">{copied ? "copied" : "copy"}</span>
          </button>
          <a className="release" href="https://github.com/codersauce/red/releases/latest" target="_blank" rel="noreferrer">Download a release <span aria-hidden="true">→</span></a>
        </div>
        <p className="platforms">macOS <span /> Linux <span /> Windows</p>
      </section>

      <section className="preview-wrap shell" id="editor">
        <div className="preview-head">
          <div className="traffic" aria-hidden="true"><i /><i /><i /></div>
          <div className="preview-tabs" role="group" aria-label="Editor preview mode">
            <button className={preview === "edit" ? "active" : ""} onClick={() => setPreview("edit")}>editing</button>
            <button className={preview === "agent" ? "active" : ""} onClick={() => setPreview("agent")}>agent review</button>
            <button className={preview === "git" ? "active" : ""} onClick={() => setPreview("git")}>git status</button>
          </div>
          <span className="preview-file">~/projects/red</span>
        </div>

        <div className="editor">
          <aside className="tree" aria-hidden="true">
            <p className="tree-title">EXPLORER</p>
            <p><span className="cyan">⌄</span> red</p>
            <p className="indent"><span className="cyan">⌄</span> src</p>
            <p className="indent2 active-file"><span className="red">●</span> editor.rs</p>
            <p className="indent2"><span className="muted">·</span> theme.rs</p>
            <p className="indent2"><span className="muted">·</span> splash.rs</p>
            <p className="indent"><span className="muted">›</span> plugins</p>
            <p className="indent"><span className="muted">·</span> Cargo.toml</p>
            <div className="tree-foot"><span className="green">●</span> rust-analyzer</div>
          </aside>

          <div className="code-pane">
            <div className="file-tabs"><span className="selected"><i className="red">●</i> editor.rs</span><span><i>·</i> theme.rs</span><span><i>·</i> Cargo.toml</span></div>
            {preview === "edit" && (
              <div className="code" aria-label="Rust code preview">
                <span className="n">128</span><span><b className="comment">// Keep the editor responsive while language tools work.</b></span>
                <span className="n">129</span><span><b className="kw">pub async fn</b> <b className="fn">open_buffer</b><b className="punct">(</b><b className="arg">&amp;mut self</b><b className="punct">,</b> path<b className="punct">:</b> <b className="ty">PathBuf</b><b className="punct">)</b> <b className="punct">-&gt;</b> <b className="ty">Result</b><b className="punct">&lt;</b><b className="ty">BufferId</b><b className="punct">&gt; {'{'}</b></span>
                <span className="n">130</span><span>    <b className="kw">let</b> buffer <b className="punct">=</b> <b className="ty">Buffer</b><b className="punct">::</b><b className="fn">from_path</b><b className="punct">(</b>path<b className="punct">).</b><b className="kw">await</b><b className="punct">?;</b></span>
                <span className="n">131</span><span>    <b className="kw">let</b> id <b className="punct">=</b> <b className="arg">self</b><b className="punct">.</b>buffers<b className="punct">.</b><b className="fn">insert</b><b className="punct">(</b>buffer<b className="punct">);</b></span>
                <span className="n active-n">132</span><span className="active-line">    <b className="arg">self</b><b className="punct">.</b>language_server<b className="punct">.</b><b className="fn">did_open</b><b className="punct">(</b>id<b className="punct">).</b><b className="kw">await</b><b className="punct">;</b><i className="cursor" /></span>
                <span className="n">133</span><span>    <b className="fn">Ok</b><b className="punct">(</b>id<b className="punct">)</b></span>
                <span className="n">134</span><span><b className="punct">{'}'}</b></span>
                <span className="n">135</span><span />
                <span className="n">136</span><span><b className="attr">#[test]</b></span>
                <span className="n">137</span><span><b className="kw">fn</b> <b className="fn">opens_without_configuration</b><b className="punct">() {'{'}</b></span>
                <span className="n">138</span><span>    <b className="kw">let</b> editor <b className="punct">=</b> <b className="ty">Editor</b><b className="punct">::</b><b className="fn">default</b><b className="punct">();</b></span>
                <span className="n">139</span><span>    <b className="macro">assert!</b><b className="punct">(</b>editor<b className="punct">.</b><b className="fn">is_ready</b><b className="punct">());</b></span>
                <span className="n">140</span><span><b className="punct">{'}'}</b></span>
              </div>
            )}
            {preview === "agent" && (
              <div className="review" aria-label="Agent proposal preview">
                <div className="review-title"><span className="red">●</span> proposal · editor.rs <span className="review-count">+4 −1</span></div>
                <p className="context"><span>128</span> <b className="comment">// Keep the editor responsive while language tools work.</b></p>
                <p className="context"><span>129</span> <b className="kw">pub async fn</b> <b className="fn">open_buffer</b><b className="punct">(…)</b> <b className="punct">{'{'}</b></p>
                <p className="minus"><span>−</span> <b className="arg">self</b><b className="punct">.</b>language_server<b className="punct">.</b><b className="fn">did_open</b><b className="punct">(</b>id<b className="punct">).</b><b className="kw">await</b><b className="punct">;</b></p>
                <p className="plus"><span>+</span> <b className="kw">if let</b> <b className="fn">Some</b><b className="punct">(</b>server<b className="punct">)</b> <b className="punct">=</b> <b className="arg">self</b><b className="punct">.</b>language_server<b className="punct">.</b><b className="fn">for_buffer</b><b className="punct">(</b>id<b className="punct">) {'{'}</b></p>
                <p className="plus"><span>+</span>     server<b className="punct">.</b><b className="fn">did_open</b><b className="punct">(</b>id<b className="punct">).</b><b className="kw">await</b><b className="punct">;</b></p>
                <p className="plus"><span>+</span> <b className="punct">{'}'}</b></p>
                <p className="context"><span>133</span> <b className="fn">Ok</b><b className="punct">(</b>id<b className="punct">)</b></p>
                <div className="review-actions"><button>accept proposal</button><button className="secondary">reject</button><small>nothing is written until you accept</small></div>
              </div>
            )}
            {preview === "git" && (
              <div className="git" aria-label="Git status preview">
                <p className="git-title">git status <span>main · 3 changes</span></p>
                <p className="git-row"><b className="amber">M</b> src/editor.rs <span>+12 −3</span></p>
                <p className="git-row"><b className="green">A</b> src/splash.rs <span>+84</span></p>
                <p className="git-row"><b className="red">D</b> docs/old-notes.md <span>−18</span></p>
                <div className="git-help"><kbd>Space</kbd> stage <kbd>d</kbd> diff <kbd>]h</kbd> next hunk <kbd>q</kbd> close</div>
              </div>
            )}
          </div>
        </div>
        <div className="status"><b>NORMAL</b><span>editor.rs</span><i>Rust · UTF-8 · 132:54</i></div>
      </section>

      <section className="statement shell">
        <p>Familiar motions. <span>Modern instincts.</span></p>
        <small>modal editing · tree-sitter · language servers · embedded plugins</small>
      </section>

      <section className="features shell">
        <article className="feature large">
          <span className="index">01 / EDIT</span><h2>Stay in flow.</h2><p>Vim-inspired modes, motions, text objects, splits, and pickers feel immediately familiar. Tree-sitter highlighting and asynchronous language tools keep pace as projects grow.</p>
          <div className="mode-row"><span className="mode active">NORMAL</span><span className="mode">INSERT</span><span className="mode">VISUAL</span><span className="mode">COMMAND</span></div>
        </article>
        <article className="feature">
          <span className="index">02 / NAVIGATE</span><h2>Find the signal.</h2><p>Jump to definitions, references, symbols, diagnostics, files, or commands without leaving the keyboard.</p>
          <div className="finder"><span className="red">›</span><span>open_buffer</span><kbd>Ctrl-t</kbd></div>
        </article>
        <article className="feature">
          <span className="index">03 / EXTEND</span><h2>Make it yours.</h2><p>Bundled Husk plugins power the file tree, project search, and theme browser. Defaults work on day one; configuration stays optional.</p>
          <div className="tokens"><span className="green">tree</span><span className="amber">search</span><span className="cyan">themes</span><span className="magenta">plugins</span></div>
        </article>
      </section>

      <section className="trust shell" id="trust">
        <div className="trust-copy"><span className="eyebrow"><span className="pulse" /> agent workflow</span><h2>Let the agent help.<br /><em>Keep the final say.</em></h2><p>Red can give an agent the context it needs, including unsaved buffers, while staging every suggested write in an isolated proposal filesystem. Review the diff, then accept or reject it explicitly.</p><blockquote>every agent edit is a proposal —<br />nothing touches your files until you accept it</blockquote></div>
        <div className="trust-steps"><div><span>01</span><h3>Ask</h3><p>Open the agent from the editor with the right workspace context.</p><kbd>Space A</kbd></div><div><span>02</span><h3>Review</h3><p>Inspect attributed changes as clear, isolated proposals.</p><kbd>:AgentReview</kbd></div><div><span>03</span><h3>Decide</h3><p>Accept what helps. Reject what does not. Nothing is silently applied.</p><kbd>your call</kbd></div></div>
      </section>

      <section className="shortcuts shell">
        <header><span className="index">A FEW KEYS TO START</span><h2>Hands on the keyboard.</h2></header>
        <div className="shortcut-grid">{shortcuts.map(([key, description]) => <div className="shortcut" key={key}><kbd>{key}</kbd><span>{description}</span><i>↵</i></div>)}</div>
      </section>

      <section className="start shell" id="start"><span className="start-dot" /><p className="start-kicker">READY WHEN YOU ARE</p><h2>Open a file.<br /><em>Start editing.</em></h2><p className="start-copy">Install the self-contained binary and get a capable editor without a setup ritual. Red is early and actively evolving—bring curiosity, and keep backups for critical work.</p><button className="install wide" onClick={copyInstall}><span className="prompt">$</span><code>brew install codersauce/tap/red</code><span className="copy">{copied ? "copied" : "copy"}</span></button><div className="start-links"><a href="https://github.com/codersauce/red/releases/latest" target="_blank" rel="noreferrer">prebuilt binaries <span>→</span></a><a href="https://github.com/codersauce/red" target="_blank" rel="noreferrer">read the docs <span>→</span></a><a href="https://discord.gg/5PWvAUNRHU" target="_blank" rel="noreferrer">join the community <span>→</span></a></div></section>

      <footer className="footer shell"><a className="brand" href="#top"><span className="brand-name">red</span><span className="dot" /></a><p>Rusty Editor · MIT licensed · made in the open</p><a href="https://github.com/codersauce/red" target="_blank" rel="noreferrer">github.com/codersauce/red <span>↗</span></a></footer>
    </main>
  );
}
