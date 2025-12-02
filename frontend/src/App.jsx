import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Home as HomeIcon,
  Upload,
  FileText,
  Users,
  Search,
  Stethoscope,
  MonitorPlay,
  Activity
} from 'lucide-react';
import Home from './pages/Home';
import UploadPage from './pages/UploadPage';
import SearchPage from './pages/SearchPage';
import ManualEntryPage from './pages/ManualEntryPage';
import PatientsListPage from './pages/PatientsListPage';
import QueueBoard from './pages/QueueBoard';
import QueueManagement from './pages/QueueManagement';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container min-h-screen bg-slate-50 font-sans text-slate-900">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/manual-entry" element={<ManualEntryPage />} />
          <Route path="/patients" element={<PatientsListPage />} />
          <Route path="/queue" element={<QueueBoard />} />
          <Route path="/queue-management" element={<QueueManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

function Navigation() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Don't show navigation on home page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
              MedTrack
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/" active={isActive('/')} icon={<HomeIcon size={18} />}>
              Home
            </NavLink>
            <NavLink to="/upload" active={isActive('/upload')} icon={<Upload size={18} />}>
              Upload
            </NavLink>
            <NavLink to="/manual-entry" active={isActive('/manual-entry')} icon={<FileText size={18} />}>
              Entry
            </NavLink>
            <NavLink to="/patients" active={isActive('/patients')} icon={<Users size={18} />}>
              Patients
            </NavLink>
            <NavLink to="/search" active={isActive('/search')} icon={<Search size={18} />}>
              Search
            </NavLink>
            <div className="w-px h-6 bg-slate-200 mx-2"></div>
            <NavLink to="/queue-management" active={isActive('/queue-management')} icon={<Stethoscope size={18} />}>
              Queue
            </NavLink>
            <NavLink to="/queue" active={isActive('/queue')} icon={<MonitorPlay size={18} />}>
              Board
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, children, active, icon }) {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${active
          ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

export default App;
