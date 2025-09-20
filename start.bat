@echo off
echo Starting Market Sentiment Dashboard...
echo.

echo Installing backend dependencies...
cd backend
npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies
    pause
    exit /b 1
)

echo Installing frontend dependencies...
cd ../frontend
npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies
    pause
    exit /b 1
)

echo.
echo Starting backend server...
cd ../backend
start cmd /k "npm start"

timeout /t 3 /nobreak > nul

echo Starting frontend development server...
cd ../frontend
start cmd /k "npm start"

echo.
echo Market Sentiment Dashboard is starting up!
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul
