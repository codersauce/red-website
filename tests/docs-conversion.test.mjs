import assert from "node:assert/strict";
import test from "node:test";
import { convertDocumentation, discoveryMarkdown, documentationAnchors, markdownCodeBlocks } from "../scripts/docs-markdown.mjs";

const page = { id: "test", slug: "test", href: "/docs/test", title: "Test guide", description: "Test documentation", section: "Reference" };
const origin = "https://getred.dev";
const wrap = (body) => `<html><body><nav>Shell navigation</nav><article class="docs-content"><header><h1>Test guide</h1></header>${body}<nav class="docs-pagination">Next page</nav></article><script>window.secret = "not content"</script></body></html>`;
const encode = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

async function convert(html, overrides = {}) {
  return convertDocumentation(html, {
    page, manifest: [page], origin, sourceRevision: "a".repeat(40), dirty: false,
    releaseVersion: "v0.9.0", installerSourceCommit: "b".repeat(40),
    anchorsByPath: new Map([[page.href, documentationAnchors(html)]]),
    ...overrides,
  });
}

test("preserves code bytes, languages, fences, and trailing whitespace", async () => {
  const examples = [
    { language: "husk", value: 'let icon = "🦀";\n\tprintln!("<ok> & quoted");  \n\n' },
    { language: "javascript", value: 'const quote = `nested \\`value\\``;\n```\n````\n~~~~\n' },
    { language: "text", value: "\n\n  indented\t\n\tfinal  " },
    { language: "text", value: "" },
  ];
  const html = wrap(examples.map(({ language, value }) => `<pre data-language="${language}" data-grammar="rust"><code><span class="syntax-token">${encode(value)}</span></code></pre>`).join(""));
  const result = await convert(html);
  assert.deepEqual(result.codeBlocks, examples);
  assert.deepEqual(markdownCodeBlocks(result.markdown), examples);
  assert.match(result.markdown, /```husk/);
  assert.doesNotMatch(result.markdown, /syntax-token|data-grammar|Shell navigation|Next page|window.secret/);
});

test("exports code frame titles as labels and drops the frame header", async () => {
  const frame = (title, value) => `<div class="code-frame"${title ? ` data-title="${title}"` : ""}>
    <div class="code-frame-header" data-doc-ignore="true"><span class="code-frame-label">${title ? `<span class="code-frame-title">${title}</span>` : ""}<span class="code-frame-language">TOML</span></span><button>Copy</button><span class="sr-only" role="status"></span></div>
    <pre data-language="toml"><code>${value}</code></pre>
  </div>`;
  const result = await convert(wrap(frame("rpc-hello-plugin/red-plugin.toml", "schema_version = 1") + frame(undefined, "theme = &quot;red.json&quot;")));
  assert.deepEqual(result.codeBlocks, [
    { language: "toml", value: "schema_version = 1" },
    { language: "toml", value: 'theme = "red.json"' },
  ]);
  assert.match(result.markdown, /`rpc-hello-plugin\/red-plugin\.toml`:\n\n```toml\nschema_version = 1\n```/);
  assert.doesNotMatch(result.markdown, /TOML|Copy/);
});

test("exports both hidden language panels and every installer platform", async () => {
  const html = wrap(`
    <div role="tablist"><button>Python</button><button>Node.js</button></div>
    <div role="tabpanel" data-doc-label="Python"><pre data-language="python"><code>print("hello")</code></pre></div>
    <div role="tabpanel" data-doc-label="Node.js" hidden><pre data-language="javascript"><code>console.log("hello")</code></pre></div>
    ${[["macOS + Linux", "shell", "curl https://getred.dev/install.sh | sh"], ["Windows", "powershell", "irm https://getred.dev/install.ps1 | iex"], ["Homebrew", "shell", "brew install codersauce/tap/red"]].map(([label, language, command]) => `
      <div class="install-command" role="tabpanel" data-doc-label="${label}" hidden>
        <span class="prompt">$</span><code data-language="${language}"><span class="syntax-token">${command}</span></code><button>copy</button>
      </div>`).join("")}
    <span role="status">Install command copied to clipboard</span>`);
  const result = await convert(html);
  for (const label of ["Python", "Node.js", "macOS + Linux", "Windows", "Homebrew"]) assert.ok(result.markdown.includes(`**${label}**`));
  assert.equal(result.codeBlocks.length, 5);
  assert.doesNotMatch(result.markdown, /copy|clipboard|tabpanel|syntax-token/);
  assert.equal(result.codeBlocks[2].value, "curl https://getred.dev/install.sh | sh");
});

test("rejects whole examples lost by a transform while excluding deliberate chrome", async () => {
  const block = '<pre data-language="shell"><code>red --version</code></pre>';
  const installer = '<div class="install-command" role="tabpanel" data-doc-label="Homebrew"><code data-language="shell">brew install codersauce/tap/red</code></div>';
  for (const example of [block, installer]) {
    // Cards export their title and description, so an example inserted inside
    // one must be rejected instead of silently disappearing from the export.
    const html = wrap(`<a class="docs-card" href="/docs/test"><h3>Guide</h3><p>Description</p>${example}</a>`);
    await assert.rejects(convert(html), /Markdown dropped or changed code/);
  }
  const result = await convert(wrap(`<div data-doc-ignore>${block}</div><nav class="docs-pagination">${block}</nav>`));
  assert.deepEqual(result.codeBlocks, []);
});

test("preserves callouts, GFM tables, inline notation, images, and substantive landing navigation", async () => {
  const html = wrap(`
    <aside class="docs-callout"><strong>Requires v0.9.0</strong><span>Install <code>node</code> separately.</span></aside>
    <table><thead><tr><th>Command</th><th>Purpose</th></tr></thead><tbody><tr><td><kbd>:RpcHello</kbd></td><td>Print a greeting</td></tr></tbody></table>
    <ol class="docs-steps"><li><span>1</span><div><strong>Run it.</strong><p>Check the result.</p></div></li></ol>
    <nav><a href="/docs/test">Test guide</a></nav>
    <a class="docs-card" href="/docs/test"><span class="docs-card-number">01</span><div><h3>Start here</h3><p>Follow this guide.</p></div><svg>arrow</svg></a>
    <img src="/images/example.png" alt="Red showing two language servers" />
    <img src="images/relative.png" alt="Document-relative illustration" />
    <div data-doc-ignore><button>Copy Markdown</button><p>Loading</p></div>`);
  const { markdown } = await convert(html);
  assert.match(markdown, /> \*\*Requires v0\.9\.0\*\*/);
  assert.match(markdown, /> Install `node` separately/);
  assert.match(markdown, /\| `:RpcHello`/);
  assert.match(markdown, /1\. \*\*Run it\.\*\*/);
  assert.doesNotMatch(markdown, /1\. 1|Copy Markdown|Loading|arrow|01/);
  assert.match(markdown, /\[Test guide\]\(https:\/\/getred.dev\/docs\/test.md\)/);
  assert.match(markdown, /\[\*\*Start here\*\*\]\(https:\/\/getred.dev\/docs\/test.md\)/);
  assert.match(markdown, /!\[Red showing two language servers\]\(https:\/\/getred.dev\/images\/example.png\)/);
  assert.match(markdown, /!\[Document-relative illustration\]\(https:\/\/getred.dev\/docs\/images\/relative.png\)/);
});

test("preserves explicit anchors and validates rewritten documentation links", async () => {
  const html = wrap('<h2 id="custom-fragment">Different heading</h2><p><a href="#custom-fragment">Jump here</a> or <a href="/releases#release-v0-9-0">release</a>.</p>');
  const result = await convert(html);
  assert.match(result.markdown, /<a id="custom-fragment"><\/a>/);
  assert.match(result.markdown, /https:\/\/getred.dev\/docs\/test.md#custom-fragment/);
  assert.match(result.markdown, /https:\/\/getred.dev\/releases#release-v0-9-0/);
  await assert.rejects(convert(wrap('<a href="/docs/missing">Missing</a>')), /Unknown documentation link/);
  await assert.rejects(convert(wrap('<a href="#missing">Missing</a>')), /Unknown documentation fragment/);
});

test("records release and source provenance without claiming a tested baseline", async () => {
  const { markdown } = await convert(wrap("<p>Body.</p>"), { dirty: true });
  assert.match(markdown, /Canonical HTML: \[Test guide\]\(https:\/\/getred.dev\/docs\/test\)/);
  assert.match(markdown, /Website source: `a{40}` \(uncommitted changes\)/);
  assert.match(markdown, /Documented Red release: v0\.9\.0/);
  assert.match(markdown, /Installer source: `b{40}`/);
  assert.doesNotMatch(markdown, /tested against/);
});

test("discovery includes every manifest entry, with descriptions and Markdown links", () => {
  const manifest = [
    { ...page, id: "overview", slug: "", href: "/docs", title: "Overview" },
    { ...page, id: "for-agents", slug: "for-agents", href: "/docs/for-agents", title: "For agents" },
    page,
  ];
  const markdown = discoveryMarkdown(manifest, origin, "v0.9.0");
  assert.ok(markdown.startsWith("# Red documentation\n"));
  for (const url of ["/docs.md", "/docs/for-agents.md", "/docs/test.md"]) assert.equal(markdown.split(`${origin}${url}`).length - 1, 1);
  assert.match(markdown, /More documentation/);
  assert.equal(markdown.split(": Test documentation").length - 1, manifest.length);
});
