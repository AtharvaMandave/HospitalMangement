import express from 'express';
import * as analyticsController from '../controllers/analyticsController.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

const router = express.Router();

/**
 * @route   GET /api/analytics
 * @desc    Get comprehensive analytics data
 * @access  Public
 */
router.get(
    '/',
    asyncHandler(analyticsController.getAnalytics)
);

export default router;
