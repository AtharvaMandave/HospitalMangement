import { useState } from 'react';

export default function SearchPatient({ onSearch }) {
    const [aadhar, setAadhar] = useState('');
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Only digits
        if (value.length <= 12) {
            setAadhar(value);
            setError('');
        }
    };

    const handleSearch = () => {
        if (!aadhar) {
            setError('Please enter an Aadhar number');
            return;
        }

        if (aadhar.length !== 12) {
            setError('Aadhar number must be exactly 12 digits');
            return;
        }

        setError('');
        onSearch(aadhar);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="search-patient bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">🔍 Search Patient by Aadhar</h2>

            <div className="space-y-4">
                <div>
                    <label htmlFor="aadhar-input" className="block text-sm font-medium text-gray-700 mb-2">
                        Aadhar Number (12 digits)
                    </label>
                    <input
                        id="aadhar-input"
                        type="text"
                        value={aadhar}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter 12-digit Aadhar number"
                        maxLength="12"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg tracking-wider"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        {aadhar.length}/12 digits
                    </p>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                <button
                    onClick={handleSearch}
                    disabled={aadhar.length !== 12}
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${aadhar.length !== 12
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
