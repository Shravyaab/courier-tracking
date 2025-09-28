@echo off
echo Starting Courier Tracking System...
echo.
echo Starting Backend Server...
start "Backend" cmd /k "cd backend && python simple_run.py"
echo.
echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > nul
echo.
echo Starting Frontend...
start "Frontend" cmd /k "npm start"
echo.
echo System started!
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:3000
echo.
echo Test accounts:
echo - admin/admin123
echo - customer1/customer123
echo.
echo Test tracking: TRK12345678
pause