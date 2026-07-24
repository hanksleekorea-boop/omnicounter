@echo off
chcp 65001 >nul
echo OmniCounter - GitHub Pages 자동 배포
echo -------------------------------------
set /p TOKEN=GitHub 토큰(ghp_...)을 붙여넣고 Enter: 
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0deploy.ps1" -Token "%TOKEN%"
echo.
pause
