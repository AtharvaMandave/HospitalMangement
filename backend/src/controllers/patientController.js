import * as PatientModel from '../models/Patient.model.js';
import { parseCSVFile, parseTextFile } from '../services/fileParser.js';
import { validatePatientData, cleanAadhar } from '../utils/validators.js';
import path from 'path';

/**
 * Helper function to process a batch of patients
 * @param {Array} patients - Array of patient data objects
 * @returns {Promise<Object>} Summary of processing
 */
const processPatientBatch = async (patients) => {
    let newPatientsCount = 0;
    let updatedPatientsCount = 0;
    const processingErrors = [];

    for (const patientData of patients) {
        try {
            // Check if patient exists
            const existingPatient = await PatientModel.findByAadhar(patientData.AADHAR_NO);

            if (existingPatient) {
                // Patient exists - update department visit
                await PatientModel.updateDepartmentVisit(
                    patientData.AADHAR_NO,
                    patientData.DEPARTMENT_VISITED
                );
                updatedPatientsCount++;
            } else {
                // New patient - create record
                await PatientModel.createPatient(patientData);
                newPatientsCount++;
            }
        } catch (error) {
            console.error(`❌ Error processing patient ${patientData.AADHAR_NO}:`, error.message);
            processingErrors.push({
                aadhar: patientData.AADHAR_NO,
                error: error.message
            });
        }
    }

    return {
        newPatientsCount,
        updatedPatientsCount,
        processingErrors
    };
};

/**
 * Upload and process file containing patient visit records
 * POST /api/uploadFile
 */
export const uploadFile = async (req, res, next) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const filePath = req.file.path;
        const fileExtension = path.extname(req.file.originalname).toLowerCase();

        console.log(`📁 Processing uploaded file: ${req.file.originalname}`);

        // Parse the file based on extension
        let parseResult;
        if (fileExtension === '.csv') {
            parseResult = await parseCSVFile(filePath);
        } else if (fileExtension === '.txt') {
            parseResult = await parseTextFile(filePath);
        } else {
            return res.status(400).json({
                success: false,
                message: 'Unsupported file format'
            });
        }

        const { patients, errors, summary } = parseResult;

        // Process patients using helper
        const processingResult = await processPatientBatch(patients);
        const { newPatientsCount, updatedPatientsCount, processingErrors } = processingResult;

        console.log(`✅ File processing complete. New: ${newPatientsCount}, Updated: ${updatedPatientsCount}`);

        // Send response with summary
        res.status(200).json({
            success: true,
            message: 'File processed successfully',
            summary: {
                totalRecords: summary.totalLines,
                validRecords: summary.validRecords,
                invalidRecords: summary.invalidRecords,
                newPatients: newPatientsCount,
                updatedPatients: updatedPatientsCount,
                processingErrors: processingErrors.length
            },
            errors: errors.length > 0 ? errors : undefined,
            processingErrors: processingErrors.length > 0 ? processingErrors : undefined
        });
    } catch (error) {
        console.error('❌ Error in uploadFile:', error);
        next(error);
    }
};

/**
 * Add multiple patient visit records
 * POST /api/addBulkVisits
 */
export const addBulkVisits = async (req, res, next) => {
    try {
        const { patients } = req.body;

        if (!Array.isArray(patients) || patients.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid data. Expected an array of patients.'
            });
        }

        console.log(`📝 Processing bulk manual entry: ${patients.length} records`);

        // Validate and clean data before processing
        const validPatients = [];
        const validationErrors = [];

        patients.forEach((p, index) => {
            const patientData = {
                AADHAR_NO: cleanAadhar(p.AADHAR_NO || p.aadhar || ''),
                NAME: p.NAME || p.name,
                AGE: p.AGE || p.age,
                GENDER: p.GENDER || p.gender,
                ADDRESS: p.ADDRESS || p.address,
                PHONE: p.PHONE || p.phone,
                DEPARTMENT_VISITED: p.DEPARTMENT_VISITED || p.department
            };

            const validation = validatePatientData(patientData);
            if (validation.valid) {
                validPatients.push(patientData);
            } else {
                validationErrors.push({
                    index,
                    aadhar: patientData.AADHAR_NO,
                    errors: validation.errors
                });
            }
        });

        if (validPatients.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid patient records found',
                errors: validationErrors
            });
        }

        // Process valid patients
        const processingResult = await processPatientBatch(validPatients);
        const { newPatientsCount, updatedPatientsCount, processingErrors } = processingResult;

        console.log(`✅ Bulk processing complete. New: ${newPatientsCount}, Updated: ${updatedPatientsCount}`);

        res.status(200).json({
            success: true,
            message: 'Bulk records processed successfully',
            summary: {
                totalReceived: patients.length,
                validRecords: validPatients.length,
                invalidRecords: validationErrors.length,
                newPatients: newPatientsCount,
                updatedPatients: updatedPatientsCount,
                processingErrors: processingErrors.length
            },
            validationErrors: validationErrors.length > 0 ? validationErrors : undefined,
            processingErrors: processingErrors.length > 0 ? processingErrors : undefined
        });

    } catch (error) {
        console.error('❌ Error in addBulkVisits:', error);
        next(error);
    }
};

/**
 * Add a single patient visit record
 * POST /api/addVisit
 */
export const addVisit = async (req, res, next) => {
    try {
        const patientData = {
            AADHAR_NO: cleanAadhar(req.body.AADHAR_NO || req.body.aadhar || ''),
            NAME: req.body.NAME || req.body.name,
            AGE: req.body.AGE || req.body.age,
            GENDER: req.body.GENDER || req.body.gender,
            ADDRESS: req.body.ADDRESS || req.body.address,
            PHONE: req.body.PHONE || req.body.phone,
            DEPARTMENT_VISITED: req.body.DEPARTMENT_VISITED || req.body.department
        };

        // Validate patient data
        const validation = validatePatientData(patientData);
        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            });
        }

        // Check if patient exists
        const existingPatient = await PatientModel.findByAadhar(patientData.AADHAR_NO);

        let result;
        let isNew = false;

        if (existingPatient) {
            // Update existing patient's department visit
            result = await PatientModel.updateDepartmentVisit(
                patientData.AADHAR_NO,
                patientData.DEPARTMENT_VISITED
            );
            console.log(`✅ Updated visit for existing patient: ${patientData.AADHAR_NO}`);
        } else {
            // Create new patient
            result = await PatientModel.createPatient(patientData);
            isNew = true;
            console.log(`✅ Created new patient: ${patientData.AADHAR_NO}`);
        }

        res.status(isNew ? 201 : 200).json({
            success: true,
            message: isNew ? 'New patient record created' : 'Patient visit updated',
            isNew,
            data: result
        });
    } catch (error) {
        console.error('❌ Error in addVisit:', error);
        next(error);
    }
};

/**

        res.status(200).json({
            success: true,
            count: patients.length,
            data: patients
        });
    } catch (error) {
        console.error('❌ Error in getAllPatients:', error);
        next(error);
    }
};

/**
 * Get patient statistics
 * GET /api/stats
 */
export const getStats = async (req, res, next) => {
    try {
        const totalPatients = await PatientModel.getPatientCount();

        res.status(200).json({
            success: true,
            stats: {
                totalPatients
            }
        });
    } catch (error) {
        console.error('❌ Error in getStats:', error);
        next(error);
    }
};

/**
 * Get patients sorted by visit count (most frequent visitors first)
 * GET /api/patients/sort/by-visits
 */
export const getPatientsByVisits = async (req, res, next) => {
    try {
        const patients = await PatientModel.getPatientsByVisitCount();

        res.status(200).json({
            success: true,
            count: patients.length,
            data: patients
        });
    } catch (error) {
        console.error('❌ Error in getPatientsByVisits:', error);
        next(error);
    }
};

/**
 * Get patients created today
 * GET /api/patients/today
 */
export const getTodaysPatients = async (req, res, next) => {
    try {
        const patients = await PatientModel.getTodaysPatients();

        res.status(200).json({
            success: true,
            count: patients.length,
            data: patients
        });
    } catch (error) {
        console.error('❌ Error in getTodaysPatients:', error);
        next(error);
    }
};

/**
 * Get patients by date range
 * GET /api/patients/date-range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 */
export const getPatientsByDateRange = async (req, res, next) => {
    try {
        console.log('🚀 getPatientsByDateRange called with', req.query);
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Both startDate and endDate are required'
            });
        }

        const patients = await PatientModel.getPatientsByDateRange(startDate, endDate);

        res.status(200).json({
            success: true,
            count: patients.length,
            data: patients
        });
    } catch (error) {
        console.error('❌ Error in getPatientsByDateRange:', error);
        next(error);
    }
};
