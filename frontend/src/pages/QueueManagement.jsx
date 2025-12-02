import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Stethoscope,
    Megaphone,
    CheckCircle,
    Clock,
    Activity,
    Users,
    Filter,
    AlertCircle
} from 'lucide-react';

const API_URL = 'http://localhost:4000/api/queue';

export default function QueueManagement() {
    const [activeQueue, setActiveQueue] = useState([]);
    const [selectedDept, setSelectedDept] = useState('All');
    const [loading, setLoading] = useState(false);

    const departments = ['All', 'Cardiology', 'Neurology', 'Orthopedics', 'General', 'Pediatrics', 'Emergency'];

    useEffect(() => {
        fetchQueue();
        const interval = setInterval(fetchQueue, 5000); // Refresh every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchQueue = async () => {
        try {
            const response = await axios.get(`${API_URL}/active`);
            if (response.data.success) {
                setActiveQueue(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching queue:', error);
        }
    };

    const callNext = async (department) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/call-next/${department}`);
            if (response.data.success) {
                await fetchQueue();
            }
        } catch (error) {
            alert(error.response?.data?.message || 'No patients in queue');
        } finally {
            setLoading(false);
        }
    };

    const completePatient = async (queueId) => {
        setLoading(true);
        try {
            await axios.post(`${API_URL}/complete/${queueId}`);
            await fetchQueue();
        } catch (error) {
            alert('Failed to complete patient');
        } finally {
            setLoading(false);
        }
    };

    const filteredQueue = selectedDept === 'All'
        ? activeQueue
        : activeQueue.filter(q => q.DEPARTMENT === selectedDept);

    const queueByDept = filteredQueue.reduce((acc, item) => {
        if (!acc[item.DEPARTMENT]) {
            acc[item.DEPARTMENT] = [];
        }
        acc[item.DEPARTMENT].push(item);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <Stethoscope className="text-blue-600" size={32} />
                            Queue Management
                        </h1>
                        <p className="text-slate-500 mt-1">
                            Control patient flow and manage department queues
                        </p>
                    </div>

                    <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-1 overflow-x-auto">
                        {departments.map(dept => (
                            <button
                                key={dept}
                                onClick={() => setSelectedDept(dept)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${selectedDept === dept
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {dept}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Queue Display */}
                {Object.keys(queueByDept).length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
                        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="text-slate-400 w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">No Active Queues</h3>
                        <p className="text-slate-500">There are no patients waiting in the selected departments</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {Object.entries(queueByDept).map(([dept, patients]) => (
                            <DepartmentSection
                                key={dept}
                                department={dept}
                                patients={patients}
                                onCallNext={callNext}
                                onComplete={completePatient}
                                loading={loading}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function DepartmentSection({ department, patients, onCallNext, onComplete, loading }) {
    const waiting = patients.filter(p => p.STATUS === 'WAITING');
    const inProgress = patients.find(p => p.STATUS === 'IN_PROGRESS');

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        {department}
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">
                            {patients.length} Total
                        </span>
                    </h2>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                            <Clock size={14} /> {waiting.length} Waiting
                        </span>
                        <span className="flex items-center gap-1">
                            <Activity size={14} /> {inProgress ? '1 Active' : '0 Active'}
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => onCallNext(department)}
                    disabled={loading || waiting.length === 0}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    <Megaphone size={18} />
                    Call Next Patient
                </button>
            </div>

            <div className="p-6 bg-slate-50/50">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Current Patient */}
                    <div className="lg:col-span-1">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Now Serving</h3>
                        {inProgress ? (
                            <div className="bg-white border border-blue-100 rounded-xl p-5 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                                            In Progress
                                        </span>
                                        <h4 className="text-lg font-bold text-slate-900">{inProgress.PATIENT_NAME}</h4>
                                        <p className="text-sm text-slate-500 font-mono">{inProgress.AADHAR_NO}</p>
                                    </div>
                                    <div className="bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center text-blue-600 font-bold text-lg">
                                        {String(inProgress.QUEUE_NUMBER).padStart(2, '0')}
                                    </div>
                                </div>

                                <button
                                    onClick={() => onComplete(inProgress.QUEUE_ID)}
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 bg-green-50 text-green-700 border border-green-200 py-2 rounded-lg font-medium hover:bg-green-100 transition-colors"
                                >
                                    <CheckCircle size={16} />
                                    Mark Complete
                                </button>
                            </div>
                        ) : (
                            <div className="bg-slate-100 border border-slate-200 border-dashed rounded-xl p-8 text-center">
                                <p className="text-slate-400 text-sm">No patient active</p>
                            </div>
                        )}
                    </div>

                    {/* Waiting List */}
                    <div className="lg:col-span-2">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Waiting Queue</h3>
                        {waiting.length === 0 ? (
                            <div className="bg-white border border-slate-100 rounded-xl p-8 text-center">
                                <p className="text-slate-400 text-sm">Queue is empty</p>
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 gap-3">
                                {waiting.map((patient) => (
                                    <div
                                        key={patient.QUEUE_ID}
                                        className="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all flex items-center gap-4"
                                    >
                                        <div className="bg-slate-100 w-10 h-10 rounded-lg flex items-center justify-center text-slate-600 font-bold">
                                            {String(patient.QUEUE_NUMBER).padStart(2, '0')}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-slate-900 truncate">{patient.PATIENT_NAME}</p>
                                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                                <Clock size={10} />
                                                {new Date(patient.CREATED_AT).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
