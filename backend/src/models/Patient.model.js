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
 * Find patient by Patient ID
 * @param {string} patientId - Patient ID
 * @returns {Promise<Object|null>} Patient object or null if not found
 */
export const findByPatientId = async (patientId) => {
    try {
        const sql = 'SELECT * FROM PATIENT_MASTER WHERE PATIENT_ID = ?';
        const result = await executeQuery(sql, [patientId]);
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error('❌ Error in findByPatientId:', error);
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
      (AADHAR_NO, NAME, AGE, GENDER, ADDRESS, PHONE, DEPARTMENT_VISITED, VISIT_COUNT) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
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
        // Return the newly created patient
        return await findByAadhar(patientData.AADHAR_NO);
    } catch (error) {
        console.error('❌ Error in createPatient:', error);
        throw error;
    }
};

/**
 * Update department visit history for existing patient
 * Appends new department to existing comma‑separated list and increments VISIT_COUNT
 * @param {string} aadhar - 12‑digit Aadhar number
 * @param {string} newDepartment - Department to append
 * @returns {Promise<Object>} Updated patient record
 */
export const updateDepartmentVisit = async (aadhar, newDepartment) => {
    try {
        const existingPatient = await findByAadhar(aadhar);
        if (!existingPatient) {
            throw new Error('Patient not found');
        }
        const existingDepartments = existingPatient.DEPARTMENT_VISITED || '';
        const departmentList = existingDepartments.split(',').map(d => d.trim());
        if (!departmentList.includes(newDepartment.trim())) {
            const sql = `
        UPDATE PATIENT_MASTER 
        SET DEPARTMENT_VISITED = DEPARTMENT_VISITED || ', ' || ?,
            VISIT_COUNT = VISIT_COUNT + 1
        WHERE AADHAR_NO = ?
      `;
            await executeNonQuery(sql, [newDepartment, aadhar]);
            console.log(`✅ Updated department visit for Aadhar ${aadhar}: Added ${newDepartment}`);
        } else {
            console.log(`ℹ️ Department ${newDepartment} already exists for Aadhar ${aadhar}`);
        }
        return await findByAadhar(aadhar);
    } catch (error) {
        console.error('❌ Error in updateDepartmentVisit:', error);
        throw error;
    }
};

/**
 * Get all patients ordered by Aadhar number
 * @returns {Promise<Array>} Array of patient records
 */
export const getAllPatients = async () => {
    try {
        const sql = 'SELECT * FROM PATIENT_MASTER ORDER BY AADHAR_NO';
        return await executeQuery(sql);
    } catch (error) {
        console.error('❌ Error in getAllPatients:', error);
        throw error;
    }
};

/**
 * Delete a patient by Aadhar (admin/testing only)
 * @param {string} aadhar - 12‑digit Aadhar number
 * @returns {Promise<boolean>} True if deleted
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

/**
 * Get all patients sorted by visit count (most visits first)
 * @returns {Promise<Array>} Array of patient records
 */
export const getPatientsByVisitCount = async () => {
    try {
        const sql = 'SELECT * FROM PATIENT_MASTER ORDER BY VISIT_COUNT DESC, AADHAR_NO';
        return await executeQuery(sql);
    } catch (error) {
        console.error('❌ Error in getPatientsByVisitCount:', error);
        throw error;
    }
};

/**
 * Get patients created today
 * @returns {Promise<Array>} Array of patient records created today
 */
export const getTodaysPatients = async () => {
    try {
        const sql = `
            SELECT * FROM PATIENT_MASTER 
            WHERE DATE(CREATED_AT) = CURRENT_DATE 
            ORDER BY CREATED_AT DESC
        `;
        return await executeQuery(sql);
    } catch (error) {
        console.error('❌ Error in getTodaysPatients:', error);
        throw error;
    }
};

/**
 * Get patients created within a date range
 * @param {string} startDate - Start date (YYYY‑MM‑DD)
 * @param {string} endDate - End date (YYYY‑MM‑DD)
 * @returns {Promise<Array>} Array of patient records within the range
 */
export const getPatientsByDateRange = async (startDate, endDate) => {
    try {
        const sql = `
            SELECT * FROM PATIENT_MASTER 
            WHERE DATE(CREATED_AT) BETWEEN ? AND ?
            ORDER BY CREATED_AT DESC
        `;
        return await executeQuery(sql, [startDate, endDate]);
    } catch (error) {
        console.error('❌ Error in getPatientsByDateRange:', error);
        throw error;
    }
};
