#!/bin/sh
# Start a dedicated Chrome with CDP for testing, or reuse the one running.
# The profile is separate from your daily browser and has no Tampermonkey,
# so the injected build never runs next to an installed copy. Log in to
# ChatGPT by hand the first time.
#
# Runs on macOS, Linux, and Windows through Git Bash.
# Env: CDP_PORT (9222), CHROME_PROFILE (~/.chrome-chatgpt-test), CHROME_BIN
PORT="${CDP_PORT:-9222}"
PROFILE="${CHROME_PROFILE:-$HOME/.chrome-chatgpt-test}"

find_chrome() {
    case "$(uname -s)" in
        Darwin)
            echo "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
            ;;
        MINGW* | MSYS* | CYGWIN*)
            for dir in "${PROGRAMFILES:-C:/Program Files}" "C:/Program Files (x86)" "$LOCALAPPDATA"; do
                if [ -n "$dir" ] && [ -f "$dir/Google/Chrome/Application/chrome.exe" ]; then
                    echo "$dir/Google/Chrome/Application/chrome.exe"
                    return
                fi
            done
            ;;
        *)
            for bin in google-chrome google-chrome-stable chromium chromium-browser; do
                if command -v "$bin" >/dev/null 2>&1; then
                    command -v "$bin"
                    return
                fi
            done
            ;;
    esac
}

CHROME="${CHROME_BIN:-$(find_chrome)}"
if [ -z "$CHROME" ]; then
    echo "Chrome not found. Set CHROME_BIN." >&2
    exit 1
fi

# Chrome on Windows needs a native path, not /c/Users/...
if command -v cygpath >/dev/null 2>&1; then
    PROFILE="$(cygpath -w "$PROFILE")"
fi

if curl -sf "http://127.0.0.1:$PORT/json/version" >/dev/null; then
    echo "already running on :$PORT"
    exit 0
fi

# Windows marks a covered window hidden, which stops rendering and stalls
# screenshots. Keep it rendering while other windows sit on top.
nohup "$CHROME" --remote-debugging-port="$PORT" --user-data-dir="$PROFILE" \
    --no-first-run --no-default-browser-check \
    --disable-features=CalculateNativeWinOcclusion --disable-backgrounding-occluded-windows \
    https://chatgpt.com >/dev/null 2>&1 &

for _ in 1 2 3 4 5 6 7 8 9 10; do
    sleep 1
    if curl -sf "http://127.0.0.1:$PORT/json/version" >/dev/null; then
        echo "started on :$PORT"
        exit 0
    fi
done
echo "failed to start Chrome on :$PORT" >&2
exit 1
