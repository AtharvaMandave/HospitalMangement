import FileUpload from '../components/FileUpload';

export default function UploadPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Page Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-3">
                        📤 Upload Patient Visit Records
                    </h1>
                    <p className="text-lg text-gray-600">
                        Import daily patient visit data from CSV or TXT files
                    </p>
                </div>

                {/* Upload Component */}
                <FileUpload />

                {/* Instructions */}
                <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        File Format Guidelines
                    </h2>

                    <div className="space-y-4 text-gray-600">
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">CSV Format Example:</h3>
                            <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                                <pre className="text-sm">
                                    {`AADHAR_NO,NAME,AGE,GENDER,ADDRESS,PHONE,DEPARTMENT_VISITED
123456789012,John Doe,45,M,123 Main St,9876543210,Heart
234567890123,Jane Smith,32,F,456 Park Ave,9876543211,Fracture`}
                                </pre>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Required Fields:</h3>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li><strong>AADHAR_NO:</strong> 12-digit Aadhar number (required)</li>
                                <li><strong>NAME:</strong> Patient name (required)</li>
                                <li><strong>DEPARTMENT_VISITED:</strong> Department name (required)</li>
                                <li><strong>AGE:</strong> Patient age (optional)</li>
                                <li><strong>GENDER:</strong> M/F/O (optional)</li>
                                <li><strong>ADDRESS:</strong> Patient address (optional)</li>
                                <li><strong>PHONE:</strong> Contact number (optional)</li>
                            </ul>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                            <p className="text-sm">
                                <strong>💡 Note:</strong> If a patient with the same Aadhar already exists,
                                the system will automatically update their department visit history instead of creating a duplicate record.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
