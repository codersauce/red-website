# Direction A recordings

The homepage's six silent MP4 loops and their posters live in `public/media/`. `a-images` is recorded in Ghostty (see `ghostty/README.md`), the rest with VHS. `a-markdown` is not on the homepage; it is footage for videos and the Markdown docs.
The VHS tapes, reset fixture, capture settings, and postprocessor here are the
editable sources. They were copied from the Red repository's `site/captures/`
prototype on 2026-09-26. The exact Red binary commit used for those original
recordings was not recorded.

| Clip | Scene | Duration | Written guide |
| --- | --- | ---: | --- |
| `a-hero` | Search, multi-cursor edit, undo, file picker | 15.5 s | `/docs/editor/navigation` |
| `a-agent` | Agent repairs token-bucket refill | 19.6 s | `/docs/agent` |
| `a-git` | Stage a hunk and draft a commit message | 14.6 s | `/docs/git` |
| `a-detach` | Detach and reattach with unsaved work | 14.6 s | `/docs/sessions` |
| `a-markdown` | Rendered Markdown, hidden markup off and on, table source, `gT`, `gx` | 23.2 s | `/docs/editor/markdown` |
| `a-images` | Images in a Markdown buffer (Ghostty, see `ghostty/README.md`) | 21.6 s | `/docs/editor/markdown` |
| `a-explore` | Explore: follow a name, dim to calls, definition and back | 21.2 s | `/docs/editor/explore` |

The homepage gives each silent clip a visible step caption and an accessible
description. The recorded steps themselves are in `tapes/*.tape`. The local
production preview loaded all six videos in Chrome on 2026-09-26. Full frame by
frame behavioral verification of the original recordings remains open; rerecord
after changes to the related Red workflow.

To make new captures, build a current Red binary, install VHS and ffmpeg, and run
from this repository:

```sh
RED_BIN=/absolute/path/to/red captures/record.sh
RED_BIN=/absolute/path/to/red captures/record.sh a-agent
captures/og/render.sh
```

`record.sh` resets a disposable `/tmp/demo` fixture before each take and uses
an isolated `XDG_CONFIG_HOME`. It invokes the logged-in Codex CLI for the Agent
and Git scenes, so their output and timing can vary. The tape header
expects Berkeley Mono and Symbols Nerd Font Mono. The social card source is
`og/og.html`; it uses `public/media/a-agent.png`.
