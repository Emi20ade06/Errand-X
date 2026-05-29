import React, { useState } from 'react';
import { X, Star, Heart } from 'lucide-react';
import { sanitizeString } from '../sanitizer';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string | null;
  providerName: string | null;
  onSubmitRating: (bookingId: string, rating: number, review: string) => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  providerName,
  onSubmitRating,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [review, setReview] = useState('');

  if (!isOpen || !bookingId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanReview = sanitizeString(review, 400);
    onSubmitRating(bookingId, rating, cleanReview);
    // Reset
    setRating(5);
    setReview('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-slate-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full p-1.5 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <Heart className="h-10 w-10 text-brand mx-auto fill-brand/10 mb-2 animate-bounce" />
          <h2 className="font-display text-xl font-black text-slate-900">How was the session?</h2>
          <p className="text-xs text-slate-500 mt-1">Rate your transaction with {providerName || 'your peer operator'}</p>
        </div>

        {/* Stars Selector FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex justify-center gap-2 items-center">
            {[1, 2, 3, 4, 5].map((starNum) => {
              const active = rating >= starNum;
              return (
                <button
                  type="button"
                  key={starNum}
                  onClick={() => setRating(starNum)}
                  className="cursor-pointer p-1.5 focus:outline-hidden hover:scale-110 transition shrink-0"
                >
                  <Star className={`h-8 w-8 stroke-amber-500 ${active ? 'fill-amber-500 text-amber-500' : 'text-slate-200'}`} />
                </button>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-705 uppercase mb-1.5">Share your experience (Optional)</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Was the work done fast? How was the phone repair or cooking quality? Share comments..."
              rows={3}
              className="w-full rounded-lg border-2 border-slate-200 px-4 py-2.5 text-sm focus:border-brand outline-hidden text-slate-900"
            />
          </div>

          <button
            type="submit"
            className="cursor-pointer btn-accessible-primary rounded-xl py-3 text-sm font-bold w-full text-center"
          >
            Submit Peer Review
          </button>
        </form>

      </div>
    </div>
  );
};
