#!/bin/bash

SPEAKER_SINK=$(pactl list short sinks | grep "pci-0000_07_00.6" | awk '{print $2}')
CURRENT=$(pactl get-default-sink)


echo "speaker isnk: $SPEAKER_SINK"
echo "current: $CURRENT"

# if current sink contains Scarlett, switch back
if echo "$CURRENT" | grep -qi "scarlett"; then
    echo "setting new default"
    pactl set-default-sink "$SPEAKER_SINK"

    # 🔥 THIS IS THE MISSING PART
    for input in $(pactl list short sink-inputs | awk '{print $1}'); do
        pactl move-sink-input "$input" "$SPEAKER_SINK"
    done
fi

echo "done"
