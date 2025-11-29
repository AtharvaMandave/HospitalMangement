export default function PatientInfo({ patient }) {
    if (!patient) {
        return null;
    }

    // Parse department visits
    const departments = patient.DEPARTMENT_VISITED
        ? patient.DEPARTMENT_VISITED.split(',').map(d => d.trim())
        : [];

    return (
        <div className="patient-info bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-8 mt-6 border border-blue-100">
            <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                    {patient.NAME?.charAt(0) || 'P'}
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">{patient.NAME}</h2>
                    <p className="text-sm text-gray-500">Patient ID: {String(patient.PATIENT_ID).padStart(5, '0')} | Aadhar: {patient.AADHAR_NO}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <InfoCard icon="🆔" label="Patient ID" value={String(patient.PATIENT_ID).padStart(5, '0')} />
                <InfoCard icon="📇" label="Aadhar Number" value={patient.AADHAR_NO} />
                <InfoCard icon="👤" label="Age" value={patient.AGE || 'N/A'} />
                <InfoCard icon="⚧" label="Gender" value={patient.GENDER === 'M' ? 'Male' : patient.GENDER === 'F' ? 'Female' : 'Other'} />
                <InfoCard icon="📧" label="Phone" value={patient.PHONE || 'N/A'} />
                <InfoCard icon="🏥" label="Total Visits" value={patient.VISIT_COUNT || departments.length} />
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <div className="flex items-center mb-3">
                    <svg className="w-6 h-6 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-800">Address</h3>
                </div>
                <p className="text-gray-600">{patient.ADDRESS || 'Not provided'}</p>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 shadow-sm border border-emerald-200">
                <div className="flex items-center mb-4">
                    <svg className="w-6 h-6 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-800">Department Visit History</h3>
                </div>

                {departments.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {departments.map((dept, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-4 py-2 bg-white rounded-full text-sm font-medium text-emerald-700 shadow-sm border border-emerald-200"
                            >
                                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                                {dept}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No visit history available</p>
                )}

                <div className="mt-4 pt-4 border-t border-emerald-200">
                    <p className="text-sm text-gray-600">
                        <strong>Total Visits:</strong> {departments.length} department(s)
                    </p>
                </div>
            </div>
        </div>
    );
}

function InfoCard({ icon, label, value }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
                <span className="text-2xl mr-3">{icon}</span>
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
                    <p className="text-lg font-semibold text-gray-800">{value}</p>
                </div>
            </div>
        </div>
    );
}
