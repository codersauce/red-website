import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";
import { fetchBuiltWorker, fileAssets } from "./helpers/built-worker.mjs";

const exportDirectory = new URL("../dist/client/_generated/docs/", import.meta.url);
const markdownType = "text/markdown; charset=utf-8";

test("serves every generated document and the discovery index through public URLs", async () => {
  const files = (await readdir(exportDirectory, { recursive: true })).filter((name) => name.endsWith(".md"));
  assert.ok(files.includes("overview.md"));
  assert.ok(files.includes("for-agents.md"));
  for (const file of [...files, "llms.txt", "llms-full.txt"]) {
    const path = file === "overview.md" ? "/docs.md" : file.startsWith("llms") ? `/${file}` : `/docs/${file}`;
    const response = await fetchBuiltWorker(path);
    assert.equal(response.status, 200, path);
    assert.equal(response.headers.get("Content-Type"), markdownType, path);
    assert.equal(response.headers.get("Cache-Control"), "public, max-age=0, must-revalidate", path);
    assert.match(response.headers.get("ETag") ?? "", /^"[^\"]+"$/);
    assert.equal(await response.text(), await readFile(new URL(file, exportDirectory), "utf8"), path);
  }
});

test("the complete export contains every generated guide exactly once", async () => {
  const full = await (await fetchBuiltWorker("/llms-full.txt")).text();
  const files = (await readdir(exportDirectory, { recursive: true })).filter((name) => name.endsWith(".md"));
  for (const file of files) {
    const guide = (await readFile(new URL(file, exportDirectory), "utf8")).trimEnd();
    assert.equal(full.split(guide).length - 1, 1, file);
  }
});

test("canonicalizes known trailing-slash URLs while preserving queries", async () => {
  for (const path of ["/docs.md", "/docs/plugins/json-rpc.md", "/llms.txt", "/llms-full.txt"]) {
    const response = await fetchBuiltWorker(`${path}/?download=1`);
    assert.equal(response.status, 308);
    assert.equal(response.headers.get("Location"), `${path}?download=1`);
    assert.equal(await response.text(), "");
  }
  assert.equal((await fetchBuiltWorker("/docs/%70lugins/json-rpc.md")).status, 200);
});

test("uses Markdown errors for unknown, malformed, and unsupported export requests", async () => {
  for (const path of ["/docs/missing.md", "/docs/missing.md/", "/docs/index.md", "/docs/plugins%2fjson-rpc.md"]) {
    const response = await fetchBuiltWorker(path);
    assert.equal(response.status, 404, path);
    assert.equal(response.headers.get("Content-Type"), markdownType);
    assert.match(await response.text(), /https:\/\/getred\.dev\/llms\.txt/);
  }
  const malformed = await fetchBuiltWorker("/docs/%E0%A4%A.md");
  assert.equal(malformed.status, 400);
  assert.equal(malformed.headers.get("Content-Type"), markdownType);
  const unsupported = await fetchBuiltWorker("/docs.md", { method: "POST", body: "ignored" });
  assert.equal(unsupported.status, 405);
  assert.equal(unsupported.headers.get("Allow"), "GET, HEAD");
});

test("preserves asset validators and conditional requests with bodyless HEAD responses", async () => {
  const path = "/docs/plugins/json-rpc.md";
  const initial = await fetchBuiltWorker(path);
  const etag = initial.headers.get("ETag");
  const lastModified = initial.headers.get("Last-Modified");
  const head = await fetchBuiltWorker(path, { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), "");
  for (const header of ["Content-Type", "ETag", "Last-Modified", "Content-Length", "Cache-Control", "Vary"]) {
    assert.equal(head.headers.get(header), initial.headers.get(header), header);
  }
  for (const headers of [
    { "If-None-Match": etag },
    { "If-None-Match": `"another", W/${etag}` },
    { "If-None-Match": "*" },
    { "If-Modified-Since": lastModified },
  ]) {
    const response = await fetchBuiltWorker(path, { headers });
    assert.equal(response.status, 304);
    assert.equal(await response.text(), "");
    assert.equal(response.headers.get("ETag"), etag);
    assert.equal(response.headers.get("Content-Type"), markdownType);
    assert.equal(response.headers.get("Vary"), "Accept-Encoding");
  }
  const changed = await fetchBuiltWorker(path, { headers: { "If-None-Match": '"another"', "If-Modified-Since": lastModified } });
  assert.equal(changed.status, 200);
  assert.ok((await changed.text()).length > 0);
  const missing = await fetchBuiltWorker("/docs/missing.md", { method: "HEAD" });
  assert.equal(missing.status, 404);
  assert.equal(await missing.text(), "");
});

test("fetches fixed backing assets and rejects missing files or HTML fallbacks", async () => {
  const fetched = [];
  const assets = { async fetch(request) { fetched.push(request); return fileAssets.fetch(request); } };
  const response = await fetchBuiltWorker("/docs/plugins/json-rpc.md?download=1", { assets, headers: { "If-None-Match": '"old"' } });
  assert.equal(response.status, 200);
  assert.equal(new URL(fetched[0].url).pathname, "/_generated/docs/plugins/json-rpc.md");
  assert.equal(new URL(fetched[0].url).search, "");
  assert.equal(fetched[0].headers.get("If-None-Match"), '"old"');
  for (const assets of [
    { async fetch() { return new Response("missing", { status: 404 }); } },
    { async fetch() { return new Response("<html>fallback</html>", { headers: { "Content-Type": "text/html" } }); } },
  ]) {
    const unavailable = await fetchBuiltWorker("/docs.md", { assets });
    assert.equal(unavailable.status, 503);
    assert.equal(unavailable.headers.get("Cache-Control"), "no-store");
    assert.doesNotMatch(await unavailable.text(), /<html>/);
  }
});

test("supports weak/list and wildcard validators even when the asset binding ignores them", async () => {
  const assets = { async fetch(request) { return fileAssets.fetch(new Request(request.url)); } };
  const path = "/docs/plugins/json-rpc.md";
  const etag = (await fetchBuiltWorker(path, { assets })).headers.get("ETag");
  for (const method of ["GET", "HEAD"]) {
    for (const condition of [`W/${etag}`, `"another", W/${etag}`, "*"]) {
      const response = await fetchBuiltWorker(path, { method, assets, headers: { "If-None-Match": condition } });
      assert.equal(response.status, 304, `${method}: ${condition}`);
      assert.equal(response.headers.get("ETag"), etag);
      assert.equal(response.headers.get("Content-Length"), null);
      assert.equal(await response.text(), "");
    }
  }
});

test("keeps explicit exports canonical across public host aliases", async () => {
  const expected = await (await fetchBuiltWorker("/docs.md")).text();
  for (const host of ["getrededitor.com", "rededitor.dev", "rededitor.app", "red-editor.fcoury.chatgpt.site", "attacker.example"]) {
    const response = await fetchBuiltWorker("/docs.md", { origin: `https://${host}` });
    assert.equal(await response.text(), expected);
    assert.match(response.headers.get("Link") ?? "", /<https:\/\/getred\.dev\/docs>; rel="canonical"/);
  }
});
