import type { CSSProperties, ReactNode } from "react";
import { createHighlighterCoreSync } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import javascript from "@shikijs/langs/javascript";
import json from "@shikijs/langs/json";
import powershell from "@shikijs/langs/powershell";
import python from "@shikijs/langs/python";
import rust from "@shikijs/langs/rust";
import shellscript from "@shikijs/langs/shellscript";
import toml from "@shikijs/langs/toml";
import typescript from "@shikijs/langs/typescript";
import vimscript from "@shikijs/langs/vimscript";
import githubDark from "@shikijs/themes/github-dark-default";
import githubLight from "@shikijs/themes/github-light-default";

export type SyntaxLanguage =
  | "husk"
  | "javascript"
  | "json"
  | "powershell"
  | "python"
  | "red-command"
  | "shell"
  | "text"
  | "toml"
  | "typescript";

type SyntaxTokenStyle = CSSProperties & {
  "--syntax-dark"?: string;
  "--syntax-light"?: string;
};

const grammarByLanguage: Record<Exclude<SyntaxLanguage, "text">, string> = {
  // Husk deliberately uses the closest available grammar. Keeping the public
  // language name separate makes that approximation visible in rendered HTML.
  husk: "rust",
  javascript: "javascript",
  json: "json",
  powershell: "powershell",
  python: "python",
  "red-command": "vimscript",
  shell: "shellscript",
  toml: "toml",
  typescript: "typescript",
} as const;

const highlighter = createHighlighterCoreSync({
  engine: createJavaScriptRegexEngine(),
  langs: [javascript, json, powershell, python, rust, shellscript, toml, typescript, vimscript],
  themes: [githubDark, githubLight],
});

function tokenStyle(lightColor?: string, darkColor?: string, fontStyle = 0): SyntaxTokenStyle {
  const style: SyntaxTokenStyle = {
    "--syntax-dark": darkColor,
    "--syntax-light": lightColor,
  };

  if (fontStyle & 1) style.fontStyle = "italic";
  if (fontStyle & 2) style.fontWeight = 700;
  if (fontStyle & 4) style.textDecoration = "underline";
  return style;
}

export function SyntaxTokens({
  code,
  language,
  palette = "theme",
}: {
  code: string;
  language: SyntaxLanguage;
  palette?: "dark" | "theme";
}) {
  if (language === "text") return code;

  const grammar = grammarByLanguage[language];
  const lines = highlighter.codeToTokensWithThemes(code, {
    lang: grammar,
    themes: {
      dark: "github-dark-default",
      light: "github-light-default",
    },
  });

  return <>{lines.map((line, lineIndex) => (
    <span className="syntax-line" key={lineIndex}>
      {line.map((token) => {
        const dark = token.variants.dark;
        const light = token.variants.light;
        return (
          <span
            className={`syntax-token syntax-token-${palette}`}
            key={token.offset}
            style={tokenStyle(light.color, dark.color, dark.fontStyle)}
          >
            {token.content}
          </span>
        );
      })}
      {lineIndex < lines.length - 1 ? "\n" : null}
    </span>
  ))}</>;
}

export function CodeBlock({
  children,
  language,
}: {
  children: string;
  language: SyntaxLanguage;
}) {
  const grammar = language === "text" ? "plaintext" : grammarByLanguage[language];
  return (
    <pre className="syntax-block" data-language={language} data-grammar={grammar}>
      <code><SyntaxTokens code={children} language={language} palette="dark" /></code>
    </pre>
  );
}

export function InlineCode({
  children,
  language,
}: {
  children: string;
  language: Exclude<SyntaxLanguage, "text">;
}) {
  return (
    <code className="syntax-inline" data-language={language} data-grammar={grammarByLanguage[language]}>
      <SyntaxTokens code={children} language={language} />
    </code>
  );
}

export type HighlightedInstallCommands = Record<"homebrew" | "unix" | "windows", ReactNode>;
