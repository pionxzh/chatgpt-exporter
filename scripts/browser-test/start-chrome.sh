#!/bin/sh
# Start a dedicated Chrome with CDP for testing, or reuse the one running.
# The profile is separate from your daily browser and has no Tampermonkey,
# so the injected build never runs next to an installed copy. Log in to
# ChatGPT by hand the first time.
#
# Env: CDP_PORT (9222), CHROME_PROFILE (~/.chrome-chatgpt-test), CHROME_BIN
PORT="${CDP_PORT:-9222}"
PROFILE="${CHROME_PROFILE:-$HOME/.chrome-chatgpt-test}"
CHROME="${CHROME_BIN:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"

if curl -sf "http://127.0.0.1:$PORT/json/version" >/dev/null; then
    echo "already running on :$PORT"
    exit 0
fi

nohup "$CHROME" --remote-debugging-port="$PORT" --user-data-dir="$PROFILE" \
    --no-first-run --no-default-browser-check https://chatgpt.com >/dev/null 2>&1 &

for _ in 1 2 3 4 5 6 7 8 9 10; do
    sleep 1
    if curl -sf "http://127.0.0.1:$PORT/json/version" >/dev/null; then
        echo "started on :$PORT"
        exit 0
    fi
done
echo "failed to start Chrome on :$PORT" >&2
exit 1
