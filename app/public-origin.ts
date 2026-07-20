export const canonicalOrigin = "https://getred.dev";

const publicHosts = new Set([
  "getred.dev",
  "rededitor.dev",
  "rededitor.app",
]);

const localHostPattern = /^(localhost|127\.0\.0\.1)(:\d+)?$/;

export function resolvePublicOrigin(requestHeaders: Headers): string {
  const forwardedHost = requestHeaders.get("x-forwarded-host");
  const host = (forwardedHost ?? requestHeaders.get("host") ?? "")
    .split(",")[0]
    .trim()
    .toLowerCase();

  if (publicHosts.has(host)) {
    return `https://${host}`;
  }

  if (localHostPattern.test(host)) {
    const forwardedProtocol = requestHeaders.get("x-forwarded-proto")
      ?.split(",")[0]
      .trim()
      .toLowerCase();
    const protocol = forwardedProtocol === "https" ? "https" : "http";
    return `${protocol}://${host}`;
  }

  return canonicalOrigin;
}
