import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

function jpegDimensions(bytes) {
  for (let index = 0; index < bytes.length - 8; index += 1) {
    if (bytes[index] !== 0xff || ![0xc0, 0xc1, 0xc2, 0xc3].includes(bytes[index + 1])) continue;
    return { width: bytes.readUInt16BE(index + 7), height: bytes.readUInt16BE(index + 5) };
  }
  throw new Error("JPEG frame marker not found");
}

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`https://red.example${path}`, { headers: { accept: "text/html", "x-forwarded-host": "red.example", "x-forwarded-proto": "https" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the Red website proposal", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /the modal editor.*for the agent era/i);
  assert.match(html, /brew install codersauce\/tap\/red/);
  assert.match(html, /macOS \+ Linux/);
  assert.match(html, />Windows<\/button>/);
  assert.match(html, /v0\.2\.0/);
  assert.match(html, /every agent edit is a proposal/i);
  assert.match(html, /Space A/);
  assert.match(html, /:AgentReview/);
  assert.match(html, /https:\/\/red\.example\/og\.png\?v=2/);
  assert.match(html, /ghostty-code\.jpg/);
  assert.match(html, /role="tablist"/i);
  assert.match(html, /role="tabpanel"/i);
  assert.match(html, /aria-selected="true"/i);
  assert.match(html, /Discover Git actions/i);
  assert.match(html, /id="preview-tab-splash"[^>]*>Welcome<\/button>/i);
  for (const theme of ["Kanso Ink", "GitHub Light", "Tokyo Night Storm", "Rosé Pine Dawn"]) {
    assert.match(html, new RegExp(theme, "i"));
  }
  const previewSource = await readFile(new URL("../app/components/PreviewTabs.tsx", import.meta.url), "utf8");
  assert.match(previewSource, /Cyberdream/i);
  assert.doesNotMatch(html, /red-editor-demo|src\/main\.rs|codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("ships SEO metadata: canonical, theme-color, and structured data", async () => {
  const html = await (await render()).text();
  assert.match(html, /<link rel="canonical" href="https:\/\/getred\.dev\/"\/>/);
  assert.match(html, /<meta name="theme-color" content="#101014"\/>/);
  assert.match(html, /Red modal editor alongside a reviewable agent proposal/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /"@type":"SoftwareApplication"/);
  assert.match(html, /"softwareVersion":"0\.2\.0"/);
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

test("ships Red-specific preview assets and removes the starter skeleton", async () => {
  const [favicon, og, ...captures] = await Promise.all([readFile(new URL("../public/favicon.svg", import.meta.url), "utf8"), readFile(new URL("../public/og.png", import.meta.url)), ...["ghostty-code.jpg", "ghostty-picker-demo.jpg", "ghostty-commands-demo.jpg", "ghostty-agent.jpg", "ghostty-git-workspace.jpg", "ghostty-splash.jpg"].map((name) => readFile(new URL(`../public/${name}`, import.meta.url)))]);
  assert.match(favicon, /#e5484d/i);
  assert.ok(og.byteLength > 100_000);
  assert.ok(og.byteLength < 500_000, "og.png should stay well under 500 KB");
  assert.ok(captures.every((capture) => capture.byteLength > 20_000));
  assert.deepEqual(captures.map(jpegDimensions), Array.from({ length: 6 }, () => ({ width: 1208, height: 704 })));
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
  assert.equal(JSON.parse(manifest).version, "0.2.0");
});
