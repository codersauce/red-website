import type { Metadata } from "next";
import Link from "next/link";
import { FiArrowRight, FiExternalLink } from "react-icons/fi";
import ReleaseVersion from "../components/ReleaseVersion";
import { SiteFooter, SiteNav } from "../components/SiteChrome";
import { releaseVersion } from "../installers.generated";
import { releases } from "../release-content";

export const metadata: Metadata = {
  title: "Releases — red editor",
  description: `Explore what shipped in Red ${releaseVersion}, with release history from v0.8.0 and the new standalone updater.`,
  alternates: { canonical: "/releases" },
};

function ReleaseNavigation() {
  return <nav aria-label="Release sections">
    <div className="docs-nav-group">
      {releases.map((release) => <a key={release.version} href={`#${release.id}`}>{release.version}</a>)}
      <a href="#available-now">Available now</a>
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
          <h1>Releases</h1>
          <p>What changed in Red, from v0.8.0 through {releaseVersion}.</p>
        </header>

        {releases.map((release, index) => <section className="release-entry" id={release.id} key={release.version}>
          {index === 0 && <p className="section-kicker">Latest release</p>}
          <h2>{release.version}</h2>
          <h3>{release.headline}</h3>
          <p>{release.summary}</p>
          <ul>
            {release.highlights.map((story) => <li key={story.id}><strong>{story.title}.</strong> {story.description}</li>)}
          </ul>
          {index === 0 && <p><Link className="text-link" href="/docs/getting-started/updating">Update an existing installation <FiArrowRight className="inline-icon arrow-icon" aria-hidden="true" /></Link></p>}
          <a className="text-link" href={`https://github.com/codersauce/red/releases/tag/${release.version}`} target="_blank" rel="noreferrer">
            Full {release.version} release notes <FiExternalLink className="inline-icon external-link-icon" aria-hidden="true" />
          </a>
        </section>)}

        <section id="available-now">
          <h2>Available now</h2>
          <ul>
            <li><strong>A persistent Codex Agent workspace.</strong> Continue a conversation with access to editor context, relevant diagnostics, and unsaved buffers.</li>
            <li><strong>Focused inline assistance.</strong> Review, explain, or refactor source in a bounded editor workflow.</li>
            <li><strong>Vim-style modal editing.</strong> Use familiar motions, operators, text objects, splits, macros, and registers.</li>
            <li><strong>A complete developer workspace.</strong> Language-server integration, project search, Git, themes, Tree-sitter, and plugins ship in one Rust binary.</li>
          </ul>
          <Link className="text-link" href="/#install">Install the published release <FiArrowRight className="inline-icon arrow-icon" aria-hidden="true" /></Link>
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
