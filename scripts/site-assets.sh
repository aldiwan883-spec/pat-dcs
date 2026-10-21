#!/usr/bin/env bash
# Copies brand, photo and client-logo assets into public/ for the website.
# Sources: brand/png (identity), profile/img (curated real site photos),
# presentation/success-stories (client logos and the region map). Needs ImageMagick.
set -euo pipefail
cd "$(dirname "$0")/.."
P=public/images
mkdir -p "$P/brand" "$P/site" "$P/clients"

# Identity
convert brand/png/logo/pat-lockup-horizontal-color-2000.png -resize 640x "$P/brand/pat-lockup-horizontal-color.png"
convert brand/png/logo/pat-lockup-horizontal-reverse-transparent-2000.png -resize 640x "$P/brand/pat-lockup-horizontal-reverse.png"
convert brand/png/logo/pat-lockup-arabic-color-2000.png -resize 740x "$P/brand/pat-lockup-arabic-color.png"
convert brand/png/logo/pat-weave-device-1600.png -resize 1200x "$P/brand/pat-weave.png"
convert brand/png/logo/pat-weave-device-reverse-1600.png -resize 1200x "$P/brand/pat-weave-reverse.png"

# Real site photos (no AI images on the site)
for f in team-site team-stack team-crane team-night plant-steam control-room-startup control-room-team marshalling-cabinet \
         io-wiring io-modules dcs-cabinet network-rack ovation-gt-panel ovation-workstation synchronizing-panel new-control-room; do
  convert "profile/img/$f.jpg" -auto-orient -resize '1800x1800>' -strip -sampling-factor 4:2:0 -interlace JPEG -quality 80 "$P/site/$f.jpg"
done

# Client logos (trademarks of their owners; see presentation/success-stories/assets/logos/SOURCES.txt)
for f in presentation/success-stories/assets/generated/logos/*.png; do
  k=$(basename "$f" .png)
  case "$k" in esraa|direct|phoenix|unitedsugar) continue ;; esac
  convert "$f" -trim +repage -resize 'x160>' -strip "$P/clients/$k.png"
done

# Region map
convert presentation/success-stories/assets/generated/maps/overview.png -resize 1600x -strip -quality 85 "$P/site/region-map.png"
echo "site assets written to $P"
