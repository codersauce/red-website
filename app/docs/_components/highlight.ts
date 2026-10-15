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

/** One highlighted token: its text, light and dark colors, and Shiki font style bits. */
export type Token = [content: string, light: string, dark: string, fontStyle: number];
export type TokenLine = Token[];
/** Source text with its tokens, one array per line. */
export type Highlighted = { code: string; lines: TokenLine[] };

const highlighter = createHighlighterCoreSync({
  engine: createJavaScriptRegexEngine(),
  langs: [javascript, json, powershell, python, rust, shellscript, toml, typescript, vimscript],
  themes: [githubDark, githubLight],
});

// Highlighting is the most expensive part of rendering a guide, and the same
// examples render on every request, so a Worker instance keeps its results.
const cache = new Map<string, TokenLine[]>();

export function tokenize(code: string, grammar: string): TokenLine[] {
  const key = `${grammar}\n${code}`;
  let lines = cache.get(key);
  if (!lines) {
    lines = highlighter.codeToTokensWithThemes(code, {
      lang: grammar,
      themes: { dark: "github-dark-default", light: "github-light-default" },
    }).map((line) => line.map((token): Token => [
      token.content,
      token.variants.light.color ?? "",
      token.variants.dark.color ?? "",
      token.variants.dark.fontStyle ?? 0,
    ]));
    cache.set(key, lines);
  }
  return lines;
}

/** Text of highlighted lines, joined the way the source was. */
export const linesText = (lines: TokenLine[]) => lines.map((line) => line.map(([content]) => content).join("")).join("\n");
