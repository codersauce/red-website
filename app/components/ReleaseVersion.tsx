"use client";

import { useEffect, useState } from "react";

const latestReleaseUrl = "https://api.github.com/repos/codersauce/red/releases/latest";
const releasePattern = /^v\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;

export default function ReleaseVersion({ fallback }: { fallback: string }) {
  const [version, setVersion] = useState(fallback);

  useEffect(() => {
    const controller = new AbortController();

    void fetch(latestReleaseUrl, {
      headers: { Accept: "application/vnd.github+json" },
      signal: controller.signal,
    })
      .then((response) => response.ok ? response.json() : null)
      .then((release: { tag_name?: unknown } | null) => {
        if (typeof release?.tag_name === "string" && releasePattern.test(release.tag_name)) {
          setVersion(release.tag_name);
        }
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, []);

  return <span aria-live="polite">{version}</span>;
}
