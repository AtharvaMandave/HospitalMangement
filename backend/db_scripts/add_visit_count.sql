-- Add VISIT_COUNT column to PATIENT_MASTER table
-- This script adds a new column to track the number of visits per patient

-- Add the VISIT_COUNT column with default value of 1
ALTER TABLE PATIENT_MASTER
ADD COLUMN VISIT_COUNT INTEGER DEFAULT 1;

-- Update existing records to have a visit count based on departments visited
-- Count commas in DEPARTMENT_VISITED and add 1
UPDATE PATIENT_MASTER
SET VISIT_COUNT = LENGTH(DEPARTMENT_VISITED) - LENGTH(REPLACE(DEPARTMENT_VISITED, ',', '')) + 1
WHERE DEPARTMENT_VISITED IS NOT NULL;

-- Set VISIT_COUNT to 1 for any records with null departments
UPDATE PATIENT_MASTER
SET VISIT_COUNT = 1
WHERE DEPARTMENT_VISITED IS NULL;

COMMIT;
