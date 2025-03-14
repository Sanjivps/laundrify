#!/bin/bash

# This script will create placeholder assets for the Laundrify app
# Run this script from the project root with: bash assets/create_assets.sh

# Create a simple blue square for the icon (1024x1024)
convert -size 1024x1024 xc:#4A90E2 \
  -gravity center -pointsize 200 -font Arial -fill white -annotate 0 "L" \
  assets/icon.png

# Use the same for adaptive icon
cp assets/icon.png assets/adaptive-icon.png

# Create a splash screen with text
convert -size 1024x1024 xc:white \
  -gravity center -pointsize 100 -font Arial -fill "#4A90E2" -annotate 0 "Laundrify" \
  assets/splash.png

# Create a simple favicon
convert -size 64x64 xc:#4A90E2 \
  -gravity center -pointsize 32 -font Arial -fill white -annotate 0 "L" \
  assets/favicon.png

echo "Assets created successfully!" 