export const releaseHighlights = [
  {
    tag: "PICKER",
    title: "Make room for long paths in pickers",
    description: "Press Alt-p or F4 to hide or restore the preview in file, buffer, and project-search pickers. The query and selected result stay in place.",
  },
  {
    tag: "EDITOR",
    title: "Save and quit after formatting finishes",
    description: "When format-on-save is pending, :wq waits for the save to finish before exiting. A failed save or a new edit keeps the editor open.",
  },
] as const;
