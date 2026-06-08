@echo off
title Ossama Portfolio - Dev Server

echo.
echo  ==========================================
echo   Ossama Portfolio - Next.js Dev Server
echo  ==========================================
echo.

:: Kill any running Node.js processes so .next files are not locked
echo  [~] Stopping any running Node.js processes...
taskkill /F /IM node.exe /T >nul 2>&1
timeout /t 2 /nobreak >nul
echo  [OK] Done.
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

:: Clear Next.js build cache to avoid stale SSR modules
if exist ".next" (
    echo  [~] Clearing .next cache...
    rmdir /s /q .next
    if errorlevel 1 (
        echo  [!] Could not clear cache - some files may be locked.
    ) else (
        echo  [OK] Cache cleared.
    )
    echo.
)

:: Increase Node.js heap for large projects (avoids OOM in watch mode)
set NODE_OPTIONS=--max-old-space-size=4096

echo  [>] Starting development server (webpack mode)...
echo  [>] App will be available at: http://localhost:3000
echo.
echo  Press Ctrl+C to stop the server.
echo.

npm run dev

pause
