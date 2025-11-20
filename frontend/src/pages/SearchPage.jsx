import { useState } from 'react';
import SearchPatient from '../components/SearchPatient';
import PatientInfo from '../components/PatientInfo';
import { getPatientByAadhar } from '../services/api';

export default function SearchPage() {
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (aadhar) => {
        setLoading(true);
        setError(null);
        setPatient(null);
        setSearched(false);

        try {
            const response = await getPatientByAadhar(aadhar);

            if (response.data.success && response.data.data) {
                setPatient(response.data.data);
            } else {
                setError('Patient not found');
            }
            setSearched(true);
        } catch (err) {
            console.error('Search error:', err);
            if (err.response?.status === 404) {
                setError('No patient found with this Aadhar number');
            } else {
                setError(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to search. Please try again.');
            }
            setSearched(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Page Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-3">
                        🔍 Search Patient Records
                    </h1>
                    <p className="text-lg text-gray-600">
                        Find patient details and visit history using Aadhar number
                    </p>
                </div>

                {/* Search Component */}
                <SearchPatient onSearch={handleSearch} />

                {/* Loading State */}
                {loading && (
                    <div className="mt-8 text-center">
                        <div className="inline-block">
                            <svg className="animate-spin h-12 w-12 text-indigo-600" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <p className="text-gray-600 mt-3">Searching...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && searched && !loading && (
                    <div className="mt-8 bg-white rounded-2xl shadow-lg p-8 text-center">
                        <svg className="w-20 h-20 text-orange-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Patient Not Found</h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <p className="text-sm text-gray-500">
                            Please verify the Aadhar number and try again
                        </p>
                    </div>
                )}

                {/* Patient Info Display */}
                {patient && !loading && (
                    <PatientInfo patient={patient} />
                )}

                {/* Initial State - No Search Yet */}
                {!patient && !loading && !searched && (
                    <div className="mt-12 text-center">
                        <svg className="w-32 h-32 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                        <p className="text-gray-500 text-lg">Enter an Aadhar number above to search</p>
                    </div>
                )}
            </div>
        </div>
    );
}
