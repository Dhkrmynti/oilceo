#!/bin/sh
# Flip the site between the illustration edition and the real Board, without a rebuild.
# Run ON the server from inside the repo:
#   sh scripts/site-mode.sh demo   → everyone sees made-up numbers (labelled); edits save on the page only
#   sh scripts/site-mode.sh live   → the real Board (launch-ready); ?demo still previews
set -e
MODE="$1"
NAME="${NAME:-oilceo-engine}"
case "$MODE" in demo | live) ;; *) echo "usage: $0 demo|live" >&2; exit 1 ;; esac
APP="$(cd "$(dirname "$0")/.." && pwd)"
sed -i -E "s/name=\"rh-mode\" content=\"[a-z]+\"/name=\"rh-mode\" content=\"$MODE\"/" "$APP/dist/index.html"
# The demo may try a real X sign-in (nothing saved); the live site never offers it.
XD=0; [ "$MODE" = demo ] && XD=1
cd "$APP" && (grep -q '^X_DEMO=' .env && sed -i "s/^X_DEMO=.*/X_DEMO=$XD/" .env || echo "X_DEMO=$XD" >> .env)
pm2 restart "$NAME" --update-env >/dev/null
grep -o 'rh-mode" content="[a-z]*"' "$APP/dist/index.html"
