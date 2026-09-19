# Truth and terminology

## Locate the sources

The website repository and Red product repository may be separate worktrees. Start from the current website checkout. Locate the Red source checkout through repository instructions, a nearby checkout with the `codersauce/red` remote, or the upstream repository. Never assume an old absolute path is current.

## Source priority

Use the narrowest current source that can establish the claim:

1. Current implementation, generated data, default configuration, and tests in the Red product checkout.
2. Current user-facing files such as `README.md` and `docs/` on the same product revision.
3. Current installer metadata and behavior in the website checkout.
4. CodeAlmanac for durable architecture, invariants, and project context when present.
5. Existing website copy as material to verify, not as independent proof.

Plans, issue discussions, prototypes, old media, previous conversations, release copy for another version, and memory are leads only. Reopen current sources before relying on them.

When code and documentation disagree, investigate and report the mismatch. Do not silently choose one.

## Claims that require current evidence

Verify these every time they appear:

- Installation commands, archive names, checksums, supported platforms, and public installer routes.
- Keybindings, command names, modes, default settings, file locations, and environment variables.
- Agent context, permissions, review behavior, write behavior, and recovery behavior.
- Bundled plugins, themes, language support, language-server behavior, and Husk capabilities.
- Detach, attach, recovery, persistence, and platform limitations.
- Version numbers, performance claims, compatibility claims, and feature availability.

Preserve `/install.sh`, `/install.ps1`, and `/installers.json` unless the task explicitly changes the installer contract and updates its consumers.

## Private claim ledger

For a page with drift-prone facts, keep a private table while authoring:

| Claim | Evidence | Verification | Destination |
| --- | --- | --- | --- |
| Exact reader-facing statement | Current file, symbol, test, or command | confirmed, conflicting, or unverified | Page and section |

Do not publish this table. It exists to prevent plausible but unsupported prose.

## Product terminology

- Use **Red** for the product and `red` for the executable or shell command.
- Preserve exact capitalization for modes, commands, panels, plugins, and configuration keys.
- Use **Codex** only when the claim is specific to Red's Codex integration.
- Use **agent** when referring to an actual Red agent surface or an external coding agent. Do not use it as a fashionable synonym for automation.
- On first public use, introduce **Husk** by its role in Red before relying on the name alone.
- Pick one current product name and repeat it. Do not rotate among agent, assistant, copilot, AI, and model for variety.

Treat all example shortcuts and command names as drift-prone. Verify them even when they appear in older Red documentation or this skill's writing examples.

## Shipped, experimental, and planned behavior

- Present shipped behavior as fact only after current verification.
- Label experimental behavior where the product labels it experimental.
- Keep planned or prototype behavior out of ordinary instructions and reference pages.
- If planned behavior must be documented, mark it plainly and keep it separate from steps a reader can perform now.
- Never turn positioning language into a command, shortcut, safety guarantee, or compatibility promise.
