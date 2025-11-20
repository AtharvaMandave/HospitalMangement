import express from 'express';
import * as patientController from '../controllers/patientController.js';
import { upload, handleMulterError } from '../middlewares/multer.middleware.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

const router = express.Router();

/**
 * @route   POST /api/uploadFile
 * @desc    Upload CSV/TXT file with patient visit records
 * @access  Public
 */
router.post(
    '/uploadFile',
    upload.single('file'),
    handleMulterError,
    asyncHandler(patientController.uploadFile)
);

/**
 * @route   POST /api/addVisit
 * @desc    Add a single patient visit record
 * @access  Public
 */
router.post(
    '/addVisit',
    asyncHandler(patientController.addVisit)
);

/**
 * @route   GET /api/patient/:aadhar
 * @desc    Get patient details by Aadhar number
 * @access  Public
 */
router.get(
    '/patient/:aadhar',
    asyncHandler(patientController.getPatientByAadhar)
);

/**
 * @route   GET /api/allPatients
 * @desc    Get all patients
 * @access  Public
 */
router.get(
    '/allPatients',
    asyncHandler(patientController.getAllPatients)
);

/**
 * @route   GET /api/stats
 * @desc    Get patient statistics
 * @access  Public
 */
router.get(
    '/stats',
    asyncHandler(patientController.getStats)
);

export default router;
