import { useState } from 'react';
import axios from 'axios';
import {
    Heart,
    Activity,
    Move,
    Stethoscope,
    Smile,
    AlertTriangle,
    Ticket
} from 'lucide-react';

const API_URL = 'http://localhost:4000/api/queue';

export default function QueueControl({ patient, onUpdate }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const addToQueue = async (department) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await axios.post(`${API_URL}/add`, {
                PATIENT_ID: patient.PATIENT_ID,
                AADHAR_NO: patient.AADHAR_NO,
                PATIENT_NAME: patient.NAME,
                DEPARTMENT: department
            });

            if (response.data.success) {
                setSuccess(`Added to ${department} queue!`);
                if (onUpdate) onUpdate();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add to queue');
        } finally {
            setLoading(false);
        }
    };

    const departments = [
        { name: 'Cardiology', icon: <Heart size={24} />, color: 'from-red-500 to-pink-500' },
        { name: 'Neurology', icon: <Activity size={24} />, color: 'from-purple-500 to-indigo-500' },
        { name: 'Orthopedics', icon: <Move size={24} />, color: 'from-blue-500 to-cyan-500' },
        { name: 'General', icon: <Stethoscope size={24} />, color: 'from-green-500 to-emerald-500' },
        { name: 'Pediatrics', icon: <Smile size={24} />, color: 'from-yellow-500 to-orange-500' },
        { name: 'Emergency', icon: <AlertTriangle size={24} />, color: 'from-red-600 to-red-700' }
    ];

    return (
        <div className="bg-white rounded-2xl p-6 mt-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <div className="bg-indigo-100 p-2 rounded-lg">
                    <Ticket className="text-indigo-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Add to Queue</h3>
            </div>

            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center">
                    <AlertTriangle size={18} className="mr-2" />
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center">
                    <Ticket size={18} className="mr-2" />
                    {success}
                </div>
            )}

            <p className="text-slate-600 mb-4 font-medium">Select a department to add this patient:</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {departments.map((dept) => (
                    <button
                        key={dept.name}
                        onClick={() => addToQueue(dept.name)}
                        disabled={loading}
                        className={`group relative overflow-hidden bg-gradient-to-br ${dept.color} text-white p-4 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-left`}
                    >
                        <div className="relative z-10">
                            <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center mb-3 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                                {dept.icon}
                            </div>
                            <span className="font-bold block">{dept.name}</span>
                        </div>

                        {/* Decorative circle */}
                        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all"></div>
                    </button>
                ))}
            </div>

            {loading && (
                <div className="mt-6 flex items-center justify-center text-indigo-600">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current mr-2"></div>
                    <span className="font-medium">Processing request...</span>
                </div>
            )}
        </div>
    );
}
