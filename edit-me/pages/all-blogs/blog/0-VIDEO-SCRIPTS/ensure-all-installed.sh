#!/bin/bash

# 1. Define what we need
# python3-venv is added because Debian 12 handles Python packages strictly now.
PACKAGES=(
    ffmpeg 
    mediainfo 
    imagemagick 
    kdenlive 
    krita 
    python3-pip 
    python3-venv
)

echo "Updating package lists..."
sudo apt update

# 2. Install the native Debian packages
echo "Installing tools via apt..."
sudo apt install -y "${PACKAGES[@]}"

# 3. Handle DeepFilterNet 
# Debian 12 (Bookworm) blocks 'pip install' globally to protect the system.
# We will check if it exists; if not, we'll install it the 'official' simple way.
if ! command -v deepFilter &> /dev/null; then
    echo "Installing DeepFilterNet..."
    # Using --break-system-packages is the 'quick and dirty' way for Debian 12.
    # It's fine for a dedicated video box, though venv is 'cleaner'.
    pip3 install deepfilternet --break-system-packages
fi

if ! command -v openai-whisper &> /dev/null; then
    echo "Installing DeepFilterNet..."
    # Using --break-system-packages is the 'quick and dirty' way for Debian 12.
    # It's fine for a dedicated video box, though venv is 'cleaner'.
    pip3 install openai-whisper --break-system-packages
fi

echo "--------------------------------------"
echo "All dependencies are ready to go ✅"
echo "No Flatpaks. No bloat. Just Debian."
