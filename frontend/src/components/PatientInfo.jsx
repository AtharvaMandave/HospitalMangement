import {
    User,
    CreditCard,
    Fingerprint,
    Calendar,
    Phone,
    Activity,
    MapPin,
    History,
    ShieldCheck
} from 'lucide-react';

export default function PatientInfo({ patient }) {
    if (!patient) {
        return null;
    }

    // Parse department visits
    const departments = patient.DEPARTMENT_VISITED
        ? patient.DEPARTMENT_VISITED.split(',').map(d => d.trim())
        : [];

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden mb-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl font-bold shadow-inner border border-white/30">
                        {patient.NAME?.charAt(0) || 'P'}
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold mb-2">{patient.NAME}</h2>
                        <div className="flex items-center gap-4 text-blue-100 text-sm font-medium">
                            <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full">
                                <CreditCard size={14} />
                                ID: {String(patient.PATIENT_ID).padStart(5, '0')}
                            </span>
                            <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full">
                                <Fingerprint size={14} />
                                Aadhar: {patient.AADHAR_NO}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8">
                {/* Info Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <InfoCard icon={<Calendar size={20} />} label="Age" value={patient.AGE ? `${patient.AGE} Years` : 'N/A'} />
                    <InfoCard icon={<User size={20} />} label="Gender" value={patient.GENDER === 'M' ? 'Male' : patient.GENDER === 'F' ? 'Female' : 'Other'} />
                    <InfoCard icon={<Phone size={20} />} label="Phone" value={patient.PHONE || 'N/A'} />
                    <InfoCard icon={<MapPin size={20} />} label="Address" value={patient.ADDRESS || 'Not provided'} className="md:col-span-2" />
                    <InfoCard icon={<Activity size={20} />} label="Total Visits" value={patient.VISIT_COUNT || departments.length} />
                </div>

                {/* Visit History */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                    <div className="flex items-center gap-2 mb-4 text-slate-800">
                        <History className="text-blue-600" size={20} />
                        <h3 className="font-bold text-lg">Department Visit History</h3>
                    </div>

                    {departments.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {departments.map((dept, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1.5 bg-white rounded-lg text-sm font-medium text-slate-700 shadow-sm border border-slate-200"
                                >
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                                    {dept}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500 italic text-sm">No visit history available</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function InfoCard({ icon, label, value, className = '' }) {
    return (
        <div className={`bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 ${className}`}>
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
                {icon}
            </div>
            <div>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-0.5">{label}</p>
                <p className="text-slate-800 font-semibold">{value}</p>
            </div>
        </div>
    );
}
