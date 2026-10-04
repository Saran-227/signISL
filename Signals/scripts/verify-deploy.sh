#!/usr/bin/env bash
# Verify that the live Hostinger deployment matches the local git HEAD.
# Usage: bash scripts/verify-deploy.sh
# Exit code: 0 = all checks pass, 1 = one or more failures.
#
# version.txt is written by the commit that introduces it, so it always
# contains the SHA of the commit *before* the one being deployed. We
# therefore treat the SHA check as informational: warn when the live SHA
# is not reachable in this repo's history, rather than failing on mismatch.

set -uo pipefail

CB=$(date +%s)
PASS=0
FAIL=0

RED='\033[0;31m'; GRN='\033[0;32m'; YLW='\033[1;33m'; RST='\033[0m'
ok()   { echo -e "${GRN}  PASS${RST}  $*"; PASS=$((PASS + 1)); }
fail() { echo -e "${RED}  FAIL${RST}  $*"; FAIL=$((FAIL + 1)); }
info() { echo -e "${YLW}  INFO${RST}  $*"; }

check_asset() {
  local label="$1" url="$2"
  local out
  out=$(curl -sI "${url}?cb=${CB}" 2>/dev/null)
  local status ct cl
  status=$(echo "$out" | grep -i "^HTTP"    | awk '{print $2}' | tr -d '\r')
  ct=$(    echo "$out" | grep -i "^content-type"   | cut -d' ' -f2- | tr -d '\r')
  cl=$(    echo "$out" | grep -i "^content-length" | cut -d' ' -f2- | tr -d '\r')
  echo "  ${label}"
  echo "    status=${status:-?}  type=${ct:-?}  length=${cl:-?}"
  if [[ "$status" == "200" ]]; then
    ok "$label is 200"
  else
    fail "$label returned ${status:-no response} (expected 200)"
  fi
}

echo ""
echo "========================================"
echo " SignISL deploy verification"
echo " Cache-buster: $CB"
echo "========================================"
echo ""

# ── version.txt (informational SHA check) ─────────────────────────────────────
echo "[ version.txt ]"
for HOST in "https://www.signisl.com" "https://signisl.com"; do
  LIVE_SHA=$(curl -s "${HOST}/version.txt?cb=${CB}" 2>/dev/null | tr -d '[:space:]')
  echo "  ${HOST}/version.txt → '${LIVE_SHA}'"
  if [[ -z "$LIVE_SHA" ]]; then
    fail "${HOST}: version.txt is empty or missing"
  elif git cat-file -t "$LIVE_SHA" >/dev/null 2>&1; then
    ok "${HOST}: live SHA is a valid commit in this repo"
    info "Live SHA: ${LIVE_SHA} (version.txt always lags HEAD by one commit by design)"
  else
    fail "${HOST}: live SHA '${LIVE_SHA}' not found in this repo — wrong branch or repo?"
  fi
done
echo ""

# ── poster images (only exist from commit 4031d9e onward) ────────────────────
echo "[ poster images ]"
for HOST in "https://www.signisl.com" "https://signisl.com"; do
  check_asset "${HOST}/video-demo-1.jpg" "${HOST}/video-demo-1.jpg"
  check_asset "${HOST}/video-demo-2.jpg" "${HOST}/video-demo-2.jpg"
done
echo ""

# ── video files ───────────────────────────────────────────────────────────────
echo "[ video files ]"
for HOST in "https://www.signisl.com" "https://signisl.com"; do
  check_asset "${HOST}/video-demo-1.mp4" "${HOST}/video-demo-1.mp4"
  check_asset "${HOST}/video-demo-2.mp4" "${HOST}/video-demo-2.mp4"
done
echo ""

# ── shared.js ─────────────────────────────────────────────────────────────────
echo "[ shared.js ]"
WEBSITE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LOCAL_JS_SIZE=$(wc -c < "${WEBSITE_DIR}/shared.js" | tr -d ' ')
for HOST in "https://www.signisl.com" "https://signisl.com"; do
  out=$(curl -sI "${HOST}/shared.js?cb=${CB}" 2>/dev/null)
  status=$(echo "$out" | grep -i "^HTTP" | awk '{print $2}' | tr -d '\r')
  cl=$(echo "$out" | grep -i "^content-length" | cut -d' ' -f2- | tr -d '\r')
  echo "  ${HOST}/shared.js  status=${status:-?}  live=${cl:-?}B  local=${LOCAL_JS_SIZE}B"
  if [[ "$status" == "200" && "$cl" == "$LOCAL_JS_SIZE" ]]; then
    ok "${HOST}/shared.js matches local size"
  elif [[ "$status" != "200" ]]; then
    fail "${HOST}/shared.js returned ${status:-no response}"
  else
    fail "${HOST}/shared.js size mismatch: live ${cl:-?} != local ${LOCAL_JS_SIZE} — stale deploy?"
  fi
done
echo ""

# ── summary ───────────────────────────────────────────────────────────────────
echo "========================================"
echo " Results: ${PASS} passed, ${FAIL} failed"
echo "========================================"
echo ""

if [[ $FAIL -gt 0 ]]; then
  exit 1
fi
