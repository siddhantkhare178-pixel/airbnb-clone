import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Users, MapPin, Building, Shield, CreditCard } from 'lucide-react';
import { format, addDays } from 'date-fns';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 3), 'yyyy-MM-dd'));
  const [roomsCount, setRoomsCount] = useState(1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;
    const params = new URLSearchParams({
      city: city.trim(),
      startDate,
      endDate,
      roomsCount: roomsCount.toString(),
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-coral-50 via-white to-warm-100">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-coral-100/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-warm-200/30 blur-3xl" />

        <div className="page-container relative z-10 py-16 sm:py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Find your next
              <span className="bg-gradient-to-r from-coral-500 to-coral-600 bg-clip-text text-transparent"> perfect stay</span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-gray-500 max-w-xl mx-auto leading-relaxed">
              Discover unique hotels and accommodations around the world. Book with confidence.
            </p>
          </div>

          {/* Search Panel */}
          <form
            onSubmit={handleSearch}
            className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 p-3 sm:p-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Destination */}
              <div className="lg:col-span-2 relative">
                <label htmlFor="search-city" className="sr-only">Destination</label>
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="search-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Where are you going?"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-all"
                  required
                />
              </div>

              {/* Check-in */}
              <div className="relative">
                <label htmlFor="search-checkin" className="sr-only">Check-in</label>
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  id="search-checkin"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-all"
                  required
                />
              </div>

              {/* Check-out */}
              <div className="relative">
                <label htmlFor="search-checkout" className="sr-only">Check-out</label>
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  id="search-checkout"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || format(new Date(), 'yyyy-MM-dd')}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-all"
                  required
                />
              </div>

              {/* Rooms + Search */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <label htmlFor="search-rooms" className="sr-only">Rooms</label>
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <select
                    id="search-rooms"
                    value={roomsCount}
                    onChange={(e) => setRoomsCount(Number(e.target.value))}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-all appearance-none"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n} Room{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn-primary !rounded-xl !px-5 flex-shrink-0" aria-label="Search hotels">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Why book with us</h2>
            <p className="mt-2 text-gray-500">Everything you need for a perfect trip</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Building className="w-7 h-7" />,
                title: 'Curated Properties',
                desc: 'Every property is verified and quality-checked to ensure a great experience.',
              },
              {
                icon: <Shield className="w-7 h-7" />,
                title: 'Secure Booking',
                desc: 'Your payments are securely processed through Stripe with full encryption.',
              },
              {
                icon: <CreditCard className="w-7 h-7" />,
                title: 'Flexible Cancellation',
                desc: 'Plans change — cancel eligible bookings easily from your dashboard.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="text-center p-8 rounded-2xl border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 group"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-coral-50 text-coral-500 flex items-center justify-center mb-5 group-hover:bg-coral-500 group-hover:text-white transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="page-container">
          <div className="bg-gradient-to-br from-coral-500 to-coral-600 rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to explore?</h2>
              <p className="text-coral-100 text-lg mb-8 max-w-lg mx-auto">
                Start searching for your ideal hotel and book your next adventure today.
              </p>
              <button
                onClick={() => document.getElementById('search-city')?.focus()}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-coral-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Search className="w-5 h-5" />
                Start Searching
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
