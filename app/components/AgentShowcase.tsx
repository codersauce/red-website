"use client";

import Image from "next/image";
import { useState } from "react";

const views = [
  {
    label: "Space A — ask",
    image: "/ask-agent-dark.png",
    alt: "Asking the Codex agent a question from inside Red",
  },
  {
    label: "the agent answers",
    image: "/agent-pane-dark.png",
    alt: "Reading the Codex agent response inside Red",
  },
] as const;

export default function AgentShowcase() {
  const [selected, setSelected] = useState(0);
  return <div className="agent-showcase">
    <div role="tablist" aria-label="Agent workflow previews">
      {views.map((view, index) => <button
        type="button"
        role="tab"
        aria-selected={selected === index}
        className={selected === index ? "active" : ""}
        onClick={() => setSelected(index)}
        key={view.label}
      >{view.label}</button>)}
    </div>
    <figure role="tabpanel">
      <Image
        src={views[selected].image}
        width={1880}
        height={1500}
        alt={views[selected].alt}
        unoptimized
      />
    </figure>
  </div>;
}
