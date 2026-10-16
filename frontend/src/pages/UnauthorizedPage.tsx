import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UnauthorizedPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 animate-fade-in">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shadow-inner">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Access Restricted</h1>
        <p className="text-gray-500 mb-8 text-sm sm:text-base">
          You do not have permission to access this page. This section may require host or manager privileges.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/" className="btn-primary w-full sm:w-auto text-sm">
            <Home className="w-4 h-4" /> Go to Homepage
          </Link>
          <Link to="/become-a-host" className="btn-secondary w-full sm:w-auto text-sm">
            Become a Host
          </Link>
          {!isAuthenticated && (
            <Link to="/login" className="btn-ghost text-sm">
              <LogIn className="w-4 h-4" /> Log In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
