import express from "express";
import cookieparser from 'cookie-parser'
import cors from 'cors'
import patientRoutes from './routes/patient.routes.js';
import queueRoutes from './routes/queue.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

const app = express();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

// Body parsers
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))

// Static files
app.use(express.static("public"))

// Cookie parser
app.use(cookieparser())

// API Routes
app.use('/api', patientRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Hospital Patient Visit Tracking System is running',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

export { app }