#!/usr/bin/env sh
# ORUVIA 배포 (macOS/Linux/Git Bash). 처음 한 번: npx wrangler login
set -e
npm install
npm run build
npx wrangler pages project create oruvia --production-branch main 2>/dev/null || true
npx wrangler pages deploy dist --project-name oruvia --branch main --commit-dirty=true
echo "배포 완료: https://oruvia.pages.dev"
