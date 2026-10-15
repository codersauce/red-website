import { docManifest } from "../app/docs/manifest";
import { canonicalOrigin } from "../app/public-origin";

export interface DocumentationAssets {
  fetch(request: Request): Promise<Response>;
}

const markdownRoutes = new Map(docManifest.map((page) => [
  `${page.href}.md`,
  { asset: `/_generated/docs/${page.slug || "overview"}.md`, html: page.href },
]));
markdownRoutes.set("/llms.txt", { asset: "/_generated/docs/llms.txt", html: "/docs" });

function markdownError(request: Request, status: number, message: string): Response {
  return new Response(request.method === "HEAD" ? null : `# ${message}\n\nFind Red documentation in the [documentation index](${canonicalOrigin}/llms.txt).\n`, {
    status,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...(status === 405 ? { Allow: "GET, HEAD" } : {}),
    },
  });
}

function matchesEtag(condition: string | null, etag: string | null): boolean {
  if (!condition) return false;
  if (condition.trim() === "*") return true;
  if (!etag) return false;
  const current = etag.replace(/^W\//, "");
  return [...condition.matchAll(/(?:W\/)?"[^"]*"/g)].some(([candidate]) => candidate.replace(/^W\//, "") === current);
}

/** Serve generated documentation without involving the app router or a converter. */
export async function handleMarkdownRequest(request: Request, assets: DocumentationAssets): Promise<Response | null> {
  const url = new URL(request.url);
  if (!/^\/(?:docs(?:\/.*)?\.md|llms\.txt)\/?$/.test(url.pathname)) return null;

  let pathname: string;
  try {
    const segments = url.pathname.split("/").map(decodeURIComponent);
    if (segments.some((segment) => /[\\/\u0000-\u001f\u007f]/.test(segment))) {
      return markdownError(request, 404, "Documentation not found");
    }
    pathname = segments.join("/");
  } catch {
    return markdownError(request, 400, "Invalid documentation URL");
  }

  const canonicalPath = pathname.replace(/\/$/, "");
  const route = markdownRoutes.get(canonicalPath);
  if (!route) return markdownError(request, 404, "Documentation not found");
  if (request.method !== "GET" && request.method !== "HEAD") {
    return markdownError(request, 405, "Method not allowed");
  }
  if (pathname !== canonicalPath) {
    return new Response(null, { status: 308, headers: { Location: canonicalPath + url.search } });
  }

  const assetUrl = new URL(route.asset, request.url);
  const asset = await assets.fetch(new Request(assetUrl, { method: request.method, headers: request.headers }));
  // A missing generated file is a broken build, not a valid HTML fallback.
  if ((!asset.ok && ![304, 412, 416].includes(asset.status)) || /text\/html\b/i.test(asset.headers.get("Content-Type") ?? "")) {
    return markdownError(request, 503, "Documentation temporarily unavailable");
  }

  const headers = new Headers(asset.headers);
  headers.set("Content-Type", "text/markdown; charset=utf-8");
  headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Link", `<${canonicalOrigin}${route.html}>; rel="canonical"; type="text/html", <${canonicalOrigin}/llms.txt>; rel="index"; type="text/markdown"`);
  // The asset binding handles a single strong validator but not every weak/list
  // form. GET and HEAD require weak comparison for If-None-Match.
  const status = asset.ok && matchesEtag(request.headers.get("If-None-Match"), headers.get("ETag")) ? 304 : asset.status;
  if (status === 304) {
    headers.delete("Content-Length");
    headers.delete("Content-Range");
    await asset.body?.cancel();
  }
  return new Response(request.method === "HEAD" || status === 304 ? null : asset.body, {
    status,
    headers,
  });
}
