import Link from "next/link";
import { canonicalOrigin } from "../../public-origin";
import { CodeBlock } from "./Code";

const index = `${canonicalOrigin}/llms.txt`;

export default function AgentDocs() {
  return <>
    <section>
      <h2>Start your agent at the index</h2>
      <p>Every documentation page is also published as Markdown. Agents can read it directly, without navigation, scripts, or HTML to strip. Point an agent at the index first:</p>
      <div className="docs-table-wrap"><table className="docs-url-table">
        <thead><tr><th>URL</th><th>What it returns</th></tr></thead>
        <tbody>
          <tr><td><a href="/llms.txt"><code>/llms.txt</code></a></td><td>Every guide, grouped by task, with a one-line description and a Markdown link. Start here.</td></tr>
          <tr><td><a href="/llms-full.txt"><code>/llms-full.txt</code></a></td><td>Every guide in one file, for tools that load documentation in a single request.</td></tr>
          <tr><td><a href="/docs.md"><code>/docs.md</code></a></td><td>The documentation overview.</td></tr>
          <tr><td><code>/docs/&lt;guide&gt;.md</code></td><td>Any guide. Add <code>.md</code> to the address of the page you&apos;re reading.</td></tr>
          <tr><td><a href="/docs/for-agents.md"><code>/docs/for-agents.md</code></a></td><td>Instructions written for agents: check the installed version, choose the right configuration layer, and validate changes.</td></tr>
        </tbody>
      </table></div>
    </section>

    <section>
      <h2>Ask your agent to read it</h2>
      <p>Paste a prompt like this into Codex, Claude Code, or another coding agent:</p>
      <CodeBlock language="text">{`Read ${index} and follow its links to the guides you need.\nCheck \`red --version\` first and follow each guide's minimum-version notes.\nThen help me: <describe the task>`}</CodeBlock>
    </section>

    <section>
      <h2>Add Red to your agent&apos;s instructions</h2>
      <p>To make the docs available in every session, add a short note to the instruction file your agent reads. Codex reads <code>AGENTS.md</code> and Claude Code reads <code>CLAUDE.md</code>, from the project or from your home directory.</p>
      <CodeBlock language="text" title="AGENTS.md">{`## Red editor\n\nWhen installing, configuring, or extending the Red editor, read\n${index} first and fetch the Markdown guides it links to.\nCheck \`red --version\` before applying instructions.`}</CodeBlock>
      <p>In Cursor, type <code>@Docs</code>, choose <strong>Add new doc</strong>, and enter <code>{index}</code>.</p>
    </section>

    <section>
      <h2>Request Markdown from any docs URL</h2>
      <p>Documentation URLs also return Markdown when the client asks for it. Tools that send <code>Accept: text/markdown</code> get the export from the regular address:</p>
      <CodeBlock language="shell">{`curl -H 'Accept: text/markdown' ${canonicalOrigin}/docs/plugins/json-rpc`}</CodeBlock>
      <p>On each page, <strong>Copy page</strong> copies its Markdown for pasting into a chat. The menu next to it opens the page in ChatGPT or Claude.</p>
    </section>

    <section>
      <h2>How the Markdown stays current</h2>
      <p>The exports are generated from these pages every time the site is built, and the build fails if a link, anchor, or code example doesn&apos;t survive the conversion. Each export names its HTML page, the website revision it came from, and the Red release it documents.</p>
      <p>When your agent configures or extends Red, have it read <Link href="/docs/for-agents">For coding agents</Link>, which is written for agents rather than people.</p>
    </section>
  </>;
}
