#!/bin/sh
# Render the social card to public/og.png (1200×630).
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --allow-file-access-from-files --window-size=1200,630 --virtual-time-budget=5000 \
  --screenshot="$HERE/../../public/og.png" "file://$HERE/og.html" 2>/dev/null
echo "wrote public/og.png"
