"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const previews = [
  {
    key: "Ctrl-p",
    label: "Find files",
    image: "/find-files-dark.png",
    alt: "Red fuzzy file finder with a live file preview",
    caption: "Fuzzy-find project files and preview them before opening.",
  },
  {
    key: "Space /",
    label: "Find in files",
    image: "/grep-dark.png",
    alt: "Red project-wide search showing highlighted matches",
    caption: "Search across the project with live, highlighted matches.",
  },
  {
    key: "Space ?",
    label: "Commands",
    image: "/palette-dark.png",
    alt: "Red command palette listing commands and their shortcuts",
    caption: "Discover commands, keybindings, and ex forms in one searchable place.",
  },
  {
    key: "Space t",
    label: "Themes",
    image: "/themes-dark.png",
    alt: "Red theme picker previewing the selected theme",
    caption: "Preview the bundled theme gallery without restarting the editor.",
  },
  {
    key: "K",
    label: "LSP hover",
    image: "/lsp-dialog-dark.png",
    alt: "Red showing language-server hover documentation",
    caption: "Read hover documentation and language intelligence where you are working.",
  },
] as const;

export default function ProductShowcase() {
  const [selected, setSelected] = useState(0);
  const tabList = useRef<HTMLDivElement>(null);
  const preview = previews[selected];

  function select(index: number) {
    setSelected(index);
    tabList.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[index]?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home"
      ? 0
      : event.key === "End"
        ? previews.length - 1
        : (selected + (event.key === "ArrowRight" ? 1 : -1) + previews.length) % previews.length;
    select(next);
  }

  return <div className="showcase">
    <div
      className="showcase-tabs"
      role="tablist"
      aria-label="Red editor features"
      onKeyDown={onKeyDown}
      ref={tabList}
    >
      {previews.map((item, index) => <button
        type="button"
        role="tab"
        id={`showcase-tab-${index}`}
        aria-controls="showcase-panel"
        aria-selected={selected === index}
        tabIndex={selected === index ? 0 : -1}
        className={selected === index ? "active" : ""}
        onClick={() => setSelected(index)}
        key={item.label}
      >
        <kbd>{item.key}</kbd>{item.label}
      </button>)}
    </div>
    <figure
      id="showcase-panel"
      role="tabpanel"
      aria-labelledby={`showcase-tab-${selected}`}
      tabIndex={0}
    >
      <Image src={preview.image} width={2104} height={1724} alt={preview.alt} unoptimized />
      <figcaption>{preview.caption}</figcaption>
    </figure>
  </div>;
}
