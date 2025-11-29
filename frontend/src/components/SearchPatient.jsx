import { useState } from 'react';

export default function SearchPatient({ onSearch }) {
    const [patientId, setPatientId] = useState('');
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Only digits
        setPatientId(value);
        setError('');
    };

    const handleSearch = () => {
        if (!patientId) {
            setError('Please enter a Patient ID');
            return;
        }

        setError('');
        onSearch(patientId);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="search-patient bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">🔍 Search Patient by ID</h2>

            <div className="space-y-4">
                <div>
                    <label htmlFor="patient-id-input" className="block text-sm font-medium text-gray-700 mb-2">
                        Patient ID
                    </label>
                    <input
                        id="patient-id-input"
                        type="text"
                        value={patientId}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter Patient ID"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg tracking-wider"
                    />
                </div>

                {error && (
                    <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                <button
                    onClick={handleSearch}
                    disabled={!patientId}
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${!patientId
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md hover:shadow-lg'
                        }`}
                >
                    Search Patient
                </button>
            </div>
        </div>
    );
}
