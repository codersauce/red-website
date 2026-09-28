export const releaseHighlights = [
  {
    tag: "FILES",
    title: "Browse a directory in an editor window",
    description: "Run red . or open a directory with :e, then use normal editor keys and Enter to navigate. Directory buffers are read-only and revisitable.",
  },
  {
    tag: "MOUSE",
    title: "Select with the mouse, keep editing with Vim keys",
    description: "Drag for a Visual selection, double-click for a word, triple-click for a line, or quadruple-click for a block.",
  },
  {
    tag: "SYNTAX",
    title: "Highlight extensionless scripts from their shebang",
    description: "Red recognizes common interpreters from the first line when a filename has no language match; language packs can register more.",
  },
  {
    tag: "PICKER",
    title: "Move through picker results with Ctrl-n and Ctrl-p",
    description: "Use Ctrl-n for the next result and Ctrl-p for the previous one without changing the search query.",
  },
  {
    tag: "RUST",
    title: "Try Rust Glancer as an optional language server",
    description: "A documented configuration switches Rust projects to Glancer; rust-analyzer stays the default.",
  },
] as const;
