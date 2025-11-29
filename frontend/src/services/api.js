import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

/**
 * Upload CSV/TXT file with patient visit records
 * @param {File} file - File object
 * @returns {Promise} API response
 */
export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return await axios.post(`${API_BASE_URL}/uploadFile`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
    });
};

/**
 * Add a single patient visit
 * @param {Object} patientData - Patient information
 * @returns {Promise} API response
 */
export const addVisit = async (patientData) => {
    return await api.post('/addVisit', patientData);
};

/**
 * Get patient details by Aadhar number
 * @param {string} aadhar - 12-digit Aadhar number
 * @returns {Promise} API response
 */
export const getPatientByAadhar = async (aadhar) => {
    return await api.get(`/patient/${aadhar}`);
};

/**
 * Get patient details by Patient ID
 * @param {string} id - Patient ID
 * @returns {Promise} API response
 */
export const getPatientById = async (id) => {
    return await api.get(`/patient/id/${id}`);
};

/**
 * Get all patients
 * @returns {Promise} API response
 */
export const getAllPatients = async () => {
    return await api.get('/allPatients');
};

/**
 * Get system statistics
 * @returns {Promise} API response
 */
export const getStats = async () => {
    return await api.get('/stats');
};

export default api;
