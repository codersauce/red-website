export const installMethods = {
  homebrew: {
    label: "Homebrew",
    command: "brew install codersauce/tap/red",
    aria: "Copy Homebrew install command",
  },
  unix: {
    label: "macOS + Linux",
    command: "curl --proto '=https' --tlsv1.2 -fsSL https://getred.dev/install.sh | sh",
    aria: "Copy macOS and Linux install command",
  },
  windows: {
    label: "Windows",
    command: "irm https://getred.dev/install.ps1 | iex",
    aria: "Copy Windows PowerShell install command",
  },
} as const;

export type InstallMethod = keyof typeof installMethods;
