#!/bin/bash
set -euo pipefail

echo "running audio capture"

# ── CONFIGURATION ───────────────────────────────────────────────────
export PATH="$HOME/.local/bin:$PATH"

INPUT=$(pactl list short sources \
    | grep -i scarlett \
    | grep -i Mic1 \
    | awk '{print $2}')

if [ -z "$INPUT" ]; then
  echo "❌ ERROR: Scarlett Solo Mic1 source not found!"
  pactl list short sources
  exit 1
fi

EPISODE="${1:-episode}"
OUTPUT="${EPISODE}.wav"

RAW_FILE="raw_${EPISODE}.wav"

# ── DEPENDENCY CHECK ────────────────────────────────────────────────
# MISSING=()
# command -v ffmpeg     &>/dev/null || MISSING+=(ffmpeg)
# command -v deepFilter &>/dev/null || MISSING+=(deepfilternet)
# 
# if [ ${#MISSING[@]} -gt 0 ]; then
  # echo "⚠️  Missing dependencies: ${MISSING[*]}"
  # for pkg in "${MISSING[@]}"; do
    # case "$pkg" in
      # ffmpeg)        sudo apt-get update && sudo apt-get install -y ffmpeg ;;
      # deepfilternet) pip install deepfilternet --break-system-packages ;;
    # esac
  # done
# fi
# 
# # pytorch
# if ! python3 -c "import torch" 2>/dev/null; then
  # echo "⚠️  PyTorch not found — installing CPU version..."
  # pip install torch --index-url https://download.pytorch.org/whl/cpu --break-system-packages
# else
  # echo "✅ PyTorch already installed"
# fi
# 
# # torch audio
# if ! python3 -c "import torchaudio" 2>/dev/null; then
  # echo "⚠️  torchaudio not found — installing CPU version..."
  # pip install torchaudio --index-url https://download.pytorch.org/whl/cpu --break-system-packages
# else
  # echo "✅ torchaudio already installed"
# fi

# ── RECORD ──────────────────────────────────────────────────────────
echo "🎙 Recording → $RAW_FILE"
echo "🎤 Using input source: $INPUT"
echo "🔴 Recording is LIVE 🔴"
echo "Press 'q' to stop"
ffmpeg -y -f pulse -i "$INPUT" -ac 1 -ar 48000 "$RAW_FILE"
echo "==================================="
echo "Recording Done."

# ── PROCESS (TONE + CONTROL) ────────────────────────────────────────
echo "🎛 Processing..."
ffmpeg -y -i "$RAW_FILE" -af "highpass=f=70,agate=threshold=-42dB:ratio=2:attack=10:release=200,equalizer=f=120:width_type=h:width=100:g=4,equalizer=f=3000:width_type=h:width=2000:g=2,acompressor=threshold=-20dB:ratio=2.5:attack=15:release=200,alimiter=limit=0.84,loudnorm=I=-19:TP=-1.5:LRA=11" "$OUTPUT"

echo "---------------------------------------------------------------"
echo "✅ DONE"
echo "🎧 Final: $OUTPUT"
echo "🗂 Raw:   $RAW_FILE"
echo "▶ Preview: aplay $OUTPUT"
