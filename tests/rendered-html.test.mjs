import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("https://red.example/", { headers: { accept: "text/html", "x-forwarded-host": "red.example", "x-forwarded-proto": "https" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the Red website proposal", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /the modal editor.*for the agent era/i);
  assert.match(html, /brew install codersauce\/tap\/red/);
  assert.match(html, /every agent edit is a proposal/i);
  assert.match(html, /Space A/);
  assert.match(html, /:AgentReview/);
  assert.match(html, /https:\/\/red\.example\/og\.png/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("ships Red-specific preview assets and removes the starter skeleton", async () => {
  const [favicon, og] = await Promise.all([readFile(new URL("../public/favicon.svg", import.meta.url), "utf8"), readFile(new URL("../public/og.png", import.meta.url))]);
  assert.match(favicon, /#e5484d/i);
  assert.ok(og.byteLength > 100_000);
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
});
