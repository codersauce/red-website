import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";
import { docManifest } from "../app/docs/manifest.ts";

const installerManifest = JSON.parse(await readFile(new URL("../public/installers.json", import.meta.url), "utf8"));
const publishedVersion = `v${installerManifest.version}`;
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function decodeHtmlText(value) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, codePoint) => String.fromCodePoint(Number.parseInt(codePoint, 16)))
    .replace(/&#([0-9]+);/g, (_, codePoint) => String.fromCodePoint(Number(codePoint)))
    .replaceAll("&quot;", "\"")
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}

function visibleText(html) {
  return decodeHtmlText(html.replace(/<[^>]*>/g, ""));
}

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
  const versions = [...releases.matchAll(/<h2>(v0\.(?:8\.[012]|9\.0))<\/h2>/g)].map((match) => match[1]);
  assert.deepEqual(versions, ["v0.9.0", "v0.8.2", "v0.8.1", "v0.8.0"]);
  assert.equal(versions[0], publishedVersion);
  for (const version of versions) {
    assert.match(releases, new RegExp(`id="release-${version.replaceAll(".", "-")}"`));
    assert.match(releases, new RegExp(`https://github.com/codersauce/red/releases/tag/${escapeRegExp(version)}`));
  }
  assert.match(releases, /Use TypeScript and ESLint together/);
  assert.match(releases, /Write plugins in your language/);
  assert.match(releases, /Query and transform JSON with JSON Workbench/);
  assert.match(releases, /Update from the editor or terminal/);
  assert.match(releases, /Browse a directory in an editor window/);
  assert.doesNotMatch(releases, /releases\/tag\/v0\.7/);
  assert.match(releases, /Make room for long paths in pickers/);
  assert.match(releases, /Save and quit after formatting finishes/);
  assert.doesNotMatch(releases, /not included in the latest published release yet/i);

  const updating = await render("/docs/getting-started/updating");
  assert.equal(updating.status, 200);
  const updateGuide = await updating.text();
  const updateText = visibleText(updateGuide);
  assert.match(updateText, /red update --check/);
  assert.match(updateText, /Migrate an older standalone installation/);
  assert.match(updateText, /mode = "off"/);

  const navigation = await (await render("/docs/editor/navigation")).text();
  assert.match(navigation, /Alt-p/);
  assert.match(navigation, /F4/);
  const languages = await (await render("/docs/languages")).text();
  assert.match(languages, /format-on-save is pending/);
  assert.match(languages, /\/docs\/languages\/typescript-eslint/);

  const tsEslintResponse = await render("/docs/languages/typescript-eslint");
  assert.equal(tsEslintResponse.status, 200);
  const tsEslint = await tsEslintResponse.text();
  const tsEslintText = visibleText(tsEslint);
  assert.match(tsEslintText, /Available in Red v0\.9\.0 and later/);
  assert.match(tsEslintText, /vscode-eslint-language-server/);
  assert.match(tsEslintText, /typescript-language-server/);
  assert.match(tsEslintText, /Disable @typescript-eslint\/no-unused-vars for this line/);

  const plugins = await (await render("/docs/plugins")).text();
  assert.match(plugins, /\/docs\/plugins\/json-rpc/);

  const jsonRpcResponse = await render("/docs/plugins/json-rpc");
  assert.equal(jsonRpcResponse.status, 200);
  const jsonRpc = await jsonRpcResponse.text();
  const jsonRpcText = visibleText(jsonRpc);
  assert.match(jsonRpcText, /Available in Red v0\.9\.0 and later/);
  assert.match(jsonRpcText, /red\/DocumentSnapshot/);
  assert.match(jsonRpcText, /red\/DocumentApply/);
  assert.match(jsonRpcText, /red\/DocumentUndo/);
  assert.match(jsonRpcText, /Array\.from\(text\)\.length/);
  assert.match(jsonRpcText, /rpc-hello-node-plugin/);
});

test("syntax-highlights every documentation example without changing its text", async () => {
  const docsSource = (await Promise.all(["../app/docs/content.tsx", "../app/docs/_components/ForAgents.tsx", "../app/docs/_components/AgentDocs.tsx", "../app/docs/page.tsx"].map((path) => readFile(new URL(path, import.meta.url), "utf8")))).join("\n");
  const guidePaths = docManifest.map((page) => page.href);
  const expectedBlocks = [...docsSource.matchAll(/<CodeBlock language="([^"]+)"/g)];
  const expectedInline = [...docsSource.matchAll(/<InlineCode language="([^"]+)"/g)];
  let renderedBlocks = 0;
  let renderedInline = 0;
  let darkBlocks = 0;
  let commandFrames = 0;

  for (const path of guidePaths) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.doesNotMatch(html, /<pre(?! class="syntax-block")/, path);

    for (const match of html.matchAll(/<pre class="syntax-block" data-language="([^"]+)" data-grammar="([^"]+)"><code>([\s\S]*?)<\/code><\/pre>/g)) {
      const [, language, grammar, code] = match;
      assert.ok(visibleText(code).length > 0, `${path}: empty ${language} block`);
      if (language === "text") {
        assert.equal(grammar, "plaintext");
        assert.doesNotMatch(code, /syntax-token/);
      } else {
        // Command bars are black in both themes, so only they use the dark palette.
        assert.match(code, /class="syntax-token syntax-token-(?:theme|dark)"/);
        if (code.includes("syntax-token-dark")) darkBlocks += 1;
        assert.match(code, /--syntax-dark:/);
        assert.match(code, /--syntax-light:/);
      }
      renderedBlocks += 1;
    }
    commandFrames += html.split('class="code-frame code-frame-command"').length - 1;

    for (const match of html.matchAll(/<code class="syntax-inline" data-language="([^"]+)" data-grammar="([^"]+)">([\s\S]*?)<\/code>/g)) {
      const [, language, , code] = match;
      assert.ok(visibleText(code).length > 0, `${path}: empty ${language} inline expression`);
      assert.match(code, /class="syntax-token syntax-token-theme"/);
      assert.match(code, /--syntax-dark:/);
      assert.match(code, /--syntax-light:/);
      renderedInline += 1;
    }
  }

  assert.equal(renderedBlocks, expectedBlocks.length);
  assert.equal(darkBlocks, commandFrames);
  assert.ok(commandFrames > 0);

  const pluginGuide = await (await render("/docs/plugins/json-rpc")).text();
  assert.match(pluginGuide, /<div class="code-frame" data-title="rpc-hello-plugin\/plugin\.py"><div class="code-frame-header" data-doc-ignore="true">/);
  assert.match(pluginGuide, /<span class="code-frame-language">Python<\/span>/);
  assert.match(pluginGuide, /class="code-frame-copy"[^>]*aria-label="Copy rpc-hello-plugin\/plugin\.py"/);
  assert.equal(renderedInline, expectedInline.length);

  const installGuide = await (await render("/docs/getting-started/install")).text();
  assert.equal([...installGuide.matchAll(/<code data-language="(?:shell|powershell)">/g)].length, 3);
  assert.match(installGuide, /<code>~\/.local\/bin\/red<\/code>/);

  const huskGuide = await (await render("/docs/husk")).text();
  assert.match(huskGuide, /data-language="husk" data-grammar="rust"/);
  assert.match(huskGuide, /<code>hello\.hk<\/code>/);

  const firstSession = await (await render("/docs/getting-started/first-session")).text();
  assert.match(firstSession, /data-language="red-command" data-grammar="vimscript"/);
});

test("gives every guide section a unique id and shows version badges from the manifest", async () => {
  for (const page of docManifest.filter((entry) => entry.href !== "/docs")) {
    const html = await (await render(page.href)).text();
    const article = html.slice(html.indexOf('<div class="docs-body">'), html.indexOf('<nav class="docs-pagination"'));
    const headings = [...article.matchAll(/<h2([^>]*)>/g)].map(([, attributes]) => /id="([^"]+)"/.exec(attributes)?.[1]);
    assert.ok(headings.length > 0, page.href);
    assert.ok(headings.every(Boolean), `${page.href}: section without an id`);
    assert.equal(new Set(headings).size, headings.length, `${page.href}: duplicate section id`);
    assert.match(html, /<aside class="docs-toc-column">/, page.href);
    const badge = /<span class="docs-version" data-doc-ignore="true">Requires Red (v[\d.]+)\+<\/span>/.exec(html)?.[1];
    assert.equal(badge, page.minVersion, page.href);
  }
});

test("keeps the syntax highlighter out of browser chunks", async () => {
  const assets = new URL("../dist/client/assets/", import.meta.url);
  const chunks = (await readdir(assets)).filter((name) => name.endsWith(".js"));
  const clientJavaScript = (await Promise.all(chunks.map((name) => readFile(new URL(name, assets), "utf8")))).join("\n");
  assert.doesNotMatch(clientJavaScript, /github-dark-default|oniguruma-to-es|source\.shell/);
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
