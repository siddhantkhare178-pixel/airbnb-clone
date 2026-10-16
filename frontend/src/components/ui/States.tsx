import React from 'react';
import { AlertTriangle, RefreshCw, SearchX, Inbox } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Something went wrong. Please try again.',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
    <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
      <AlertTriangle className="w-8 h-8 text-red-500" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-1">Error</h3>
    <p className="text-sm text-gray-500 max-w-sm mb-4">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn-secondary text-sm">
        <RefreshCw className="w-4 h-4" /> Try Again
      </button>
    )}
  </div>
);

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Nothing here yet',
  message = 'No data to display.',
  icon,
  action,
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
      {icon || <Inbox className="w-8 h-8 text-gray-400" />}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
    <p className="text-sm text-gray-500 max-w-sm mb-4">{message}</p>
    {action}
  </div>
);

export const NoSearchResults: React.FC<{ query?: string }> = ({ query }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
    <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
      <SearchX className="w-8 h-8 text-amber-500" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-1">No results found</h3>
    <p className="text-sm text-gray-500 max-w-sm">
      {query
        ? `We couldn't find any hotels matching "${query}". Try adjusting your search.`
        : 'Try different search criteria.'}
    </p>
  </div>
);
