"use client";

import { useState } from "react";
import { FiCheck, FiCopy, FiFileText } from "react-icons/fi";

export default function MarkdownControls({ href }: { href: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "copied" | "error">("idle");

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
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  return <div className="docs-markdown-controls" data-doc-ignore>
    <a href={href}><FiFileText aria-hidden="true" /> View Markdown</a>
    <button type="button" onClick={copyMarkdown} disabled={status === "loading"}>
      {status === "copied" ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
      {status === "loading" ? "Copying…" : "Copy Markdown"}
    </button>
    <span role="status">
      {status === "copied" ? "Markdown copied" : status === "error" ? "Could not copy. Open View Markdown to copy the text." : ""}
    </span>
  </div>;
}
