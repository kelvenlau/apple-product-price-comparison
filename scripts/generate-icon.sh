#!/bin/zsh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ASSET_DIR="$ROOT/build-assets"
ICONSET_DIR="$ASSET_DIR/icon.iconset"
SOURCE_SVG="$ASSET_DIR/tree-icon.svg"
SOURCE_PNG="$ASSET_DIR/tree-icon.svg.png"
OUTPUT_ICNS="$ASSET_DIR/icon.icns"

mkdir -p "$ICONSET_DIR"
rm -f "$SOURCE_PNG" "$OUTPUT_ICNS"
setopt NULL_GLOB
rm -f "$ICONSET_DIR"/*.png
unsetopt NULL_GLOB

qlmanage -t -s 1024 -o "$ASSET_DIR" "$SOURCE_SVG" >/dev/null

if [[ ! -f "$SOURCE_PNG" ]]; then
  echo "未能生成 PNG 图标底稿：$SOURCE_PNG" >&2
  exit 1
fi

sips -z 16 16 "$SOURCE_PNG" --out "$ICONSET_DIR/icon_16x16.png" >/dev/null
sips -z 32 32 "$SOURCE_PNG" --out "$ICONSET_DIR/icon_16x16@2x.png" >/dev/null
sips -z 32 32 "$SOURCE_PNG" --out "$ICONSET_DIR/icon_32x32.png" >/dev/null
sips -z 64 64 "$SOURCE_PNG" --out "$ICONSET_DIR/icon_32x32@2x.png" >/dev/null
sips -z 128 128 "$SOURCE_PNG" --out "$ICONSET_DIR/icon_128x128.png" >/dev/null
sips -z 256 256 "$SOURCE_PNG" --out "$ICONSET_DIR/icon_128x128@2x.png" >/dev/null
sips -z 256 256 "$SOURCE_PNG" --out "$ICONSET_DIR/icon_256x256.png" >/dev/null
sips -z 512 512 "$SOURCE_PNG" --out "$ICONSET_DIR/icon_256x256@2x.png" >/dev/null
sips -z 512 512 "$SOURCE_PNG" --out "$ICONSET_DIR/icon_512x512.png" >/dev/null
cp "$SOURCE_PNG" "$ICONSET_DIR/icon_512x512@2x.png"

iconutil -c icns "$ICONSET_DIR" -o "$OUTPUT_ICNS"
echo "Generated icon at $OUTPUT_ICNS"
