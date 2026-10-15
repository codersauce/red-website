import assert from "node:assert/strict";
import test from "node:test";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import remarkParse from "remark-parse";
import { docManifest } from "../app/docs/manifest.ts";
import { fetchBuiltWorker } from "./helpers/built-worker.mjs";

function collect(node, predicate, found = []) {
  if (predicate(node)) found.push(node);
  for (const child of node.children ?? []) collect(child, predicate, found);
  return found;
}

test("every documentation page advertises its export and discovery index", async () => {
  for (const page of docManifest) {
    const response = await fetchBuiltWorker(page.href, { headers: { Accept: "text/html" } });
    assert.equal(response.status, 200, page.href);
    const tree = unified().use(rehypeParse).parse(await response.text());
    const nodes = collect(tree, (node) => node.type === "element");
    assert.ok(nodes.some((node) => node.tagName === "link" && node.properties.rel?.includes("alternate")
      && node.properties.type === "text/markdown"
      && new URL(node.properties.href, "https://getred.dev").pathname === `${page.href}.md`), page.href);
    assert.ok(nodes.some((node) => node.tagName === "a" && node.properties.href === `${page.href}.md`), page.href);
    assert.ok(nodes.some((node) => node.tagName === "a" && node.properties.href === "/llms.txt"), page.href);
    assert.equal(nodes.filter((node) => node.properties.className?.includes("docs-markdown-controls")).length, 1, page.href);
  }
});

test("every discovery link resolves and each guide appears exactly once", async () => {
  const index = await fetchBuiltWorker("/llms.txt");
  const tree = unified().use(remarkParse).parse(await index.text());
  const links = collect(tree, (node) => node.type === "link");
  for (const page of docManifest) {
    assert.equal(links.filter((node) => node.url === `https://getred.dev${page.href}.md`).length, 1, page.href);
  }
  for (const link of links) {
    const url = new URL(link.url);
    assert.equal(url.origin, "https://getred.dev");
    const response = await fetchBuiltWorker(url.pathname, { headers: { Accept: "text/html" } });
    assert.equal(response.status, 200, link.url);
  }
});
