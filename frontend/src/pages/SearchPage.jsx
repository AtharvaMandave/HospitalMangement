import { useState } from 'react';
import { Search, AlertCircle, FileSearch } from 'lucide-react';
import SearchPatient from '../components/SearchPatient';
import PatientInfo from '../components/PatientInfo';
import QueueControl from '../components/QueueControl';
import { getPatientById } from '../services/api';

export default function SearchPage() {
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (id) => {
        setLoading(true);
        setError(null);
        setPatient(null);
        setSearched(false);

        try {
            const response = await getPatientById(id);

            if (response.data.success && response.data.data) {
                setPatient(response.data.data);
            } else {
                setError('Patient not found');
            }
            setSearched(true);
        } catch (err) {
            console.error('Search error:', err);
            if (err.response?.status === 404) {
                setError('No patient found with this Patient ID');
            } else {
                setError(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to search. Please try again.');
            }
            setSearched(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Page Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4 text-blue-600">
                        <Search size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        Search Patient Records
                    </h1>
                    <p className="text-lg text-slate-500">
                        Find patient details and visit history using Patient ID
                    </p>
                </div>

                {/* Search Component */}
                <SearchPatient onSearch={handleSearch} />

                {/* Loading State */}
                {loading && (
                    <div className="mt-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
                        <p className="text-slate-500 mt-4 font-medium">Searching database...</p>
                    </div>
                )}

                {/* Error State */}
                {error && searched && !loading && (
                    <div className="mt-8 bg-white rounded-2xl border border-red-100 shadow-lg p-8 text-center max-w-lg mx-auto">
                        <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="text-red-500" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Patient Not Found</h3>
                        <p className="text-slate-600 mb-4">{error}</p>
                        <p className="text-sm text-slate-400">
                            Please verify the Patient ID and try again
                        </p>
                    </div>
                )}

                {/* Patient Info Display */}
                {patient && !loading && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <PatientInfo patient={patient} />
                        <QueueControl patient={patient} />
                    </div>
                )}

                {/* Initial State - No Search Yet */}
                {!patient && !loading && !searched && (
                    <div className="mt-16 text-center opacity-50">
                        <FileSearch className="w-24 h-24 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-400 text-lg">Enter a Patient ID above to begin search</p>
                    </div>
                )}
            </div>
        </div>
    );
}
