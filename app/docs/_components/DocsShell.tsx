import type { ReactNode } from "react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa6";
import { SiteFooter, SiteNav } from "../../components/SiteChrome";
import { docNavigation, type DocPageId } from "../content";

function DocsNavigation({ current }: { current: DocPageId }) {
  return <nav aria-label="Documentation">
    {docNavigation.map((group) => <section className="docs-nav-group" key={group.label}>
      <h2>{group.label}</h2>
      {group.items.map((item) => <Link
        aria-current={current === item.id ? "page" : undefined}
        className={current === item.id ? "active" : undefined}
        href={item.href}
        key={item.id}
      >{item.label}</Link>)}
    </section>)}
  </nav>;
}

export default function DocsShell({
  current,
  currentLabel,
  children,
}: {
  current: DocPageId;
  currentLabel: string;
  children: ReactNode;
}) {
  return <main>
    <div className="nav-wrap"><div className="page-shell"><SiteNav /></div></div>
    <div className="docs-layout page-shell">
      <aside className="docs-sidebar">
        <Link className="docs-sidebar-title" href="/docs">Red documentation</Link>
        <DocsNavigation current={current} />
        <a className="docs-source" href="https://github.com/codersauce/red/tree/main/docs" target="_blank" rel="noreferrer">
          <FaGithub className="inline-icon github-icon" aria-hidden="true" /> Source documentation
        </a>
      </aside>

      <details className="docs-mobile-nav">
        <summary>{currentLabel}</summary>
        <DocsNavigation current={current} />
      </details>

      {children}
    </div>
    <SiteFooter />
  </main>;
}
