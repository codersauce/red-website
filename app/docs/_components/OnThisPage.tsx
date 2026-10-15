"use client";

import { useEffect, useState } from "react";

type Heading = { id: string; text: string };

// Headings count as current once they pass just under the sticky site header.
const activationOffset = 120;

export default function OnThisPage() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = [...document.querySelectorAll<HTMLHeadingElement>(".docs-body h2[id]")];
    // eslint-disable-next-line react-hooks/set-state-in-effect -- headings come from server-rendered DOM
    setHeadings(elements.map((element) => ({ id: element.id, text: element.textContent ?? "" })));

    // Section links on hover. The article is static server output, so React never
    // re-renders these headings underneath the added anchors.
    const anchors = elements.map((element) => {
      const anchor = document.createElement("a");
      anchor.className = "heading-anchor";
      anchor.href = `#${element.id}`;
      anchor.setAttribute("aria-label", `Link to ${element.textContent}`);
      anchor.textContent = "#";
      element.append(anchor);
      return anchor;
    });

    let frame = 0;
    function update() {
      frame = 0;
      let current: string | null = elements[0]?.id ?? null;
      for (const element of elements) {
        if (element.getBoundingClientRect().top > activationOffset) break;
        current = element.id;
      }
      // At the bottom of the page the last short sections can never reach the
      // offset; treat the last heading as current there.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = elements.at(-1)?.id ?? current;
      }
      setActive(current);
    }
    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
      for (const anchor of anchors) anchor.remove();
    };
  }, []);

  if (headings.length < 2) return null;

  return <nav className="docs-toc" aria-label="On this page">
    <p>On this page</p>
    <ul>
      {headings.map((heading) => <li key={heading.id}>
        <a href={`#${heading.id}`} aria-current={active === heading.id ? "location" : undefined}>{heading.text}</a>
      </li>)}
    </ul>
  </nav>;
}
