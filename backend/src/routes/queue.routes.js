import express from 'express';
import * as queueController from '../controllers/queueController.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

const router = express.Router();

/**
 * @route   POST /api/queue/add
 * @desc    Add patient to queue
 * @access  Public
 */
router.post(
    '/add',
    asyncHandler(queueController.addPatientToQueue)
);

/**
 * @route   GET /api/queue/active
 * @desc    Get active queue (all departments)
 * @access  Public
 */
router.get(
    '/active',
    asyncHandler(queueController.getActiveQueue)
);

/**
 * @route   GET /api/queue/department/:department
 * @desc    Get queue by department
 * @access  Public
 */
router.get(
    '/department/:department',
    asyncHandler(queueController.getQueueByDepartment)
);

/**
 * @route   PUT /api/queue/status/:id
 * @desc    Update queue status
 * @access  Public
 */
router.put(
    '/status/:id',
    asyncHandler(queueController.updateQueueStatus)
);

/**
 * @route   POST /api/queue/call-next/:department
 * @desc    Call next patient in queue for department
 * @access  Public
 */
router.post(
    '/call-next/:department',
    asyncHandler(queueController.callNextPatient)
);

/**
 * @route   POST /api/queue/complete/:id
 * @desc    Mark patient as done
 * @access  Public
 */
router.post(
    '/complete/:id',
    asyncHandler(queueController.completePatient)
);

export default router;
