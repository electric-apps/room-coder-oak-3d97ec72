#!/bin/bash
# Forward AskUserQuestion hook events to Electric Agent studio.
# Blocks until the user answers in the web UI.
BODY="$(cat)"
RESPONSE=$(curl -s -X POST "http://host.docker.internal:4400/api/sessions/3d97ec72-5e4b-48eb-b46f-93bc949a1577/hook-event" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 8022f57d816a1606faab711b91d2f930a9b8bea58819c5e5d40bcd68c7ae8306" \
  -d "${BODY}" \
  --max-time 360 \
  --connect-timeout 5 \
  2>/dev/null)
if echo "${RESPONSE}" | grep -q '"hookSpecificOutput"'; then
  echo "${RESPONSE}"
fi
exit 0