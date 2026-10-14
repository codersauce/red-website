# Syntax highlighting throughout the docs

Add consistent syntax highlighting to code examples throughout the Red documentation so readers can distinguish commands, values, and syntax at a glance.

**Goals**

- Cover every documentation page that presents code examples.
- Highlight code blocks and inline commands and expressions; keep inline paths and filenames neutral.
- Keep code readable in the site's light and dark themes.
- Identify the shared rendering changes, content updates, and verification needed before implementation.

**Assumptions**

- Use the existing documentation components and visual design where practical.
- Preserve example text, whitespace, selection, and copying.

## Agreed scope

**Highlight inline commands and expressions as well as code blocks.** This includes examples such as `red --version`, `red update --check`, `red::state()`, and `red::state_patch(...)` wherever they appear in prose, lists, tables, or callouts.

**Keep inline paths and filenames neutral.** References such as `~/.config/red/config.toml` and `hello.hk` retain their existing inline code styling. This focuses syntax colors on executable commands and language expressions while keeping file references easy to read.

## Current rendering

The 20 guides use JSX in [content.tsx](../app/docs/content.tsx). They contain 74 code blocks across 16 guides and 490 inline code elements. The shared [InstallPicker](../app/components/InstallPicker.tsx) adds Unix, PowerShell, and Homebrew command panels. None currently use a syntax highlighter.

Inline code includes several different kinds of content:

- Commands: `red --version` and `red update --check` in the update guide.
- Paths and filenames: `~/.config/red/config.toml` and `hello.hk`.
- Function calls and API names: `red::state()` and `red::state_patch(...)` in the Husk guide.
- Configuration fragments, flags, versions, and diagnostic text elsewhere in the guides.

These currently share neutral inline code styling. The migration will identify commands and expressions explicitly and preserve neutral styling for paths and filenames.

## Implementation

- Use one shared, server-rendered Shiki renderer with explicit language metadata. It covers block and inline forms without adding the highlighter or grammars to browser chunks.
- Pass server-highlighted installer content through the existing client picker while keeping raw command strings as the clipboard source.
- Load only the grammars used by the docs: shell, PowerShell, TOML, JavaScript, TypeScript, JSON, Python, Rust, and Vimscript.
- Treat Husk as a documented lexical approximation of Rust, Red editor commands as Vimscript, and directory trees as explicit plaintext. Split the mixed terminal/editor example into separate shell and Red command examples.
- Use a dark token palette on code blocks in both site themes. Inline expressions use light and dark token palettes selected through the existing theme attribute, without client retokenization.
- Check rendered HTML for every guide, exact visible code text, language and grammar metadata, intentional plaintext, highlighted and neutral inline examples, installer panels, and absence of highlighter code in client chunks. Visually inspect light and dark themes, narrow screens, tab controls, selection, and copying.

## Completion criteria

- Every existing code block is rendered through the shared component or explicitly marked plaintext.
- Inline commands and expressions are highlighted; paths and filenames remain neutral.
- Existing lint, typecheck, installer checks, production build, and rendered Worker tests pass.
- Manual browser checks pass in both themes and at desktop and narrow widths.
- The verified source and build archive are deployed through the existing Sites project without changing its audience.
