import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { FiArrowRight } from "react-icons/fi";
import DocsShell from "./_components/DocsShell";
import { CodeBlock } from "./_components/Code";
import CopyCodeButton from "./_components/CopyCodeButton";
import CopyPageMenu from "./_components/CopyPageMenu";
import HighlightedInstallPicker from "./_components/HighlightedInstallPicker";
import { docMetadata, markdownPath } from "./manifest";
import { canonicalOrigin, resolvePublicOrigin } from "../public-origin";

const overview = docMetadata("overview");

export const metadata: Metadata = {
  title: "Documentation — Red editor",
  description: "Install Red, complete your first editing session, and find current guides for the editor.",
  alternates: { canonical: overview.href, types: { "text/markdown": markdownPath(overview.href) } },
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
      ["TypeScript and ESLint", "/docs/languages/typescript-eslint"],
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
      ["JSON-RPC plugins", "/docs/plugins/json-rpc"],
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

export default async function DocsPage() {
  const origin = resolvePublicOrigin(await headers());
  return <DocsShell current="overview" currentLabel="Overview">
    <article className="docs-content docs-landing">
      <header className="docs-header">
        <div className="docs-header-top">
          <p className="docs-eyebrow">Documentation</p>
          <CopyPageMenu href={markdownPath(overview.href)} key={overview.href} />
        </div>
        <h1>{overview.title}</h1>
        <p>{overview.description}</p>
      </header>

      <section aria-labelledby="start-here">
        <h2 id="start-here">Start here</h2>
        <div className="docs-quickstart">
          <div className="docs-quickstart-step">
            <span className="docs-quickstart-number" aria-hidden="true">1</span>
            <div>
              <h3>Install Red</h3>
              <HighlightedInstallPicker origin={origin} />
              <p>The install scripts verify the release checksum and run <code>red --self-check</code>. <Link href="/docs/getting-started/install">Other install methods</Link></p>
            </div>
          </div>
          <div className="docs-quickstart-step">
            <span className="docs-quickstart-number" aria-hidden="true">2</span>
            <div>
              <h3>Open a project</h3>
              <CodeBlock language="shell" variant="command">red -r path/to/project</CodeBlock>
              <p>Edit and save a file, then find commands when you need them. <Link href="/docs/getting-started/first-session">Your first session</Link></p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="agent-docs">
        <div className="docs-agent-strip">
          <div>
            <h2 id="agent-docs">Point your agent at the docs</h2>
            <p>Every page is also plain Markdown. Start a coding agent at the index, or <Link href="/docs/getting-started/agent-docs">add Red to its instructions</Link> once. Agents that configure or extend Red should read <Link href="/docs/for-agents">For coding agents</Link>.</p>
          </div>
          <ul className="docs-agent-urls">
            {[["/llms.txt", "Documentation index"], ["/docs.md", "Overview as Markdown"]].map(([path, label]) => <li key={path}>
              <a href={path} aria-label={label}><code>{canonicalOrigin.replace("https://", "")}{path}</code></a>
              <CopyCodeButton code={`${canonicalOrigin}${path}`} label={`${label} URL`} />
            </li>)}
          </ul>
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
