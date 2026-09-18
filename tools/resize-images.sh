#!/usr/bin/env bash
# Resize oversized images in images/ for the web.
#   heroes  -> max 2400px on the long edge
#   others  -> max 1600px
# Files already small enough are left untouched. _originals/ is never touched.
# Needs only `sips`, which ships with macOS.

set -euo pipefail
cd "$(dirname "$0")/.."

QUALITY=72
changed=0

longest_edge() {
  sips -g pixelWidth -g pixelHeight "$1" 2>/dev/null \
    | awk '/pixel/{print $2}' | sort -nr | head -1
}

for f in $(find images -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) | sort); do
  case "$f" in
    images/instagram/*) continue ;;                 # generated thumbnails
  esac

  case "$(basename "$f")" in
    hero.jpg|hero-sm.jpg|01-*) max=2400 ;;          # full-width slots
    *)                         max=1600 ;;
  esac
  [ "$(basename "$f")" = "hero-sm.jpg" ] && max=1400

  edge=$(longest_edge "$f")
  [ -z "$edge" ] && continue

  before_kb=$(( $(stat -f%z "$f") / 1024 ))

  if [ "$edge" -gt "$max" ]; then
    sips -Z "$max" -s formatOptions "$QUALITY" "$f" --out "$f" >/dev/null 2>&1
    after_kb=$(( $(stat -f%z "$f") / 1024 ))
    printf '  resized  %-42s %spx -> %spx   %sKB -> %sKB\n' "$f" "$edge" "$max" "$before_kb" "$after_kb"
    changed=$((changed+1))
  elif [ "$before_kb" -gt 800 ]; then
    sips -s formatOptions "$QUALITY" "$f" --out "$f" >/dev/null 2>&1
    after_kb=$(( $(stat -f%z "$f") / 1024 ))
    printf '  recompressed %-39s %sKB -> %sKB\n' "$f" "$before_kb" "$after_kb"
    changed=$((changed+1))
  fi
done

if [ "$changed" -eq 0 ]; then
  echo "Nothing to do — every image is already web-sized."
else
  echo
  echo "$changed file(s) updated."
fi
