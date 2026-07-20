import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const publicOrigins = [
  "https://getred.dev",
  "https://rededitor.dev",
  "https://rededitor.app",
];

function pngDimensions(bytes) {
  assert.equal(bytes.toString("ascii", 1, 4), "PNG");
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
  };
}

async function render(path = "/", origin = "https://getred.dev") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  const { default: worker } = await import(workerUrl.href);
  const url = new URL(path, origin);
  return worker.fetch(
    new Request(url, {
      headers: {
        accept: "text/html",
        "x-forwarded-host": url.host,
        "x-forwarded-proto": url.protocol.slice(0, -1),
      },
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the replacement website and real docs route", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /editor that respects.*muscle memory/i);
  assert.match(html, /Batteries included/i);
  assert.match(html, /Agent edits you can actually trust/i);
  assert.match(html, /v0\.2\.1/);
  assert.match(html, /editing-light\.png/);
  assert.match(html, /editing-dark\.png/);
  assert.match(html, /role="tablist"/i);
  assert.match(html, /role="tabpanel"/i);
  assert.match(html, /aria-selected="true"/i);
  assert.match(html, /Use dark color theme/i);
  assert.match(html, /red-color-theme/);
  assert.match(html, /theme-icon/);
  assert.match(html, /github-icon/);
  assert.match(html, /copy-icon/);
  assert.match(html, /download-icon/);
  assert.match(html, /external-link-icon/);
  assert.doesNotMatch(html, /[☀☾↗]/);
  assert.doesNotMatch(html, /ghostty-|codex-preview|react-loading-skeleton|Your site is taking shape/i);

  const docsResponse = await render("/docs");
  assert.equal(docsResponse.status, 200);
  const docs = await docsResponse.text();
  assert.match(docs, /Red documentation/i);
  assert.match(docs, /Installation/);
  assert.match(docs, /Agent workflow/);
  assert.match(docs, /typed Husk runtime/i);
});

test("installation snippets preserve each supported website origin", async () => {
  for (const origin of publicOrigins) {
    const html = await (await render("/", origin)).text();
    assert.match(html, new RegExp(`${origin.replaceAll(".", "\\.")}/install\\.sh`));
    assert.match(html, new RegExp(`${origin.replaceAll(".", "\\.")}/install\\.ps1`));
    assert.match(html, /brew install codersauce\/tap\/red/);
    assert.match(html, /<link rel="canonical" href="https:\/\/getred\.dev\/"\/>/);
    assert.match(html, new RegExp(`${origin.replaceAll(".", "\\.")}/og\\.png\\?v=3`));
  }

  const untrusted = await (await render("/", "https://attacker.example")).text();
  assert.match(untrusted, /https:\/\/getred\.dev\/install\.sh/);
  assert.doesNotMatch(untrusted, /attacker\.example\/install\.(sh|ps1)/);
});

test("inactive installation commands stay hidden", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.install-command\[hidden\]\s*\{[^}]*display:\s*none;/s);
});

test("ships SEO metadata and structured application data", async () => {
  const html = await (await render()).text();
  assert.match(html, /<meta name="theme-color" content="#fdfcfb"\/>/);
  assert.match(html, /Red editor website and Rust editing preview/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /"@type":"SoftwareApplication"/);
  assert.match(html, /"softwareVersion":"0\.2\.1"/);
  const robots = await readFile(new URL("../public/robots.txt", import.meta.url), "utf8");
  const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  assert.match(robots, /Sitemap: https:\/\/getred\.dev\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/getred\.dev\/<\/loc>/);
});

test("renders a branded 404 page with a real 404 status", async () => {
  const response = await render("/does-not-exist");
  assert.equal(response.status, 404);
  const html = await response.text();
  assert.match(html, /Nothing at this path/);
  assert.match(html, /github\.com\/codersauce\/red/);
});

test("ships the replacement editor captures and social card", async () => {
  const captureNames = [
    "editing-light.png",
    "editing-dark.png",
    "find-files-dark.png",
    "grep-dark.png",
    "palette-dark.png",
    "themes-dark.png",
    "lsp-dialog-dark.png",
    "ask-agent-dark.png",
    "agent-pane-dark.png",
    "editor-dark.png",
  ];
  const [favicon, og, ...captures] = await Promise.all([
    readFile(new URL("../public/favicon.svg", import.meta.url), "utf8"),
    readFile(new URL("../public/og.png", import.meta.url)),
    ...captureNames.map((name) => readFile(new URL(`../public/${name}`, import.meta.url))),
  ]);
  assert.match(favicon, /#e5484d/i);
  assert.deepEqual(pngDimensions(og), { width: 1200, height: 630 });
  assert.ok(og.byteLength > 100_000);
  assert.ok(og.byteLength < 2_000_000);
  assert.ok(captures.every((capture) => capture.byteLength > 50_000));
  assert.deepEqual(captures.map(pngDimensions), Array.from({ length: 10 }, () => ({ width: 1880, height: 1500 })));
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
});

test("ships checksum-verifying installers at stable public paths", async () => {
  const [shell, powershell, manifest] = await Promise.all([
    readFile(new URL("../public/install.sh", import.meta.url), "utf8"),
    readFile(new URL("../public/install.ps1", import.meta.url), "utf8"),
    readFile(new URL("../public/installers.json", import.meta.url), "utf8"),
  ]);
  assert.match(shell, /SHA256SUMS\.txt/);
  assert.match(shell, /--self-check/);
  assert.match(powershell, /Get-FileHash -Algorithm SHA256/);
  assert.match(powershell, /--self-check/);
  assert.equal(JSON.parse(manifest).version, "0.2.1");
});
