import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const installerManifest = JSON.parse(await readFile(new URL("../public/installers.json", import.meta.url), "utf8"));
const publishedVersion = `v${installerManifest.version}`;
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const publicOrigins = [
  "https://getred.dev",
  "https://getrededitor.com",
  "https://red-editor.fcoury.chatgpt.site",
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

test("serves direction A at the root and keeps docs and releases", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /Vim keys\.<br><em>Agent inside\.<\/em><br>One binary\./);
  assert.match(html, /The agent works <em>through<\/em> your editor/);
  assert.match(html, /href="\/docs"/);
  assert.match(html, /href="\/releases"/);
  assert.match(html, /\/media\/a-agent\.mp4/);
  assert.match(html, /\/media\/a-agent-poster\.jpg/);
  assert.match(html, /id="hero-install"[^>]*data-copy="curl -fsS https:\/\/getred\.dev\/install\.sh \| sh"/);
  assert.match(html, /brew install codersauce\/tap\/red/);
  assert.match(html, /https:\/\/getred\.dev\/install\.sh/);
  assert.match(html, /https:\/\/getred\.dev\/install\.ps1/);

  const docsResponse = await render("/docs");
  assert.equal(docsResponse.status, 200);
  const docs = await docsResponse.text();
  assert.match(docs, /Use Red/);
  assert.match(docs, /\/docs\/getting-started\/install/);
  assert.match(docs, /\/docs\/agent/);

  const agentResponse = await render("/docs/agent");
  assert.equal(agentResponse.status, 200);
  assert.match(await agentResponse.text(), /unsaved, undoable/i);
  const gitResponse = await render("/docs/git");
  assert.equal(gitResponse.status, 200);
  assert.match(await gitResponse.text(), /Git workspace/i);

  const releasesResponse = await render("/releases");
  assert.equal(releasesResponse.status, 200);
  const releases = await releasesResponse.text();
  assert.match(releases, /Latest published/i);
  assert.match(releases, new RegExp(escapeRegExp(publishedVersion)));
  assert.match(releases, /Available now/i);
  assert.match(releases, /New in v0\.7\.0/i);
  assert.doesNotMatch(releases, /not included in the latest published release yet/i);
});

test("installation snippets use the canonical origin on every supported host", async () => {
  for (const origin of publicOrigins) {
    const html = await (await render("/", origin)).text();
    assert.match(html, /https:\/\/getred\.dev\/install\.sh/);
    assert.match(html, /https:\/\/getred\.dev\/install\.ps1/);
    assert.match(html, /brew install codersauce\/tap\/red/);
    assert.match(html, /<link rel="canonical" href="https:\/\/getred\.dev\/"/);
    assert.match(html, /https:\/\/getred\.dev\/og\.png/);
  }

  const untrusted = await (await render("/", "https://attacker.example")).text();
  assert.match(untrusted, /https:\/\/getred\.dev\/install\.sh/);
  assert.doesNotMatch(untrusted, /attacker\.example\/install\.(sh|ps1)/);
});

test("offers Homebrew and direct installers", async () => {
  const html = await (await render()).text();
  assert.match(html, /<span>Homebrew<\/span>/);
  assert.match(html, /<span>macOS · Linux<\/span>/);
  assert.match(html, /<span>Windows<\/span>/);
});

test("inactive installation commands stay hidden", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.install-command\[hidden\]\s*\{[^}]*display:\s*none;/s);
});

test("ships SEO metadata and structured application data", async () => {
  const home = await (await render()).text();
  assert.match(home, /<meta name="theme-color" content="#D7182A">/);
  assert.match(home, /<meta property="og:image" content="https:\/\/getred\.dev\/og\.png">/);
  assert.match(home, /<meta name="twitter:card" content="summary_large_image">/);
  const html = await (await render("/docs")).text();
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /"@type":"SoftwareApplication"/);
  assert.match(html, new RegExp(`"softwareVersion":"${escapeRegExp(installerManifest.version)}"`));
  const robots = await readFile(new URL("../public/robots.txt", import.meta.url), "utf8");
  const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  assert.match(robots, /Sitemap: https:\/\/getred\.dev\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/getred\.dev\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/getred\.dev\/docs<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/getred\.dev\/docs\/agent<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/getred\.dev\/releases<\/loc>/);
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
  assert.deepEqual(captures.map(pngDimensions), Array.from({ length: 10 }, () => ({ width: 2104, height: 1724 })));
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
});

test("ships every homepage recording and poster in the built assets", async () => {
  const names = ["a-hero", "a-agent", "a-inline", "a-git", "a-detach", "a-themes"];
  for (const name of names) {
    const [video, poster] = await Promise.all([
      readFile(new URL(`../dist/client/media/${name}.mp4`, import.meta.url)),
      readFile(new URL(`../dist/client/media/${name}-poster.jpg`, import.meta.url)),
    ]);
    assert.equal(video.toString("ascii", 4, 8), "ftyp");
    assert.ok(video.byteLength > 100_000, name);
    assert.ok(poster.byteLength > 5_000, name);
  }
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
  const generated = await readFile(new URL("../app/installers.generated.ts", import.meta.url), "utf8");
  assert.equal(JSON.parse(manifest).version, installerManifest.version);
  assert.match(generated, new RegExp(`releaseVersion = "${escapeRegExp(publishedVersion)}"`));
});

test("refreshes the visible release version from GitHub with a static fallback", async () => {
  const component = await readFile(new URL("../app/components/ReleaseVersion.tsx", import.meta.url), "utf8");
  assert.match(component, /api\.github\.com\/repos\/codersauce\/red\/releases\/latest/);
  assert.match(component, /aria-live="polite"/);
  assert.match(component, /useState\(fallback\)/);
});
