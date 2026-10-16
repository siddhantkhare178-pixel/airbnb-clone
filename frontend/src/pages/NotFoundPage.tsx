import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 animate-fade-in">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-coral-50 flex items-center justify-center text-coral-500 shadow-inner">
          <span className="text-3xl font-extrabold tracking-tight">404</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-8 text-sm sm:text-base">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/" className="btn-primary w-full sm:w-auto text-sm">
            <Home className="w-4 h-4" /> Go to Homepage
          </Link>
          <Link to="/search" className="btn-secondary w-full sm:w-auto text-sm">
            <Search className="w-4 h-4" /> Search Stays
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
