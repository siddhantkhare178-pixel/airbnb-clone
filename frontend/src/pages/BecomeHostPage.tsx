import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  TrendingUp,
  CalendarCheck,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Loader2,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const BecomeHostPage: React.FC = () => {
  const { user, isAuthenticated, isHost, setMode, refreshUser } = useAuth();
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  const handleRefreshStatus = async () => {
    setChecking(true);
    try {
      await refreshUser();
      toast.success('Account authorization refreshed');
    } catch {
      toast.error('Failed to refresh status');
    } finally {
      setChecking(false);
    }
  };

  const handleEnterHostMode = () => {
    setMode('host');
    navigate('/host');
  };

  return (
    <div className="page-container py-10 animate-fade-in">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8 sm:p-14 mb-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-coral-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-coral-500/20 text-coral-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-coral-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Host on StaySpot
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            Turn your spaces into unforgettable stays
          </h1>
          <p className="text-gray-300 text-base sm:text-lg mb-8 leading-relaxed">
            Welcome travelers from around the world. List hotels and boutique accommodations, manage real-time inventory, and track your revenue with ease.
          </p>

          {/* Conditional CTA */}
          {isAuthenticated ? (
            isHost ? (
              <button
                onClick={handleEnterHostMode}
                className="btn-primary text-base !py-3.5 !px-8 shadow-xl shadow-coral-500/30"
              >
                Switch to Host Experience <ArrowRight className="w-5 h-5 ml-1" />
              </button>
            ) : (
              <a
                href="#host-status"
                className="btn-primary text-base !py-3.5 !px-8 shadow-xl shadow-coral-500/30"
              >
                Check Host Access Status <ArrowRight className="w-5 h-5 ml-1" />
              </a>
            )
          ) : (
            <div className="flex flex-wrap gap-4">
              <Link to="/signup" className="btn-primary text-base !py-3.5 !px-8">
                Create Host Account <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
              <Link to="/login" className="btn-secondary text-base !py-3.5 !px-8 !bg-white/10 !text-white !border-white/20 hover:!bg-white/20">
                Log In
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="mb-14">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Everything you need to succeed as a host
          </h2>
          <p className="text-gray-500">
            Enterprise-grade property management tools connected directly to the Spring Boot reservation core.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Building2 className="w-6 h-6 text-coral-500" />,
              title: 'Multi-Room Listings',
              desc: 'List properties with room types, base prices, capacities, amenities, and high-resolution photo sets.',
            },
            {
              icon: <TrendingUp className="w-6 h-6 text-emerald-500" />,
              title: 'Dynamic Surge Pricing',
              desc: 'Configure surge pricing multipliers and seasonal factors across customized date windows.',
            },
            {
              icon: <CalendarCheck className="w-6 h-6 text-sky-500" />,
              title: 'Automated 365 Inventory',
              desc: 'Activating a property automatically provisions a full year of synchronized room-level inventory.',
            },
            {
              icon: <BarChart3 className="w-6 h-6 text-amber-500" />,
              title: 'Live Revenue Reports',
              desc: 'Gain instant insight into total confirmed bookings, gross earnings, and average revenue per stay.',
            },
          ].map((f, i) => (
            <div key={i} className="card p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-4 border border-gray-100">
                {f.icon}
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Real Host Authorization Status Section */}
      <div id="host-status" className="max-w-3xl mx-auto mb-16">
        <div className="card p-6 sm:p-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-coral-50 text-coral-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Host Authorization & Roles</h2>
              <p className="text-xs sm:text-sm text-gray-500">Verified backend permission state</p>
            </div>
          </div>

          {!isAuthenticated ? (
            <div className="text-center py-6">
              <Lock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 text-lg mb-1">Sign in to check your host status</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                Host management features require authentication and the <code className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-700">HOTEL_MANAGER</code> role.
              </p>
              <div className="flex justify-center gap-3">
                <Link to="/login" className="btn-primary text-sm">
                  Log in
                </Link>
                <Link to="/signup" className="btn-secondary text-sm">
                  Create account
                </Link>
              </div>
            </div>
          ) : isHost ? (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-emerald-900 text-sm">Host Access Active (HOTEL_MANAGER)</h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Your authenticated session possesses verified <code className="font-mono">ROLE_HOTEL_MANAGER</code> authorities. You have full access to create properties, configure rooms and inventory, and view earnings.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">Logged in as {user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button onClick={handleEnterHostMode} className="btn-primary w-full sm:w-auto text-sm">
                  Launch Host Dashboard <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <h4 className="font-semibold text-amber-900 text-sm">Host Role Required (HOTEL_MANAGER)</h4>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Your account is currently registered with standard <code className="font-mono bg-amber-100 px-1 py-0.5 rounded text-amber-900">GUEST</code> permissions. In compliance with your Spring Boot backend architecture, all administrative endpoints (<code className="font-mono">/admin/**</code>) strictly require the <code className="font-mono font-semibold">HOTEL_MANAGER</code> role.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-3">
                <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-coral-500" /> Enterprise Role Architecture Note
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  In accordance with security standards, permissions are never faked in client-side storage. To grant this account host capabilities:
                </p>
                <div className="bg-white p-3 rounded-lg border border-gray-200 text-xs text-gray-700 font-mono space-y-1 overflow-x-auto">
                  <p className="text-gray-500">// Smallest backend change required:</p>
                  <p className="text-coral-600">POST /api/v1/users/become-host</p>
                  <p className="text-gray-600">user.getRoles().add(Role.HOTEL_MANAGER);</p>
                  <p className="text-gray-600">userRepository.save(user);</p>
                </div>
                <p className="text-xs text-gray-500">
                  Alternatively, the database administrator can assign the <code className="font-mono">HOTEL_MANAGER</code> role to your user ID in the <code className="font-mono">app_user_roles</code> table.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">Current User: {user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleRefreshStatus}
                  disabled={checking}
                  className="btn-secondary w-full sm:w-auto text-sm"
                >
                  {checking ? (
                    <Loader2 className="w-4 h-4 animate-spin text-coral-500" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  Check Authorization Status
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BecomeHostPage;
