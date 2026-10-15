import Link from "next/link";
import { FaGithub } from "react-icons/fa6";
import { FiExternalLink } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";

export function SiteNav() {
  return <nav className="site-nav">
    <Link className="brand" href="/" aria-label="Red home">getred.dev</Link>
    <div className="nav-links">
      {/* The homepage's sections, in its order. */}
      <Link className="nav-section" href="/#agent">Agent</Link>
      <Link className="nav-section" href="/#inline">Inline</Link>
      <Link className="nav-section" href="/#git">Git</Link>
      <Link className="nav-section" href="/#sessions">Sessions</Link>
      <Link className="nav-install" href="/#install">Install</Link>
      <Link href="/docs">Docs</Link>
      <Link href="/releases">Releases</Link>
      <ThemeToggle />
      <a className="github-button" href="https://github.com/codersauce/red" target="_blank" rel="noreferrer">
        <FaGithub className="button-icon github-icon" aria-hidden="true" /> GitHub
      </a>
    </div>
  </nav>;
}

export function SiteFooter() {
  return <footer className="site-footer page-shell">
    <div><span className="footer-brand">getred.dev</span><span>MIT licensed · built in Rust</span></div>
    <div>
      <a href="https://github.com/codersauce/red" target="_blank" rel="noreferrer">
        <FaGithub className="inline-icon github-icon" aria-hidden="true" /> GitHub
      </a>
      <a href="https://discord.gg/5PWvAUNRHU" target="_blank" rel="noreferrer">
        Discord <FiExternalLink className="inline-icon external-link-icon" aria-hidden="true" />
      </a>
      <Link href="/docs">Docs</Link>
      <Link href="/releases">Releases</Link>
      <a href="/llms.txt" type="text/markdown">For agents: llms.txt</a>
    </div>
  </footer>;
}
