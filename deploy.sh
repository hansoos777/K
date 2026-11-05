#!/usr/bin/env sh
# 믿어보까 배포 (macOS/Linux/Git Bash). 처음 한 번: npx wrangler login
set -e
npm install
npm run build
npx wrangler pages project create mideobogga --production-branch main 2>/dev/null || true
npx wrangler pages deploy dist --project-name mideobogga --branch main --commit-dirty=true
echo "배포 완료: https://mideobogga.pages.dev"
