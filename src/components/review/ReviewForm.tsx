'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/app/provider/AuthProvider';

interface Props {
  medicineId: string;
  onReviewSubmitted?: () => void;
}

export default function ReviewForm({ medicineId, onReviewSubmitted }: Props) {
  const { user } = useAuth();
  const [rating,  setRating]  = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async () => {
    if (!user) return setError('Please login to submit a review');
    if (rating === 0) return setError('Please select a star rating');

    setLoading(true); setError('');
    try {
      await api.post('/reviews', { medicineId, rating, comment });
      setSuccess(true);
      setRating(0); setComment('');
      onReviewSubmitted?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally { setLoading(false); }
  };

  if (success) return (
    <div className="flex flex-col items-center py-8 gap-2 text-center">
      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
        <Star className="h-6 w-6 text-green-600 fill-green-600" />
      </div>
      <p className="font-semibold text-gray-900">Review Submitted!</p>
      <p className="text-sm text-gray-500">Thank you for your feedback.</p>
      <button onClick={() => setSuccess(false)}
        className="mt-2 text-sm font-semibold text-indigo-600 hover:text-pink-600 transition-colors">
        Write another review
      </button>
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="font-bold text-gray-900 mb-4">Write a Review</h3>

      {/* Star Rating */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-600 mb-2">Your Rating</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`h-8 w-8 transition-colors ${
                  star <= (hovered || rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
          </p>
        )}
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Comment <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          rows={3}
          placeholder="Share your experience with this medicine..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

      {!user ? (
        <p className="text-sm text-gray-500 text-center py-2">
          <a href="/login" className="text-indigo-600 font-semibold hover:text-pink-600">Login</a> to write a review
        </p>
      ) : (
        <button onClick={handleSubmit} disabled={loading}
          className="flex items-center justify-center gap-2 w-full bg-linear-to-r from-indigo-600 to-pink-700 text-white font-semibold py-2.5 rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity">
          {loading
            ? <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            : 'Submit Review'}
        </button>
      )}
    </div>
  );
}