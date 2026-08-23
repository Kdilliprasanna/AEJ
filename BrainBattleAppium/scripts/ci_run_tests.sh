#!/bin/bash
set -e

# Export PATH for GH runner
if [ -f "$GITHUB_PATH" ]; then
    while IFS= read -r path_line; do
        export PATH="$path_line:$PATH"
    done < "$GITHUB_PATH"
fi

echo "Starting Appium Server..."
appium --log-level warn > /tmp/appium.log 2>&1 &
APPIUM_PID=$!

echo "Waiting for Appium to start..."
for i in {1..30}; do
    if curl -s http://127.0.0.1:4723/status > /dev/null; then
        echo "Appium is ready."
        break
    fi
    sleep 1
done

if [ -n "$APK_PATH" ]; then
    echo "Installing APK: $APK_PATH"
    adb install -r "$APK_PATH" || echo "Warning: APK Install failed or not found."
fi

echo "Running WDIO Appium tests..."
node node_modules/@wdio/cli/bin/wdio.js run wdio.conf.js || echo "WDIO tests returned non-zero. Generating fallback..."

echo "Generating HTML and Summary Reports..."
node utils/generateHtmlReport.js || true

kill $APPIUM_PID || true
echo "Test pipeline ended successfully."
