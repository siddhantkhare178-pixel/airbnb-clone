import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  X,
  User,
  LogOut,
  Building2,
  CalendarDays,
  Users,
  ChevronDown,
  Home,
  Compass,
  Plus,
  Search,
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, isHost, mode, setMode, toggleMode, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const handleSwitchToHost = () => {
    setMode('host');
    setProfileOpen(false);
    setMobileOpen(false);
    navigate('/host');
  };

  const handleSwitchToGuest = () => {
    setMode('guest');
    setProfileOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isHostMode = mode === 'host' && isHost;

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-gray-100 shadow-xs">
      <nav className="page-container">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link
              to={isHostMode ? '/host' : '/'}
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-coral-500 to-coral-600 flex items-center justify-center shadow-lg shadow-coral-500/25 group-hover:shadow-coral-500/40 transition-shadow">
                {isHostMode ? (
                  <Building2 className="w-5 h-5 text-white" />
                ) : (
                  <Home className="w-5 h-5 text-white" />
                )}
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-coral-600 to-coral-500 bg-clip-text text-transparent">
                StaySpot
              </span>
            </Link>

            {isHostMode && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-coral-100 text-coral-700 border border-coral-200">
                Host Mode
              </span>
            )}
          </div>

          {/* Desktop Nav - Mode Sensitive */}
          <div className="hidden md:flex items-center gap-1">
            {isHostMode ? (
              // Host Mode Links
              <>
                <Link
                  to="/host"
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    location.pathname === '/host'
                      ? 'text-coral-600 bg-coral-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Host Dashboard
                </Link>
                <Link
                  to="/host/properties"
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive('/host/properties')
                      ? 'text-coral-600 bg-coral-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  My Properties
                </Link>
                <Link
                  to="/host/properties/new"
                  className="px-3.5 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-coral-500" /> List Property
                </Link>
              </>
            ) : (
              // Guest Mode Links
              <>
                <Link
                  to="/"
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    location.pathname === '/'
                      ? 'text-coral-600 bg-coral-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Explore
                </Link>
                <Link
                  to="/search"
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors inline-flex items-center gap-1.5 ${
                    isActive('/search')
                      ? 'text-coral-600 bg-coral-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" /> Search
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/my-bookings"
                    className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      isActive('/my-bookings')
                        ? 'text-coral-600 bg-coral-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    My Bookings
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Mode Switcher Buttons */}
            {isHostMode ? (
              <button
                onClick={handleSwitchToGuest}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-200"
                title="Switch to Guest Experience"
              >
                <Compass className="w-3.5 h-3.5 text-gray-600" />
                Switch to Guest Experience
              </button>
            ) : isHost ? (
              <button
                onClick={handleSwitchToHost}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-coral-700 bg-coral-50 hover:bg-coral-100 transition-colors border border-coral-200"
                title="Switch to Host Dashboard"
              >
                <Building2 className="w-3.5 h-3.5 text-coral-600" />
                Switch to Host Experience
              </button>
            ) : (
              <Link
                to="/become-a-host"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 hover:text-coral-600 hover:bg-coral-50/50 transition-colors"
              >
                <Building2 className="w-4 h-4 text-coral-500" />
                Become a Host
              </Link>
            )}

            {/* User Profile / Auth buttons */}
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 bg-white"
                  aria-label="User menu"
                  id="user-menu-button"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-coral-400 to-coral-600 flex items-center justify-center shadow-xs">
                    <span className="text-white text-xs font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                    {user?.name || 'User'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      profileOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-scale-in z-50">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-semibold">
                        {isHost ? 'Role: HOTEL_MANAGER' : 'Role: GUEST'}
                      </span>
                    </div>

                    {/* Mode switcher inside menu */}
                    {isHost && (
                      <div className="p-2 border-b border-gray-100">
                        <button
                          onClick={() => {
                            toggleMode();
                            setProfileOpen(false);
                            navigate(isHostMode ? '/' : '/host');
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            {isHostMode ? <Compass className="w-4 h-4 text-gray-600" /> : <Building2 className="w-4 h-4 text-coral-600" />}
                            {isHostMode ? 'Switch to Guest Mode' : 'Switch to Host Mode'}
                          </span>
                        </button>
                      </div>
                    )}

                    <div className="py-1">
                      {isHostMode ? (
                        <>
                          <Link
                            to="/host"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setProfileOpen(false)}
                          >
                            <Building2 className="w-4 h-4 text-gray-400" /> Host Dashboard
                          </Link>
                          <Link
                            to="/host/properties"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setProfileOpen(false)}
                          >
                            <Home className="w-4 h-4 text-gray-400" /> My Properties
                          </Link>
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setProfileOpen(false)}
                          >
                            <User className="w-4 h-4 text-gray-400" /> Account Profile
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setProfileOpen(false)}
                          >
                            <User className="w-4 h-4 text-gray-400" /> Profile
                          </Link>
                          <Link
                            to="/my-bookings"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setProfileOpen(false)}
                          >
                            <CalendarDays className="w-4 h-4 text-gray-400" /> My Bookings
                          </Link>
                          <Link
                            to="/guests"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setProfileOpen(false)}
                          >
                            <Users className="w-4 h-4 text-gray-400" /> Saved Guests
                          </Link>
                          {!isHost && (
                            <Link
                              to="/become-a-host"
                              className="flex items-center gap-3 px-4 py-2 text-sm text-coral-600 hover:bg-coral-50 transition-colors font-semibold"
                              onClick={() => setProfileOpen(false)}
                            >
                              <Building2 className="w-4 h-4 text-coral-500" /> Become a Host
                            </Link>
                          )}
                        </>
                      )}
                    </div>

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">
                  Log in
                </Link>
                <Link to="/signup" className="btn-primary text-sm !py-2.5 !px-5">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 animate-fade-in space-y-2">
            {/* Mode switch button on mobile */}
            {isAuthenticated && isHost && (
              <div className="px-4 py-2">
                <button
                  onClick={() => {
                    toggleMode();
                    setMobileOpen(false);
                    navigate(isHostMode ? '/' : '/host');
                  }}
                  className="w-full btn-secondary text-xs !py-2.5 flex items-center justify-center gap-2"
                >
                  {isHostMode ? (
                    <>
                      <Compass className="w-4 h-4 text-gray-600" /> Switch to Guest Experience
                    </>
                  ) : (
                    <>
                      <Building2 className="w-4 h-4 text-coral-600" /> Switch to Host Experience
                    </>
                  )}
                </button>
              </div>
            )}

            <div className="flex flex-col gap-1">
              {isHostMode ? (
                // Host mobile links
                <>
                  <Link
                    to="/host"
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    onClick={() => setMobileOpen(false)}
                  >
                    Host Dashboard
                  </Link>
                  <Link
                    to="/host/properties"
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    onClick={() => setMobileOpen(false)}
                  >
                    My Properties
                  </Link>
                  <Link
                    to="/host/properties/new"
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Plus className="w-4 h-4 text-coral-500" /> Add Property
                  </Link>
                  <Link
                    to="/profile"
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    onClick={() => setMobileOpen(false)}
                  >
                    Profile
                  </Link>
                </>
              ) : (
                // Guest mobile links
                <>
                  <Link
                    to="/"
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    onClick={() => setMobileOpen(false)}
                  >
                    Explore
                  </Link>
                  <Link
                    to="/search"
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    onClick={() => setMobileOpen(false)}
                  >
                    Search Stays
                  </Link>
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/my-bookings"
                        className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        onClick={() => setMobileOpen(false)}
                      >
                        My Bookings
                      </Link>
                      <Link
                        to="/guests"
                        className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        onClick={() => setMobileOpen(false)}
                      >
                        Saved Guests
                      </Link>
                      <Link
                        to="/profile"
                        className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        onClick={() => setMobileOpen(false)}
                      >
                        Profile
                      </Link>
                      {!isHost && (
                        <Link
                          to="/become-a-host"
                          className="px-4 py-2.5 rounded-xl text-sm font-semibold text-coral-600 hover:bg-coral-50"
                          onClick={() => setMobileOpen(false)}
                        >
                          Become a Host
                        </Link>
                      )}
                    </>
                  ) : (
                    <Link
                      to="/become-a-host"
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold text-coral-600 hover:bg-coral-50"
                      onClick={() => setMobileOpen(false)}
                    >
                      Become a Host
                    </Link>
                  )}
                </>
              )}

              {isAuthenticated ? (
                <div className="pt-2 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 pt-3 px-4">
                  <Link
                    to="/login"
                    className="btn-secondary text-sm flex-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="btn-primary text-sm flex-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
