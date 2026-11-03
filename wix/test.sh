#!/usr/bin/env bash
# Checks criterion 10 of docs/email-capture-spec.md against a deployed tunerSignup endpoint.
# Usage: wix/test.sh <site root or endpoint URL> [email]
#   e.g. wix/test.sh https://user.wixsite.com/my-site   (the /_functions/tunerSignup path is added if missing)
set -u
URL=${1:?usage: test.sh <site-root-or-endpoint-url> [email]}
case "$URL" in */_functions*) ;; *) URL="${URL%/}/_functions/tunerSignup" ;; esac  # also accepts /_functions-dev/
EMAIL=${2:-tuner-test-$(date +%s)@example.com}
GOOD=https://faust-ifsa.github.io
EVIL=https://evil.example
fail=0
check() { # name, expected, actual
  if [ "$2" = "$3" ]; then echo "PASS  $1 ($3)"; else echo "FAIL  $1 (expected $2, got $3)"; fail=1; fi
}
status() { curl -s -o /dev/null -w '%{http_code}' "$@"; }
acao() { curl -s -D - -o /dev/null "$@" | grep -i '^access-control-allow-origin:' | tr -d '\r' | awk '{print $2}'; }
post() { # origin, json
  curl -s -o /dev/null -w '%{http_code}' -X POST -H "Origin: $1" -H 'Content-Type: application/json' -d "$2" "$URL"
}
body() { printf '{"email":"%s","lang":"cs","source":"landing","consent":%s,"consentVersion":"2026-11-v1","website":"%s"}' "$1" "$2" "$3"; }

echo "endpoint: $URL"; echo "email:    $EMAIL"
check "OPTIONS preflight -> 204"      204   "$(status -X OPTIONS -H "Origin: $GOOD" -H 'Access-Control-Request-Method: POST' "$URL")"
check "OPTIONS echoes allowed origin" "$GOOD" "$(acao -X OPTIONS -H "Origin: $GOOD" -H 'Access-Control-Request-Method: POST' "$URL")"
check "valid POST -> 200"             200   "$(post "$GOOD" "$(body "$EMAIL" true '')")"
check "POST carries allowed origin"   "$GOOD" "$(acao -X POST -H "Origin: $GOOD" -H 'Content-Type: application/json' -d "$(body "$EMAIL" true '')" "$URL")"
check "duplicate POST -> 200"         200   "$(post "$GOOD" "$(body "$EMAIL" true '')")"
check "bad email -> 400"              400   "$(post "$GOOD" "$(body 'not-an-email' true '')")"
check "consent:false -> 400"          400   "$(post "$GOOD" "$(body "$EMAIL" false '')")"
check "honeypot filled -> 400"        400   "$(post "$GOOD" "$(body "$EMAIL" true x)")"
check "evil origin: no ACAO (OPTIONS)" ""   "$(acao -X OPTIONS -H "Origin: $EVIL" -H 'Access-Control-Request-Method: POST' "$URL")"
check "evil origin: no ACAO (POST)"   ""    "$(acao -X POST -H "Origin: $EVIL" -H 'Content-Type: application/json' -d "$(body "$EMAIL" true '')" "$URL")"
echo; echo "Now check Wix Contacts for $EMAIL: label 'tuner' + fields tuner-consent-at / tuner-consent-version / tuner-source."
exit $fail
