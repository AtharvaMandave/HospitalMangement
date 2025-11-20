import { useState } from 'react';
import { uploadFile } from '../services/api';

export default function FileUpload() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            // Validate file type
            const validTypes = ['text/csv', 'text/plain', 'application/vnd.ms-excel'];
            const fileName = selectedFile.name.toLowerCase();

            if (!fileName.endsWith('.csv') && !fileName.endsWith('.txt')) {
                setError('Please select a CSV or TXT file');
                setFile(null);
                return;
            }

            setFile(selectedFile);
            setError(null);
            setResult(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file first');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await uploadFile(file);

            if (response.data.success) {
                setResult(response.data.summary);
                setFile(null);
                // Reset file input
                document.getElementById('file-input').value = '';
            } else {
                setError(response.data.message || 'Upload failed');
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to upload file. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="file-upload-container bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">📁 Upload Patient Visit File</h2>

            <div className="upload-area border-2 border-dashed border-blue-300 rounded-xl p-8 mb-6 text-center hover:border-blue-500 transition-colors">
                <input
                    id="file-input"
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                />
                <label
                    htmlFor="file-input"
                    className="cursor-pointer flex flex-col items-center"
                >
                    <svg className="w-16 h-16 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-lg font-medium text-gray-700">
                        {file ? file.name : 'Click to select CSV or TXT file'}
                    </span>
                    <span className="text-sm text-gray-500 mt-2">
                        Maximum file size: 5MB
                    </span>
                </label>
            </div>

            {file && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                        <strong>Selected:</strong> {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </p>
                </div>
            )}

            <button
                onClick={handleUpload}
                disabled={!file || loading}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${!file || loading
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg'
                    }`}
            >
                {loading ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                    </span>
                ) : (
                    'Upload and Process File'
                )}
            </button>

            {error && (
                <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                    <p className="text-red-800">
                        <strong>Error:</strong> {error}
                    </p>
                </div>
            )}

            {result && (
                <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Upload Successful!
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <p className="text-2xl font-bold text-blue-600">{result.newPatients}</p>
                            <p className="text-sm text-gray-600">New Patients Added</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <p className="text-2xl font-bold text-purple-600">{result.updatedPatients}</p>
                            <p className="text-sm text-gray-600">Existing Patients Updated</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <p className="text-2xl font-bold text-green-600">{result.validRecords}</p>
                            <p className="text-sm text-gray-600">Valid Records</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <p className="text-2xl font-bold text-orange-600">{result.invalidRecords}</p>
                            <p className="text-sm text-gray-600">Invalid Records</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
