#!/bin/sh
# Remotion's chrome-headless-shell crashes on this Mac because its separate GPU process cannot
# receive the ICU data file from the parent ("icudtl.dat not found in bundle"). Running the GPU
# work inside the browser process avoids that child entirely.
exec "$(dirname "$0")/../remotion/node_modules/.remotion/chrome-headless-shell/mac-arm64/chrome-headless-shell-mac-arm64/chrome-headless-shell" --in-process-gpu "$@"
