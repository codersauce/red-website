---
name: red-docs
description: Create, restructure, or audit public documentation for the Red editor on getred.dev. Use for Red tutorials, how-to guides, explanations, reference pages, documentation navigation, and docs copy. Do not use for the marketing homepage, internal engineering notes, release announcements, or Rust API documentation.
---

# Red Docs

Create public documentation that helps someone use Red and describes only behavior supported by current evidence.

## Start with the reader

Before drafting, name the reader, the task they came to complete, what they already know, and what they should be able to do afterward. Keep this analysis private.

Classify the page by its primary job:

- **Tutorial:** a newcomer learns by completing a guided result.
- **How-to guide:** a capable reader completes a specific task.
- **Explanation:** a reader understands a concept, boundary, or design choice.
- **Reference:** a reader looks up exact behavior, commands, defaults, or fields.

If a page tries to do more than one of these jobs, split it or narrow its purpose. Do not create empty categories merely to fit the framework.

## Gather evidence before writing

Read [Truth and terminology](references/truth-and-terminology.md) before making factual product claims. Build a private claim ledger for anything that can drift: commands, shortcuts, defaults, platform support, feature names, safety behavior, installer URLs, and release-specific behavior.

Do not turn prototypes, plans, old screenshots, previous conversations, or historical validation into statements about the current product. When evidence conflicts, stop and report the discrepancy rather than choosing the more convenient source.

## Write the shortest accurate path

Read [Audience and voice](references/audience-and-voice.md) whenever writing or editing prose. Describe observable behavior instead of using AI, corporate, or marketing jargon. Preserve exact Red terms, define unfamiliar ones once, and use the same name consistently.

For task pages, give the reader prerequisites, the action, the expected result, and only the caveats that change the outcome. Link to deeper material instead of repeating it. A page is complete when the reader can finish its job, not when it contains every available detail.

For documentation structure or coverage work, read [Content model](references/content-model.md). Derive navigation from reader tasks and the current product surface.

## Keep public copy separate from authoring evidence

Do not place claim ledgers, source paths, investigation notes, uncertainty discussions, test output, or model instructions in the published page. Use them to produce a clean artifact for a reader arriving without project history.

When evidence is missing, leave the unsupported claim out and report the gap separately. Never manufacture a command, shortcut, example result, rationale, performance number, or compatibility statement.

## Validate before finishing

Read [Validation](references/validation.md) before reporting documentation as complete. Run examples where practical, resolve links, verify names and defaults against the current implementation, and distinguish completed checks from checks that could not run.

When asked to audit rather than edit, report concrete findings with locations and proposed fixes. Do not rewrite the files unless the user asked for changes.

Use [Writing examples](references/writing-examples.md) when the draft feels generic, overly polished, jargon-heavy, or too complex.
