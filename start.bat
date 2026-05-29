@echo off
title Ossama Portfolio - Dev Server

echo.
echo  ==========================================
echo   Ossama Portfolio - Next.js Dev Server
echo  ==========================================
echo.

:: Check if node_modules exists
if not exist "node_modules" (
    echo  [!] node_modules not found. Installing dependencies...
    echo.
    npm install
    if errorlevel 1 (
        echo.
        echo  [ERROR] npm install failed. Make sure Node.js is installed.
        pause
        exit /b 1
    )
    echo.
    echo  [OK] Dependencies installed.
    echo.
)

echo  [>] Starting development server...
echo  [>] App will be available at: http://localhost:3000
echo.
echo  Press Ctrl+C to stop the server.
echo.

npm run dev

pause
