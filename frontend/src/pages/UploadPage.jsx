import { Upload, Info, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import FileUpload from '../components/FileUpload';

export default function UploadPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Page Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4 text-blue-600">
                        <Upload size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        Upload Patient Records
                    </h1>
                    <p className="text-lg text-slate-500">
                        Import daily patient visit data from CSV or TXT files
                    </p>
                </div>

                {/* Upload Component */}
                <FileUpload />

                {/* Instructions */}
                <div className="mt-10 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-slate-50 p-6 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Info className="text-blue-600" size={20} />
                            File Format Guidelines
                        </h2>
                    </div>

                    <div className="p-6 space-y-8">
                        <div>
                            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                <FileText size={18} className="text-slate-400" />
                                CSV Format Example
                            </h3>
                            <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto shadow-inner">
                                <pre className="text-sm text-blue-300 font-mono">
                                    {`AADHAR_NO,NAME,AGE,GENDER,ADDRESS,PHONE,DEPARTMENT_VISITED
123456789012,John Doe,45,M,123 Main St,9876543210,Heart
234567890123,Jane Smith,32,F,456 Park Ave,9876543211,Fracture`}
                                </pre>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                <CheckCircle size={18} className="text-slate-400" />
                                Required Fields
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <span className="font-mono text-sm font-bold text-slate-700">AADHAR_NO</span>
                                    <p className="text-xs text-slate-500 mt-1">12-digit unique identifier</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <span className="font-mono text-sm font-bold text-slate-700">NAME</span>
                                    <p className="text-xs text-slate-500 mt-1">Full name of patient</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <span className="font-mono text-sm font-bold text-slate-700">DEPARTMENT_VISITED</span>
                                    <p className="text-xs text-slate-500 mt-1">Department name</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
                            <AlertCircle className="text-blue-600 shrink-0" size={20} />
                            <p className="text-sm text-blue-800">
                                <strong>Smart Deduplication:</strong> If a patient with the same Aadhar already exists,
                                the system will automatically update their department visit history instead of creating a duplicate record.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
