#!/bin/sh
# Record public/media/a-images.mp4 without touching the keyboard: open the
# capture window, drive Red with System Events, record the window, and export.
# The process running this script needs Accessibility (keystrokes) and Screen
# Recording permission. Keep hands off the keyboard and mouse for ~30 s.
# Usage: RED_BIN=/absolute/path/to/red captures/ghostty/take.sh
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="$HERE/../../public/media"
TMP="$(mktemp -d)"
"$HERE/record-images.sh" docs/design.md
for _ in 1 2 3 4 5 6 7 8 9 10; do
  PID="$(pgrep -f red-capture.conf | head -1)"; [ -n "$PID" ] && break; sleep 1
done
sleep 2.5
osascript -e "tell application \"System Events\" to tell (first process whose unix id is $PID) to set position of window 1 to {120, 90}"
sleep 0.5
WID="$(osascript -l JavaScript -e 'ObjC.import("CoreGraphics"); const l=ObjC.castRefToObject($.CGWindowListCopyWindowInfo($.kCGWindowListOptionOnScreenOnly,0)); let o=""; for(let i=0;i<l.count;i++){const w=l.objectAtIndex(i); if(ObjC.unwrap(w.objectForKey("kCGWindowOwnerPID"))=='"$PID"'){o=ObjC.unwrap(w.objectForKey("kCGWindowNumber"))}}; String(o)')"
osascript -l JavaScript -e 'ObjC.import("CoreGraphics"); $.CGWarpMouseCursorPosition({x:2,y:400}); ""' >/dev/null
osascript -e "tell application \"System Events\" to set frontmost of (first process whose unix id is $PID) to true"
sleep 0.6
screencapture -x -o -v -V 24 -l "$WID" "$TMP/take.mov" &
REC=$!
osascript <<T
tell application "System Events"
  tell (first process whose unix id is $PID)
    delay 1.6
    keystroke "d" using control down
    delay 2.6
    keystroke ":32"
    delay 0.4
    key code 36
    delay 2.3
    keystroke "i"
    delay 1.6
    key code 53
    delay 1.2
    keystroke "k"
    delay 1.4
    repeat 6 times
      keystroke "e" using option down
      delay 0.5
    end repeat
    delay 1.0
    keystroke "g"
    delay 2.0
    key code 53
    delay 1.4
    keystroke "d" using control down
    delay 2.6
  end tell
end tell
T
wait $REC
kill "$PID" 2>/dev/null || true
# Start once the chart is on screen, so the poster shows the picture.
ffmpeg -loglevel error -y -ss 2.3 -to 23.9 -i "$TMP/take.mov" -an \
  -vf "fps=30,scale=1600:-2:flags=lanczos,crop=1600:900:0:2,format=yuv420p" \
  -c:v libx264 -crf 20 -preset slow -movflags +faststart "$TMP/a-images.mp4"
"$HERE/../deflash.py" "$TMP/a-images.mp4" "$OUT/a-images.mp4"
rm -rf "$TMP"
