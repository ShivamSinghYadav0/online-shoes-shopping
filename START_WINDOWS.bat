@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (echo Node.js 20+ is required. Install from https://nodejs.org/ & pause & exit /b 1)
echo.
echo ==========================================
echo   AUVRYKO V15 - FIXED HOMEPAGE RELEASE
echo   Open: http://127.0.0.1:3100
echo ==========================================
echo.
start "" cmd /c "timeout /t 2 >nul & start http://127.0.0.1:3100"
set PORT=3100
npm start
pause
