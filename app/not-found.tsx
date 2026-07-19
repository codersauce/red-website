import Link from "next/link";

export default function NotFound() {
  return <main className="notfound shell">
    <p className="eyebrow"><span className="pulse" /> 404</p>
    <h1>Nothing at this path.<br /><em>Your files stay yours.</em></h1>
    <p className="lead">The page you were looking for does not exist — the editor, however, does.</p>
    <div className="notfound-links">
      <Link href="/">back to getred.dev <span aria-hidden="true">→</span></Link>
      <a href="https://github.com/codersauce/red" target="_blank" rel="noreferrer">github.com/codersauce/red <span aria-hidden="true">↗</span></a>
    </div>
  </main>;
}
