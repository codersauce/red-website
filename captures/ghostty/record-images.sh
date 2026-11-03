#!/bin/sh
# Open a Ghostty window set up like the VHS recordings, with Red showing the
# Markdown demo document. Record the window with the macOS screen recorder
# (Cmd-Shift-5, "Record Selected Window"). The shot list is in README.md.
# Usage: RED_BIN=/absolute/path/to/red captures/ghostty/record-images.sh [docs/design.md]
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
RED="${RED_BIN:-$(command -v red)}"
DOC="${1:-docs/design.md}"
"$HERE/../fixture.sh" /tmp/demo >/dev/null
cat > /tmp/demo/run-red.sh <<T
#!/bin/sh
cd /tmp/demo/throttle
export XDG_CONFIG_HOME=/tmp/demo/xdg
# Colour: crossterm drops every colour when NO_COLOR is set, which agent
# shells often do.
unset TMUX STY ZELLIJ ZELLIJ_SESSION_NAME HERDR_ENV NO_COLOR
export COLORTERM=truecolor
exec "$RED" -c lsp.enabled=false -c markdown_images=kitty $DOC
T
chmod +x /tmp/demo/run-red.sh
open -na Ghostty --args --config-default-files=false \
  --config-file="$HERE/red-capture.conf" --command=/tmp/demo/run-red.sh
