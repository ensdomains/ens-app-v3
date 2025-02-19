#!/bin/bash
# Copied and modified from: https://github.com/actions/virtual-environments/issues/5651#issuecomment-1142075171
# Used to ensure that tests are always using the latest version of Chrome.
# This script now handles both ARM64 and AMD64 architectures.

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
        # Temporary disable exit on error to retry on non-zero exit code
        set +e
        http_code=$(eval $COMMAND)
        exit_code=$?
        if [ $http_code -eq 200 ] && [ $exit_code -eq 0 ]; then
            echo "Download completed"
            return 0
        else
            echo "Error — Either HTTP response code for '$URL' is wrong - '$http_code' or exit code is not 0 - '$exit_code'. Waiting $interval seconds before the next attempt, $retries attempts left"
            sleep 30
        fi
        # Enable exit on error back
        set -e
    done

    echo "Could not download $URL"
    return 1
}

# Detect architecture
ARCH=$(uname -m)
echo "Detected architecture: $ARCH"

# Check if Chrome is installed
if command -v google-chrome &> /dev/null; then
    INSTALLED_CHROME_VERSION=$(google-chrome --product-version)
else
    INSTALLED_CHROME_VERSION="none"
fi

LATEST_VERSION_URL="https://omahaproxy.appspot.com/linux"
echo "Fetching latest chrome version from: $LATEST_VERSION_URL"
LATEST_CHROME_VERSION=$(curl "$LATEST_VERSION_URL")

echo "Installed Chrome Version: $INSTALLED_CHROME_VERSION"
echo "Latest Chrome Version: $LATEST_CHROME_VERSION"

if [ "$INSTALLED_CHROME_VERSION" == "$LATEST_CHROME_VERSION" ]; then
    echo "The latest major version of Chrome is already installed."
    exit 0
fi

# Install dependencies
echo "Installing dependencies..."
sudo apt-get update
sudo apt-get install -y wget gnupg

# Add Chrome repository and install Chrome based on architecture
if [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
    echo "Installing Chrome for ARM64..."
    
    # For ARM64, we need to use Chromium as Chrome doesn't provide official ARM64 builds
    sudo apt-get install -y chromium-browser
    
    # Create symlink to make chromium accessible as google-chrome
    sudo ln -sf /usr/bin/chromium-browser /usr/bin/google-chrome
    
    # Install additional dependencies that might be needed
    sudo apt-get install -y libnss3 libgbm1 libasound2
else
    echo "Installing Chrome for AMD64..."
    # Download and install Google Chrome
    CHROME_DEB_URL="https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb"
    CHROME_DEB_NAME="google-chrome-stable_current_amd64.deb"
    download_with_retries $CHROME_DEB_URL "/tmp" "${CHROME_DEB_NAME}"
    sudo apt-get install -y "/tmp/${CHROME_DEB_NAME}" -f
fi

# Verify installation
CHROME_VERSION=$(google-chrome --version)
echo "Installed Chrome/Chromium version: $CHROME_VERSION"