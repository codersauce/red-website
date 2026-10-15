import type { CSSProperties, ReactNode } from "react";
import { linesText, tokenize, type TokenLine } from "./highlight";
import CopyCodeButton from "./CopyCodeButton";

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

const languageLabels: Record<SyntaxLanguage, string> = {
  husk: "Husk",
  javascript: "JavaScript",
  json: "JSON",
  powershell: "PowerShell",
  python: "Python",
  "red-command": "Red command",
  shell: "Shell",
  text: "Text",
  toml: "TOML",
  typescript: "TypeScript",
};

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
  tokens,
}: {
  code: string;
  language: SyntaxLanguage;
  palette?: "dark" | "theme";
  /** Lines highlighted at build time; otherwise the code is highlighted here. */
  tokens?: TokenLine[];
}) {
  if (language === "text") return code;

  const lines = tokens ?? tokenize(code, grammarByLanguage[language]);
  return <>{lines.map((line, lineIndex) => (
    <span className="syntax-line" key={lineIndex}>
      {line.map(([content, light, dark, fontStyle], tokenIndex) => (
        <span
          className={`syntax-token syntax-token-${palette}`}
          key={tokenIndex}
          style={tokenStyle(light || undefined, dark || undefined, fontStyle)}
        >
          {content}
        </span>
      ))}
      {lineIndex < lines.length - 1 ? "\n" : null}
    </span>
  ))}</>;
}

// Directory trees: a branch glyph followed by its horizontal rule at the start of a line.
const treeGuide = /^[\s│]*[├└]──/m;

/** Directory trees: dim the connectors and set folders apart without changing the text. */
function TreeLines({ code }: { code: string }) {
  const lines = code.split("\n");
  return <>{lines.map((line, index) => {
    const [, guide, name] = /^([\s│├└─]*)(.*)$/u.exec(line)!;
    return <span className="tree-line" key={index}>
      {guide ? <span className="tree-guide">{guide}</span> : null}
      {name ? <span className={name.endsWith("/") ? "tree-dir" : "tree-file"}>{name}</span> : null}
      {index < lines.length - 1 ? "\n" : null}
    </span>;
  })}</>;
}

export function CodeBlock({
  children,
  language,
  title,
  variant,
  tokens,
}: {
  children: string;
  language: SyntaxLanguage;
  /** A file name. The Markdown export renders it as a label paragraph before the fence. */
  title?: string;
  /** "command": a one-line black command bar, like the install picker's. */
  variant?: "command";
  /** Lines highlighted at build time for `children` (see examples.ts). */
  tokens?: TokenLine[];
}) {
  if (tokens && linesText(tokens) !== children) throw new Error("CodeBlock tokens do not match its code");
  const grammar = language === "text" ? "plaintext" : grammarByLanguage[language];
  const tree = language === "text" && treeGuide.test(children);
  const languageLabel = tree ? "Files" : languageLabels[language];
  const frameClass = ["code-frame", tree && "code-frame-tree", variant && `code-frame-${variant}`].filter(Boolean).join(" ");
  return (
    <div className={frameClass} data-title={title}>
      <div className="code-frame-header" data-doc-ignore>
        <span className="code-frame-label">
          {title ? <span className="code-frame-title">{title}</span> : null}
          <span className="code-frame-language">{languageLabel}</span>
        </span>
        <CopyCodeButton code={children} label={title ?? `${languageLabel} code`} />
      </div>
      <pre className="syntax-block" data-language={language} data-grammar={grammar}>
        <code>{tree
          ? <TreeLines code={children} />
          : <SyntaxTokens code={children} language={language} palette={variant === "command" ? "dark" : "theme"} tokens={tokens} />}</code>
      </pre>
    </div>
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
