# ORUVIA 새 버전 올리기 (Windows PowerShell)
# 사용: 바탕화면 oruvia 폴더에서  .\deploy.ps1
# GitHub에서 최신 코드를 받고, 빌드하고, Cloudflare Pages(oruvia)에 올린다. PujaTime은 건드리지 않음.
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
git pull
npm install
npm run build
$w = "C:\Users\khans\Desktop\K자녀\kproject\node_modules\.bin\wrangler.cmd"
if (Test-Path $w) {
  & $w pages deploy dist --project-name oruvia --branch main --commit-dirty=true
} else {
  npx wrangler pages deploy dist --project-name oruvia --branch main --commit-dirty=true
}
Write-Host ""
Write-Host "완료: https://oruvia.pages.dev  (1~2분 뒤 새로고침)"
