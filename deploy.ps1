param([Parameter(Mandatory=$true)][string]$Token)
$H = @{ Authorization = "token $Token"; Accept = 'application/vnd.github+json'; 'User-Agent' = 'omnicounter-deploy' }
Write-Host "`n[1/4] GitHub 계정 확인..."
$me = Invoke-RestMethod -Uri 'https://api.github.com/user' -Headers $H
$login = $me.login
Write-Host "  -> 계정: $login"
Write-Host "[2/4] 저장소 omnicounter 생성..."
try {
  $body = @{ name='omnicounter'; private=$false; description='OmniCounter - universal counter PWA'; homepage="https://$login.github.io/omnicounter/" } | ConvertTo-Json
  Invoke-RestMethod -Method Post -Uri 'https://api.github.com/user/repos' -Headers $H -Body $body | Out-Null
  Write-Host "  -> 생성됨: $login/omnicounter"
} catch { Write-Host "  -> 이미 있거나 건너뜀 - 계속" }
Write-Host "[3/4] 파일 업로드(push)..."
Set-Location $PSScriptRoot
if (-not (Test-Path .git)) { git init | Out-Null; git branch -M main }
git add -A | Out-Null
git -c user.email="deploy@omnicounter.local" -c user.name="OmniCounter" commit -m "OmniCounter deploy" 2>&1 | Out-Null
git remote remove origin 2>&1 | Out-Null
git remote add origin "https://github.com/$login/omnicounter.git"
git -c http.extraheader="Authorization: Bearer $Token" push -u origin main --force
Write-Host "  -> 업로드 완료"
Write-Host "[4/4] GitHub Pages 활성화..."
try {
  $pb = @{ source = @{ branch='main'; path='/' } } | ConvertTo-Json
  Invoke-RestMethod -Method Post -Uri "https://api.github.com/repos/$login/omnicounter/pages" -Headers $H -Body $pb | Out-Null
  Write-Host "  -> Pages 켜짐"
} catch { Write-Host "  -> 이미 켜졌거나 곧 반영 - 계속" }
$url = "https://$login.github.io/omnicounter/"
Write-Host "`n==================================================="
Write-Host "  고정 링크(1~2분 뒤 활성화): $url"
Write-Host "  이 주소를 채팅에 붙여넣어 주세요. 앞으로 URL 고정."
Write-Host "==================================================="
