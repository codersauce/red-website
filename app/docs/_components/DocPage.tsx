import type { ReactNode } from "react";
import Link from "next/link";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import DocsShell from "./DocsShell";
import { docPages, type DocPageDefinition } from "../content";

export default function DocPage({ page, body }: { page: DocPageDefinition; body: ReactNode }) {
  const index = docPages.findIndex((candidate) => candidate.id === page.id);
  const previous = index > 0 ? docPages[index - 1] : undefined;
  const next = index >= 0 ? docPages[index + 1] : undefined;

  return <DocsShell current={page.id} currentLabel={page.title}>
    <article className="docs-content">
      <header className="docs-header">
        <p className="docs-eyebrow">{page.section}</p>
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
  </DocsShell>;
}
