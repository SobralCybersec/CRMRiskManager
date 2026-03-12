@echo off
echo Rebuilding CRM Risk Manager...
echo.

echo Stopping all services...
docker-compose down

echo.
echo Removing old images...
docker-compose rm -f

echo.
echo Building and starting services...
docker-compose up --build -d

echo.
echo Waiting for services to be ready...
timeout /t 15 /nobreak > nul

echo.
echo Services status:
docker-compose ps

echo.
echo Rebuild complete!
