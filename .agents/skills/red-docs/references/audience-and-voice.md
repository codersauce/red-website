# Audience and voice

## Audience

Red's public documentation primarily serves developers who already understand code editors and terminals. Many will bring Vim or Neovim habits. Do not assume they know Red's command names, configuration, bundled features, agent behavior, Husk, or session model.

Some pages also serve newcomers to modal editing. A tutorial may teach a small amount of modal vocabulary, but reference and how-to pages should not turn into modal-editing courses.

## Voice

Write like a practical maintainer helping another developer:

- Lead with what the reader can do.
- Use direct, active sentences and common contractions.
- Prefer commands, results, examples, and mechanisms over adjectives.
- Be calm and specific. Let the behavior establish why a feature is useful.
- Keep necessary nuance. Do not flatten technical meaning to make a sentence shorter.
- Preserve a natural rhythm; not every paragraph needs the same shape or length.
- Address the reader as "you" when instructions require it.

## Avoid AI and corporate jargon

Use terms such as **agent**, **model**, **context**, **Codex**, and **AI** only when they identify a real product component or a behavior the page must explain. Otherwise, name what happens.

| Avoid | Prefer |
| --- | --- |
| AI-native or agentic experience | Name the Agent panel, inline assist, or review step involved |
| intelligent assistance | Name completion, diagnostics, or the agent action |
| context-aware | State which buffer, selection, file, or diagnostic information is provided |
| seamless | Describe which step is automatic or which action is no longer required |
| powerful or robust | Name the capability or failure behavior |
| leverage or harness | use |
| orchestrate | start, run, coordinate, or route, whichever is accurate |
| empower or unlock | State what the reader can now do |
| cutting-edge, next-generation, transformative | Delete the claim |

Also remove throat-clearing such as "It's important to note," "At its core," and "In today's development landscape." Avoid faux-insight setups, summary conclusions that repeat the page, dramatic fragments, rhetorical questions, and decorative emphasis.

## Control complexity

- Give each page one reader job and each section one idea.
- Put conditions and prerequisites before the action they constrain.
- Use shallow headings. Do not create a heading for one short sentence.
- Define a term inline when one sentence is enough; do not add a glossary prematurely.
- Show one realistic path before listing alternatives.
- Keep edge cases out of the main path unless they change safety or the expected result.
- Use a list only for parallel items. Use prose for an argument or explanation.
- Use a table only when at least three items share the same fields.
- Use callouts sparingly for real warnings, compatibility limits, or consequences.
- End on the last useful instruction, result, or next step. Do not recap a page the reader just read.

## Final prose check

Before publishing, ask:

1. Could this sentence appear unchanged on another editor's site? If so, replace it with a Red-specific fact or remove it.
2. Does every unfamiliar term help the reader complete this page's task?
3. Can any paragraph disappear without changing understanding or action?
4. Does the page sound natural when read aloud?
5. Did the edit preserve useful technical detail and the writer's voice?
