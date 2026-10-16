import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Plus, Package, CalendarDays, BarChart3 } from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { HotelDto } from '../../types';
import { ErrorState } from '../../components/ui/States';

const HostDashboardPage: React.FC = () => {
  const [hotels, setHotels] = useState<HotelDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await adminService.getAllHotels();
        setHotels(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard. You may need HOTEL_MANAGER role.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const activeCount = hotels.filter((h) => h.active).length;

  if (error) return <div className="page-container py-8"><ErrorState message={error} /></div>;

  return (
    <div className="page-container py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title">Host Dashboard</h1>
          <p className="section-subtitle">Manage your properties and bookings</p>
        </div>
        <Link to="/host/properties/new" className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add Property
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Properties', value: loading ? '...' : hotels.length, icon: <Building2 className="w-6 h-6" />, color: 'bg-coral-50 text-coral-500' },
          { label: 'Active Properties', value: loading ? '...' : activeCount, icon: <Package className="w-6 h-6" />, color: 'bg-emerald-50 text-emerald-500' },
          { label: 'Inactive Properties', value: loading ? '...' : hotels.length - activeCount, icon: <Building2 className="w-6 h-6" />, color: 'bg-amber-50 text-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'My Properties', desc: 'View and manage all properties', icon: <Building2 className="w-5 h-5" />, to: '/host/properties' },
          { label: 'Add Property', desc: 'List a new hotel', icon: <Plus className="w-5 h-5" />, to: '/host/properties/new' },
        ].map((action, i) => (
          <Link key={i} to={action.to} className="card p-5 hover:border-coral-200 group">
            <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center mb-3 group-hover:bg-coral-50 group-hover:text-coral-500 transition-colors">
              {action.icon}
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">{action.label}</h3>
            <p className="text-xs text-gray-500 mt-1">{action.desc}</p>
          </Link>
        ))}
      </div>

      {/* Properties List */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Properties</h2>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 skeleton rounded-xl" />)}
        </div>
      ) : hotels.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-gray-500 mb-4">You haven't added any properties yet.</p>
          <Link to="/host/properties/new" className="btn-primary text-sm"><Plus className="w-4 h-4" /> Add Property</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-4">
                {hotel.photos && hotel.photos.length > 0 ? (
                  <img src={hotel.photos[0]} alt={hotel.name} className="w-14 h-14 rounded-xl object-cover" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <div>
                  <Link to={`/host/properties/${hotel.id}`} className="font-semibold text-gray-900 hover:text-coral-600 transition-colors">
                    {hotel.name}
                  </Link>
                  <p className="text-sm text-gray-500">{hotel.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={hotel.active ? 'badge-success' : 'badge-warning'}>{hotel.active ? 'Active' : 'Inactive'}</span>
                <Link to={`/host/properties/${hotel.id}`} className="btn-primary text-xs !py-1.5">Manage</Link>
                <Link to={`/host/properties/${hotel.id}/rooms`} className="btn-ghost text-xs"><Package className="w-3.5 h-3.5" /> Rooms</Link>
                <Link to={`/host/properties/${hotel.id}/inventory`} className="btn-ghost text-xs">Inventory</Link>
                <Link to={`/host/properties/${hotel.id}/bookings`} className="btn-ghost text-xs"><CalendarDays className="w-3.5 h-3.5" /> Bookings</Link>
                <Link to={`/host/properties/${hotel.id}/reports`} className="btn-ghost text-xs"><BarChart3 className="w-3.5 h-3.5" /> Reports</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HostDashboardPage;
