export type InstallMethod = "homebrew" | "unix" | "windows";

export interface InstallMethodDetails {
  label: string;
  command: string;
  aria: string;
}

export function installMethods(origin: string): Record<InstallMethod, InstallMethodDetails> {
  return {
    homebrew: {
      label: "Homebrew",
      command: "brew install codersauce/tap/red",
      aria: "Copy Homebrew install command",
    },
    unix: {
      label: "macOS + Linux",
      command: `curl --proto '=https' --tlsv1.2 -fsSL ${origin}/install.sh | sh`,
      aria: "Copy macOS and Linux install command",
    },
    windows: {
      label: "Windows",
      command: `irm ${origin}/install.ps1 | iex`,
      aria: "Copy Windows PowerShell install command",
    },
  };
}

export function detectInstallMethod(platform: string, userAgent = ""): InstallMethod | null {
  const signature = `${platform} ${userAgent}`.toLowerCase();
  if (signature.includes("iphone") || signature.includes("ipad") || signature.includes("android")) {
    return null;
  }
  if (signature.includes("win")) return "windows";
  if (signature.includes("mac")) return "unix";
  if (signature.includes("linux")) return "unix";
  return null;
}
