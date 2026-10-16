import React from 'react';

export const HotelCardSkeleton: React.FC = () => (
  <div className="card overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-5 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="flex gap-2">
        <div className="h-6 bg-gray-200 rounded-full w-16" />
        <div className="h-6 bg-gray-200 rounded-full w-20" />
      </div>
      <div className="h-5 bg-gray-200 rounded w-1/3 mt-2" />
    </div>
  </div>
);

export const DetailSkeleton: React.FC = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-64 sm:h-96 bg-gray-200 rounded-2xl" />
    <div className="space-y-3">
      <div className="h-8 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-1/3" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="h-32 bg-gray-200 rounded-xl" />
      <div className="h-32 bg-gray-200 rounded-xl" />
    </div>
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="space-y-3 animate-pulse">
    <div className="h-10 bg-gray-200 rounded-lg" />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-14 bg-gray-100 rounded-lg" />
    ))}
  </div>
);

export const FormSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-10 bg-gray-200 rounded-xl" />
      </div>
    ))}
    <div className="h-12 bg-gray-200 rounded-xl mt-4" />
  </div>
);
