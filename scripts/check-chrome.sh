#!/bin/bash
# Script to set up and cache Chrome/Chromium for CI

# Detect architecture
ARCH=$(uname -m)
echo "Detected architecture: $ARCH"

# Create chrome directory
CHROME_DIR="/usr/local/chrome"
sudo mkdir -p $CHROME_DIR

# Check if we already have a cached version
if [ -f "$CHROME_DIR/chrome" ]; then
    echo "Found cached Chrome/Chromium binary"
    sudo ln -sf $CHROME_DIR/chrome /usr/local/bin/google-chrome
    CHROME_VERSION=$(google-chrome --version || echo "none")
    echo "Cached version: $CHROME_VERSION"
else
    echo "No cached version found, installing..."
    
    # Install dependencies
    sudo apt-get update
    sudo apt-get install -y --no-install-recommends \
        libnss3 \
        libgbm1 \
        libasound2 \
        libatk1.0-0 \
        libatk-bridge2.0-0 \
        libcups2 \
        libdrm2 \
        libxkbcommon0 \
        libxcomposite1 \
        libxdamage1 \
        libxfixes3 \
        libxrandr2

    if [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
        echo "Installing Chromium for ARM64..."
        sudo apt-get install -y chromium-browser

        # Copy the installed binary to our cache directory
        sudo cp -r /usr/lib/chromium-browser/* $CHROME_DIR/
        sudo ln -sf $CHROME_DIR/chrome /usr/local/bin/google-chrome
    else
        echo "Installing Chrome for AMD64..."
        wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
        sudo apt-get install -y ./google-chrome-stable_current_amd64.deb
        
        # Copy the installed binary to our cache directory
        sudo cp -r /opt/google/chrome/* $CHROME_DIR/
        sudo ln -sf $CHROME_DIR/chrome /usr/local/bin/google-chrome
    fi
fi

# Set up chrome sandbox
sudo chown root:root $CHROME_DIR/chrome_sandbox
sudo chmod 4755 $CHROME_DIR/chrome_sandbox
sudo cp -f $CHROME_DIR/chrome_sandbox $CHROME_DIR/chrome-sandbox

# Verify installation
CHROME_VERSION=$(google-chrome --version)
echo "Using Chrome/Chromium version: $CHROME_VERSION"

# Export chrome path for Playwright
echo "PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/local/bin/google-chrome" >> $GITHUB_ENV