import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, sep } from "node:path";

const assetDirectory = resolve(fileURLToPath(new URL("../../dist/client/", import.meta.url)));
let workerPromise;

/** A filesystem asset binding for built-Worker tests; runtime smoke covers the real binding. */
export const fileAssets = {
  async fetch(request) {
    const pathname = decodeURIComponent(new URL(request.url).pathname);
    const filename = resolve(assetDirectory, `.${pathname}`);
    if (!filename.startsWith(assetDirectory + sep)) return new Response(null, { status: 404 });
    let bytes;
    let info;
    try {
      [bytes, info] = await Promise.all([readFile(filename), stat(filename)]);
    } catch (error) {
      if (error.code === "ENOENT" || error.code === "EISDIR") return new Response(null, { status: 404 });
      throw error;
    }
    const etag = `"${createHash("sha256").update(bytes).digest("hex")}"`;
    const headers = new Headers({
      "Content-Type": pathname.endsWith(".md") ? "text/markdown" : "text/plain",
      "Content-Length": String(bytes.byteLength),
      ETag: etag,
      "Last-Modified": info.mtime.toUTCString(),
      Vary: "Accept-Encoding",
    });
    const match = request.headers.get("If-None-Match");
    const modifiedSince = request.headers.get("If-Modified-Since");
    const unchanged = match !== null
      ? match.split(",").some((value) => value.trim() === "*" || value.trim().replace(/^W\//, "") === etag)
      : modifiedSince !== null && Date.parse(modifiedSince) >= Math.floor(info.mtimeMs / 1000) * 1000;
    return new Response(request.method === "HEAD" || unchanged ? null : bytes, { status: unchanged ? 304 : 200, headers });
  },
};

export async function fetchBuiltWorker(path, { origin = "https://getred.dev", assets = fileAssets, ...options } = {}) {
  workerPromise ??= import(new URL("../../dist/server/index.js", import.meta.url));
  const { default: worker } = await workerPromise;
  const url = new URL(path, origin);
  const headers = new Headers(options.headers);
  headers.set("x-forwarded-host", url.host);
  headers.set("x-forwarded-proto", url.protocol.slice(0, -1));
  return worker.fetch(new Request(url, { ...options, headers }), { ASSETS: assets }, { waitUntil() {}, passThroughOnException() {} });
}
