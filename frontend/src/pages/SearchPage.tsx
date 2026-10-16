import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Calendar, Users, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { hotelService } from '../services/hotelService';
import type { HotelPriceResponseDto, Page } from '../types';
import HotelCard from '../components/hotel/HotelCard';
import { HotelCardSkeleton } from '../components/ui/Skeletons';
import { ErrorState, NoSearchResults } from '../components/ui/States';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || format(addDays(new Date(), 3), 'yyyy-MM-dd'));
  const [roomsCount, setRoomsCount] = useState(Number(searchParams.get('roomsCount')) || 1);
  const [page, setPage] = useState(Number(searchParams.get('page')) || 0);

  const [results, setResults] = useState<Page<HotelPriceResponseDto> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchHotels = useCallback(async (searchCity: string, sd: string, ed: string, rooms: number, p: number) => {
    if (!searchCity.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await hotelService.searchHotels({
        city: searchCity.trim(),
        startDate: sd,
        endDate: ed,
        roomsCount: rooms,
        page: p,
        size: 12,
      });
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search hotels');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-search on mount if params are present
  useEffect(() => {
    const urlCity = searchParams.get('city');
    if (urlCity) {
      searchHotels(
        urlCity,
        searchParams.get('startDate') || startDate,
        searchParams.get('endDate') || endDate,
        Number(searchParams.get('roomsCount')) || roomsCount,
        Number(searchParams.get('page')) || 0
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;
    setPage(0);
    const params = { city: city.trim(), startDate, endDate, roomsCount: roomsCount.toString(), page: '0' };
    setSearchParams(params);
    searchHotels(city, startDate, endDate, roomsCount, 0);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setSearchParams({
      city: city.trim(),
      startDate,
      endDate,
      roomsCount: roomsCount.toString(),
      page: newPage.toString(),
    });
    searchHotels(city, startDate, endDate, roomsCount, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const searchParamsString = new URLSearchParams({
    startDate,
    endDate,
    roomsCount: roomsCount.toString(),
  }).toString();

  return (
    <div className="page-container py-8">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="card-elevated p-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-2 relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City or destination"
              className="input-field !pl-11"
              required
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="input-field !pl-11"
              required
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              className="input-field !pl-11"
              required
            />
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <select
                value={roomsCount}
                onChange={(e) => setRoomsCount(Number(e.target.value))}
                className="input-field !pl-11 appearance-none"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n} Room{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-primary !px-5">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>

      {/* Results Header */}
      {results && !loading && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Hotels in {city}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {results.totalElements} {results.totalElements === 1 ? 'property' : 'properties'} found
            </p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <HotelCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && <ErrorState message={error} onRetry={() => searchHotels(city, startDate, endDate, roomsCount, page)} />}

      {/* Results */}
      {!loading && !error && results && (
        <>
          {results.empty ? (
            <NoSearchResults query={city} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.content.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} searchParams={searchParamsString} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {results.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={results.first}
                className="btn-secondary !py-2 !px-3"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(results.totalPages, 7) }).map((_, i) => {
                const pageNum = i;
                return (
                  <button
                    key={i}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pageNum === page
                        ? 'bg-coral-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={results.last}
                className="btn-secondary !py-2 !px-3"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Initial state */}
      {!loading && !error && !results && (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-coral-50 flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-coral-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Search for hotels</h2>
          <p className="text-gray-500">Enter a city and dates to find available properties</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
