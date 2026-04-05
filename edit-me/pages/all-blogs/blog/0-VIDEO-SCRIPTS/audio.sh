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
ffmpeg -f pulse -i "$INPUT" -ac 1 -ar 48000 "${EPISODE}_raw.wav"

# ── PROCESS ─────────────────────────────────────────────────────────
echo "🤖  Running AI Noise Reduction (DeepFilterNet)..."
# We specify the output directory to avoid 'out/' collisions
deepFilter "${EPISODE}_raw.wav" -o "$TEMP_DIR"

echo "🎚  Mastering: EQ + Loudness + MP3 Export..."
# Scrutiny: -19 LUFS is the industry standard for Mono podcasts.
ffmpeg -i "${TEMP_DIR}/${EPISODE}_raw.wav" \
  -af "highpass=f=80, loudnorm=I=-19:TP=-1.5:LRA=11" \
  -codec:a libmp3lame -q:a 2 \
  "${EPISODE}.mp3"

# ── CLEANUP ─────────────────────────────────────────────────────────
# Logic: Only remove the specific temp directory we created.
if [ -d "$TEMP_DIR" ]; then
    rm -rf "$TEMP_DIR"
fi

echo "---------------------------------------------------------------"
echo "✅  SUCCESS!"
echo "Final Export: ${EPISODE}.mp3"
echo "Archive Raw:  ${EPISODE}_raw.wav"

# old method:
# ffmpeg -f pulse -i "alsa_input.usb-Focusrite_Scarlett_Solo_USB_Y7NMT21137C1B5-00.analog-stereo" -ac 1 -ar 48000 INPUT.wav
# ffmpeg -i INPUT.wav -af "highpass=f=80, lowpass=f=15000, afftdn=nf=-25, loudnorm=I=-16:TP=-1.5:LRA=11" OUTPUT.wav
# ffmpeg -i paced.wav -af "highpass=f=80, loudnorm=I=-19:TP=-1.5:LRA=11" final_publishable_podcast.wav
