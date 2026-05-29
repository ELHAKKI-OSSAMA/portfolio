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

:: Increase Node.js heap for large projects (avoids OOM in watch mode)
set NODE_OPTIONS=--max-old-space-size=4096

echo  [>] Starting development server (webpack mode)...
echo  [>] App will be available at: http://localhost:3000
echo  [i] For Turbopack instead: npm run dev:turbo
echo.
echo  Press Ctrl+C to stop the server.
echo.

npm run dev

pause
