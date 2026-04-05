# Logic: Check for binaries; if missing, attempt a straightforward install.
MISSING=()
command -v ffmpeg        &>/dev/null || MISSING+=(ffmpeg)
command -v pip3          &>/dev/null || MISSING+=(python3-pip)
command -v deepFilter    &>/dev/null || MISSING+=(deepfilternet)
command -v mediainfo     &>/dev/null || MISSING+=(mediainfo)
command -v convert       &>/dev/null || MISSING+=(imagemagick)
flatpak list --app 2>/dev/null | grep -q org.kde.kdenlive || MISSING+=(kdenlive-flatpak)
flatpak list --app 2>/dev/null | grep -q org.kde.krita    || MISSING+=(krita-flatpak)

if [ ${#MISSING[@]} -gt 0 ]; then
  echo "⚠️  Missing dependencies: ${MISSING[*]}"
  for pkg in "${MISSING[@]}"; do
    case "$pkg" in
      ffmpeg)           sudo apt-get update && sudo apt-get install -y ffmpeg ;;
      python3-pip)      sudo apt-get update && sudo apt-get install -y python3-pip ;;
      deepfilternet)    pip3 install deepfilternet --break-system-packages ;;
      mediainfo)        sudo apt-get install -y mediainfo ;;
      imagemagick)      sudo apt-get install -y imagemagick ;;
      kdenlive-flatpak) flatpak install -y flathub org.kde.kdenlive ;;
      krita-flatpak)    flatpak install -y flathub org.kde.krita ;;
    esac
  done
fi

echo "All dependencies are ready to go ✅"
