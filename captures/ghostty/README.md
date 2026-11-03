# Inline image recordings

VHS draws the terminal with xterm.js, which cannot show terminal graphics, so
Red's inline Markdown images are recorded in a real Ghostty window instead.
`red-capture.conf` matches the VHS clips: Berkeley Mono, the `red-capture`
colors, no title bar, and a 157×35 cell window (about 16:9). Ghostty's update
badge is off so it does not appear in the frame.

```sh
RED_BIN=/absolute/path/to/red captures/ghostty/record-images.sh
```

The script resets `/tmp/demo`, then opens Ghostty with Red on
`docs/design.md`, the language server off and Kitty graphics forced. Record
the window with Cmd-Shift-5, **Record Selected Window**, and turn off **Show
Mouse Clicks**. Leave a second of stillness at each end so the loop can be
trimmed cleanly.

## Automated take

`take.sh` records and exports `public/media/a-images.mp4` in one go. It drives
Red with System Events, so the process running it needs Accessibility and
Screen Recording permission, and the keyboard and mouse must stay untouched
for about 30 seconds.

```sh
RED_BIN=/absolute/path/to/red captures/ghostty/take.sh
```

## Shot list (`a-images`, about 18 s)

| # | Keys | What the viewer should see |
| --- | --- | --- |
| 1 | `Ctrl-d` | The benchmarks table, then the token bucket chart, fully on screen. Hold 2 s. This frame is the poster. |
| 2 | `/Token bucket` `Enter`, then `j` `j` | The cursor reaches the `![…]` line. Its Markdown appears in the image's first row; the chart stays below and nothing below it moves. Hold 1.5 s. |
| 3 | `i`, then `Esc` | Insert shows the raw line; Escape returns the picture. |
| 4 | `Alt-e` six times, slowly | The view scrolls one line at a time. The chart's top leaves the screen and the rest stays sharp and in proportion, not squashed. |
| 5 | `g` | The key-hint popup draws over the chart with a clean edge. Hold 1.5 s, then `Esc`; the full chart returns with no ghosting. |
| 6 | `Ctrl-d` | The sliding window diagram comes into view. Hold 2 s. |

Export as H.264 MP4 at 1600×900, 30 fps, without audio, then run
`captures/deflash.py in.mp4 public/media/a-images.mp4` to write the clip and
its poster.
