import { readFile } from "node:fs/promises";
import type { Plugin } from "vite";
import { tokenize } from "../app/docs/_components/highlight";

/**
 * `import example from "./plugin.ts?highlight=typescript"` yields the file's text
 * (without its final newline) and its syntax tokens, computed once at build time
 * instead of on every request.
 */
export function highlightedSources(): Plugin {
  return {
    name: "red-highlighted-sources",
    enforce: "pre",
    async load(id) {
      const [file, query = ""] = id.split("?");
      const grammar = new URLSearchParams(query).get("highlight");
      if (!grammar) return null;
      this.addWatchFile(file);
      const code = (await readFile(file, "utf8")).replace(/\n+$/, "");
      return `export default ${JSON.stringify({ code, lines: tokenize(code, grammar) })};`;
    },
  };
}
