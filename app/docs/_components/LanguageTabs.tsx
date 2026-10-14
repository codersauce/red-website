"use client";

import { type ReactNode, useId, useRef, useSyncExternalStore } from "react";

export type PluginExampleLanguage = "python" | "node";

const languageOrder: PluginExampleLanguage[] = ["python", "node"];
const languageLabels: Record<PluginExampleLanguage, string> = {
  python: "Python",
  node: "Node.js",
};

let currentLanguage: PluginExampleLanguage = "python";
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): PluginExampleLanguage {
  return currentLanguage;
}

function getServerSnapshot(): PluginExampleLanguage {
  return "python";
}

function setLanguage(next: PluginExampleLanguage) {
  if (currentLanguage === next) return;
  currentLanguage = next;
  for (const listener of listeners) {
    listener();
  }
}

export default function LanguageTabs({
  python,
  node,
  label = "Plugin implementation language",
}: {
  python: ReactNode;
  node: ReactNode;
  label?: string;
}) {
  const selected = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const tabList = useRef<HTMLDivElement>(null);
  const id = useId().replaceAll(":", "");
  const panels: Record<PluginExampleLanguage, ReactNode> = { python, node };

  function moveSelection(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const currentIndex = languageOrder.indexOf(selected);
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? languageOrder.length - 1
        : (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + languageOrder.length) % languageOrder.length;
    const nextLanguage = languageOrder[nextIndex];
    setLanguage(nextLanguage);
    tabList.current?.querySelector<HTMLButtonElement>(`[data-language="${nextLanguage}"]`)?.focus();
  }

  return <>
    <div
      className="install-selector"
      role="tablist"
      aria-label={label}
      onKeyDown={moveSelection}
      ref={tabList}
    >
      {languageOrder.map((language) => <button
        className={selected === language ? "active" : ""}
        type="button"
        role="tab"
        aria-selected={selected === language}
        aria-controls={`${id}-${language}-panel`}
        data-language={language}
        id={`${id}-${language}-tab`}
        tabIndex={selected === language ? 0 : -1}
        onClick={() => setLanguage(language)}
        key={language}
      >{languageLabels[language]}</button>)}
    </div>
    {languageOrder.map((language) => <div
      id={`${id}-${language}-panel`}
      role="tabpanel"
      aria-labelledby={`${id}-${language}-tab`}
      data-doc-label={languageLabels[language]}
      tabIndex={selected === language ? 0 : -1}
      hidden={selected !== language}
      key={language}
    >
      {panels[language]}
    </div>)}
  </>;
}
