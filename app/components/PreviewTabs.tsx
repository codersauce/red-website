"use client";

import { useState, type KeyboardEvent } from "react";
import Image from "next/image";

const previewOrder = ["edit", "find", "commands", "agent", "git", "splash"] as const;
type Preview = (typeof previewOrder)[number];

const previews: Record<Preview, { label: string; title: string; image: string; alt: string; note: string }> = {
  edit: {
    label: "Edit",
    title: "Rendering pipeline",
    image: "/ghostty-code.jpg",
    alt: "Red editing its Rust rendering pipeline with the project tree open",
    note: "src/editor/rendering.rs · Rust · tree-sitter",
  },
  find: {
    label: "Files",
    title: "Find source files",
    image: "/ghostty-picker-demo.jpg",
    alt: "Red file picker filtering its own rendering and buffer source files",
    note: "Ctrl-p · fuzzy files · live preview",
  },
  commands: {
    label: "Commands",
    title: "Discover Git actions",
    image: "/ghostty-commands-demo.jpg",
    alt: "Red command palette showing Git hunk navigation, stage, reset, and unstage actions",
    note: "Space ? · 74 commands · shortcuts included",
  },
  agent: {
    label: "Agent",
    title: "Ask with context",
    image: "/ghostty-agent.jpg",
    alt: "Red agent prompt asking about tree-sitter injections over the editor highlighter source",
    note: "Space A · source-aware prompt",
  },
  git: {
    label: "Git review",
    title: "Review a real diff",
    image: "/ghostty-git-workspace.jpg",
    alt: "Red Git workspace reviewing an unstaged change to its rendering pipeline",
    note: "Space G · unstaged rendering diff",
  },
  splash: {
    label: "Welcome",
    title: "Start from blank",
    image: "/ghostty-splash.jpg",
    alt: "Red blank-state splash screen showing its logo, startup shortcuts, and agent safety message",
    note: "empty buffer · branded splash",
  },
};

export default function PreviewTabs() {
  const [preview, setPreview] = useState<Preview>("commands");

  function handlePreviewKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % previewOrder.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + previewOrder.length) % previewOrder.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = previewOrder.length - 1;
    else return;

    event.preventDefault();
    setPreview(previewOrder[next]);
    document.getElementById(`preview-tab-${previewOrder[next]}`)?.focus();
  }

  const active = previews[preview];

  return <section className="preview-wrap shell" id="editor" aria-label="Real editor previews">
    <header className="preview-head">
      <div className="preview-title"><span className="preview-dot" /><span>{active.title}</span></div>
      <div className="preview-tabs" role="tablist" aria-label="Editor previews">
        {previewOrder.map((key, index) => <button
          className={preview === key ? "active" : ""}
          id={`preview-tab-${key}`}
          role="tab"
          aria-selected={preview === key}
          aria-controls="preview-panel"
          tabIndex={preview === key ? 0 : -1}
          onClick={() => setPreview(key)}
          onKeyDown={(event) => handlePreviewKey(event, index)}
          key={key}
        >{previews[key].label}</button>)}
      </div>
      <span className="preview-file">real editor · Ghostty</span>
    </header>
    <figure className="live-shot" id="preview-panel" role="tabpanel" aria-labelledby={`preview-tab-${preview}`} tabIndex={0}>
      <Image src={active.image} width={1208} height={704} alt={active.alt} unoptimized />
      <figcaption><span>Red source capture</span><span>{active.note}</span></figcaption>
    </figure>
  </section>;
}
