import { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const API_BASE_URL = 'http://localhost:4000/api';

export default function PatientsListPage() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('aadhar'); // 'aadhar', 'visits', 'today', or 'daterange'
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        if (sortBy !== 'daterange') {
            fetchPatients();
        }
    }, [sortBy]);

    const fetchPatients = async () => {
        setLoading(true);
        setError(null);

        try {
            let endpoint;
            if (sortBy === 'today') {
                endpoint = `${API_BASE_URL}/patients/today`;
            } else if (sortBy === 'daterange') {
                // Ensure dates are in YYYY-MM-DD format
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
                console.log('Fetching date range:', { formattedStart, formattedEnd, endpoint });
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
            setPatients([]); // Clear patients when switching to date range mode
        }
    };

    const handleDateSearch = () => {
        if (startDate && endDate) {
            // Ensure dates are in YYYY-MM-DD format
            const formattedStartDate = startDate.includes('/')
                ? startDate.split('/').reverse().join('-')
                : startDate;
            const formattedEndDate = endDate.includes('/')
                ? endDate.split('/').reverse().join('-')
                : endDate;

            // Validate date range
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
        const doc = new jsPDF('l', 'mm', 'a4'); // landscape orientation

        // Add title
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        let title = "Patients Report";
        if (sortBy === 'today') {
            title = "Today's Patients Report";
        } else if (sortBy === 'daterange' && startDate && endDate) {
            title = `Patients Report (${startDate} to ${endDate})`;
        }
        doc.text(title, 14, 15);

        // Add date
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
        doc.text(`Total Records: ${patients.length}`, 14, 28);

        // Prepare table data
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

        // Add table using autoTable
        autoTable(doc, {
            startY: 32,
            head: [['Patient ID', 'Aadhar No', 'Name', 'Age', 'Gender', 'Phone', 'Visits', 'Date Visited', 'Departments']],
            body: tableData,
            theme: 'striped',
            headStyles: {
                fillColor: [59, 130, 246], // blue
                textColor: 255,
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 9,
                cellPadding: 3
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

        // Save PDF
        let fileName = `patients_report_${new Date().toISOString().split('T')[0]}.pdf`;
        if (sortBy === 'today') {
            fileName = `patients_today_${new Date().toISOString().split('T')[0]}.pdf`;
        } else if (sortBy === 'daterange' && startDate && endDate) {
            fileName = `patients_${startDate}_to_${endDate}.pdf`;
        }

        doc.save(fileName);
    };

    const getDisplayTitle = () => {
        if (sortBy === 'today') return "Today's Patients";
        if (sortBy === 'daterange' && startDate && endDate) {
            return `Patients (${startDate} to ${endDate})`;
        }
        return 'All Patients';
    };

    const getDisplaySubtitle = () => {
        if (sortBy === 'today') return 'Patients registered today';
        if (sortBy === 'daterange') return 'Select date range and click Search';
        return 'View and sort all patient records';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        👥 {getDisplayTitle()}
                    </h1>
                    <p className="text-gray-600">
                        {getDisplaySubtitle()}
                    </p>
                </div>

                {/* Sort Controls */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="flex items-center space-x-4">
                            <label className="text-gray-700 font-medium">
                                Filter/Sort:
                            </label>
                            <select
                                value={sortBy}
                                onChange={handleSortChange}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            >
                                <option value="aadhar">All - By Aadhar Number</option>
                                <option value="visits">All - By Visit Count</option>
                                <option value="today">📅 Today's Patients</option>
                                <option value="daterange">📆 Custom Date Range</option>
                            </select>
                        </div>
                    </div>

                    {/* Date Range Picker - Show only when daterange is selected */}
                    {sortBy === 'daterange' && (
                        <div className="flex flex-wrap items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center space-x-2">
                                <label className="text-gray-700 font-medium">From:</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <label className="text-gray-700 font-medium">To:</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <button
                                onClick={handleDateSearch}
                                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                            >
                                🔍 Search
                            </button>
                        </div>
                    )}

                    {/* Stats and Export */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                        <div className="text-gray-600">
                            Total: <span className="font-bold text-blue-600">{patients.length}</span>
                        </div>
                        {patients.length > 0 && (
                            <button
                                onClick={exportToPDF}
                                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>Export PDF</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <p className="text-gray-600 mt-3">Loading patients...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-red-100 border border-red-300 text-red-800 rounded-lg p-4 mb-6">
                        {error}
                    </div>
                )}

                {/* Patients Table */}
                {!loading && !error && patients.length > 0 && (
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gradient-to-r from-blue-500 to-purple-600">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                            Patient ID
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                            Aadhar No
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                            Age
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                            Gender
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                            Phone
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                            Visit Count
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                            Date Visited
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                            Departments Visited
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {patients.map((patient, index) => (
                                        <tr
                                            key={patient.PATIENT_ID}
                                            className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                                                {String(patient.PATIENT_ID).padStart(5, '0')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {patient.AADHAR_NO}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                                                {patient.NAME}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {patient.AGE || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {patient.GENDER || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {patient.PHONE || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${patient.VISIT_COUNT >= 5
                                                    ? 'bg-red-100 text-red-800'
                                                    : patient.VISIT_COUNT >= 3
                                                        ? 'bg-orange-100 text-orange-800'
                                                        : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {patient.VISIT_COUNT || 1} {patient.VISIT_COUNT === 1 ? 'visit' : 'visits'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {patient.CREATED_AT ? new Date(patient.CREATED_AT).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                                                <div className="truncate" title={patient.DEPARTMENT_VISITED}>
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
                    <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                        <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Patients Found</h3>
                        <p className="text-gray-500">No patient records available in the database.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
