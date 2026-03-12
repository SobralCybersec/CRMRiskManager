@echo off
echo Restarting backend-python and frontend...
echo.

docker-compose up -d --build backend-python frontend

echo.
echo Services restarted!
echo.
echo Backend Python: http://localhost:8001
echo Frontend: http://localhost:5175
