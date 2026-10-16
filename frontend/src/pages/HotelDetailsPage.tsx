import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, Wifi, Car, Coffee, Dumbbell, Waves, Utensils, Wind, Phone, Mail, Navigation, CalendarDays, Users, Loader2 } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { hotelService } from '../services/hotelService';
import type { HotelInfoDto, RoomPriceResponseDto } from '../types';
import { DetailSkeleton } from '../components/ui/Skeletons';
import { ErrorState } from '../components/ui/States';
import { useAuth } from '../context/AuthContext';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80';

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-4 h-4" />,
  parking: <Car className="w-4 h-4" />,
  breakfast: <Coffee className="w-4 h-4" />,
  gym: <Dumbbell className="w-4 h-4" />,
  pool: <Waves className="w-4 h-4" />,
  restaurant: <Utensils className="w-4 h-4" />,
  ac: <Wind className="w-4 h-4" />,
};

const getAmenityIcon = (amenity: string) => {
  const key = amenity.toLowerCase().replace(/[\s_-]/g, '');
  for (const [k, icon] of Object.entries(amenityIcons)) {
    if (key.includes(k)) return icon;
  }
  return null;
};

const HotelDetailsPage: React.FC = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [startDate, setStartDate] = useState(searchParams.get('startDate') || format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || format(addDays(new Date(), 3), 'yyyy-MM-dd'));
  const [roomsCount, setRoomsCount] = useState(Number(searchParams.get('roomsCount')) || 1);

  const [hotelInfo, setHotelInfo] = useState<HotelInfoDto | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomPriceResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  const fetchHotelInfo = async () => {
    if (!hotelId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await hotelService.getHotelInfo(Number(hotelId), {
        startDate,
        endDate,
        roomsCount,
      });
      setHotelInfo(data);
      if (data.rooms && data.rooms.length > 0) {
        setSelectedRoom(data.rooms[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load hotel details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotelInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotelId]);

  const handleUpdateDates = () => {
    fetchHotelInfo();
  };

  const handleBookNow = () => {
    if (!selectedRoom || !hotelId) return;
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: window.location.pathname + window.location.search } } });
      return;
    }
    const params = new URLSearchParams({
      roomId: selectedRoom.id.toString(),
      startDate,
      endDate,
      roomsCount: roomsCount.toString(),
      roomType: selectedRoom.type,
      price: selectedRoom.price.toString(),
    });
    navigate(`/booking/${hotelId}?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="page-container py-8">
        <DetailSkeleton />
      </div>
    );
  }

  if (error || !hotelInfo) {
    return (
      <div className="page-container py-8">
        <ErrorState message={error || 'Hotel not found'} onRetry={fetchHotelInfo} />
      </div>
    );
  }

  const { hotel, rooms } = hotelInfo;
  const photos = hotel.photos && hotel.photos.length > 0 ? hotel.photos : [FALLBACK_IMAGE];

  return (
    <div className="page-container py-8 animate-fade-in">
      {/* Photo Gallery */}
      <div className="relative rounded-2xl overflow-hidden mb-8 bg-gray-100">
        <div className="aspect-[16/7] sm:aspect-[16/6]">
          <img
            src={photos[photoIndex]}
            alt={`${hotel.name} - Photo ${photoIndex + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
          />
        </div>
        {photos.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setPhotoIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === photoIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`View photo ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Hotel Info */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin className="w-5 h-5 text-coral-400" />
              <span className="text-lg">{hotel.city}</span>
            </div>
          </div>

          {/* Amenities */}
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {hotel.amenities.map((amenity, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="w-9 h-9 rounded-lg bg-coral-50 text-coral-500 flex items-center justify-center flex-shrink-0">
                      {getAmenityIcon(amenity) || <Wifi className="w-4 h-4" />}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          {hotel.contactInfo && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="card p-5 space-y-3">
                {hotel.contactInfo.address && (
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Navigation className="w-4 h-4 text-gray-400" /> {hotel.contactInfo.address}
                  </div>
                )}
                {hotel.contactInfo.phoneNumber && (
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" /> {hotel.contactInfo.phoneNumber}
                  </div>
                )}
                {hotel.contactInfo.email && (
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" /> {hotel.contactInfo.email}
                  </div>
                )}
                {hotel.contactInfo.location && (
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" /> {hotel.contactInfo.location}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rooms */}
          {rooms && rooms.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Rooms</h2>
              <div className="space-y-4">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`card p-5 cursor-pointer transition-all ${
                      selectedRoom?.id === room.id
                        ? 'ring-2 ring-coral-500 border-coral-200'
                        : 'hover:border-gray-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {room.photos && room.photos.length > 0 && (
                          <img
                            src={room.photos[0]}
                            alt={room.type}
                            className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                          />
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{room.type}</h3>
                          {room.amenities && room.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {room.amenities.slice(0, 3).map((a, i) => (
                                <span key={i} className="badge-neutral text-xs">{a}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">₹{room.price.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">per night</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="card-elevated p-6 sticky top-24 space-y-5">
            <h3 className="text-lg font-semibold text-gray-900">Book Your Stay</h3>

            <div className="space-y-3">
              <div>
                <label className="label flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /> Check-in</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /> Check-out</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label flex items-center gap-1.5"><Users className="w-4 h-4" /> Rooms</label>
                <select
                  value={roomsCount}
                  onChange={(e) => setRoomsCount(Number(e.target.value))}
                  className="input-field"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n} Room{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <button onClick={handleUpdateDates} className="btn-secondary w-full text-sm">
                <Loader2 className="w-4 h-4" /> Update Availability
              </button>
            </div>

            {selectedRoom && (
              <div className="border-t border-gray-100 pt-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Room type</span>
                  <span className="font-medium text-gray-900">{selectedRoom.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Price per night</span>
                  <span className="font-medium text-gray-900">₹{selectedRoom.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Rooms</span>
                  <span className="font-medium text-gray-900">{roomsCount}</span>
                </div>

                <button onClick={handleBookNow} className="btn-primary w-full mt-4">
                  Book Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailsPage;
