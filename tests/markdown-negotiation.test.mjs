import assert from "node:assert/strict";
import test from "node:test";
import { docManifest } from "../app/docs/manifest.ts";
import { fetchBuiltWorker, fileAssets } from "./helpers/built-worker.mjs";

const page = "/docs/plugins/json-rpc";
const html = "text/html; charset=utf-8";
const markdown = "text/markdown; charset=utf-8";
const noStore = "no-store, must-revalidate";

function assertVariantHeaders(response, contentType) {
  assert.equal(response.headers.get("Content-Type"), contentType);
  assert.equal(response.headers.get("Cache-Control"), noStore);
  const vary = response.headers.get("Vary").toLowerCase().split(/,\s*/);
  for (const name of ["accept", "rsc", "next-router-state-tree", "next-router-prefetch", "next-router-segment-prefetch", "next-url", "next-hmr-refresh", "x-vinext-interception-context", "x-vinext-mounted-slots", "x-vinext-rsc-render-mode", "x-rsc-action", "next-action"]) {
    assert.ok(vary.includes(name), name);
  }
  assert.equal(vary.length, new Set(vary).size);
}

test("negotiates the exact export for every known documentation page", async () => {
  for (const { href } of docManifest) {
    const explicit = await fetchBuiltWorker(`${href}.md`);
    const negotiated = await fetchBuiltWorker(href, { headers: { Accept: "text/markdown" } });
    assert.equal(negotiated.status, 200, href);
    assertVariantHeaders(negotiated, markdown);
    assert.equal(negotiated.headers.get("ETag"), explicit.headers.get("ETag"));
    assert.equal(await negotiated.text(), await explicit.text(), href);
    assert.equal(explicit.headers.get("Cache-Control"), "public, max-age=0, must-revalidate");
  }
});

test("respects Accept quality, specificity, exclusions, parameters, and explicit tie order", async () => {
  const cases = [
    [undefined, html],
    ["*/*", html],
    ["text/*", html],
    ["text/*;q=0.8, */*;q=0.8", html],
    ["text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", html],
    ["text/markdown;q=0.5,text/html;q=1", html],
    ["text/html;q=0.5,text/markdown;q=1", markdown],
    ["text/markdown;q=0,text/*;q=1", html],
    ["text/html;q=0,*/*;q=1", markdown],
    ["text/*;q=1,text/markdown;q=0.5", html],
    ["text/markdown,*/*", markdown],
    ["text/markdown,text/html", markdown],
    ["text/html,text/markdown", html],
    ["TEXT/MARKDOWN; q=0.9, text/html; q=0.8", markdown],
    ["text/x-component;q=0,text/markdown", markdown],
    ["text/markdown; charset=utf-8", markdown],
    ["text/markdown; charset=iso-8859-1", null],
    ["application/json", null],
    ["text/html;q=0,text/markdown;q=0,*/*;q=0.8", null],
    ["*/*;q=0", null],
    ["", null],
  ];
  for (const [accept, expected] of cases) {
    const response = await fetchBuiltWorker("/docs", { headers: accept === undefined ? {} : { Accept: accept } });
    assert.equal(response.status, expected ? 200 : 406, `Accept: ${accept}`);
    assertVariantHeaders(response, expected ?? "text/plain; charset=utf-8");
    const body = await response.text();
    if (expected === html) assert.match(body, /<!DOCTYPE html>/i);
    if (expected === null) assert.match(body, /https:\/\/getred\.dev\/docs\.md/);
  }
});

test("preserves Markdown validators on GET/HEAD/304 without using them for HTML", async () => {
  const explicit = await fetchBuiltWorker(`${page}.md`);
  const etag = explicit.headers.get("ETag");
  for (const method of ["GET", "HEAD"]) {
    for (const condition of [etag, `"another", W/${etag}`, "*"]) {
      const response = await fetchBuiltWorker(page, { method, headers: { Accept: "text/markdown", "If-None-Match": condition } });
      assert.equal(response.status, 304);
      assertVariantHeaders(response, markdown);
      assert.equal(response.headers.get("ETag"), etag);
      assert.equal(await response.text(), "");
    }
  }
  for (const accept of ["text/html", "text/markdown", "application/json"]) {
    const response = await fetchBuiltWorker(page, { method: "HEAD", headers: { Accept: accept, "If-None-Match": '"different"' } });
    assert.equal(response.status, accept === "application/json" ? 406 : 200);
    assert.equal(await response.text(), "");
    assertVariantHeaders(response, accept === "application/json" ? "text/plain; charset=utf-8" : accept === "text/html" ? html : markdown);
  }
  const htmlResponse = await fetchBuiltWorker(page, { headers: { Accept: "text/html", "If-None-Match": etag } });
  assert.equal(htmlResponse.status, 200);
  assertVariantHeaders(htmlResponse, html);
  assert.notEqual(htmlResponse.headers.get("ETag"), etag);
  assert.match(await htmlResponse.text(), /<!DOCTYPE html>/i);
});

test("canonicalizes known trailing-slash documentation URLs before negotiating", async () => {
  for (const accept of ["text/html", "text/markdown", "application/json"]) {
    const response = await fetchBuiltWorker(`${page}/?download=1`, { headers: { Accept: accept } });
    assert.equal(response.status, 308);
    assert.equal(response.headers.get("Location"), `${page}?download=1`);
    assert.equal(response.headers.get("Cache-Control"), noStore);
    assert.match(response.headers.get("Vary"), /Accept/);
    assert.equal(await response.text(), "");
  }
});

test("leaves framework requests, unrelated routes, and explicit exports outside negotiation", async () => {
  for (const name of ["RSC", "Next-Router-State-Tree", "Next-Router-Prefetch", "Next-Router-Segment-Prefetch", "Next-Url", "Next-Hmr-Refresh", "X-Vinext-Interception-Context", "X-Vinext-Mounted-Slots", "X-Vinext-Rsc-Render-Mode", "X-Rsc-Action", "Next-Action"]) {
    const response = await fetchBuiltWorker("/docs", { headers: { Accept: "text/markdown", [name]: "1" } });
    assert.notEqual(response.headers.get("Content-Type"), markdown, name);
    assert.equal(response.headers.get("Cache-Control"), noStore);
    await response.body?.cancel();
  }
  for (const path of ["/docs?_rsc", "/docs?%5Frsc=abc"]) {
    const response = await fetchBuiltWorker(path, { headers: { Accept: "text/markdown" } });
    assertVariantHeaders(response, html);
    await response.body?.cancel();
  }
  const flight = await fetchBuiltWorker("/docs.rsc", { headers: { Accept: "text/markdown", RSC: "1" } });
  assert.match(flight.headers.get("Content-Type"), /^text\/x-component/);
  await flight.body?.cancel();
  const frameworkAccept = await fetchBuiltWorker("/docs", { headers: { Accept: "text/x-component, text/markdown" } });
  assertVariantHeaders(frameworkAccept, html);
  await frameworkAccept.body?.cancel();
  for (const path of ["/", "/releases", "/docs/missing", "/assets/missing.js"]) {
    const response = await fetchBuiltWorker(path, { headers: { Accept: "text/markdown" } });
    assert.notEqual(response.headers.get("Content-Type"), markdown, path);
    await response.body?.cancel();
  }
  const explicit = await fetchBuiltWorker("/docs.md", { headers: { Accept: "application/json" } });
  assert.equal(explicit.status, 200);
  assert.equal(explicit.headers.get("Content-Type"), markdown);
  const post = await fetchBuiltWorker("/docs", { method: "POST", headers: { Accept: "text/markdown" } });
  assert.notEqual(post.headers.get("Content-Type"), markdown);
  await post.body?.cancel();
});

test("preserves existing Vary dimensions and isolates alternating representations", async () => {
  const assets = {
    async fetch(request) {
      const response = await fileAssets.fetch(request);
      response.headers.set("Vary", "Accept-Encoding, X-Test, accept");
      return response;
    },
  };
  const response = await fetchBuiltWorker(page, { assets, headers: { Accept: "text/markdown" } });
  assertVariantHeaders(response, markdown);
  assert.match(response.headers.get("Vary"), /Accept-Encoding, X-Test, accept/);
  const wildcardAssets = { async fetch(request) { const response = await fileAssets.fetch(request); response.headers.set("Vary", "*"); return response; } };
  const wildcard = await fetchBuiltWorker(page, { assets: wildcardAssets, headers: { Accept: "text/markdown" } });
  assert.equal(wildcard.headers.get("Vary"), "*");
  for (const accept of ["text/html", "text/markdown", "text/html", "text/markdown"]) {
    const response = await fetchBuiltWorker("/docs", { headers: { Accept: accept } });
    assertVariantHeaders(response, accept === "text/html" ? html : markdown);
    const body = await response.text();
    assert.equal(/<!DOCTYPE html>/i.test(body), accept === "text/html");
  }
});
