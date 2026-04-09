'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import api from '@/lib/api';

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user: { name: string };
}

interface Props {
  medicineId: string;
  refresh?: number;
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`h-4 w-4 ${s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
      ))}
    </div>
  );
}

export default function ReviewList({ medicineId, refresh }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/reviews?medicineId=${medicineId}`)
      .then((res) => setReviews(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [medicineId, refresh]);

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (loading) return (
    <div className="space-y-3">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
          <div className="h-3 bg-gray-100 rounded w-1/4 mb-2" />
          <div className="h-4 bg-gray-100 rounded w-3/4" />
        </div>
      ))}
    </div>
  );

  return (
    <div>
      {/* Summary */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-3 mb-5">
          <span className="text-4xl font-bold text-gray-900">{avg}</span>
          <div>
            <StarDisplay rating={Math.round(Number(avg))} />
            <p className="text-xs text-gray-500 mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-linear-to-br from-indigo-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold">
                    {review.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{review.user?.name}</span>
                </div>
                <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
              <StarDisplay rating={review.rating} />
              {review.comment && (
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}