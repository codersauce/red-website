"use client";

import { useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  detectInstallMethod,
  installMethods,
  type InstallMethod,
} from "../install-methods";

const methodOrder: InstallMethod[] = ["homebrew", "unix", "windows"];
const subscribeToPlatform = () => () => {};

function detectedMethod(): InstallMethod {
  const platform = (
    (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ??
    navigator.platform ??
    ""
  );
  return detectInstallMethod(platform, navigator.userAgent) ?? "homebrew";
}

export default function InstallPicker({
  origin,
  wide = false,
}: {
  origin: string;
  wide?: boolean;
}) {
  const detected = useSyncExternalStore(subscribeToPlatform, detectedMethod, () => "homebrew");
  const [selectedMethod, setSelectedMethod] = useState<InstallMethod | null>(null);
  const [copied, setCopied] = useState(false);
  const methods = useMemo(() => installMethods(origin), [origin]);
  const tabList = useRef<HTMLDivElement>(null);
  const id = useId().replaceAll(":", "");
  const installMethod = selectedMethod ?? detected;

  async function copyInstall(method: InstallMethod) {
    try {
      await navigator.clipboard.writeText(methods[method].command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  function selectMethod(method: InstallMethod) {
    setSelectedMethod(method);
    setCopied(false);
  }

  function moveSelection(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const currentIndex = methodOrder.indexOf(installMethod);
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? methodOrder.length - 1
        : (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + methodOrder.length) % methodOrder.length;
    const nextMethod = methodOrder[nextIndex];
    selectMethod(nextMethod);
    tabList.current?.querySelector<HTMLButtonElement>(`[data-method="${nextMethod}"]`)?.focus();
  }

  return <>
    <div
      className="install-selector"
      role="tablist"
      aria-label="Installation method"
      onKeyDown={moveSelection}
      ref={tabList}
    >
      {methodOrder.map((method) => <button
        className={installMethod === method ? "active" : ""}
        type="button"
        role="tab"
        aria-selected={installMethod === method}
        aria-controls={`${id}-${method}-panel`}
        data-method={method}
        id={`${id}-${method}-tab`}
        tabIndex={installMethod === method ? 0 : -1}
        onClick={() => selectMethod(method)}
        key={method}
      >{methods[method].label}</button>)}
    </div>
    {methodOrder.map((method) => <div
      className={wide ? "install-command wide" : "install-command"}
      id={`${id}-${method}-panel`}
      role="tabpanel"
      aria-labelledby={`${id}-${method}-tab`}
      tabIndex={installMethod === method ? 0 : -1}
      hidden={installMethod !== method}
      key={method}
    >
      <span className="prompt" aria-hidden="true">$</span>
      <code>{methods[method].command}</code>
      <button type="button" className="copy" onClick={() => copyInstall(method)} aria-label={methods[method].aria}>
        {copied && installMethod === method ? "copied" : "copy"}
      </button>
    </div>)}
    <span className="sr-only" role="status">{copied ? "Install command copied to clipboard" : ""}</span>
  </>;
}
