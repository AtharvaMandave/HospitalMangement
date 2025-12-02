import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import {
    MonitorPlay,
    Wifi,
    WifiOff,
    ClipboardList,
    User,
    Clock,
    Activity
} from 'lucide-react';

const SOCKET_URL = 'http://localhost:4000';
const API_URL = 'http://localhost:4000/api/queue';

export default function QueueBoard() {
    const [queue, setQueue] = useState([]);
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);

    // Group queue by department
    const queueByDepartment = queue.reduce((acc, item) => {
        if (!acc[item.DEPARTMENT]) {
            acc[item.DEPARTMENT] = [];
        }
        acc[item.DEPARTMENT].push(item);
        return acc;
    }, {});

    const departments = Object.keys(queueByDepartment).sort();

    useEffect(() => {
        // Fetch initial queue data
        fetchQueue();

        // Initialize Socket.io connection
        const newSocket = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnection: true
        });

        newSocket.on('connect', () => {
            console.log('✅ Connected to WebSocket');
            setConnected(true);
            newSocket.emit('join_queue_board');
        });

        newSocket.on('disconnect', () => {
            console.log('❌ Disconnected from WebSocket');
            setConnected(false);
        });

        newSocket.on('queue_updated', (updatedQueue) => {
            console.log('📡 Queue updated:', updatedQueue);
            setQueue(updatedQueue);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    const fetchQueue = async () => {
        try {
            const response = await axios.get(`${API_URL}/active`);
            if (response.data.success) {
                setQueue(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching queue:', error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 py-8 px-4 font-sans">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-10 bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-500/20">
                            <MonitorPlay className="text-white w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">Live Queue Board</h1>
                            <p className="text-slate-400">Real-time patient status display</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-700">
                        {connected ? (
                            <Wifi className="text-emerald-500 w-5 h-5 animate-pulse" />
                        ) : (
                            <WifiOff className="text-red-500 w-5 h-5" />
                        )}
                        <span className={`font-medium ${connected ? 'text-emerald-500' : 'text-red-500'}`}>
                            {connected ? 'System Online' : 'Reconnecting...'}
                        </span>
                    </div>
                </div>

                {/* Queue Display */}
                {departments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-slate-800/30 rounded-3xl border border-slate-800 border-dashed">
                        <div className="bg-slate-800 p-6 rounded-full mb-6">
                            <ClipboardList className="text-slate-600 w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-500 mb-2">Queue is Empty</h2>
                        <p className="text-slate-600">No active patients in any department</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {departments.map(dept => (
                            <DepartmentQueue
                                key={dept}
                                department={dept}
                                patients={queueByDepartment[dept]}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function DepartmentQueue({ department, patients }) {
    const waiting = patients.filter(p => p.STATUS === 'WAITING');
    const inProgress = patients.find(p => p.STATUS === 'IN_PROGRESS');

    return (
        <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-xl flex flex-col h-full">
            {/* Department Header */}
            <div className="bg-slate-700/50 p-6 border-b border-slate-700">
                <h2 className="text-2xl font-bold text-white mb-2">{department}</h2>
                <div className="flex items-center gap-4 text-sm font-medium">
                    <span className="text-emerald-400 flex items-center gap-1">
                        <Activity size={16} />
                        {inProgress ? 'Active' : 'Idle'}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                        <Clock size={16} />
                        {waiting.length} Waiting
                    </span>
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col gap-6">
                {/* Currently Being Served */}
                {inProgress ? (
                    <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <Activity size={64} className="text-emerald-500" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Now Serving</p>
                            </div>
                            <div className="flex items-baseline gap-1 mb-1">
                                <span className="text-4xl font-bold text-white">#{String(inProgress.QUEUE_NUMBER).padStart(2, '0')}</span>
                            </div>
                            <p className="text-lg font-medium text-slate-200 truncate">{inProgress.PATIENT_NAME}</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-5 text-center">
                        <p className="text-slate-500 text-sm">No patient currently being served</p>
                    </div>
                )}

                {/* Waiting Queue */}
                <div className="flex-1">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-3">Next in Line</p>
                    {waiting.length === 0 ? (
                        <p className="text-slate-600 text-center py-4 text-sm italic">Queue is empty</p>
                    ) : (
                        <div className="space-y-2">
                            {waiting.slice(0, 5).map((patient) => (
                                <div
                                    key={patient.QUEUE_ID}
                                    className="bg-slate-700/30 rounded-lg p-3 border border-slate-700/50 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-slate-300 font-bold text-sm">
                                            {String(patient.QUEUE_NUMBER).padStart(2, '0')}
                                        </div>
                                        <p className="text-slate-200 font-medium text-sm truncate max-w-[120px]">
                                            {patient.PATIENT_NAME}
                                        </p>
                                    </div>
                                    <Clock size={14} className="text-slate-500" />
                                </div>
                            ))}
                            {waiting.length > 5 && (
                                <p className="text-slate-500 text-center text-xs pt-2">
                                    +{waiting.length - 5} more patients
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
