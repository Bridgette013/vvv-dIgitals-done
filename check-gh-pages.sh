#!/usr/bin/env bash

set -e

echo "=== Checking latest gh-pages commit ==="
git fetch origin gh-pages
git log origin/gh-pages -1 --pretty=format:"%h %s (%ci)" || echo "No gh-pages branch found"

echo -e "\n=== Listing first 50 files on gh-pages ==="
git ls-tree -r origin/gh-pages --name-only | head -n 50

echo -e "\n=== Checking for CNAME file on gh-pages ==="
if git ls-tree -r origin/gh-pages --name-only | grep -q '^CNAME$'; then
  echo "CNAME file found:"
  git show origin/gh-pages:CNAME
else
  echo "No CNAME file found on gh-pages branch"
fi

echo -e "\n=== Checking repo root CNAME file ==="
if [ -f CNAME ]; then
  echo "Repo root CNAME file contents:"
  cat CNAME
else
  echo "No CNAME file in repo root"
fi

echo -e "\n=== Checking DNS records for vvvdigitals.com ==="
if command -v dig >/dev/null 2>&1; then
  dig +short A vvvdigitals.com
else
  echo "dig not found; install bind-utils or use online DNS checker"
fi

echo -e "\n=== Checking GitHub Pages settings ==="
echo "Visit: https://github.com/Bridgette013/vvv-dIgitals-done/settings/pages"
echo "Confirm custom domain and HTTPS are enabled."

echo -e "\n=== Done. If all checks pass, your site should be live at https://vvvdigitals.com ==="