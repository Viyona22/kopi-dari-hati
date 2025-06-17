
import React from 'react';
import { Star } from 'lucide-react';
import { useReviewData, Review } from '@/hooks/useReviewData';

interface ReviewsListProps {
  menuItemId: string;
}

export function ReviewsList({ menuItemId }: ReviewsListProps) {
  const { reviews, loading } = useReviewData(menuItemId);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${
          index < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <p>Belum ada review untuk menu ini.</p>
        <p className="text-sm">Jadilah yang pertama memberikan review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-medium text-gray-900">{review.customer_name}</h4>
              <div className="flex items-center gap-1 mt-1">
                {renderStars(review.rating)}
                <span className="text-sm text-gray-600 ml-1">{review.rating}/5</span>
              </div>
            </div>
            {review.created_at && (
              <span className="text-xs text-gray-500">
                {formatDate(review.created_at)}
              </span>
            )}
          </div>
          {review.comment && (
            <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
}
