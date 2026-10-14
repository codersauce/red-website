export const releases = [
{
  "version": "v0.9.0",
  "id": "release-v0-9-0",
  "headline": "TypeScript and ESLint together, plugins in your language",
  "summary": "Red v0.9.0 lets multiple language servers work on the same file and adds a JSON-RPC plugin interface for external programs. JSON Workbench demonstrates the new interface with live jq queries and reviewable document transformations.",
  "highlights": [
    {
      "id": "multiple-language-servers",
      "title": "Use TypeScript and ESLint together",
      "description": "Attach multiple configured language servers to the same document. Diagnostics and code actions are combined, while completion, hover, and navigation use a capable server. Install the server executables and configure ESLint in Red's user config; attachment is automatic afterward. External Prettier formatting keeps its precedence."
    },
    {
      "id": "json-rpc-plugins",
      "title": "Write plugins in your language",
      "description": "Run external plugins as supervised JSON-RPC processes over stdio. Plugins can contribute commands, panels, pickers, statusline content, and revision-checked document edits, with owner-scoped configuration and storage. Existing Husk plugins remain supported."
    },
    {
      "id": "json-workbench",
      "title": "Query and transform JSON with JSON Workbench",
      "description": "Install the example plugin to run jq filters against a pinned document or selection, edit queries with live previews, explore results, and apply or undo checked transformations. Saved query history, result documents, and copying are included. Requires Python 3.9 or newer and jq on PATH; the plugin is installed separately."
    },
    {
      "id": "wasmtime-security-update",
      "title": "Update the WebAssembly runtime",
      "description": "Wasmtime is updated to 48.0.6, addressing the security advisories reported against the previously pinned 48.0.5 release."
    }
  ]
},
  {
    version: "v0.8.2",
    id: "release-v0-8-2",
    headline: "Update Red from your editor or terminal",
    summary: "Red v0.8.2 adds a managed updater for official standalone installations. Daily checks notify you about new stable releases; you choose when to install them.",
    highlights: [
      {
        id: "standalone-updater",
        title: "Update from the editor or terminal",
        description: "Run red update, :update, or Update Red in the command palette for an official standalone installation. The updater verifies the release checksum and candidate binary before replacement. Restart your editing sessions to use the new version."
      },
      {
        id: "daily-update-checks",
        title: "Hear about new releases without unattended installs",
        description: "Red checks for a newer stable release once per day and notifies you. Set [updates] mode = \"off\" to disable automatic checks; manual updates remain available."
      }
    ]
  },
  {
    version: "v0.8.1",
    id: "release-v0-8-1",
    headline: "More room in pickers, reliable save and quit",
    summary: "Red v0.8.1 lets you hide picker previews to see longer result paths. It also waits for an in-progress format-on-save before :wq exits, and updates Wasmtime.",
    highlights: [
      {
        id: "picker-preview-toggle",
        title: "Make room for long paths in pickers",
        description: "Press Alt-p or F4 to hide or restore the preview in file, buffer, and project-search pickers. The query and selected result stay in place."
      },
      {
        id: "format-save-quit",
        title: "Save and quit after formatting finishes",
        description: "When format-on-save is pending, :wq waits for the save to finish before exiting. A failed save or a new edit keeps the editor open."
      }
    ]
  },
  {
    version: "v0.8.0",
    id: "release-v0-8-0",
    headline: "Open a directory, stay in the editor",
    summary: "Red v0.8.0 turns directories into navigable, read-only editor buffers. Start with red ., move through entries with familiar keys, and open files in place. Mouse selection, shebang-based syntax detection, and picker navigation make the rest of the trip easier.",
    highlights: [
      {
        id: "directory-buffers",
        title: "Browse a directory in an editor window",
        description: "Run red . or :e path/to/dir, move with normal editor keys, press Enter to open an entry, and use - to go up. Directory buffers are read-only and can be revisited."
      },
      {
        id: "mouse-selection",
        title: "Select with the mouse, keep editing with Vim keys",
        description: "Drag to make a Visual selection, double-click for a word, triple-click for a line, or quadruple-click for a block. The selection remains available for motions and editing commands."
      },
      {
        id: "shebang-syntax",
        title: "Highlight extensionless scripts from their shebang",
        description: "When a filename has no language match, Red recognizes common shell, Node, Lua, PowerShell, and Husk interpreters from the first line. Language packs can register more."
      },
      {
        id: "picker-control-navigation",
        title: "Move through picker results with Ctrl-n and Ctrl-p",
        description: "Use Ctrl-n for the next result and Ctrl-p for the previous one without changing your search query."
      },
      {
        id: "rust-glancer",
        title: "Try Rust Glancer as an optional language server",
        description: "A documented configuration lets Rust projects use Glancer; rust-analyzer remains the default. Install Glancer separately before switching."
      }
    ]
  }
] as const;
