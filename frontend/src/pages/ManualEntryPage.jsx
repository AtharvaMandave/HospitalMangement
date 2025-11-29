import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

function ManualEntryPage() {
    const [formData, setFormData] = useState({
        AADHAR_NO: '',
        NAME: '',
        AGE: '',
        GENDER: '',
        ADDRESS: '',
        PHONE: '',
        DEPARTMENT_VISITED: ''
    });

    const [patientList, setPatientList] = useState([]);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddToList = (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.AADHAR_NO || !formData.NAME || !formData.DEPARTMENT_VISITED) {
            setMessage({
                type: 'error',
                text: 'Aadhar Number, Name, and Department are required fields.'
            });
            return;
        }

        // Add to list
        setPatientList(prev => [...prev, { ...formData, id: Date.now() }]);

        // Reset form
        setFormData({
            AADHAR_NO: '',
            NAME: '',
            AGE: '',
            GENDER: '',
            ADDRESS: '',
            PHONE: '',
            DEPARTMENT_VISITED: ''
        });

        setMessage({
            type: 'success',
            text: 'Patient added to list! Add more or click "Save All Records".'
        });
    };

    const handleRemoveFromList = (id) => {
        setPatientList(prev => prev.filter(p => p.id !== id));
        setMessage({
            type: 'info',
            text: 'Patient removed from list.'
        });
    };

    const handleSaveAll = async () => {
        if (patientList.length === 0) {
            setMessage({
                type: 'error',
                text: 'No records to save. Please add at least one patient.'
            });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            // Remove the temporary id field before sending
            const patientsToSave = patientList.map(({ id, ...patient }) => patient);

            const response = await axios.post(`${API_BASE_URL}/addBulkVisits`, {
                patients: patientsToSave
            });

            if (response.data.success) {
                const { summary } = response.data;
                setMessage({
                    type: 'success',
                    text: `✅ Successfully processed ${summary.validRecords} records! New patients: ${summary.newPatients}, Updated patients: ${summary.updatedPatients}`
                });
                setPatientList([]); // Clear the list
            }
        } catch (error) {
            console.error('Error saving records:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to save records. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        📝 Manual Patient Entry
                    </h1>
                    <p className="text-gray-600">
                        Fill in patient details and add multiple records before saving
                    </p>
                </div>

                {/* Message Display */}
                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' :
                        message.type === 'error' ? 'bg-red-100 text-red-800 border border-red-300' :
                            'bg-blue-100 text-blue-800 border border-blue-300'
                        }`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Form Section */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Patient Information</h2>

                        <form onSubmit={handleAddToList} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Aadhar Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="AADHAR_NO"
                                    value={formData.AADHAR_NO}
                                    onChange={handleInputChange}
                                    placeholder="12-digit Aadhar number"
                                    maxLength="12"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="NAME"
                                    value={formData.NAME}
                                    onChange={handleInputChange}
                                    placeholder="Patient name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Age
                                    </label>
                                    <input
                                        type="number"
                                        name="AGE"
                                        value={formData.AGE}
                                        onChange={handleInputChange}
                                        placeholder="Age"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Gender
                                    </label>
                                    <select
                                        name="GENDER"
                                        value={formData.GENDER}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Select</option>
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                        <option value="O">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address
                                </label>
                                <textarea
                                    name="ADDRESS"
                                    value={formData.ADDRESS}
                                    onChange={handleInputChange}
                                    placeholder="Patient address"
                                    rows="2"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    name="PHONE"
                                    value={formData.PHONE}
                                    onChange={handleInputChange}
                                    placeholder="Contact number"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Department Visited <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="DEPARTMENT_VISITED"
                                    value={formData.DEPARTMENT_VISITED}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Cardiology"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                            >
                                ➕ Add to List
                            </button>
                        </form>
                    </div>

                    {/* Patient List Section */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Records to Save ({patientList.length})
                            </h2>
                            {patientList.length > 0 && (
                                <button
                                    onClick={handleSaveAll}
                                    disabled={loading}
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? '⏳ Saving...' : '💾 Save All Records'}
                                </button>
                            )}
                        </div>

                        {patientList.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                <svg className="w-20 h-20 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                                <p className="text-lg">No records added yet</p>
                                <p className="text-sm">Fill the form and click "Add to List"</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                {patientList.map((patient) => (
                                    <div
                                        key={patient.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg text-gray-800">
                                                    {patient.NAME}
                                                </h3>
                                                <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                                                    <div>
                                                        <span className="font-medium">Aadhar:</span> {patient.AADHAR_NO}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Age:</span> {patient.AGE || 'N/A'}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Gender:</span> {patient.GENDER || 'N/A'}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Phone:</span> {patient.PHONE || 'N/A'}
                                                    </div>
                                                    <div className="col-span-2">
                                                        <span className="font-medium">Department:</span> {patient.DEPARTMENT_VISITED}
                                                    </div>
                                                    {patient.ADDRESS && (
                                                        <div className="col-span-2">
                                                            <span className="font-medium">Address:</span> {patient.ADDRESS}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveFromList(patient.id)}
                                                className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                                                title="Remove"
                                            >
                                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
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

export default ManualEntryPage;
