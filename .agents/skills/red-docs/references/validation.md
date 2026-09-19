# Validation

Validate in proportion to the change. Report only checks that actually ran.

## Content checks

- Confirm commands, keybindings, configuration keys, defaults, feature names, and platform claims against the current Red revision.
- Run documented commands in a safe fixture when practical and compare the result with the page.
- Check that every code fence has the correct language and contains enough context to run or understand it.
- Resolve internal links and check changed external links.
- Verify that renamed or moved pages have updated navigation and inbound links.
- Read the page as someone without the authoring conversation. Remove investigation residue and unexplained project shorthand.
- Read prose aloud. Cut filler, repeated setup, generic AI language, and conclusions that merely restate the page.

## Website checks

Use the website repository's current scripts and instructions rather than assuming command names. For this repository, inspect `package.json` before running checks.

For content or route changes, normally verify:

- The production build succeeds.
- Documentation routes render in the built application.
- Existing installer drift and route checks still pass.
- Metadata, canonical links, and navigation point to the intended pages.

Run lint when required by repository instructions or when source changes make it relevant. Perform browser interaction or visual QA when the user requests it or when the change affects layout or responsive behavior. A successful build alone does not prove the documentation is readable or factually correct.

## Product checks

Use focused product checks to establish reader-facing behavior. Do not run the entire Rust suite merely to validate a prose-only claim when a narrower command, test, configuration source, or manual check answers it.

When product source changes accompany the documentation, follow the Red repository's required Rust validation, including its clippy gate.

## Completion report

State:

- Pages or navigation changed.
- Examples and links verified.
- Product facts checked and their current source.
- Build, tests, lint, or focused commands that ran.
- Facts, platforms, or behavior that remain unverified.

Do not treat an old capture, a previous passing run, a health endpoint, or a partial build as current end-to-end proof.
