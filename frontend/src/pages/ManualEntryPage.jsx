import { useState } from 'react';
import axios from 'axios';
import {
    FileText,
    Plus,
    Save,
    Trash2,
    Clipboard,
    User,
    CreditCard,
    Phone,
    MapPin,
    Loader2,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

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
            console.error('Error response:', error.response?.data);

            let errorMessage = 'Failed to save records. Please try again.';

            if (error.response?.data?.validationErrors) {
                const validationErrors = error.response.data.validationErrors;
                errorMessage = 'Validation failed:\n' + validationErrors.map(ve =>
                    `• ${ve.name || 'Patient'}: ${ve.errors.join(', ')}`
                ).join('\n');
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            setMessage({
                type: 'error',
                text: errorMessage
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4 text-blue-600">
                        <FileText size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        Manual Patient Entry
                    </h1>
                    <p className="text-lg text-slate-500">
                        Fill in patient details and add multiple records before saving
                    </p>
                </div>

                {/* Message Display */}
                {message && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
                        message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
                            'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}>
                        {message.type === 'success' ? <CheckCircle size={20} /> :
                            message.type === 'error' ? <AlertCircle size={20} /> :
                                <CheckCircle size={20} />}
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <User size={20} className="text-blue-600" />
                            Patient Information
                        </h2>

                        <form onSubmit={handleAddToList} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Aadhar Number <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <CreditCard size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        name="AADHAR_NO"
                                        value={formData.AADHAR_NO}
                                        onChange={handleInputChange}
                                        placeholder="12-digit Aadhar number"
                                        maxLength="12"
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        name="NAME"
                                        value={formData.NAME}
                                        onChange={handleInputChange}
                                        placeholder="Patient name"
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Age
                                    </label>
                                    <input
                                        type="number"
                                        name="AGE"
                                        value={formData.AGE}
                                        onChange={handleInputChange}
                                        placeholder="Age"
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Gender
                                    </label>
                                    <select
                                        name="GENDER"
                                        value={formData.GENDER}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    >
                                        <option value="">Select</option>
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                        <option value="O">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Address
                                </label>
                                <div className="relative">
                                    <div className="absolute top-3 left-3 pointer-events-none text-slate-400">
                                        <MapPin size={18} />
                                    </div>
                                    <textarea
                                        name="ADDRESS"
                                        value={formData.ADDRESS}
                                        onChange={handleInputChange}
                                        placeholder="Patient address"
                                        rows="2"
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Phone
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <Phone size={18} />
                                    </div>
                                    <input
                                        type="tel"
                                        name="PHONE"
                                        value={formData.PHONE}
                                        onChange={handleInputChange}
                                        placeholder="Contact number"
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Department Visited <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="DEPARTMENT_VISITED"
                                    value={formData.DEPARTMENT_VISITED}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Cardiology"
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
                            >
                                <Plus size={20} />
                                Add to List
                            </button>
                        </form>
                    </div>

                    {/* Patient List Section */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <Clipboard size={20} className="text-purple-600" />
                                Records to Save ({patientList.length})
                            </h2>
                            {patientList.length > 0 && (
                                <button
                                    onClick={handleSaveAll}
                                    disabled={loading}
                                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    {loading ? 'Saving...' : 'Save All'}
                                </button>
                            )}
                        </div>

                        {patientList.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                                <Clipboard size={48} className="mb-4 opacity-50" />
                                <p className="text-lg font-medium">No records added yet</p>
                                <p className="text-sm">Fill the form and click "Add to List"</p>
                            </div>
                        ) : (
                            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                                {patientList.map((patient) => (
                                    <div
                                        key={patient.id}
                                        className="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all group"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                                    {patient.NAME}
                                                    <span className="text-xs font-normal bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                                                        {patient.DEPARTMENT_VISITED}
                                                    </span>
                                                </h3>
                                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm text-slate-500">
                                                    <div className="flex items-center gap-1">
                                                        <CreditCard size={12} /> {patient.AADHAR_NO}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <User size={12} /> {patient.AGE || 'N/A'} • {patient.GENDER || 'N/A'}
                                                    </div>
                                                    <div className="flex items-center gap-1 col-span-2">
                                                        <Phone size={12} /> {patient.PHONE || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveFromList(patient.id)}
                                                className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
                                                title="Remove"
                                            >
                                                <Trash2 size={18} />
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
