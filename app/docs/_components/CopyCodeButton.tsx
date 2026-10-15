"use client";

import { useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";

export default function CopyCodeButton({ code, label }: { code: string; label: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    window.setTimeout(() => setStatus("idle"), 1800);
  }

  return <>
    <button type="button" className="code-frame-copy" onClick={copyCode} aria-label={`Copy ${label}`}>
      {status === "copied" ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
      {status === "copied" ? "Copied" : status === "error" ? "Select to copy" : "Copy"}
    </button>
    <span className="sr-only" role="status">{status === "copied" ? "Code copied to clipboard" : ""}</span>
  </>;
}
