export const releaseHighlights = [
  {
    tag: "AGENT",
    title: "Explanations that point back to the source",
    description: "Ask about a subsystem and follow source-linked annotations through the actual code.",
  },
  {
    tag: "INLINE",
    title: "Ask, review, and refactor where you edit",
    description: "Work on the enclosing function or exact visual selection without leaving your buffer.",
  },
  {
    tag: "VIM",
    title: "Multi-cursor, with your Vim muscle memory",
    description: "Press Ctrl-n to select successive occurrences and edit all selections as one undoable change.",
  },
  {
    tag: "WORKSPACE",
    title: "Pick models and protect unsaved work",
    description: "Choose a model per Agent conversation and resolve external file conflicts without losing edits.",
  },
] as const;
