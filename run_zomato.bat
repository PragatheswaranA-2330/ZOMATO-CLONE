@echo off
echo =========================================
echo Starting Zomato Web Application...
echo =========================================

echo 1. Starting Backend API on port 5001...
cd backend
start cmd /k "npm start"

echo 2. Starting Frontend Web Server on port 3000...
cd ..
start cmd /k "npx serve -l 3000"

echo Done! The servers are starting in new windows.
echo Please wait a few seconds, then refresh your browser at http://localhost:3000
pause
