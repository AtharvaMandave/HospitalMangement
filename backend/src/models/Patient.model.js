import { executeQuery, executeNonQuery } from '../config/db2.js';

/**
 * Patient Model - Handles all database operations for PATIENT_MASTER table
 */

/**
 * Find patient by Aadhar number
 * @param {string} aadhar - 12-digit Aadhar number
 * @returns {Promise<Object|null>} Patient object or null if not found
 */
export const findByAadhar = async (aadhar) => {
    try {
        const sql = 'SELECT * FROM PATIENT_MASTER WHERE AADHAR_NO = ?';
        const result = await executeQuery(sql, [aadhar]);

        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error('❌ Error in findByAadhar:', error);
        throw error;
    }
};

/**
 * Create a new patient record
 * @param {Object} patientData - Patient data object
 * @returns {Promise<Object>} Created patient record
 */
export const createPatient = async (patientData) => {
    try {
        const sql = `
      INSERT INTO PATIENT_MASTER 
      (AADHAR_NO, NAME, AGE, GENDER, ADDRESS, PHONE, DEPARTMENT_VISITED) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

        const params = [
            patientData.AADHAR_NO,
            patientData.NAME,
            patientData.AGE || null,
            patientData.GENDER || null,
            patientData.ADDRESS || null,
            patientData.PHONE || null,
            patientData.DEPARTMENT_VISITED
        ];

        await executeNonQuery(sql, params);

        // Fetch and return the created record
        return await findByAadhar(patientData.AADHAR_NO);
    } catch (error) {
        console.error('❌ Error in createPatient:', error);
        throw error;
    }
};

/**
 * Update department visit history for existing patient
 * Appends new department to existing comma-separated list
 * @param {string} aadhar - 12-digit Aadhar number
 * @param {string} newDepartment - Department to append
 * @returns {Promise<Object>} Updated patient record
 */
export const updateDepartmentVisit = async (aadhar, newDepartment) => {
    try {
        // First, check if the department already exists in the visit history
        const existingPatient = await findByAadhar(aadhar);

        if (!existingPatient) {
            throw new Error('Patient not found');
        }

        // Check if department already exists in the visit history
        const existingDepartments = existingPatient.DEPARTMENT_VISITED || '';
        const departmentList = existingDepartments.split(',').map(d => d.trim());

        // Only append if department is not already in the list
        if (!departmentList.includes(newDepartment.trim())) {
            const sql = `
        UPDATE PATIENT_MASTER 
        SET DEPARTMENT_VISITED = DEPARTMENT_VISITED || ', ' || ?
        WHERE AADHAR_NO = ?
      `;

            await executeNonQuery(sql, [newDepartment, aadhar]);
            console.log(`✅ Updated department visit for Aadhar ${aadhar}: Added ${newDepartment}`);
        } else {
            console.log(`ℹ️ Department ${newDepartment} already exists for Aadhar ${aadhar}, skipping`);
        }

        // Fetch and return the updated record
        return await findByAadhar(aadhar);
    } catch (error) {
        console.error('❌ Error in updateDepartmentVisit:', error);
        throw error;
    }
};

/**
 * Get all patients ordered by Aadhar number
 * @returns {Promise<Array>} Array of all patient records
 */
export const getAllPatients = async () => {
    try {
        const sql = 'SELECT * FROM PATIENT_MASTER ORDER BY AADHAR_NO';
        const result = await executeQuery(sql);

        return result;
    } catch (error) {
        console.error('❌ Error in getAllPatients:', error);
        throw error;
    }
};

/**
 * Delete a patient by Aadhar (for testing/admin purposes)
 * @param {string} aadhar - 12-digit Aadhar number
 * @returns {Promise<boolean>} True if deleted successfully
 */
export const deletePatient = async (aadhar) => {
    try {
        const sql = 'DELETE FROM PATIENT_MASTER WHERE AADHAR_NO = ?';
        await executeNonQuery(sql, [aadhar]);

        console.log(`✅ Deleted patient with Aadhar ${aadhar}`);
        return true;
    } catch (error) {
        console.error('❌ Error in deletePatient:', error);
        throw error;
    }
};

/**
 * Get total patient count
 * @returns {Promise<number>} Total number of patients
 */
export const getPatientCount = async () => {
    try {
        const sql = 'SELECT COUNT(*) AS TOTAL FROM PATIENT_MASTER';
        const result = await executeQuery(sql);

        return result[0].TOTAL;
    } catch (error) {
        console.error('❌ Error in getPatientCount:', error);
        throw error;
    }
};
