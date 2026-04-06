#!/bin/bash
set -euo pipefail

# ── CONFIGURATION ───────────────────────────────────────────────────
# Ensure ~/.local/bin is in PATH (common for pip installs)
export PATH="$HOME/.local/bin:$PATH"

INPUT="alsa_input.usb-Focusrite_Scarlett_Solo_USB_Y7NMT21137C1B5-00.analog-stereo"
EPISODE="${1:-episode}"
TEMP_DIR="tmp_processing_${EPISODE}"

# ── DEPENDENCY CHECK ────────────────────────────────────────────────
# Logic: Check for binaries; if missing, attempt a straightforward install.
MISSING=()
command -v ffmpeg     &>/dev/null || MISSING+=(ffmpeg)
command -v deepFilter  &>/dev/null || MISSING+=(deepfilternet)

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
# Logic: Scrutinize if the Focusrite is actually visible to Pulse/Pipewire.
if ! pactl list short sources | grep -q "$INPUT"; then
  echo "❌ ERROR: Focusrite device not found!"
  echo "Check connection or run 'pactl list short sources' to verify ID."
  exit 1
fi

# ── RECORD ──────────────────────────────────────────────────────────
echo "🎙  Recording: ${EPISODE}_raw.wav"
echo "Press 'q' to stop recording."
ffmpeg -f pulse -i "$INPUT" -ac 1 -ar 48000 "raw_${EPISODE}.wav"

# # ── PROCESS ─────────────────────────────────────────────────────────
echo "Processing..."
ffmpeg -i "raw_${EPISODE}.wav" -af "highpass=f=70,agate=threshold=-42dB:ratio=2:attack=10:release=200,equalizer=f=120:width_type=h:width=100:g=4,equalizer=f=3000:width_type=h:width=2000:g=2,acompressor=threshold=-20dB:ratio=2.5:attack=15:release=200,alimiter=limit=0.84,loudnorm=I=-19:TP=-1.5:LRA=11" stage1.wav

echo "🤖 Running DeepFilterNet for q3..."
deepFilter "stage1.wav" 
mv stage1.wav FINAL_PODCAST.wav

echo "---------------------------------------------------------------"
echo "✅  SUCCESS!"
echo "Final Export: FINAL_PODCAST.wav"
echo "Archive Raw:  raw_${EPISODE}.wav"
echo "use: aplay <filename> to preview"

# old method:
# ffmpeg -f pulse -i "alsa_input.usb-Focusrite_Scarlett_Solo_USB_Y7NMT21137C1B5-00.analog-stereo" -ac 1 -ar 48000 INPUT.wav
# ffmpeg -i INPUT.wav -af "highpass=f=80, lowpass=f=15000, afftdn=nf=-25, loudnorm=I=-16:TP=-1.5:LRA=11" OUTPUT.wav
# ffmpeg -i paced.wav -af "highpass=f=80, loudnorm=I=-19:TP=-1.5:LRA=11" final_publishable_podcast.wav
