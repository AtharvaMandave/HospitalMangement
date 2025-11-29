import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import UploadPage from './pages/UploadPage';
import SearchPage from './pages/SearchPage';
import ManualEntryPage from './pages/ManualEntryPage';
import PatientsListPage from './pages/PatientsListPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/manual-entry" element={<ManualEntryPage />} />
          <Route path="/patients" element={<PatientsListPage />} />
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
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-800">Hospital Tracking</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-2">
            <NavLink to="/" active={isActive('/')}>
              🏠 Home
            </NavLink>
            <NavLink to="/upload" active={isActive('/upload')}>
              📤 Upload
            </NavLink>
            <NavLink to="/manual-entry" active={isActive('/manual-entry')}>
              📝 Manual Entry
            </NavLink>
            <NavLink to="/patients" active={isActive('/patients')}>
              👥 View All
            </NavLink>
            <NavLink to="/search" active={isActive('/search')}>
              🔍 Search
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, children, active }) {
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg font-medium transition-all ${active
        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
        : 'text-gray-600 hover:bg-gray-100'
        }`}
    >
      {children}
    </Link>
  );
}

export default App;
