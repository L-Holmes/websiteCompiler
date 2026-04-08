#!/bin/bash
set -euo pipefail

# ── CONFIGURATION ───────────────────────────────────────────────────
export PATH="$HOME/.local/bin:$PATH"

INPUT="alsa_input.usb-Focusrite_Scarlett_Solo_USB_Y7NMT21137C1B5-00.analog-stereo"
EPISODE="${1:-episode}"
OUTPUT="${EPISODE}.wav"

RAW_FILE="raw_${EPISODE}.wav"
STAGE1_FILE="stage1_${EPISODE}.wav"
DF_FILE="stage1_${EPISODE}_DeepFilterNet3.wav"

# ── DEPENDENCY CHECK ────────────────────────────────────────────────
MISSING=()
command -v ffmpeg     &>/dev/null || MISSING+=(ffmpeg)
command -v deepFilter &>/dev/null || MISSING+=(deepfilternet)

if [ ${#MISSING[@]} -gt 0 ]; then
  echo "⚠️  Missing dependencies: ${MISSING[*]}"
  for pkg in "${MISSING[@]}"; do
    case "$pkg" in
      ffmpeg)        sudo apt-get update && sudo apt-get install -y ffmpeg ;;
      deepfilternet) pip install deepfilternet --break-system-packages ;;
    esac
  done
fi

# ── HARDWARE VALIDATION ─────────────────────────────────────────────
if ! pactl list short sources | grep -q "$INPUT"; then
  echo "❌ ERROR: Focusrite device not found!"
  echo "Run: pactl list short sources"
  exit 1
fi

# ── RECORD ──────────────────────────────────────────────────────────
echo "🎙 Recording → $RAW_FILE"
echo "Press 'q' to stop"
ffmpeg -f pulse -i "$INPUT" -ac 1 -ar 48000 "$RAW_FILE"

# ── PROCESS (TONE + CONTROL) ────────────────────────────────────────
echo "🎛 Processing..."
ffmpeg -i "$RAW_FILE" -af "highpass=f=70,agate=threshold=-42dB:ratio=2:attack=10:release=200,equalizer=f=120:width_type=h:width=100:g=4,equalizer=f=3000:width_type=h:width=2000:g=2,acompressor=threshold=-20dB:ratio=2.5:attack=15:release=200,alimiter=limit=0.84,loudnorm=I=-19:TP=-1.5:LRA=11" "$STAGE1_FILE"

# ── AI DENOISE (FINAL TOUCH) ────────────────────────────────────────
echo "🤖 DeepFilterNet..."
deepFilter "$STAGE1_FILE"

# ── FINALIZE ────────────────────────────────────────────────────────
mv "$DF_FILE" "$OUTPUT"

echo "---------------------------------------------------------------"
echo "✅ DONE"
echo "🎧 Final: $OUTPUT"
echo "🗂 Raw:   $RAW_FILE"
echo "▶ Preview: aplay $OUTPUT"
