#!/bin/bash
# Script to download and set up Chromium directly from official sources

download_with_retries() {
    local URL="$1"
    local DEST="${2:-.}"
    local NAME="${3:-${URL##*/}}"
    local COMPRESSED="$4"

    if [[ $COMPRESSED == "compressed" ]]; then
        local COMMAND="curl $URL -4 -sL --compressed -o '$DEST/$NAME' -w '%{http_code}'"
    else
        local COMMAND="curl $URL -4 -sL -o '$DEST/$NAME' -w '%{http_code}'"
    fi

    echo "Downloading '$URL' to '${DEST}/${NAME}'..."
    retries=20
    interval=30
    while [ $retries -gt 0 ]; do
        ((retries--))
        set +e
        http_code=$(eval $COMMAND)
        exit_code=$?
        if [ $http_code -eq 200 ] && [ $exit_code -eq 0 ]; then
            echo "Download completed"
            return 0
        else
            echo "Error — HTTP code: '$http_code', exit code: '$exit_code'. Retrying in $interval seconds, $retries attempts left"
            sleep 30
        fi
        set -e
    done

    echo "Could not download $URL"
    return 1
}

# Detect architecture
ARCH=$(uname -m)
echo "Detected architecture: $ARCH"

# Create chrome directory
CHROME_DIR="/usr/local/chrome"
sudo mkdir -p $CHROME_DIR

if [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
    echo "Setting up Chromium for ARM64..."
    
    # Use Chromium directly from Ubuntu's Snap store - they provide ARM builds
    SNAP_CHROMIUM_URL="https://launchpad.net/ubuntu/+archive/primary/+files/chromium-browser_120.0.6099.224-0ubuntu0.18.04.1_arm64.deb"
    CHROMIUM_DEB="/tmp/chromium-browser.deb"
    
    # Download and extract
    download_with_retries $SNAP_CHROMIUM_URL "/tmp" "chromium-browser.deb"
    cd /tmp
    ar x chromium-browser.deb
    tar xf data.tar.xz
    
    # Move binary to our chrome directory
    sudo mv usr/lib/chromium-browser/* $CHROME_DIR/
    
    # Create symlink
    sudo ln -sf $CHROME_DIR/chrome /usr/local/bin/google-chrome
    
    # Install minimal dependencies
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
        libxrandr2 \
        libgbm1 \
        libasound2
else
    echo "Setting up Chrome for AMD64..."
    CHROME_URL="https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb"
    download_with_retries $CHROME_URL "/tmp" "chrome.deb"
    
    cd /tmp
    ar x chrome.deb
    tar xf data.tar.xz
    
    # Move binary to our chrome directory
    sudo mv opt/google/chrome/* $CHROME_DIR/
    
    # Create symlink
    sudo ln -sf $CHROME_DIR/chrome /usr/local/bin/google-chrome
    
    # Install minimal dependencies
    sudo apt-get update
    sudo apt-get install -y --no-install-recommends \
        libnss3 \
        libgbm1 \
        libasound2
fi

# Set up chrome sandbox
sudo chown root:root $CHROME_DIR/chrome_sandbox
sudo chmod 4755 $CHROME_DIR/chrome_sandbox
sudo cp $CHROME_DIR/chrome_sandbox $CHROME_DIR/chrome-sandbox

# Verify installation
CHROME_VERSION=$(google-chrome --version)
echo "Installed Chrome/Chromium version: $CHROME_VERSION"

# Export chrome path for Playwright
echo "PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/local/bin/google-chrome" >> $GITHUB_ENV