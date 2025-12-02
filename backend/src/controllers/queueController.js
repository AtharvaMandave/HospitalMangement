import * as QueueModel from '../models/Queue.model.js';
import { emitQueueUpdate } from '../socket.js';

/**
 * Add patient to queue
 * POST /api/queue/add
 */
export const addPatientToQueue = async (req, res, next) => {
    try {
        const { PATIENT_ID, AADHAR_NO, PATIENT_NAME, DEPARTMENT } = req.body;

        if (!PATIENT_ID || !AADHAR_NO || !PATIENT_NAME || !DEPARTMENT) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const queueEntry = await QueueModel.addToQueue({
            PATIENT_ID,
            AADHAR_NO,
            PATIENT_NAME,
            DEPARTMENT
        });

        // Emit real-time update
        const activeQueue = await QueueModel.getActiveQueue();
        emitQueueUpdate(activeQueue);

        res.status(201).json({
            success: true,
            message: 'Patient added to queue',
            data: queueEntry
        });
    } catch (error) {
        console.error('❌ Error in addPatientToQueue:', error);
        next(error);
    }
};

/**
 * Get active queue
 * GET /api/queue/active
 */
export const getActiveQueue = async (req, res, next) => {
    try {
        const queue = await QueueModel.getActiveQueue();

        res.status(200).json({
            success: true,
            count: queue.length,
            data: queue
        });
    } catch (error) {
        console.error('❌ Error in getActiveQueue:', error);
        next(error);
    }
};

/**
 * Get queue by department
 * GET /api/queue/department/:department
 */
export const getQueueByDepartment = async (req, res, next) => {
    try {
        const { department } = req.params;

        const queue = await QueueModel.getQueueByDepartment(department);

        res.status(200).json({
            success: true,
            department,
            count: queue.length,
            data: queue
        });
    } catch (error) {
        console.error('❌ Error in getQueueByDepartment:', error);
        next(error);
    }
};

/**
 * Update queue status
 * PUT /api/queue/status/:id
 */
export const updateQueueStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['WAITING', 'IN_PROGRESS', 'DONE'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be WAITING, IN_PROGRESS, or DONE'
            });
        }

        const updatedEntry = await QueueModel.updateQueueStatus(id, status);

        if (!updatedEntry) {
            return res.status(404).json({
                success: false,
                message: 'Queue entry not found'
            });
        }

        // Emit real-time update
        const activeQueue = await QueueModel.getActiveQueue();
        emitQueueUpdate(activeQueue);

        res.status(200).json({
            success: true,
            message: 'Queue status updated',
            data: updatedEntry
        });
    } catch (error) {
        console.error('❌ Error in updateQueueStatus:', error);
        next(error);
    }
};

/**
 * Call next patient in queue
 * POST /api/queue/call-next/:department
 */
export const callNextPatient = async (req, res, next) => {
    try {
        const { department } = req.params;

        const nextPatient = await QueueModel.callNextPatient(department);

        if (!nextPatient) {
            return res.status(404).json({
                success: false,
                message: 'No patients waiting in queue'
            });
        }

        // Emit real-time update
        const activeQueue = await QueueModel.getActiveQueue();
        emitQueueUpdate(activeQueue);

        res.status(200).json({
            success: true,
            message: 'Next patient called',
            data: nextPatient
        });
    } catch (error) {
        console.error('❌ Error in callNextPatient:', error);
        next(error);
    }
};

/**
 * Mark patient as done
 * POST /api/queue/complete/:id
 */
export const completePatient = async (req, res, next) => {
    try {
        const { id } = req.params;

        const updatedEntry = await QueueModel.updateQueueStatus(id, 'DONE');

        if (!updatedEntry) {
            return res.status(404).json({
                success: false,
                message: 'Queue entry not found'
            });
        }

        // Emit real-time update
        const activeQueue = await QueueModel.getActiveQueue();
        emitQueueUpdate(activeQueue);

        res.status(200).json({
            success: true,
            message: 'Patient marked as done',
            data: updatedEntry
        });
    } catch (error) {
        console.error('❌ Error in completePatient:', error);
        next(error);
    }
};
