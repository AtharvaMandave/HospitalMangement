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
 * @route   POST /api/addBulkVisits
 * @desc    Add multiple patient visit records
 * @access  Public
 */
router.post(
    '/addBulkVisits',
    asyncHandler(patientController.addBulkVisits)
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
 * @route   GET /api/patient/id/:id
 * @desc    Get patient details by Patient ID
 * @access  Public
 */
router.get(
    '/patient/id/:id',
    asyncHandler(patientController.getPatientById)
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

/**
 * @route   GET /api/patients/date-range
 * @desc    Get patients by date range
 * @access  Public
 */
router.get(
    '/patients/date-range',
    asyncHandler(patientController.getPatientsByDateRange)
);

/**
 * @route   GET /api/patients/today
 * @desc    Get patients created today
 * @access  Public
 */
router.get(
    '/patients/today',
    asyncHandler(patientController.getTodaysPatients)
);

/**
 * @route   GET /api/patients/sort/by-visits
 * @desc    Get patients sorted by visit count (most frequent first)
 * @access  Public
 */
router.get(
    '/patients/sort/by-visits',
    asyncHandler(patientController.getPatientsByVisits)
);

export default router;
