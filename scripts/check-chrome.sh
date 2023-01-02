  #!/bin/bash
  # Copied and modified from: https://github.com/actions/virtual-environments/issues/5651#issuecomment-1142075171
  # Used to ensure that Cypress tests are always using the latest version of Chrome.
  # This is important because sometimes when Chrome releases a new version, Github Action runners can run the
  # previous version or the new version and when sharding the tests to run in parallel results in this error:
  # https://github.com/cypress-io/github-action/issues/518

  download_with_retries() {
  # Due to restrictions of bash functions, positional arguments are used here.
  # In case if you using latest argument NAME, you should also set value to all previous parameters.
  # Example: download_with_retries $ANDROID_SDK_URL "." "android_sdk.zip"
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

  INSTALLED_CHROME_VERSION=$(google-chrome --product-version)
  INSTALLED_CHROME_VERSION=${INSTALLED_CHROME_VERSION%.*}
  INSTALLED_CHROME_MAJOR_VERSION=$(echo $INSTALLED_CHROME_VERSION | cut -d. -f1)

  # Determine latest release of chromedriver
  # Compatibility of Google Chrome and Chromedriver: https://sites.google.com/a/chromium.org/chromedriver/downloads/version-selection
  LATEST_VERSION_URL="https://chromedriver.storage.googleapis.com/LATEST_RELEASE"
  echo "Fetching latest chromedriver version from: $LATEST_VERSION_URL"
  LATEST_CHROMEDRIVER_VERSION=$(curl "$LATEST_VERSION_URL")
  LATEST_CHROMEDRIVER_MAJOR_VERSION=$(echo $LATEST_CHROMEDRIVER_VERSION | cut -d. -f1)

  echo "Installed Chrome Version: $INSTALLED_CHROME_VERSION"
  echo "Latest ChromeDriver Version: $LATEST_CHROMEDRIVER_VERSION"

  if [ "$INSTALLED_CHROME_MAJOR_VERSION" == "$LATEST_CHROMEDRIVER_MAJOR_VERSION" ]; then
    echo "The latest major version of Chrome is already installed."
    exit 0
  fi

  # Download and install Google Chrome
  CHROME_DEB_URL="https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb"
  CHROME_DEB_NAME="google-chrome-stable_current_amd64.deb"
  download_with_retries $CHROME_DEB_URL "/tmp" "${CHROME_DEB_NAME}"
  sudo apt install "/tmp/${CHROME_DEB_NAME}" -f

  # Download and unpack latest release of chromedriver
  echo "Downloading chromedriver v$LATEST_CHROMEDRIVER_VERSION..."
  wget "https://chromedriver.storage.googleapis.com/$LATEST_CHROMEDRIVER_VERSION/chromedriver_linux64.zip"
  unzip chromedriver_linux64.zip
  rm chromedriver_linux64.zip

  CHROMEDRIVER_DIR="/usr/local/share/chrome_driver"
  CHROMEDRIVER_BIN="$CHROMEDRIVER_DIR/chromedriver"

  sudo rm -rf $CHROMEDRIVER_DIR/*
  sudo rm -rf $CHROMEDRIVER_BIN/*

  sudo mkdir -p $CHROMEDRIVER_DIR
  sudo mv "chromedriver" $CHROMEDRIVER_BIN
  sudo chmod +x $CHROMEDRIVER_BIN
  chromedriver --version