import fs from 'fs';
import csv from 'csv-parser';
import { validatePatientData, cleanAadhar } from '../utils/validators.js';

/**
 * Parse CSV file containing patient visit records
 * @param {string} filePath - Path to the CSV file
 * @returns {Promise<Array>} Array of validated patient objects
 */
export const parseCSVFile = (filePath) => {
    return new Promise((resolve, reject) => {
        const patients = [];
        const errors = [];
        let lineNumber = 1;

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            reject(new Error(`File not found: ${filePath}`));
            return;
        }

        fs.createReadStream(filePath)
            .pipe(csv({
                mapHeaders: ({ header }) => header.trim().toUpperCase(),
                skipLines: 0
            }))
            .on('data', (row) => {
                lineNumber++;

                try {
                    // Clean and structure the data
                    const patientData = {
                        AADHAR_NO: row.AADHAR_NO ? cleanAadhar(row.AADHAR_NO) : null,
                        NAME: row.NAME ? row.NAME.trim() : null,
                        AGE: row.AGE ? parseInt(row.AGE) : null,
                        GENDER: row.GENDER ? row.GENDER.trim().toUpperCase().charAt(0) : null,
                        ADDRESS: row.ADDRESS ? row.ADDRESS.trim() : null,
                        PHONE: row.PHONE ? row.PHONE.trim() : null,
                        DEPARTMENT_VISITED: row.DEPARTMENT_VISITED ? row.DEPARTMENT_VISITED.trim() : null
                    };

                    // Validate the patient data
                    const validation = validatePatientData(patientData);

                    if (validation.valid) {
                        patients.push(patientData);
                    } else {
                        errors.push({
                            line: lineNumber,
                            aadhar: patientData.AADHAR_NO,
                            errors: validation.errors
                        });
                        console.warn(`⚠️ Line ${lineNumber}: Validation failed -`, validation.errors.join(', '));
                    }
                } catch (error) {
                    errors.push({
                        line: lineNumber,
                        error: error.message
                    });
                    console.error(`❌ Error parsing line ${lineNumber}:`, error.message);
                }
            })
            .on('end', () => {
                console.log(`✅ CSV parsing completed. Valid records: ${patients.length}, Errors: ${errors.length}`);

                // Delete the file after processing
                try {
                    fs.unlinkSync(filePath);
                    console.log(`🗑️ Deleted temporary file: ${filePath}`);
                } catch (err) {
                    console.warn(`⚠️ Could not delete file ${filePath}:`, err.message);
                }

                resolve({
                    patients,
                    errors,
                    summary: {
                        totalLines: lineNumber - 1,
                        validRecords: patients.length,
                        invalidRecords: errors.length
                    }
                });
            })
            .on('error', (error) => {
                console.error('❌ CSV parsing error:', error);
                reject(error);
            });
    });
};

/**
 * Parse text file (tab or space delimited)
 * @param {string} filePath - Path to the text file
 * @returns {Promise<Array>} Array of validated patient objects
 */
export const parseTextFile = (filePath) => {
    return new Promise((resolve, reject) => {
        const patients = [];
        const errors = [];

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }

            const lines = data.split('\n');
            let lineNumber = 0;

            // Skip header line
            for (let i = 1; i < lines.length; i++) {
                lineNumber++;
                const line = lines[i].trim();

                if (!line) continue; // Skip empty lines

                // Split by tab or multiple spaces
                const fields = line.split(/[\t]+|[ ]{2,}/);

                if (fields.length < 7) {
                    errors.push({
                        line: lineNumber,
                        error: 'Insufficient fields'
                    });
                    continue;
                }

                const patientData = {
                    AADHAR_NO: cleanAadhar(fields[0]),
                    NAME: fields[1].trim(),
                    AGE: parseInt(fields[2]),
                    GENDER: fields[3].trim().toUpperCase().charAt(0),
                    ADDRESS: fields[4].trim(),
                    PHONE: fields[5].trim(),
                    DEPARTMENT_VISITED: fields[6].trim()
                };

                const validation = validatePatientData(patientData);

                if (validation.valid) {
                    patients.push(patientData);
                } else {
                    errors.push({
                        line: lineNumber,
                        aadhar: patientData.AADHAR_NO,
                        errors: validation.errors
                    });
                }
            }

            // Delete the file after processing
            try {
                fs.unlinkSync(filePath);
                console.log(`🗑️ Deleted temporary file: ${filePath}`);
            } catch (err) {
                console.warn(`⚠️ Could not delete file ${filePath}:`, err.message);
            }

            resolve({
                patients,
                errors,
                summary: {
                    totalLines: lineNumber,
                    validRecords: patients.length,
                    invalidRecords: errors.length
                }
            });
        });
    });
};
