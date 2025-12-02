import { useState } from 'react';
import {
    UploadCloud,
    FileText,
    CheckCircle,
    AlertTriangle,
    UserPlus,
    UserCheck,
    CheckSquare,
    XCircle,
    Loader2
} from 'lucide-react';
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
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <UploadCloud size={24} />
                </div>
                Upload Patient Visit File
            </h2>

            <div className={`border-2 border-dashed rounded-xl p-10 mb-6 text-center transition-all duration-200 ${file ? 'border-blue-500 bg-blue-50/50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                }`}>
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
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-colors ${file ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'
                        }`}>
                        {file ? <FileText size={32} /> : <UploadCloud size={32} />}
                    </div>

                    <span className="text-xl font-semibold text-slate-700 mb-2">
                        {file ? file.name : 'Click to select file'}
                    </span>

                    <span className="text-sm text-slate-500">
                        {file ? (
                            <span className="text-blue-600 font-medium">{(file.size / 1024).toFixed(2)} KB</span>
                        ) : (
                            'Supports .csv and .txt files (Max 5MB)'
                        )}
                    </span>
                </label>
            </div>

            <button
                onClick={handleUpload}
                disabled={!file || loading}
                className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all shadow-lg ${!file || loading
                        ? 'bg-slate-300 cursor-not-allowed shadow-none'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/30 hover:-translate-y-0.5'
                    }`}
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin" size={20} />
                        Processing Records...
                    </span>
                ) : (
                    <span className="flex items-center justify-center gap-2">
                        <UploadCloud size={20} />
                        Upload and Process
                    </span>
                )}
            </button>

            {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                    <XCircle className="text-red-500 shrink-0" size={20} />
                    <div>
                        <h4 className="font-bold text-red-800 text-sm">Upload Failed</h4>
                        <p className="text-red-600 text-sm mt-1">{error}</p>
                    </div>
                </div>
            )}

            {result && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 mb-6 flex items-center gap-4">
                        <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                            <CheckCircle size={32} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-emerald-900">Upload Successful!</h3>
                            <p className="text-emerald-700">File has been processed and database updated.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <StatCard
                            icon={<UserPlus size={20} />}
                            label="New Patients"
                            value={result.newPatients}
                            color="text-blue-600"
                            bg="bg-blue-50"
                        />
                        <StatCard
                            icon={<UserCheck size={20} />}
                            label="Updated"
                            value={result.updatedPatients}
                            color="text-purple-600"
                            bg="bg-purple-50"
                        />
                        <StatCard
                            icon={<CheckSquare size={20} />}
                            label="Valid Records"
                            value={result.validRecords}
                            color="text-emerald-600"
                            bg="bg-emerald-50"
                        />
                        <StatCard
                            icon={<AlertTriangle size={20} />}
                            label="Invalid"
                            value={result.invalidRecords}
                            color="text-orange-600"
                            bg="bg-orange-50"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ icon, label, value, color, bg }) {
    return (
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className={`${bg} ${color} p-2 rounded-lg mb-2`}>
                {icon}
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{label}</p>
        </div>
    );
}
