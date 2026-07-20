import Link from "next/link";
import { FaGithub } from "react-icons/fa6";
import { FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  return <main className="notfound page-shell">
    <p className="section-kicker">404</p>
    <h1>Nothing at this path.<br /><em>Your files stay yours.</em></h1>
    <p className="lead">The page you were looking for does not exist — the editor, however, does.</p>
    <div className="notfound-links">
      <Link href="/"><FiArrowLeft className="inline-icon arrow-icon" aria-hidden="true" /> back to getred.dev</Link>
      <a href="https://github.com/codersauce/red" target="_blank" rel="noreferrer">
        <FaGithub className="inline-icon github-icon" aria-hidden="true" /> github.com/codersauce/red
      </a>
    </div>
  </main>;
}
