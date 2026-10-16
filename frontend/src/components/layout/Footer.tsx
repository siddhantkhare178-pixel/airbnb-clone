import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-coral-500 to-coral-600 flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">StaySpot</span>
            </Link>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Discover and book unique accommodations around the world.
              Your next unforgettable stay is just a search away.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-sm hover:text-white transition-colors">Explore</Link></li>
              <li><Link to="/search" className="text-sm hover:text-white transition-colors">Search Hotels</Link></li>
              <li><Link to="/login" className="text-sm hover:text-white transition-colors">Log in</Link></li>
              <li><Link to="/signup" className="text-sm hover:text-white transition-colors">Sign up</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-coral-400" />
                support@stayspot.com
              </li>
              <li className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-coral-400" />
                Worldwide
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} StaySpot. All rights reserved.</p>
          <p className="text-xs text-gray-500">Built with ❤️ for great travel experiences</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
