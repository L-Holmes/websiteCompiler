#!/bin/bash
RAW="${1:-episode_raw.wav}"
TEMP_DIR="tmp_gen"
mkdir -p "$TEMP_DIR"

echo "🧪 Generating 3 Variations (Bypassing libmp3lame)..."

# --- q1: Basic Native Cleanup (No AI) ---
# Highpass + Gentle Denoiser + Loudnorm
ffmpeg -y -i "$RAW" -af "highpass=f=80, afftdn=nf=-25, loudnorm=I=-19:TP=-1.5:LRA=11" "q1_native_basic.m4a"
ffmpeg -i "$RAW" -af "highpass=f=80, lowpass=f=15000, afftdn=nf=-25, loudnorm=I=-16:TP=-1.5:LRA=11" q2.wav
ffmpeg -i "$RAW" -af "highpass=f=80, lowpass=f=15000, afftdn=nf=-25, loudnorm=I=-19:TP=-1.5:LRA=11" q4.wav
ffmpeg -i "$RAW" -af "highpass=f=80, lowpass=f=15000, afftdn=nf=-25, compand=attacks=0:points=-30/-90|-20/-20|0/0, loudnorm=I=-19:TP=-1.5:LRA=11" q7.wav

# --- q3: AI Enhanced (DeepFilterNet) ---
echo "🤖 Running DeepFilterNet for q3..."
deepFilter "$RAW" 


deepFilter "q7.wav" 
mv q7_DeepFilterNet3.wav FINAL_PODCAST.wav

echo "Done. Compare q1, q2, and q3."
