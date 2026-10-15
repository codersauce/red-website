import { execFileSync } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { docManifest } from "../app/docs/manifest.ts";
import { canonicalOrigin } from "../app/public-origin.ts";
import { convertDocumentation, discoveryMarkdown, discoveryOrder, documentationAnchors, fullDocumentationMarkdown } from "./docs-markdown.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = resolve(root, "dist/client/_generated/docs");
const installerManifest = JSON.parse(await readFile(resolve(root, "public/installers.json"), "utf8"));
const sourceRevision = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
const dirty = execFileSync("git", ["status", "--porcelain", "--untracked-files=normal"], { cwd: root, encoding: "utf8" }).length > 0;
const { default: worker } = await import(pathToFileURL(resolve(root, "dist/server/index.js")).href);

const renderedPages = new Map();
const anchorsByPath = new Map();
for (const page of docManifest) {
  if (renderedPages.has(page.href)) throw new Error(`Duplicate documentation URL: ${page.href}`);
  const url = new URL(page.href, canonicalOrigin);
  const response = await worker.fetch(new Request(url, {
    headers: { accept: "text/html", "x-forwarded-host": url.host, "x-forwarded-proto": "https" },
  }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
  if (response.status !== 200 || !response.headers.get("content-type")?.startsWith("text/html")) {
    throw new Error(`Cannot export ${page.href}: ${response.status} ${response.headers.get("content-type")}`);
  }
  const html = await response.text();
  renderedPages.set(page.href, html);
  anchorsByPath.set(page.href, documentationAnchors(html));
}

// Exercise the demanding examples first; any conversion or fidelity failure
// aborts the build before generated output is published to the asset directory.
const proofIds = ["json-rpc-plugins", "install"];
const pages = [
  ...proofIds.map((id) => docManifest.find((page) => page.id === id)).filter(Boolean),
  ...docManifest.filter((page) => !proofIds.includes(page.id)),
];
const exports = new Map();
const markdownById = new Map();
let codeBlockCount = 0;
for (const page of pages) {
  const relativePath = page.href === "/docs" ? "overview.md" : `${page.slug}.md`;
  const filename = resolve(output, relativePath);
  if (!filename.startsWith(`${output}/`) || exports.has(filename)) {
    throw new Error(`Invalid or duplicate documentation output: ${relativePath}`);
  }
  const result = await convertDocumentation(renderedPages.get(page.href), {
    page,
    manifest: docManifest,
    origin: canonicalOrigin,
    anchorsByPath,
    sourceRevision,
    dirty,
    releaseVersion: `v${installerManifest.version}`,
    installerSourceCommit: installerManifest.sourceCommit,
  });
  exports.set(filename, result.markdown);
  markdownById.set(page.id, result.markdown);
  codeBlockCount += result.codeBlocks.length;
}
exports.set(resolve(output, "llms.txt"), discoveryMarkdown(docManifest, canonicalOrigin, `v${installerManifest.version}`));
exports.set(resolve(output, "llms-full.txt"), fullDocumentationMarkdown(
  discoveryOrder(docManifest).map((page) => markdownById.get(page.id)),
  canonicalOrigin,
  `v${installerManifest.version}`,
));

await rm(output, { recursive: true, force: true });
for (const [filename, markdown] of exports) {
  await mkdir(dirname(filename), { recursive: true });
  await writeFile(filename, markdown);
}
console.log(`Generated ${pages.length} documentation exports, llms.txt, and llms-full.txt; verified ${codeBlockCount} code blocks (${sourceRevision.slice(0, 12)}${dirty ? ", uncommitted changes" : ", clean"}).`);
