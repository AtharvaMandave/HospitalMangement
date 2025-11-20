/**
 * Validate Aadhar number format
 * @param {string} aadhar - Aadhar number to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const validateAadhar = (aadhar) => {
    if (!aadhar) return false;

    // Remove spaces and special characters
    const cleanAadhar = aadhar.replace(/\s/g, '');

    // Must be exactly 12 digits
    if (cleanAadhar.length !== 12) return false;

    // Must be numeric
    if (!/^\d{12}$/.test(cleanAadhar)) return false;

    return true;
};

/**
 * Sanitize string input to prevent SQL injection
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (str) => {
    if (typeof str !== 'string') return str;

    // Remove potentially dangerous characters
    return str.trim();
};

/**
 * Validate complete patient data object
 * @param {Object} patientData - Patient data to validate
 * @returns {Object} { valid: boolean, errors: Array }
 */
export const validatePatientData = (patientData) => {
    const errors = [];

    // Required fields
    if (!patientData.AADHAR_NO) {
        errors.push('Aadhar number is required');
    } else if (!validateAadhar(patientData.AADHAR_NO)) {
        errors.push('Aadhar number must be exactly 12 digits');
    }

    if (!patientData.NAME || patientData.NAME.trim() === '') {
        errors.push('Name is required');
    }

    if (!patientData.DEPARTMENT_VISITED || patientData.DEPARTMENT_VISITED.trim() === '') {
        errors.push('Department visited is required');
    }

    // Optional but validated if present
    if (patientData.AGE && (isNaN(patientData.AGE) || patientData.AGE < 0 || patientData.AGE > 150)) {
        errors.push('Age must be a valid number between 0 and 150');
    }

    if (patientData.GENDER && !['M', 'F', 'O'].includes(patientData.GENDER.toUpperCase())) {
        errors.push('Gender must be M, F, or O');
    }

    if (patientData.PHONE && !/^\d{10,15}$/.test(patientData.PHONE.replace(/\s/g, ''))) {
        errors.push('Phone number must be 10-15 digits');
    }

    return {
        valid: errors.length === 0,
        errors
    };
};

/**
 * Clean and format Aadhar number
 * @param {string} aadhar - Aadhar number
 * @returns {string} Cleaned 12-digit Aadhar
 */
export const cleanAadhar = (aadhar) => {
    return aadhar.replace(/\s/g, '').substring(0, 12);
};
