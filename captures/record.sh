#!/bin/sh
# Record every tape (or the ones named) into ../public/media.
# Usage: record.sh [shot ...]
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="$HERE/../public/media"
BUILD="$HERE/.build"
RED="${RED_BIN:-red}"
mkdir -p "$OUT" "$BUILD"
shots="$*"
[ -n "$shots" ] || shots="$(cd "$HERE/tapes" && ls *.tape | sed 's/\.tape$//')"
for shot in $shots; do
  echo "== $shot"
  "$HERE/fixture.sh" /tmp/demo >/dev/null
  {
    echo "Output \"$shot.mp4\""
    cat "$HERE/header.tape"
    echo "Env PATH \"$(dirname "$RED"):$PATH\""
    cat "$HERE/tapes/$shot.tape"
  } > "$BUILD/$shot.tape"
  # The host terminal must not leak into the recording: Red picks image and
  # clipboard behavior from these variables.
  (cd "$BUILD" && env -u TERM_PROGRAM -u TERM_PROGRAM_VERSION -u HERDR_ENV -u TMUX \
    -u GHOSTTY_RESOURCES_DIR -u GHOSTTY_BIN_DIR -u KITTY_WINDOW_ID -u WEZTERM_EXECUTABLE \
    -u ZELLIJ -u ZELLIJ_SESSION_NAME -u STY -u LC_TERMINAL -u NO_COLOR vhs "$shot.tape" >/dev/null)
  "$HERE/deflash.py" "$BUILD/$shot.mp4" "$OUT/$shot.mp4"
  rm -f "$BUILD/$shot.mp4"
  for png in "$BUILD"/*.png; do [ -e "$png" ] && mv "$png" "$OUT/"; done
done
