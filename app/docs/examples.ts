/**
 * The JSON-RPC guide's example plugin. The guide shows these files verbatim and
 * cuts its step-by-step snippets from them, so the page always matches the code
 * that tests/outline-plugin.test.mjs runs.
 */
import firstPython from "../../examples/markdown-outline/first-command/python/plugin.py?raw";
import firstPythonManifest from "../../examples/markdown-outline/first-command/python/red-plugin.toml?raw";
import firstTypescript from "../../examples/markdown-outline/first-command/typescript/plugin.ts?raw";
import firstTypescriptManifest from "../../examples/markdown-outline/first-command/typescript/red-plugin.toml?raw";
import python from "../../examples/markdown-outline/python/plugin.py?raw";
import pythonManifest from "../../examples/markdown-outline/python/red-plugin.toml?raw";
import typescript from "../../examples/markdown-outline/typescript/plugin.ts?raw";
import typescriptManifest from "../../examples/markdown-outline/typescript/red-plugin.toml?raw";

export const outlinePlugin = {
  typescript: { source: typescript, manifest: typescriptManifest },
  python: { source: python, manifest: pythonManifest },
  firstCommand: {
    typescript: { source: firstTypescript, manifest: firstTypescriptManifest },
    python: { source: firstPython, manifest: firstPythonManifest },
  },
};

const indentation = (line: string) => line.length - line.trimStart().length;

/**
 * One declaration from `source`: the line starting with `start` through the end
 * of its block, or up to (not including) the line starting with `until`.
 * Throws during rendering if the source no longer contains it.
 */
export function excerpt(source: string, start: string, until?: string): string {
  const lines = source.split("\n");
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
  const block = lines.slice(from, to + 1);
  while (!block.at(-1)?.trim()) block.pop();
  const trim = Math.min(...block.filter((line) => line.trim()).map(indentation));
  return block.map((line) => line.slice(trim)).join("\n");
}

/** Several declarations, separated by a blank line. */
export function excerpts(source: string, starts: string[]): string {
  return starts.map((start) => excerpt(source, start)).join("\n\n");
}
