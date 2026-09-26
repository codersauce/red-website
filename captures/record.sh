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
  (cd "$BUILD" && vhs "$shot.tape" >/dev/null)
  "$HERE/deflash.py" "$BUILD/$shot.mp4" "$OUT/$shot.mp4"
  rm -f "$BUILD/$shot.mp4"
  for png in "$BUILD"/*.png; do [ -e "$png" ] && mv "$png" "$OUT/"; done
done
