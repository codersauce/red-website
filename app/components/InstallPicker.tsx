"use client";

import { useEffect, useState } from "react";
import { installMethods, type InstallMethod } from "../install-methods";

export default function InstallPicker({ wide = false }: { wide?: boolean }) {
  const [installMethod, setInstallMethod] = useState<InstallMethod>("homebrew");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const platform = (
      (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ??
      navigator.platform ??
      ""
    ).toLowerCase();
    const detected = platform.includes("win") ? "windows" : platform.includes("linux") ? "unix" : null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR must render the Homebrew default; the visitor's OS is only knowable after hydration
    if (detected) setInstallMethod(detected);
  }, []);

  const active = installMethods[installMethod];

  async function copyInstall() {
    try {
      await navigator.clipboard.writeText(active.command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return <>
    <div className="install-selector" role="tablist" aria-label="Installation method">
      {(Object.keys(installMethods) as InstallMethod[]).map((method) => <button
        className={installMethod === method ? "active" : ""}
        type="button"
        role="tab"
        aria-selected={installMethod === method}
        onClick={() => {
          setInstallMethod(method);
          setCopied(false);
        }}
        key={method}
      >{installMethods[method].label}</button>)}
    </div>
    <button className={wide ? "install wide" : "install"} onClick={copyInstall} aria-label={active.aria}><span className="prompt">$</span><code>{active.command}</code><span className="copy">{copied ? "copied" : "copy"}</span></button>
    <span className="sr-only" role="status">{copied ? "Install command copied to clipboard" : ""}</span>
  </>;
}
