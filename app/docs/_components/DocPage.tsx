import type { ReactNode } from "react";
import Link from "next/link";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import DocsShell from "./DocsShell";
import CopyPageMenu from "./CopyPageMenu";
import OnThisPage from "./OnThisPage";
import { docPages, type DocPageDefinition } from "../content";
import { markdownPath } from "../manifest";

export default function DocPage({ page, body }: { page: DocPageDefinition; body: ReactNode }) {
  const index = docPages.findIndex((candidate) => candidate.id === page.id);
  const previous = index > 0 ? docPages[index - 1] : undefined;
  const next = index >= 0 ? docPages[index + 1] : undefined;

  return <DocsShell current={page.id} currentLabel={page.title}>
    <article className="docs-content">
      <header className="docs-header">
        <div className="docs-header-top">
          <div className="docs-header-meta">
            <p className="docs-eyebrow">{page.section}</p>
            {page.minVersion
              ? <span className="docs-version" data-doc-ignore>{`Requires Red ${page.minVersion}+`}</span>
              : null}
          </div>
          <CopyPageMenu href={markdownPath(page.href)} key={page.href} />
        </div>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
      </header>

      <div className="docs-body">{body}</div>

      <nav className="docs-pagination" aria-label="Previous and next documentation pages">
        {previous
          ? <Link href={previous.href}><FiArrowLeft aria-hidden="true" /><span><small>Previous</small>{previous.title}</span></Link>
          : <span />}
        {next
          ? <Link href={next.href}><span><small>Next</small>{next.title}</span><FiArrowRight aria-hidden="true" /></Link>
          : <span />}
      </nav>
    </article>
    <aside className="docs-toc-column">
      <OnThisPage key={page.href} />
    </aside>
  </DocsShell>;
}
