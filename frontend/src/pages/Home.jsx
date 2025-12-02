import { Link } from 'react-router-dom';
import {
    Upload,
    Search,
    Users,
    Activity,
    ArrowRight,
    Database,
    ShieldCheck,
    Zap
} from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-white">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-70"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                <div className="relative container mx-auto px-4 pt-20 pb-32">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-blue-100 rounded-full px-4 py-1.5 mb-8 shadow-sm">
                            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                            <span className="text-sm font-medium text-blue-900">System Online & Operational</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
                            Next-Gen Patient <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                Visit Tracking
                            </span>
                        </h1>

                        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Streamline hospital operations with our advanced deduplication engine.
                            Manage patient visits, history, and queues with enterprise-grade efficiency.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/search"
                                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-1"
                            >
                                <Search size={20} />
                                <span>Find Patient</span>
                            </Link>
                            <Link
                                to="/upload"
                                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-semibold hover:bg-slate-50 transition-all hover:-translate-y-1 shadow-sm"
                            >
                                <Upload size={20} />
                                <span>Upload Records</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-1 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent"></div>
            </div>

            {/* Features Grid */}
            <div className="container mx-auto px-4 py-20">
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    <FeatureCard
                        icon={<Database className="text-blue-600" size={32} />}
                        title="Bulk Data Processing"
                        description="Ingest thousands of patient records in seconds via CSV/TXT. Our engine handles the heavy lifting."
                    />
                    <FeatureCard
                        icon={<ShieldCheck className="text-indigo-600" size={32} />}
                        title="Smart Deduplication"
                        description="Never create duplicate records again. We automatically match and merge patient history using Aadhar."
                    />
                    <FeatureCard
                        icon={<Zap className="text-purple-600" size={32} />}
                        title="Real-Time Queue"
                        description="Live, socket-powered queue management system for instant updates across the entire hospital."
                    />
                </div>

                {/* Quick Actions */}
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
                        <span className="text-sm text-slate-500">Select a module to begin</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <ActionCard
                            to="/upload"
                            icon={<Upload className="text-white" size={32} />}
                            title="Upload Records"
                            description="Import daily visit logs"
                            color="bg-blue-600"
                        />
                        <ActionCard
                            to="/search"
                            icon={<Search className="text-white" size={32} />}
                            title="Patient Search"
                            description="Find and manage records"
                            color="bg-indigo-600"
                        />
                        <ActionCard
                            to="/queue-management"
                            icon={<Activity className="text-white" size={32} />}
                            title="Queue Management"
                            description="Doctor's control panel"
                            color="bg-purple-600"
                        />
                        <ActionCard
                            to="/queue"
                            icon={<Users className="text-white" size={32} />}
                            title="Live Display"
                            description="Public waiting room board"
                            color="bg-slate-800"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="bg-slate-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{description}</p>
        </div>
    );
}

function ActionCard({ to, icon, title, description, color }) {
    return (
        <Link
            to={to}
            className={`${color} relative overflow-hidden rounded-2xl p-8 hover:scale-[1.02] transition-all duration-300 shadow-xl group`}
        >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>

            <div className="relative z-10 flex items-start justify-between">
                <div>
                    <div className="bg-white/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                        {icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                    <p className="text-white/80">{description}</p>
                </div>

                <div className="bg-white/20 p-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all">
                    <ArrowRight className="text-white" size={20} />
                </div>
            </div>
        </Link>
    );
}
