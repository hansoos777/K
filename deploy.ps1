# 믿어보까 새 버전 올리기 (Windows PowerShell)
# 사용: 바탕화면 oruvia 폴더에서  .\deploy.ps1
# GitHub에서 최신 코드를 받고, 빌드하고, Cloudflare Pages(mideobogga)에 올린다. PujaTime은 건드리지 않음.
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
git pull
npm install
npm run build
$w = "C:\Users\khans\Desktop\K자녀\kproject\node_modules\.bin\wrangler.cmd"
$run = { if (Test-Path $w) { & $w @args } else { npx wrangler @args } }
# 프로젝트가 아직 없으면 만든다(이미 있으면 오류가 나도 무시하고 계속)
$ErrorActionPreference = 'Continue'
& $run pages project create mideobogga --production-branch main
$ErrorActionPreference = 'Stop'
& $run pages deploy dist --project-name mideobogga --branch main --commit-dirty=true
Write-Host ""
Write-Host "완료: https://mideobogga.pages.dev  (1~2분 뒤 새로고침)"
