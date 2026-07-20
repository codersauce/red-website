import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export function SiteNav() {
  return <nav className="site-nav">
    <Link className="brand" href="/" aria-label="Red home">
      red<span>.</span>
    </Link>
    <div className="nav-links">
      <Link href="/#features">Features</Link>
      <Link href="/docs">Docs</Link>
      <Link className="nav-install" href="/#install">Install</Link>
      <ThemeToggle />
      <a className="github-button" href="https://github.com/codersauce/red" target="_blank" rel="noreferrer">
        GitHub
      </a>
    </div>
  </nav>;
}

export function SiteFooter() {
  return <footer className="site-footer page-shell">
    <div><span className="footer-brand">red<span>.</span></span><span>MIT licensed · built in Rust</span></div>
    <div>
      <a href="https://github.com/codersauce/red" target="_blank" rel="noreferrer">GitHub ↗</a>
      <a href="https://discord.gg/5PWvAUNRHU" target="_blank" rel="noreferrer">Discord ↗</a>
      <Link href="/docs">Docs</Link>
    </div>
  </footer>;
}
