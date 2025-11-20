@echo off
REM Hospital Patient Tracking System - Database Setup Script
REM This script creates the PATIENT_MASTER table in DB2

echo ========================================
echo Hospital Patient Tracking System
echo Database Setup Script
echo ========================================
echo.

echo [1/3] Connecting to DB2 database HOSPDB...
db2 connect to HOSPDB user db2admin using Atharva@123

echo.
echo [2/3] Creating PATIENT_MASTER table...
db2 "CREATE TABLE PATIENT_MASTER (AADHAR_NO CHAR(12) NOT NULL PRIMARY KEY, NAME VARCHAR(50), AGE INTEGER, GENDER CHAR(1), ADDRESS VARCHAR(100), PHONE VARCHAR(15), DEPARTMENT_VISITED VARCHAR(500), CREATED_AT TIMESTAMP DEFAULT CURRENT TIMESTAMP)"

echo.
echo [2.5/3] Creating index on NAME field...
db2 "CREATE INDEX IDX_PATIENT_NAME ON PATIENT_MASTER(NAME)"

echo.
echo [3/3] Verifying table creation...
db2 "SELECT TABNAME, CREATE_TIME FROM SYSCAT.TABLES WHERE TABNAME = 'PATIENT_MASTER'"

echo.
echo [4/3] Checking table structure...
db2 "DESCRIBE TABLE PATIENT_MASTER"

echo.
echo [5/3] Disconnecting from database...
db2 disconnect HOSPDB

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Run: cd backend
echo 2. Run: node test-db.js
echo 3. Open: http://localhost:5173
echo.

pause
