import InstallPicker from "../../components/InstallPicker";
import { installMethods } from "../../install-methods";
import { SyntaxTokens, type HighlightedInstallCommands } from "./Code";

export default function HighlightedInstallPicker({ origin, wide = false }: { origin: string; wide?: boolean }) {
  const methods = installMethods(origin);
  const highlightedCommands: HighlightedInstallCommands = {
    homebrew: <SyntaxTokens code={methods.homebrew.command} language="shell" palette="dark" />,
    unix: <SyntaxTokens code={methods.unix.command} language="shell" palette="dark" />,
    windows: <SyntaxTokens code={methods.windows.command} language="powershell" palette="dark" />,
  };

  return <InstallPicker highlightedCommands={highlightedCommands} origin={origin} wide={wide} />;
}
