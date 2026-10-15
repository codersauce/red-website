import assert from "node:assert/strict";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";

const htmlParser = unified().use(rehypeParse);
const markdownParser = unified().use(remarkParse).use(remarkGfm);
const markdownWriter = unified().use(remarkGfm).use(remarkStringify, {
  bullet: "-",
  fences: true,
  listItemIndent: "one",
});

const element = (tagName, children, properties = {}) => ({ type: "element", tagName, properties, children });
const text = (value) => ({ type: "text", value });
const hasClass = (node, name) => node.properties?.className?.includes(name) ?? false;

/** Text content, deliberately without whitespace collapsing or trimming. */
export function nodeText(node) {
  if (node.type === "text") return node.value;
  return (node.children ?? []).map(nodeText).join("");
}

function walk(node, visitor) {
  visitor(node);
  for (const child of node.children ?? []) walk(child, visitor);
}

function find(node, predicate) {
  if (predicate(node)) return node;
  for (const child of node.children ?? []) {
    const found = find(child, predicate);
    if (found) return found;
  }
}

function articleFromHtml(html) {
  const tree = htmlParser.parse(html);
  const article = find(tree, (node) => node.tagName === "article" && hasClass(node, "docs-content"));
  assert.ok(article, "Documentation response has no article.docs-content");
  return article;
}

// Inventory examples before transforming the article. This must not reuse the
// semantic converter: a transform that drops an entire example must fail too.
function sourceCodeBlocks(article) {
  const blocks = [];
  function collect(node) {
    if (node.properties?.dataDocIgnore !== undefined
      || ["docs-pagination", "docs-markdown-controls"].some((name) => hasClass(node, name))
      || ["button", "script", "style", "svg"].includes(node.tagName)) return;
    if (node.tagName === "pre" || hasClass(node, "install-command")) {
      const code = node.children.find((child) => child.tagName === "code");
      assert.ok(code, "Documentation example needs a code child");
      blocks.push({
        language: String(node.properties.dataLanguage ?? code.properties?.dataLanguage ?? "text"),
        value: nodeText(code),
      });
      return;
    }
    for (const child of node.children ?? []) collect(child);
  }
  collect(article);
  return blocks;
}

// Keep hidden tab panels: they hold equally authoritative examples. Only known
// presentation controls are removed, never all navigation or hidden elements.
function semanticContent(node) {
  if (node.type === "comment") return [];
  if (node.type !== "element") return [node];
  const properties = node.properties ?? {};
  if (["button", "script", "style", "svg"].includes(node.tagName)
    || properties.dataDocIgnore !== undefined
    || properties.ariaHidden === "true" || properties.ariaHidden === true
    || properties.role === "tablist" || properties.role === "status"
    || ["docs-pagination", "docs-markdown-controls", "docs-eyebrow", "docs-card-number", "sr-only", "prompt"]
      .some((name) => hasClass(node, name))) return [];

  if (hasClass(node, "docs-steps")) {
    for (const item of node.children) {
      if (item.tagName !== "li") continue;
      const first = item.children.find((child) => child.type === "element");
      if (first?.tagName === "span" && /^\d+$/.test(nodeText(first))) {
        item.children = item.children.filter((child) => child !== first);
      }
    }
  }

  if (properties.role === "tabpanel") {
    const label = properties.dataDocLabel;
    assert.ok(label, "Documentation tab panel needs a data-doc-label");
    const labelNode = element("p", [element("strong", [text(String(label))])]);
    if (hasClass(node, "install-command")) {
      const code = node.children.find((child) => child.tagName === "code");
      assert.ok(code?.properties?.dataLanguage, "Installer command needs a language");
      return [labelNode, element("pre", [code], { dataLanguage: code.properties.dataLanguage })];
    }
    return [labelNode, ...node.children.flatMap(semanticContent)];
  }

  if (hasClass(node, "code-frame")) {
    const pre = node.children.find((child) => child.tagName === "pre");
    assert.ok(pre, "Code frame needs a pre child");
    const title = properties.dataTitle;
    return [
      ...(title ? [element("p", [element("code", [text(String(title))]), text(":")])] : []),
      ...semanticContent(pre),
    ];
  }

  if (hasClass(node, "docs-card")) {
    const heading = find(node, (child) => /^h[1-6]$/.test(child.tagName ?? ""));
    const description = find(node, (child) => child.tagName === "p");
    assert.ok(heading && properties.href, "Documentation card needs a heading and URL");
    return [
      element("p", [element("a", [element("strong", heading.children)], { href: properties.href })]),
      ...(description ? semanticContent(description) : []),
    ];
  }

  node.children = node.children.flatMap(semanticContent);
  if (hasClass(node, "docs-callout")) {
    node.tagName = "blockquote";
    node.children = node.children.map((child) => (
      ["strong", "span"].includes(child.tagName) ? element("p", [child]) : child
    ));
  }
  if (node.tagName === "nav") {
    node.tagName = "ul";
    node.children = node.children.map((child) => (
      child.tagName === "a" ? element("li", [child]) : child
    ));
  }
  if (node.tagName === "kbd") node.tagName = "code";
  return [node];
}

function preparedDocument(html) {
  return { type: "root", children: semanticContent(articleFromHtml(html)) };
}

export function documentationAnchors(html) {
  const anchors = new Set();
  walk(preparedDocument(html), (node) => {
    if (node.properties?.id) anchors.add(String(node.properties.id));
  });
  return anchors;
}

export function markdownPath(page) {
  return page.href === "/docs" ? "/docs.md" : `${page.href}.md`;
}

function rewriteUrl(value, options) {
  const url = new URL(value, new URL(options.page.href, options.origin));
  if (url.origin !== options.origin) return url.href;
  let path = url.pathname.replace(/\/$/, "");
  if (path === "/docs.md") path = "/docs";
  else if (path.startsWith("/docs/") && path.endsWith(".md")) path = path.slice(0, -3);
  if (path !== "/docs" && !path.startsWith("/docs/")) return url.href;

  const target = options.manifest.find((page) => page.href === path);
  assert.ok(target, `Unknown documentation link ${value} in ${options.page.href}`);
  if (url.hash) {
    const anchor = decodeURIComponent(url.hash.slice(1));
    assert.ok(options.anchorsByPath.get(path)?.has(anchor), `Unknown documentation fragment ${value} in ${options.page.href}`);
  }
  url.pathname = markdownPath(target);
  return url.href;
}

function escapeAttribute(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function preserveAnchors(node) {
  if (!node.children) return;
  node.children = node.children.flatMap((child) => {
    preserveAnchors(child);
    const id = child.properties?.id;
    if (!id) return [child];
    delete child.properties.id;
    return [element("doc-anchor", [], { id: String(id) }), child];
  });
}

export function markdownCodeBlocks(markdown) {
  const codeBlocks = [];
  walk(markdownParser.parse(markdown), (node) => {
    if (node.type === "code") codeBlocks.push({ language: node.lang ?? "text", value: node.value });
  });
  return codeBlocks;
}

/** Convert locally rendered documentation; throws on lossy code conversion. */
export async function convertDocumentation(html, options) {
  const article = articleFromHtml(html);
  const codeBlocks = sourceCodeBlocks(article);
  const tree = { type: "root", children: semanticContent(article) };
  const pageUrl = new URL(options.page.href, options.origin);
  const links = [];
  walk(tree, (node) => {
    if (node.tagName === "a" && node.properties.href) {
      node.properties.href = rewriteUrl(String(node.properties.href), options);
      links.push(node.properties.href);
    }
    if (node.tagName === "img" && node.properties.src) {
      node.properties.src = new URL(String(node.properties.src), pageUrl).href;
    }
  });
  preserveAnchors(tree);

  const markdownTree = await unified().use(rehypeRemark, {
    handlers: {
      pre(_state, node) {
        const code = node.children.find((child) => child.tagName === "code");
        assert.ok(code, "Documentation pre element needs a code child");
        const language = String(node.properties.dataLanguage ?? code.properties?.dataLanguage ?? "text");
        const value = nodeText(code);
        return { type: "code", lang: language, value };
      },
      code(_state, node) {
        return { type: "inlineCode", value: nodeText(node) };
      },
      "doc-anchor"(_state, node) {
        return { type: "html", value: `<a id="${escapeAttribute(node.properties.id)}"></a>` };
      },
    },
  }).run(tree);

  const canonical = pageUrl.href;
  const metadata = {
    type: "paragraph",
    children: [
      text("Canonical HTML: "), { type: "link", url: canonical, children: [text(options.page.title)] },
      text(". Website source: "), { type: "inlineCode", value: options.sourceRevision },
      text(options.dirty ? " (uncommitted changes). " : ". "),
      text(`Documented Red release: ${options.releaseVersion}. Installer source: `),
      { type: "inlineCode", value: options.installerSourceCommit }, text("."),
    ],
  };
  const headingIndex = markdownTree.children.findIndex((node) => node.type === "heading" && node.depth === 1);
  assert.ok(headingIndex >= 0, `${options.page.href}: missing title`);
  markdownTree.children.splice(headingIndex + 1, 0, metadata);
  const markdown = markdownWriter.stringify(markdownTree);
  assert.deepEqual(markdownCodeBlocks(markdown), codeBlocks, `${options.page.href}: Markdown dropped or changed code text or language`);
  return { markdown, codeBlocks, links, anchors: documentationAnchors(html) };
}

const discoveryGroups = [
  ["Start here", ["for-agents", "overview"]],
  ["Install and update", ["install", "updating", "first-session"]],
  ["Configure Red and language servers", ["configuration", "languages", "typescript-eslint", "keybindings", "themes"]],
  ["Develop plugins", ["plugins", "json-rpc-plugins", "husk"]],
  ["Use editor commands and sessions", ["navigation", "search", "windows", "git", "agent", "sessions", "cli", "vim"]],
  ["Diagnose problems", ["troubleshooting"]],
];

// Pages for people rather than agents; listed under the optional section.
const optionalIds = ["agent-docs"];

function discoveryLayout(manifest) {
  const listed = new Set(optionalIds);
  const groups = discoveryGroups.map(([title, ids]) => {
    const pages = ids.map((id) => manifest.find((page) => page.id === id)).filter(Boolean);
    for (const page of pages) listed.add(page.id);
    return { title, pages };
  });
  const remaining = manifest.filter((page) => !listed.has(page.id));
  if (remaining.length) groups.push({ title: "More documentation", pages: remaining });
  const optional = optionalIds.map((id) => manifest.find((page) => page.id === id)).filter(Boolean);
  return { groups, optional };
}

/** Every manifest page, in the order the discovery index lists them. */
export function discoveryOrder(manifest) {
  const { groups, optional } = discoveryLayout(manifest);
  return [...groups.flatMap(({ pages }) => pages), ...optional];
}

const pageListItem = (page, origin) => ({
  type: "listItem", spread: false,
  children: [{ type: "paragraph", children: [
    { type: "link", url: new URL(markdownPath(page), origin).href, children: [text(page.title)] },
    text(`: ${page.description}`),
  ] }],
});

const indexSummary = "Red is a modal text editor with Vim-style editing, language-server support, and extensible plugins.";

export function discoveryMarkdown(manifest, origin, releaseVersion) {
  const { groups, optional } = discoveryLayout(manifest);
  const tree = {
    type: "root",
    children: [
      { type: "heading", depth: 1, children: [text("Red documentation")] },
      { type: "blockquote", children: [{ type: "paragraph", children: [text(indexSummary)] }] },
      { type: "paragraph", children: [text(`These pages document Red ${releaseVersion}. Check red --version first and follow each guide's minimum version and tested-baseline notes. The published release is not a claim that every page was tested against that version. Start with the guide for agents when choosing commands or APIs.`)] },
      ...groups.flatMap(({ title, pages }) => pages.length ? [
        { type: "heading", depth: 2, children: [text(title)] },
        {
          type: "list", ordered: false, spread: false,
          children: pages.map((page) => pageListItem(page, origin)),
        },
      ] : []),
      { type: "heading", depth: 2, children: [text("Optional background and releases")] },
      { type: "list", ordered: false, spread: false, children: [
        { type: "listItem", spread: false, children: [{ type: "paragraph", children: [
          { type: "link", url: new URL("/llms-full.txt", origin).href, children: [text("Complete documentation")] },
          text(": Every guide above in a single Markdown file."),
        ] }] },
        ...optional.map((page) => pageListItem(page, origin)),
        { type: "listItem", spread: false, children: [{ type: "paragraph", children: [
          { type: "link", url: new URL("/releases", origin).href, children: [text("Release notes")] },
          text(": Published Red releases and compatibility changes."),
        ] }] },
      ] },
    ],
  };
  return markdownWriter.stringify(tree);
}

/** All guides in one file, in discovery order. Each keeps its own title and provenance line. */
export function fullDocumentationMarkdown(pageMarkdown, origin, releaseVersion) {
  const intro = markdownWriter.stringify({
    type: "root",
    children: [
      { type: "heading", depth: 1, children: [text("Red documentation (complete)")] },
      { type: "blockquote", children: [{ type: "paragraph", children: [text(indexSummary)] }] },
      { type: "paragraph", children: [
        text(`This file joins every guide listed in the `),
        { type: "link", url: new URL("/llms.txt", origin).href, children: [text("documentation index")] },
        text(`. These pages document Red ${releaseVersion}. Check red --version first and follow each guide's minimum version and tested-baseline notes.`),
      ] },
    ],
  });
  return [intro, ...pageMarkdown].map((part) => part.trimEnd()).join("\n\n") + "\n";
}
