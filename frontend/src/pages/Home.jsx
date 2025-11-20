import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="container mx-auto px-4 py-16">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="inline-block mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                            <svg className="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-4">
                        Hospital Patient Tracking System
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-2">
                        Efficient Patient Visit Management with Aadhar-Based Deduplication
                    </p>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Track patient visits, eliminate duplicates, and maintain comprehensive medical visit history
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <FeatureCard
                        icon="📤"
                        title="Bulk Upload"
                        description="Upload CSV/TXT files containing daily patient visit records with automatic processing"
                    />
                    <FeatureCard
                        icon="🔄"
                        title="Smart Deduplication"
                        description="Automatically detects existing patients using Aadhar and updates visit history"
                    />
                    <FeatureCard
                        icon="🔍"
                        title="Quick Search"
                        description="Search for any patient instantly using their 12-digit Aadhar number"
                    />
                </div>

                {/* Action Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <ActionCard
                        to="/upload"
                        icon="📁"
                        title="Upload Patient Records"
                        description="Import daily visit records from CSV or text files"
                        bgGradient="from-blue-500 to-blue-600"
                        hoverGradient="from-blue-600 to-blue-700"
                    />
                    <ActionCard
                        to="/search"
                        icon="🔎"
                        title="Search Patient"
                        description="Find patient details and visit history by Aadhar number"
                        bgGradient="from-purple-500 to-purple-600"
                        hoverGradient="from-purple-600 to-purple-700"
                    />
                </div>

                {/* Info Section */}
                <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 How It Works</h2>
                    <ol className="space-y-4 text-gray-600">
                        <li className="flex items-start">
                            <span className="font-bold text-blue-600 mr-3 text-xl">1.</span>
                            <span><strong>Upload Daily Records:</strong> Import patient visit data in CSV or TXT format</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-bold text-blue-600 mr-3 text-xl">2.</span>
                            <span><strong>Automatic Processing:</strong> System identifies new patients and existing ones using Aadhar number</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-bold text-blue-600 mr-3 text-xl">3.</span>
                            <span><strong>Smart Updates:</strong> New patients are added; existing patients' department visit history is updated</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-bold text-blue-600 mr-3 text-xl">4.</span>
                            <span><strong>Easy Retrieval:</strong> Search any patient record instantly using Aadhar number</span>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="text-5xl mb-4">{icon}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}

function ActionCard({ to, icon, title, description, bgGradient, hoverGradient }) {
    return (
        <Link
            to={to}
            className={`block bg-gradient-to-br ${bgGradient} hover:${hoverGradient} rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 group`}
        >
            <div className="text-6xl mb-4">{icon}</div>
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:scale-105 transition-transform">
                {title}
            </h3>
            <p className="text-blue-100">{description}</p>
            <div className="mt-4 flex items-center text-white font-semibold">
                <span>Get Started</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </div>
        </Link>
    );
}
