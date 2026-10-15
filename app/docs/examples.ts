/**
 * The JSON-RPC guide's example plugin. The guide shows these files verbatim and
 * cuts its step-by-step snippets from them, so the page always matches the code
 * that tests/outline-plugin.test.mjs runs. Files are highlighted at build time
 * (build/highlight-vite-plugin.ts); snippets reuse slices of those tokens.
 */
import firstPython from "../../examples/markdown-outline/first-command/python/plugin.py?highlight=python";
import firstPythonManifest from "../../examples/markdown-outline/first-command/python/red-plugin.toml?highlight=toml";
import firstTypescript from "../../examples/markdown-outline/first-command/typescript/plugin.ts?highlight=typescript";
import firstTypescriptManifest from "../../examples/markdown-outline/first-command/typescript/red-plugin.toml?highlight=toml";
import python from "../../examples/markdown-outline/python/plugin.py?highlight=python";
import pythonManifest from "../../examples/markdown-outline/python/red-plugin.toml?highlight=toml";
import typescript from "../../examples/markdown-outline/typescript/plugin.ts?highlight=typescript";
import typescriptManifest from "../../examples/markdown-outline/typescript/red-plugin.toml?highlight=toml";
import type { Highlighted, TokenLine } from "./_components/highlight";

export const outlinePlugin = {
  typescript: { source: typescript, manifest: typescriptManifest },
  python: { source: python, manifest: pythonManifest },
  firstCommand: {
    typescript: { source: firstTypescript, manifest: firstTypescriptManifest },
    python: { source: firstPython, manifest: firstPythonManifest },
  },
};

const indentation = (line: string) => line.length - line.trimStart().length;

// Remove the first `count` characters of a line, across tokens.
function dedentLine(line: TokenLine, count: number): TokenLine {
  let remaining = count;
  const result: TokenLine = [];
  for (const [content, ...colors] of line) {
    const removed = Math.min(remaining, content.length);
    remaining -= removed;
    if (content.length > removed) result.push([content.slice(removed), ...colors]);
  }
  return result;
}

/**
 * One declaration from `source`: the line starting with `start` through the end
 * of its block, or up to (not including) the line starting with `until`.
 * Throws during rendering if the source no longer contains it.
 */
export function excerpt(source: Highlighted, start: string, until?: string): Highlighted {
  const lines = source.code.split("\n");
  const from = lines.findIndex((line) => line.trimStart().startsWith(start));
  if (from < 0) throw new Error(`Example excerpt not found: ${start}`);
  const base = indentation(lines[from]);
  let to = from;
  if (until) {
    to = lines.findIndex((line, index) => index > from && line.trimStart().startsWith(until)) - 1;
    if (to < from) throw new Error(`Example excerpt end not found: ${until}`);
  } else {
    for (let index = from + 1; index < lines.length; index += 1) {
      const line = lines[index];
      if (!line.trim()) continue;
      const closing = /^[)\]}]/.test(line.trimStart());
      if (indentation(line) < base || (indentation(line) === base && !closing)) break;
      to = index;
      if (indentation(line) === base && closing) break; // a TypeScript block's closing brace
    }
  }
  while (to > from && !lines[to].trim()) to -= 1;
  const block = lines.slice(from, to + 1);
  const trim = Math.min(...block.filter((line) => line.trim()).map(indentation));
  return {
    code: block.map((line) => line.slice(trim)).join("\n"),
    lines: source.lines.slice(from, to + 1).map((line) => dedentLine(line, trim)),
  };
}

/** Several declarations, separated by a blank line. */
export function excerpts(source: Highlighted, starts: string[]): Highlighted {
  const parts = starts.map((start) => excerpt(source, start));
  return {
    code: parts.map((part) => part.code).join("\n\n"),
    lines: parts.flatMap((part, index) => (index ? [[], ...part.lines] : part.lines)),
  };
}
