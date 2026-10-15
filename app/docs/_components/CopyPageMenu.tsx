"use client";

import { useEffect, useRef, useState } from "react";
import { FiCheck, FiChevronDown, FiCopy, FiExternalLink, FiFileText, FiLink } from "react-icons/fi";
import { canonicalOrigin } from "../../public-origin";

// Chat links are a convenience over undocumented query parameters. Drop an
// entry here if its provider stops honoring the prompt.
const chatLinks = [
  { label: "Open in ChatGPT", url: (prompt: string) => `https://chatgpt.com/?q=${encodeURIComponent(prompt)}` },
  { label: "Open in Claude", url: (prompt: string) => `https://claude.ai/new?q=${encodeURIComponent(prompt)}` },
];

type Status = "idle" | "loading" | "copied" | "url-copied" | "error";

export default function CopyPageMenu({ href }: { href: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const menu = useRef<HTMLDetailsElement>(null);
  const markdownUrl = `${canonicalOrigin}${href}`;
  const prompt = `Read ${markdownUrl} so I can ask you questions about this page of the Red editor documentation.`;

  useEffect(() => {
    function close(event: Event) {
      const details = menu.current;
      if (!details?.open) return;
      if (event instanceof KeyboardEvent) {
        if (event.key !== "Escape") return;
        details.open = false;
        details.querySelector("summary")?.focus();
      } else if (!details.contains(event.target as Node)) {
        details.open = false;
      }
    }
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, []);

  function settle(next: Status) {
    setStatus(next);
    if (next !== "error") window.setTimeout(() => setStatus("idle"), 1800);
  }

  async function copyMarkdown() {
    setStatus("loading");
    try {
      const markdown = fetch(href).then(async (response) => {
        if (!response.ok || !response.headers.get("content-type")?.startsWith("text/markdown")) {
          throw new Error("Markdown export unavailable");
        }
        return response.text();
      });
      if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
        // Start the clipboard write during the click gesture, including in Safari.
        await navigator.clipboard.write([new ClipboardItem({
          "text/plain": markdown.then((text) => new Blob([text], { type: "text/plain" })),
        })]);
      } else {
        await navigator.clipboard.writeText(await markdown);
      }
      settle("copied");
    } catch {
      settle("error");
    }
  }

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(markdownUrl);
      settle("url-copied");
    } catch {
      settle("error");
    }
    if (menu.current) menu.current.open = false;
  }

  return <div className="docs-markdown-controls copy-page" data-doc-ignore>
    <button className="copy-page-main" type="button" onClick={copyMarkdown} disabled={status === "loading"}>
      {status === "copied" || status === "url-copied" ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
      {status === "loading" ? "Copying…" : status === "copied" ? "Copied" : status === "url-copied" ? "URL copied" : "Copy page"}
    </button>
    <details className="copy-page-more" ref={menu}>
      <summary aria-label="More ways to use this page"><FiChevronDown aria-hidden="true" /></summary>
      <div className="copy-page-menu">
        <a href={href}>
          <FiFileText aria-hidden="true" />
          <span>View as Markdown<small>{href}</small></span>
        </a>
        <button type="button" onClick={copyUrl}>
          <FiLink aria-hidden="true" />
          <span>Copy Markdown URL<small>For agents that fetch pages</small></span>
        </button>
        <hr />
        {chatLinks.map((link) => <a href={link.url(prompt)} target="_blank" rel="noreferrer" key={link.label}>
          <FiExternalLink aria-hidden="true" />
          <span>{link.label}<small>Starts a chat that reads this page</small></span>
        </a>)}
      </div>
    </details>
    <span className="copy-page-status" role="status">
      {status === "error" ? "Could not copy. Open View as Markdown to copy the text." : status === "copied" ? <span className="sr-only">Markdown copied</span> : ""}
    </span>
  </div>;
}
