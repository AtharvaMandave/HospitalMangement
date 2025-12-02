@echo off
echo ========================================
echo Queue Table Setup Script
echo ========================================
echo.

REM Load environment variables
for /f "tokens=1,2 delims==" %%a in (..\.env) do (
    if "%%a"=="DB2_DATABASE" set DB2_DATABASE=%%b
    if "%%a"=="DB2_HOSTNAME" set DB2_HOSTNAME=%%b
    if "%%a"=="DB2_PORT" set DB2_PORT=%%b
    if "%%a"=="DB2_UID" set DB2_UID=%%b
    if "%%a"=="DB2_PASSWORD" set DB2_PASSWORD=%%b
)

echo Database: %DB2_DATABASE%
echo Hostname: %DB2_HOSTNAME%
echo Port: %DB2_PORT%
echo User: %DB2_UID%
echo.

echo Creating QUEUE_MASTER table...
echo.

db2 connect to %DB2_DATABASE% user %DB2_UID% using %DB2_PASSWORD%

if %errorlevel% neq 0 (
    echo ERROR: Failed to connect to database
    pause
    exit /b 1
)

echo Connected successfully!
echo.

db2 -tvf create_queue_table.sql

if %errorlevel% neq 0 (
    echo ERROR: Failed to create table
    db2 connect reset
    pause
    exit /b 1
)

echo.
echo ========================================
echo Queue table created successfully!
echo ========================================
echo.

db2 connect reset

pause
