import type { ReactNode } from "react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa6";
import { SiteFooter, SiteNav } from "../../components/SiteChrome";
import { docNavigation, type DocPageId } from "../manifest";

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

function AgentLinks() {
  return <div className="docs-agent-links">
    <Link href="/docs/getting-started/agent-docs">For agents</Link>
    <a href="/llms.txt" rel="index" type="text/markdown"><code>llms.txt</code></a>
    <a href="/llms-full.txt" type="text/markdown"><code>llms-full.txt</code></a>
  </div>;
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
    <div className="nav-wrap"><div className="page-shell page-shell-wide"><SiteNav section={{ label: "docs", href: "/docs" }} /></div></div>
    <div className="docs-layout page-shell page-shell-wide">
      <aside className="docs-sidebar">
        <Link className="docs-sidebar-title" href="/docs">Red documentation</Link>
        <DocsNavigation current={current} />
        <AgentLinks />
        <a className="docs-source" href="https://github.com/codersauce/red/tree/main/docs" target="_blank" rel="noreferrer">
          <FaGithub className="inline-icon github-icon" aria-hidden="true" /> Source documentation
        </a>
      </aside>

      <details className="docs-mobile-nav">
        <summary>{currentLabel}</summary>
        <DocsNavigation current={current} />
        <AgentLinks />
      </details>

      {children}
    </div>
    <SiteFooter />
  </main>;
}
