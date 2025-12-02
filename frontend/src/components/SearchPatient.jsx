import { useState } from 'react';
import { Search, CreditCard, AlertCircle } from 'lucide-react';

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
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                <Search className="text-blue-600" size={24} />
                Search Patient by ID
            </h2>

            <div className="space-y-6">
                <div>
                    <label htmlFor="patient-id-input" className="block text-sm font-bold text-slate-700 mb-2">
                        Patient ID
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                            <CreditCard size={20} />
                        </div>
                        <input
                            id="patient-id-input"
                            type="text"
                            value={patientId}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter Patient ID (e.g., 10001)"
                            className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-lg font-mono tracking-wider transition-all"
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-700">
                        <AlertCircle size={18} />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                <button
                    onClick={handleSearch}
                    disabled={!patientId}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${!patientId
                            ? 'bg-slate-300 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5'
                        }`}
                >
                    <Search size={20} />
                    Search Patient
                </button>
            </div>
        </div>
    );
}
