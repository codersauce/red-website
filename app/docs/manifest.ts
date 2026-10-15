/** Shared documentation metadata. JSX render functions remain in content.tsx. */
export const docManifest = [
  {
    "id": "overview",
    "slug": "",
    "href": "/docs",
    "section": "Getting started",
    "title": "Use Red",
    "description": "Install the editor, complete a short first session, then move into the parts of Red you need."
  },
  {
    "id": "install",
    "slug": "getting-started/install",
    "href": "/docs/getting-started/install",
    "section": "Getting started",
    "title": "Install Red",
    "description": "Install the Red binary for your platform, then check that its bundled runtime is ready."
  },
  {
    "id": "updating",
    "slug": "getting-started/updating",
    "href": "/docs/getting-started/updating",
    "section": "Getting started",
    "title": "Update Red",
    "description": "Check for new releases, update a standalone installation, and migrate an older install."
  },
  {
    "id": "first-session",
    "slug": "getting-started/first-session",
    "href": "/docs/getting-started/first-session",
    "section": "Getting started",
    "title": "Your first session",
    "description": "Open a project, edit and save a file, and learn where Red keeps its commands and shortcuts."
  },
  {
    "id": "agent-docs",
    "slug": "getting-started/agent-docs",
    "href": "/docs/getting-started/agent-docs",
    "section": "Getting started",
    "title": "Use these docs with your agent",
    "description": "Give a coding agent Red's documentation as Markdown through the llms.txt index, per-page exports, and your agent's instruction file."
  },
  {
    "id": "for-agents",
    "slug": "for-agents",
    "href": "/docs/for-agents",
    "section": "Getting started",
    "title": "For coding agents",
    "description": "Choose version-appropriate instructions, configure language tools, build plugins, and validate changes in Red."
  },
  {
    "id": "navigation",
    "slug": "editor/navigation",
    "href": "/docs/editor/navigation",
    "section": "Editor",
    "title": "Navigate and edit",
    "description": "Move through a project with Red's file tools and use its Vim-style editing model without guessing which commands are available."
  },
  {
    "id": "search",
    "slug": "editor/search",
    "href": "/docs/editor/search",
    "section": "Editor",
    "title": "Search and replace",
    "description": "Search one buffer, the whole project, or the file tree, and make controlled replacements with Red's regular-expression syntax."
  },
  {
    "id": "windows",
    "slug": "editor/windows",
    "href": "/docs/editor/windows",
    "section": "Editor",
    "title": "Buffers and windows",
    "description": "Arrange files in splits, move between editor and plugin panes, and resolve files that changed outside Red."
  },
  {
    "id": "languages",
    "slug": "languages",
    "href": "/docs/languages",
    "section": "Editor",
    "title": "Language tools",
    "description": "Use completion, diagnostics, navigation, formatting, and language packs for the files in your workspace."
  },
  {
    "id": "typescript-eslint",
    "slug": "languages/typescript-eslint",
    "href": "/docs/languages/typescript-eslint",
    "section": "Editor",
    "title": "TypeScript and ESLint (multiple language servers)",
    "description": "Attach TypeScript and ESLint language servers to the same buffer, keep Prettier formatting, and troubleshoot multi-server setups.",
    "minVersion": "v0.9.0"
  },
  {
    "id": "git",
    "slug": "git",
    "href": "/docs/git",
    "section": "Editor",
    "title": "Work with Git",
    "description": "Review changes, stage hunks or lines, write commits, and use repository operations without leaving Red."
  },
  {
    "id": "agent",
    "slug": "agent",
    "href": "/docs/agent",
    "section": "Agent",
    "title": "Agent and inline assist",
    "description": "Set up Codex, use the full Agent workspace or a bounded inline request, and know when a change is saved to disk."
  },
  {
    "id": "configuration",
    "slug": "configuration",
    "href": "/docs/configuration",
    "section": "Customize",
    "title": "Configure Red",
    "description": "Keep the embedded defaults and add only the settings you want to change."
  },
  {
    "id": "keybindings",
    "slug": "keybindings",
    "href": "/docs/keybindings",
    "section": "Customize",
    "title": "Change keybindings",
    "description": "Map actions, action sequences, chords, and plugin commands without changing how keys behave in other modes."
  },
  {
    "id": "themes",
    "slug": "themes",
    "href": "/docs/themes",
    "section": "Customize",
    "title": "Choose and edit themes",
    "description": "Preview bundled themes, keep a selection, or eject a JSON theme into your configuration directory."
  },
  {
    "id": "plugins",
    "slug": "plugins",
    "href": "/docs/plugins",
    "section": "Customize",
    "title": "Manage plugins",
    "description": "Inspect bundled plugins, install external packages, control their lifecycle, and keep native grammar approval explicit."
  },
  {
    "id": "json-rpc-plugins",
    "slug": "plugins/json-rpc",
    "href": "/docs/plugins/json-rpc",
    "section": "Customize",
    "title": "Write a JSON-RPC plugin",
    "description": "Build a live Markdown outline and table of contents plugin in TypeScript or Python with Red's JSON-RPC host API.",
    "minVersion": "v0.9.0"
  },
  {
    "id": "husk",
    "slug": "husk",
    "href": "/docs/husk",
    "section": "Customize",
    "title": "Write a Husk plugin",
    "description": "Use Red's embedded Husk language to register commands, keep private state, and request editor-owned operations."
  },
  {
    "id": "sessions",
    "slug": "sessions",
    "href": "/docs/sessions",
    "section": "Sessions",
    "title": "Detach and recover",
    "description": "Keep a live editor across terminal disconnects on macOS and Linux, or restore an atomic snapshot after the editor stops."
  },
  {
    "id": "cli",
    "slug": "reference/cli",
    "href": "/docs/reference/cli",
    "section": "Reference",
    "title": "Command-line reference",
    "description": "Look up Red's editor, validation, runtime asset, Agent, session, plugin, language, and keyboard commands."
  },
  {
    "id": "vim",
    "slug": "reference/vim",
    "href": "/docs/reference/vim",
    "section": "Reference",
    "title": "Vim compatibility",
    "description": "See which Vim-style editing behaviors Red supports and where its defaults or command language intentionally differ."
  },
  {
    "id": "troubleshooting",
    "slug": "troubleshooting",
    "href": "/docs/troubleshooting",
    "section": "Reference",
    "title": "Troubleshooting",
    "description": "Use Red's focused checks to separate installation, configuration, runtime asset, language-server, Agent, keyboard, and recovery problems."
  }
] as const;

export type DocPageId = (typeof docManifest)[number]["id"];
export interface DocMetadata {
  id: DocPageId;
  slug: string;
  href: string;
  section: string;
  title: string;
  description: string;
  /** Oldest Red release the whole guide applies to, shown as a header badge. */
  minVersion?: string;
}

export function docMetadata(id: DocPageId): DocMetadata {
  return docManifest.find((page) => page.id === id)!;
}

export function markdownPath(href: string): string {
  return `${href}.md`;
}

export const docNavigation = [
  {
    label: "Getting started",
    items: [
      { ...docMetadata("overview"), label: "Overview" },
      { ...docMetadata("install"), label: "Install Red" },
      { ...docMetadata("updating"), label: "Update Red" },
      { ...docMetadata("first-session"), label: "First session" },
      { ...docMetadata("agent-docs"), label: "Docs for your agent" },
      { ...docMetadata("for-agents"), label: "For coding agents" },
    ],
  },
  {
    label: "Editor",
    items: [
      { ...docMetadata("navigation"), label: "Navigate and edit" },
      { ...docMetadata("search"), label: "Search and replace" },
      { ...docMetadata("windows"), label: "Buffers and windows" },
      { ...docMetadata("languages"), label: "Language tools" },
      { ...docMetadata("typescript-eslint"), label: "TypeScript and ESLint" },
      { ...docMetadata("git"), label: "Git" },
    ],
  },
  {
    label: "Agent",
    items: [
      { ...docMetadata("agent"), label: "Agent and inline assist" },
    ],
  },
  {
    label: "Customize",
    items: [
      { ...docMetadata("configuration"), label: "Configuration" },
      { ...docMetadata("keybindings"), label: "Keybindings" },
      { ...docMetadata("themes"), label: "Themes" },
      { ...docMetadata("plugins"), label: "Plugins" },
      { ...docMetadata("json-rpc-plugins"), label: "JSON-RPC plugins" },
      { ...docMetadata("husk"), label: "Husk" },
    ],
  },
  {
    label: "Sessions",
    items: [
      { ...docMetadata("sessions"), label: "Detach and recover" },
    ],
  },
  {
    label: "Reference",
    items: [
      { ...docMetadata("cli"), label: "Command line" },
      { ...docMetadata("vim"), label: "Vim compatibility" },
      { ...docMetadata("troubleshooting"), label: "Troubleshooting" },
    ],
  },
];
