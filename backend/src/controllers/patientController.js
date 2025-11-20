import * as PatientModel from '../models/Patient.model.js';
import { parseCSVFile, parseTextFile } from '../services/fileParser.js';
import { validatePatientData, cleanAadhar } from '../utils/validators.js';
import path from 'path';

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

        // Process each patient record
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
 * Get patient details by Aadhar number
 * GET /api/patient/:aadhar
 */
export const getPatientByAadhar = async (req, res, next) => {
    try {
        const aadhar = cleanAadhar(req.params.aadhar);

        // Validate Aadhar format
        if (aadhar.length !== 12) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Aadhar number. Must be 12 digits.'
            });
        }

        // Find patient
        const patient = await PatientModel.findByAadhar(aadhar);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        res.status(200).json({
            success: true,
            data: patient
        });
    } catch (error) {
        console.error('❌ Error in getPatientByAadhar:', error);
        next(error);
    }
};

/**
 * Get all patients
 * GET /api/allPatients
 */
export const getAllPatients = async (req, res, next) => {
    try {
        const patients = await PatientModel.getAllPatients();

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
