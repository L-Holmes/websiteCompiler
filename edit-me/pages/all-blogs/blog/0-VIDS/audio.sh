#!/bin/bash
set -euo pipefail

echo "running audio capture"

# ── CONFIGURATION ───────────────────────────────────────────────────
export PATH="$HOME/.local/bin:$PATH"

# INPUT=$(pactl list short sources \
    # | grep -i scarlett \
    # | grep -i Mic1 \
    # | awk '{print $2}')
# 
# if [ -z "$INPUT" ]; then
  # echo "❌ ERROR: Scarlett Solo Mic1 source not found!"
  # pactl list short sources
  # exit 1
# fi

EPISODE="${1:-episode}"
OUTPUT="${EPISODE}.wav"

RAW_FILE="raw_${EPISODE}.wav"

DEVICE_NAME=$(wpctl inspect @DEFAULT_AUDIO_SOURCE@ | grep 'node.description' | cut -d'"' -f2)

echo "---------------------------------------------------------------"
echo "🔍 PRE-FLIGHT CHECK"
echo "🎙️  Current Input:  $DEVICE_NAME"
echo "---------------------------------------------------------------"
echo "👉 Press [ENTER] to start recording, or [Ctrl+C] to abort."
read -r  # This waits for the user to press Enter


# ── RECORD ──────────────────────────────────────────────────────────
echo "🎙 Recording → $RAW_FILE"
# echo "🎤 Using input source: $INPUT"
echo "🔴 Recording is LIVE 🔴"
echo "Press 'q' to stop"
ffmpeg -y -f pulse -i default -ac 1 -ar 48000 "$RAW_FILE"
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

