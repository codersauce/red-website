# Content model

Use this reference when planning navigation, splitting an existing page, auditing coverage, or deciding where new material belongs.

## Organize around reader tasks

Prefer a small number of recognizable paths over a taxonomy that exposes Red's internal architecture. A complete documentation set should let readers:

- Install Red and confirm that it runs.
- Learn enough modal editing and command discovery to complete a first session.
- Open, navigate, edit, search, and organize files and windows.
- Use Git and language tooling that currently ships.
- Understand and operate the current agent features safely.
- Configure Red, keybindings, themes, languages, plugins, and Husk where supported.
- Keep work across disconnects or recover it after interruption where supported.
- Look up exact commands, configuration, compatibility, and troubleshooting information.

Treat this as a coverage lens, not a required navigation tree. Remove areas that current product evidence does not support. Add a route only when it gives a reader a distinct destination.

## Page types

### Tutorial

Guide a newcomer through one reliable result. Choose the path for them, show expected outcomes, and postpone alternatives.

### How-to guide

Start with a concrete goal and assume basic competence. Put prerequisites first, give executable steps, and link to reference material for option lists.

### Explanation

Clarify a concept, boundary, or reason. Ground each concept before depending on it. Separate observed behavior from inferred or documented rationale.

### Reference

Mirror the product surface being described. Use stable, repeatable entry shapes and neutral language. Keep instruction and background discussion elsewhere.

## Splitting mixed pages

Split a page when its sections serve different reading modes. Common examples:

- Move a first-session walkthrough out of a command reference.
- Move exhaustive configuration fields out of a setup guide.
- Move agent safety rationale out of step-by-step usage, while linking both directions.
- Move troubleshooting lookup tables out of conceptual explanations.

Do not split merely because a page is long. A coherent page may be long when the task requires it.

## Navigation rules

- The documentation landing page should expose the first useful destinations without a marketing hero.
- Titles should describe the reader's task or the exact reference surface.
- Every page needs at least one route into it and a useful related destination when one exists.
- Avoid duplicate explanations. Choose one canonical page and link to it.
- Keep marketing claims on the marketing surface and operating instructions in documentation.
- Keep maintainer procedures, implementation plans, incident notes, and architectural deep dives out of public user documentation unless they directly help users operate Red.

## Definition of complete

Coverage alone is not completion. A documentation area is complete when its current, supported reader tasks have discoverable pages; examples and links work; factual claims have evidence; and unsupported or stale material is absent.
