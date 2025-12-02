import * as AnalyticsModel from '../models/Analytics.model.js';

/**
 * Get analytics data
 * GET /api/analytics
 */
export const getAnalytics = async (req, res, next) => {
    try {
        const analytics = await AnalyticsModel.getAnalytics();

        res.status(200).json({
            success: true,
            data: analytics
        });
    } catch (error) {
        console.error('❌ Error in getAnalytics:', error);
        next(error);
    }
};
