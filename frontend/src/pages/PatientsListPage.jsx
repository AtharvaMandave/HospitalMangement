import { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
    Users,
    TrendingUp,
    Activity,
    Calendar,
    Filter,
    FileDown,
    Loader2,
    AlertCircle,
    Award,
    BarChart3
} from 'lucide-react';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

const API_BASE_URL = 'http://localhost:4000/api';

export default function PatientsListPage() {
    const [patients, setPatients] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('aadhar');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        if (sortBy !== 'daterange') {
            fetchPatients();
        }
        fetchAnalytics();
    }, [sortBy]);

    const fetchAnalytics = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/analytics`);
            if (response.data.success) {
                setAnalytics(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching analytics:', err);
        }
    };

    const fetchPatients = async () => {
        setLoading(true);
        setError(null);

        try {
            let endpoint;
            if (sortBy === 'today') {
                endpoint = `${API_BASE_URL}/patients/today`;
            } else if (sortBy === 'daterange') {
                const formattedStart = startDate.includes('/')
                    ? startDate.split('/').reverse().join('-')
                    : startDate;
                const formattedEnd = endDate.includes('/')
                    ? endDate.split('/').reverse().join('-')
                    : endDate;
                if (new Date(formattedStart) > new Date(formattedEnd)) {
                    setError('Start date cannot be after end date');
                    setLoading(false);
                    return;
                }
                endpoint = `${API_BASE_URL}/patients/date-range?startDate=${formattedStart}&endDate=${formattedEnd}`;
            } else if (sortBy === 'visits') {
                endpoint = `${API_BASE_URL}/patients/sort/by-visits`;
            } else {
                endpoint = `${API_BASE_URL}/allPatients`;
            }

            const response = await axios.get(endpoint);

            if (response.data.success) {
                setPatients(response.data.data);
                if (response.data.data.length === 0 && sortBy === 'daterange') {
                    setError(`No patients found between ${startDate} and ${endDate}`);
                }
            }
        } catch (err) {
            console.error('Error fetching patients:', err);
            if (err.response) {
                setError(`Error: ${err.response.data.message || err.response.statusText}`);
            } else {
                setError('Failed to load patients. Please check your connection and try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        if (e.target.value === 'daterange') {
            setPatients([]);
        }
    };

    const handleDateSearch = () => {
        if (startDate && endDate) {
            const formattedStartDate = startDate.includes('/')
                ? startDate.split('/').reverse().join('-')
                : startDate;
            const formattedEndDate = endDate.includes('/')
                ? endDate.split('/').reverse().join('-')
                : endDate;

            if (new Date(formattedStartDate) > new Date(formattedEndDate)) {
                setError('Start date cannot be after end date');
                return;
            }

            fetchPatients();
        } else {
            setError('Please select both start and end dates');
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF('l', 'mm', 'a4');

        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        let title = "Patients Report";
        if (sortBy === 'today') {
            title = "Today's Patients Report";
        } else if (sortBy === 'daterange' && startDate && endDate) {
            title = `Patients Report (${startDate} to ${endDate})`;
        }
        doc.text(title, 14, 15);

        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
        doc.text(`Total Records: ${patients.length}`, 14, 28);

        const tableData = patients.map(patient => [
            String(patient.PATIENT_ID).padStart(5, '0'),
            patient.AADHAR_NO,
            patient.NAME,
            patient.AGE || 'N/A',
            patient.GENDER || 'N/A',
            patient.PHONE || 'N/A',
            patient.VISIT_COUNT || '1',
            patient.CREATED_AT ? new Date(patient.CREATED_AT).toLocaleDateString() : 'N/A',
            patient.DEPARTMENT_VISITED || 'N/A'
        ]);

        autoTable(doc, {
            startY: 32,
            head: [['Patient ID', 'Aadhar No', 'Name', 'Age', 'Gender', 'Phone', 'Visits', 'Date Visited', 'Departments']],
            body: tableData,
            theme: 'striped',
            headStyles: {
                fillColor: [37, 99, 235],
                textColor: 255,
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 9,
                cellPadding: 3,
                font: 'helvetica'
            },
            columnStyles: {
                0: { cellWidth: 20 },
                1: { cellWidth: 30 },
                2: { cellWidth: 35 },
                3: { cellWidth: 15 },
                4: { cellWidth: 18 },
                5: { cellWidth: 25 },
                6: { cellWidth: 15 },
                7: { cellWidth: 25 },
                8: { cellWidth: 'auto' }
            }
        });

        let fileName = `patients_report_${new Date().toISOString().split('T')[0]}.pdf`;
        if (sortBy === 'today') {
            fileName = `patients_today_${new Date().toISOString().split('T')[0]}.pdf`;
        } else if (sortBy === 'daterange' && startDate && endDate) {
            fileName = `patients_${startDate}_to_${endDate}.pdf`;
        }

        doc.save(fileName);
    };

    // Chart data
    const departmentChartData = analytics ? {
        labels: analytics.departmentStats.map(d => d.DEPARTMENT || d.DEPARTMENT_VISITED),
        datasets: [{
            label: 'Patients by Department',
            data: analytics.departmentStats.map(d => d.COUNT),
            backgroundColor: [
                'rgba(239, 68, 68, 0.8)',
                'rgba(147, 51, 234, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(34, 197, 94, 0.8)',
                'rgba(251, 191, 36, 0.8)',
                'rgba(239, 68, 68, 0.8)',
            ],
        }]
    } : null;

    const genderChartData = analytics ? {
        labels: analytics.genderStats.map(g => g.GENDER_LABEL),
        datasets: [{
            data: analytics.genderStats.map(g => g.COUNT),
            backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(236, 72, 153, 0.8)',
                'rgba(168, 85, 247, 0.8)',
            ],
        }]
    } : null;

    const ageChartData = analytics ? {
        labels: analytics.ageStats.map(a => a.AGE_GROUP),
        datasets: [{
            label: 'Patients by Age Group',
            data: analytics.ageStats.map(a => a.COUNT),
            backgroundColor: 'rgba(99, 102, 241, 0.8)',
        }]
    } : null;

    const trendChartData = analytics ? {
        labels: analytics.trendStats.map(t => new Date(t.VISIT_DATE).toLocaleDateString()),
        datasets: [{
            label: 'New Registrations',
            data: analytics.trendStats.map(t => t.COUNT),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
        }]
    } : null;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4 text-blue-600">
                        <BarChart3 size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        Patient Analytics Dashboard
                    </h1>
                    <p className="text-lg text-slate-500">
                        Comprehensive insights and patient management
                    </p>
                </div>

                {/* Stats Cards */}
                {analytics && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                        <StatCard
                            icon={<Users size={24} />}
                            label="Total Patients"
                            value={analytics.totalPatients}
                            color="bg-blue-500"
                        />
                        <StatCard
                            icon={<Calendar size={24} />}
                            label="Today's Registrations"
                            value={analytics.todayCount}
                            color="bg-emerald-500"
                        />
                        <StatCard
                            icon={<TrendingUp size={24} />}
                            label="Avg Visits/Patient"
                            value={analytics.avgVisits}
                            color="bg-purple-500"
                        />
                        <StatCard
                            icon={<Activity size={24} />}
                            label="Active Departments"
                            value={analytics.departmentStats.length}
                            color="bg-orange-500"
                        />
                    </div>
                )}

                {/* Charts Section */}
                {analytics && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                        <ChartCard title="Patients by Department">
                            {departmentChartData && <Bar data={departmentChartData} options={{ responsive: true, maintainAspectRatio: true }} />}
                        </ChartCard>

                        <ChartCard title="Gender Distribution">
                            {genderChartData && <Pie data={genderChartData} options={{ responsive: true, maintainAspectRatio: true }} />}
                        </ChartCard>

                        <ChartCard title="Age Distribution">
                            {ageChartData && <Bar data={ageChartData} options={{ responsive: true, maintainAspectRatio: true }} />}
                        </ChartCard>

                        <ChartCard title="Registration Trend (Last 7 Days)">
                            {trendChartData && <Line data={trendChartData} options={{ responsive: true, maintainAspectRatio: true }} />}
                        </ChartCard>
                    </div>
                )}

                {/* Frequent Visitors */}
                {analytics && analytics.frequentVisitors.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Award className="text-yellow-500" size={24} />
                            <h2 className="text-xl font-bold text-slate-800">Frequent Visitors</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {analytics.frequentVisitors.map((patient, idx) => (
                                <div key={idx} className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
                                    <div className="text-2xl font-bold text-yellow-600 mb-1">{patient.VISIT_COUNT}</div>
                                    <div className="text-sm font-medium text-slate-700 truncate">{patient.NAME}</div>
                                    <div className="text-xs text-slate-500 truncate">{patient.DEPARTMENT_VISITED}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Controls */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
                    <div className="flex flex-wrap items-center gap-6 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                                <Filter size={20} />
                            </div>
                            <label className="text-slate-700 font-bold">
                                Filter View:
                            </label>
                            <select
                                value={sortBy}
                                onChange={handleSortChange}
                                className="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-700 font-medium"
                            >
                                <option value="aadhar">All - By Aadhar Number</option>
                                <option value="visits">All - By Visit Count</option>
                                <option value="today">📅 Today's Patients</option>
                                <option value="daterange">📆 Custom Date Range</option>
                            </select>
                        </div>
                    </div>

                    {sortBy === 'daterange' && (
                        <div className="flex flex-wrap items-end gap-4 p-6 bg-blue-50/50 rounded-xl border border-blue-100 mb-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">From Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">To Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <button
                                onClick={handleDateSearch}
                                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                            >
                                <Filter size={18} />
                                Search
                            </button>
                        </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                        <div className="text-slate-600 font-medium">
                            Total Records: <span className="font-bold text-blue-600 text-lg ml-1">{patients.length}</span>
                        </div>
                        {patients.length > 0 && (
                            <button
                                onClick={exportToPDF}
                                className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                            >
                                <FileDown size={20} />
                                <span>Export PDF Report</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-20">
                        <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
                        <p className="text-slate-500 font-medium">Loading patient records...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 mb-8 flex items-center gap-3">
                        <AlertCircle size={24} />
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                {/* Patients Table */}
                {!loading && !error && patients.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Patient ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Aadhar No</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Age/Gender</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Visits</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Last Visit</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Departments</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    {patients.map((patient) => (
                                        <tr
                                            key={patient.PATIENT_ID}
                                            className="hover:bg-blue-50/50 transition-colors group"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                                                #{String(patient.PATIENT_ID).padStart(5, '0')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-600">
                                                {patient.AADHAR_NO}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">
                                                {patient.NAME}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {patient.AGE || '-'} / {patient.GENDER || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {patient.PHONE || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${patient.VISIT_COUNT >= 5 ? 'bg-red-100 text-red-700' :
                                                    patient.VISIT_COUNT >= 3 ? 'bg-orange-100 text-orange-700' :
                                                        'bg-green-100 text-green-700'
                                                    }`}>
                                                    {patient.VISIT_COUNT || 1}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {patient.CREATED_AT ? new Date(patient.CREATED_AT).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 max-w-xs">
                                                <div className="truncate font-medium" title={patient.DEPARTMENT_VISITED}>
                                                    {patient.DEPARTMENT_VISITED || 'N/A'}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && patients.length === 0 && sortBy !== 'daterange' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-16 text-center">
                        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users className="text-slate-300" size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No Patients Found</h3>
                        <p className="text-slate-500">No patient records available in the database.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
            <div className={`${color} p-4 rounded-xl text-white shadow-lg`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">{label}</p>
                <p className="text-3xl font-bold text-slate-900">{value}</p>
            </div>
        </div>
    );
}

function ChartCard({ title, children }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">{title}</h3>
            <div className="h-64">
                {children}
            </div>
        </div>
    );
}
