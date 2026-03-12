@echo off
echo Starting CRM Risk Manager...
echo.

echo Building and starting all services...
docker-compose up --build -d

echo.
echo Waiting for services to be ready...
timeout /t 10 /nobreak > nul

echo.
echo Services status:
docker-compose ps

echo.
echo ========================================
echo CRM Risk Manager is running!
echo ========================================
echo.
echo Frontend:        http://localhost:5175
echo Backend API:     http://localhost:8080
echo Python API:      http://localhost:8001
echo PostgreSQL:      localhost:5432
echo Redis:           localhost:6379
echo.
echo To view logs: docker-compose logs -f
echo To stop:      docker-compose down
echo ========================================
