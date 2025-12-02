import { executeQuery, executeNonQuery } from '../config/db2.js';

/**
 * Queue Model - Handles all database operations for QUEUE_MASTER table
 */

/**
 * Add patient to queue
 * @param {Object} queueData - Queue entry data
 * @returns {Promise<Object>} Created queue entry
 */
export const addToQueue = async (queueData) => {
    try {
        // Get next queue number for the department
        const queueNumberSql = `
            SELECT COALESCE(MAX(QUEUE_NUMBER), 0) + 1 AS NEXT_NUMBER
            FROM QUEUE_MASTER
            WHERE DEPARTMENT = ? AND STATUS IN ('WAITING', 'IN_PROGRESS')
        `;
        const queueNumberResult = await executeQuery(queueNumberSql, [queueData.DEPARTMENT]);
        const queueNumber = queueNumberResult[0].NEXT_NUMBER;

        const sql = `
            INSERT INTO QUEUE_MASTER 
            (PATIENT_ID, AADHAR_NO, PATIENT_NAME, DEPARTMENT, STATUS, QUEUE_NUMBER) 
            VALUES (?, ?, ?, ?, 'WAITING', ?)
        `;
        const params = [
            queueData.PATIENT_ID,
            queueData.AADHAR_NO,
            queueData.PATIENT_NAME,
            queueData.DEPARTMENT,
            queueNumber
        ];

        await executeNonQuery(sql, params);
        console.log(`✅ Added patient ${queueData.PATIENT_NAME} to ${queueData.DEPARTMENT} queue`);

        // Return the newly created queue entry
        return await getLatestQueueEntry(queueData.AADHAR_NO);
    } catch (error) {
        console.error('❌ Error in addToQueue:', error);
        throw error;
    }
};

/**
 * Get latest queue entry for a patient
 * @param {string} aadhar - Aadhar number
 * @returns {Promise<Object>} Queue entry
 */
const getLatestQueueEntry = async (aadhar) => {
    try {
        const sql = `
            SELECT * FROM QUEUE_MASTER 
            WHERE AADHAR_NO = ? 
            ORDER BY CREATED_AT DESC 
            FETCH FIRST 1 ROWS ONLY
        `;
        const result = await executeQuery(sql, [aadhar]);
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error('❌ Error in getLatestQueueEntry:', error);
        throw error;
    }
};

/**
 * Get active queue (WAITING and IN_PROGRESS)
 * @returns {Promise<Array>} Array of queue entries
 */
export const getActiveQueue = async () => {
    try {
        const sql = `
            SELECT * FROM QUEUE_MASTER 
            WHERE STATUS IN ('WAITING', 'IN_PROGRESS')
            ORDER BY DEPARTMENT, QUEUE_NUMBER
        `;
        return await executeQuery(sql);
    } catch (error) {
        console.error('❌ Error in getActiveQueue:', error);
        throw error;
    }
};

/**
 * Get queue by department
 * @param {string} department - Department name
 * @returns {Promise<Array>} Array of queue entries
 */
export const getQueueByDepartment = async (department) => {
    try {
        const sql = `
            SELECT * FROM QUEUE_MASTER 
            WHERE DEPARTMENT = ? AND STATUS IN ('WAITING', 'IN_PROGRESS')
            ORDER BY QUEUE_NUMBER
        `;
        return await executeQuery(sql, [department]);
    } catch (error) {
        console.error('❌ Error in getQueueByDepartment:', error);
        throw error;
    }
};

/**
 * Update queue status
 * @param {number} queueId - Queue ID
 * @param {string} newStatus - New status (WAITING, IN_PROGRESS, DONE)
 * @returns {Promise<Object>} Updated queue entry
 */
export const updateQueueStatus = async (queueId, newStatus) => {
    try {
        const sql = `
            UPDATE QUEUE_MASTER 
            SET STATUS = ?, UPDATED_AT = CURRENT TIMESTAMP
            WHERE QUEUE_ID = ?
        `;
        await executeNonQuery(sql, [newStatus, queueId]);
        console.log(`✅ Updated queue ${queueId} to ${newStatus}`);

        // Return updated entry
        return await getQueueById(queueId);
    } catch (error) {
        console.error('❌ Error in updateQueueStatus:', error);
        throw error;
    }
};

/**
 * Get queue entry by ID
 * @param {number} queueId - Queue ID
 * @returns {Promise<Object>} Queue entry
 */
export const getQueueById = async (queueId) => {
    try {
        const sql = 'SELECT * FROM QUEUE_MASTER WHERE QUEUE_ID = ?';
        const result = await executeQuery(sql, [queueId]);
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error('❌ Error in getQueueById:', error);
        throw error;
    }
};

/**
 * Call next patient in queue for a department
 * @param {string} department - Department name
 * @returns {Promise<Object>} Next patient in queue
 */
export const callNextPatient = async (department) => {
    try {
        // Get the next waiting patient
        const sql = `
            SELECT * FROM QUEUE_MASTER 
            WHERE DEPARTMENT = ? AND STATUS = 'WAITING'
            ORDER BY QUEUE_NUMBER
            FETCH FIRST 1 ROWS ONLY
        `;
        const result = await executeQuery(sql, [department]);

        if (result.length === 0) {
            return null;
        }

        const nextPatient = result[0];

        // Update status to IN_PROGRESS
        await updateQueueStatus(nextPatient.QUEUE_ID, 'IN_PROGRESS');

        return await getQueueById(nextPatient.QUEUE_ID);
    } catch (error) {
        console.error('❌ Error in callNextPatient:', error);
        throw error;
    }
};

/**
 * Clear completed queue entries (older than 24 hours)
 * @returns {Promise<boolean>} Success status
 */
export const clearOldQueue = async () => {
    try {
        const sql = `
            DELETE FROM QUEUE_MASTER 
            WHERE STATUS = 'DONE' 
            AND UPDATED_AT < CURRENT TIMESTAMP - 24 HOURS
        `;
        await executeNonQuery(sql);
        console.log('✅ Cleared old queue entries');
        return true;
    } catch (error) {
        console.error('❌ Error in clearOldQueue:', error);
        throw error;
    }
};
