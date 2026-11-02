# ORUVIA 배포 (Windows PowerShell). PujaTime 배포에 쓰던 Cloudflare 로그인을 그대로 사용.
# 처음 한 번: npx wrangler login   (이미 로그인돼 있으면 생략)
# 실행: 이 폴더에서  .\deploy.ps1
$ErrorActionPreference = 'Stop'
npm install
npm run build
npx wrangler pages project create oruvia --production-branch main 2>$null
npx wrangler pages deploy dist --project-name oruvia --branch main --commit-dirty=true
Write-Host "배포 완료: https://oruvia.pages.dev"
