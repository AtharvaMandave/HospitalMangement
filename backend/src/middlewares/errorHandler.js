/**
 * Global error handling middleware
 * Catches all errors and sends formatted JSON response
 */
export const errorHandler = (err, req, res, next) => {
    console.error('❌ Error occurred:', err);

    // Default error status and message
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = err.message;
    }

    // DB2 specific errors
    if (err.message && err.message.includes('SQL')) {
        statusCode = 500;
        message = 'Database error occurred';

        // Check for specific DB2 errors
        if (err.message.includes('SQL0803N')) {
            statusCode = 409;
            message = 'Duplicate record - This Aadhar number already exists';
        }
    }

    // Send error response
    res.status(statusCode).json({
        success: false,
        error: {
            message: message,
            ...(process.env.NODE_ENV === 'development' && {
                stack: err.stack,
                details: err
            })
        }
    });
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        success: false,
        error: {
            message: `Route ${req.originalUrl} not found`
        }
    });
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
