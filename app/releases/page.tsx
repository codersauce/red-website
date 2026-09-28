import type { Metadata } from "next";
import Link from "next/link";
import { FiArrowRight, FiExternalLink } from "react-icons/fi";
import ReleaseVersion from "../components/ReleaseVersion";
import { SiteFooter, SiteNav } from "../components/SiteChrome";
import { releaseVersion } from "../installers.generated";
import { releaseHighlights } from "../release-content";

export const metadata: Metadata = {
  title: "Release highlights — red editor",
  description: `Explore what shipped in Red ${releaseVersion}, including directory browsing, mouse selection, and shebang syntax detection.`,
  alternates: { canonical: "/releases" },
};

function ReleaseNavigation() {
  return <nav aria-label="Release sections">
    <div className="docs-nav-group">
      <a href="#available-now">Available now</a>
      <a href="#release-highlights">New in {releaseVersion}</a>
      <a href="#release-notes">Complete release notes</a>
    </div>
  </nav>;
}

export default function ReleasesPage() {
  return <main>
    <div className="nav-wrap"><div className="page-shell"><SiteNav /></div></div>
    <div className="docs-layout page-shell">
      <aside className="docs-sidebar">
        <p className="docs-sidebar-title">Release highlights</p>
        <ReleaseNavigation />
      </aside>
      <details className="docs-mobile-nav">
        <summary>Release sections</summary>
        <ReleaseNavigation />
      </details>
      <article className="docs-content">
        <header>
          <p className="section-kicker">Latest published · <ReleaseVersion fallback={releaseVersion} /></p>
          <h1>What Red can do</h1>
          <p>Explore Red&apos;s core workflows and what shipped in {releaseVersion}.</p>
        </header>

        <section id="available-now">
          <h2>Available now</h2>
          <ul>
            <li><strong>A persistent Codex Agent workspace.</strong> Continue a conversation with access to editor context, relevant diagnostics, and unsaved buffers.</li>
            <li><strong>Focused inline assistance.</strong> Review, explain, or refactor source in a bounded editor workflow.</li>
            <li><strong>Vim-style modal editing.</strong> Use familiar motions, operators, text objects, splits, macros, and registers.</li>
            <li><strong>A complete developer workspace.</strong> Language servers, project search, Git, themes, Tree-sitter, and plugins ship in one Rust binary.</li>
          </ul>
          <Link className="text-link" href="/#install">Install the published release <FiArrowRight className="inline-icon arrow-icon" aria-hidden="true" /></Link>
        </section>

        <section id="release-highlights">
          <h2>New in {releaseVersion}</h2>
          <p>These features are available in the latest published release:</p>
          <ul>
            {releaseHighlights.map((story) => <li key={story.tag}><strong>{story.title}.</strong> {story.description}</li>)}
          </ul>
        </section>

        <section id="release-notes">
          <h2>Complete release notes</h2>
          <p>Each GitHub release contains the full changelog, downloadable archives, and checksum files.</p>
          <a className="text-link" href="https://github.com/codersauce/red/releases" target="_blank" rel="noreferrer">
            Read every GitHub release <FiExternalLink className="inline-icon external-link-icon" aria-hidden="true" />
          </a>
        </section>
      </article>
    </div>
    <SiteFooter />
  </main>;
}
