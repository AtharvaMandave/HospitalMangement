-- Hospital Patient Visit Tracking System - Create Table Script
-- Database: HOSPDB
-- Execute this script to create the PATIENT_MASTER table

-- Drop table if exists (optional - comment out if you want to keep existing data)
-- DROP TABLE PATIENT_MASTER;

-- Create the main patient table
CREATE TABLE PATIENT_MASTER (
    AADHAR_NO CHAR(12) NOT NULL PRIMARY KEY,
    NAME VARCHAR(50),
    AGE INTEGER,
    GENDER CHAR(1),
    ADDRESS VARCHAR(100),
    PHONE VARCHAR(15),
    DEPARTMENT_VISITED VARCHAR(500),
    CREATED_AT TIMESTAMP DEFAULT CURRENT TIMESTAMP
);

-- Create index for faster name searches
CREATE INDEX IDX_PATIENT_NAME ON PATIENT_MASTER(NAME);

-- Verify table creation
SELECT TABNAME, COLNAME, TYPENAME, LENGTH 
FROM SYSCAT.COLUMNS 
WHERE TABNAME = 'PATIENT_MASTER' 
ORDER BY COLNO;

-- Show table structure
DESCRIBE TABLE PATIENT_MASTER;

-- Display message
VALUES ('PATIENT_MASTER table created successfully!');
