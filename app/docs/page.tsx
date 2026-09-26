import type { Metadata } from "next";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import DocsShell from "./_components/DocsShell";

export const metadata: Metadata = {
  title: "Documentation — Red editor",
  description: "Install Red, complete your first editing session, and find current guides for the editor.",
  alternates: { canonical: "/docs" },
};

const topics = [
  {
    title: "Editor",
    description: "Files, editing, search, windows, language tools, and Git.",
    links: [
      ["Navigate and edit", "/docs/editor/navigation"],
      ["Search and replace", "/docs/editor/search"],
      ["Buffers and windows", "/docs/editor/windows"],
      ["Language tools", "/docs/languages"],
      ["Git", "/docs/git"],
    ],
  },
  {
    title: "Agent",
    description: "Codex setup, full Agent work, inline assist, review, and history.",
    links: [["Agent and inline assist", "/docs/agent"]],
  },
  {
    title: "Customize",
    description: "Configuration, keybindings, themes, plugins, and Husk.",
    links: [
      ["Configuration", "/docs/configuration"],
      ["Keybindings", "/docs/keybindings"],
      ["Themes", "/docs/themes"],
      ["Plugins", "/docs/plugins"],
      ["Husk", "/docs/husk"],
    ],
  },
  {
    title: "Sessions and reference",
    description: "Detach, recovery, command-line options, Vim behavior, and problem diagnosis.",
    links: [
      ["Detach and recover", "/docs/sessions"],
      ["Command line", "/docs/reference/cli"],
      ["Vim compatibility", "/docs/reference/vim"],
      ["Troubleshooting", "/docs/troubleshooting"],
    ],
  },
];

export default function DocsPage() {
  return <DocsShell current="overview" currentLabel="Overview">
    <article className="docs-content docs-landing">
      <header className="docs-header">
        <p className="docs-eyebrow">Documentation</p>
        <h1>Use Red</h1>
        <p>Install the editor, complete a short first session, then move into the parts of Red you need.</p>
      </header>

      <section aria-labelledby="start-here">
        <h2 id="start-here">Start here</h2>
        <div className="docs-card-grid">
          <Link className="docs-card" href="/docs/getting-started/install">
            <span className="docs-card-number">01</span>
            <div><h3>Install Red</h3><p>Choose the command for your platform and check that the bundled runtime is ready.</p></div>
            <FiArrowRight aria-hidden="true" />
          </Link>
          <Link className="docs-card" href="/docs/getting-started/first-session">
            <span className="docs-card-number">02</span>
            <div><h3>Your first session</h3><p>Open a project, edit and save a file, and find commands when you need them.</p></div>
            <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section aria-labelledby="browse-docs">
        <p className="docs-eyebrow">All documentation</p>
        <h2 id="browse-docs">Browse by task</h2>
        <div className="docs-topic-grid">
          {topics.map((topic) => <section className="docs-topic" key={topic.title}>
            <h3>{topic.title}</h3>
            <p>{topic.description}</p>
            <nav aria-label={`${topic.title} documentation`}>
              {topic.links.map(([label, href]) => <Link href={href} key={href}>{label}<FiArrowRight aria-hidden="true" /></Link>)}
            </nav>
          </section>)}
        </div>
      </section>
    </article>
  </DocsShell>;
}
