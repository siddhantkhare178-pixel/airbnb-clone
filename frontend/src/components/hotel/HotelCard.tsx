import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Wifi, Car, Coffee, Dumbbell, Waves, Utensils, Wind } from 'lucide-react';
import type { HotelPriceResponseDto } from '../../types';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80';

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-3.5 h-3.5" />,
  parking: <Car className="w-3.5 h-3.5" />,
  breakfast: <Coffee className="w-3.5 h-3.5" />,
  gym: <Dumbbell className="w-3.5 h-3.5" />,
  pool: <Waves className="w-3.5 h-3.5" />,
  restaurant: <Utensils className="w-3.5 h-3.5" />,
  ac: <Wind className="w-3.5 h-3.5" />,
};

const getAmenityIcon = (amenity: string) => {
  const key = amenity.toLowerCase().replace(/[\s_-]/g, '');
  for (const [k, icon] of Object.entries(amenityIcons)) {
    if (key.includes(k)) return icon;
  }
  return null;
};

interface HotelCardProps {
  hotel: HotelPriceResponseDto;
  searchParams?: string;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, searchParams }) => {
  const photo = hotel.photos && hotel.photos.length > 0 ? hotel.photos[0] : FALLBACK_IMAGE;
  const linkTo = `/hotels/${hotel.id}${searchParams ? `?${searchParams}` : ''}`;

  return (
    <Link to={linkTo} className="card overflow-hidden group block">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={photo}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
          loading="lazy"
        />
        {hotel.price > 0 && (
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-lg">
            <span className="text-lg font-bold text-gray-900">₹{hotel.price.toLocaleString()}</span>
            <span className="text-xs text-gray-500 ml-1">/night</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-coral-600 transition-colors line-clamp-1">
          {hotel.name}
        </h3>
        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
          <MapPin className="w-4 h-4 text-coral-400 flex-shrink-0" />
          <span className="truncate">{hotel.city}</span>
        </div>

        {/* Amenities */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {hotel.amenities.slice(0, 4).map((amenity, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 text-xs text-gray-600 border border-gray-100"
              >
                {getAmenityIcon(amenity)}
                {amenity}
              </span>
            ))}
            {hotel.amenities.length > 4 && (
              <span className="px-2 py-0.5 rounded-md bg-gray-50 text-xs text-gray-400 border border-gray-100">
                +{hotel.amenities.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default HotelCard;
