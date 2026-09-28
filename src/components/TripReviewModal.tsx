/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Star, 
  X, 
  CheckCircle2, 
  Sparkles, 
  ThumbsUp, 
  MapPin, 
  Calendar, 
  MessageSquare, 
  Award,
  Send
} from 'lucide-react';
import { Booking, TripReview } from '../types';

interface TripReviewModalProps {
  booking: Booking;
  onClose: () => void;
  onSubmitReview: (reviewData: Omit<TripReview, 'id' | 'createdAt'>) => Promise<void>;
  existingReview?: TripReview;
}

export const TripReviewModal: React.FC<TripReviewModalProps> = ({
  booking,
  onClose,
  onSubmitReview,
  existingReview
}) => {
  const [rating, setRating] = useState<number>(existingReview?.rating || 5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [title, setTitle] = useState(existingReview?.title || '');
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [travelerName, setTravelerName] = useState(existingReview?.travelerName || booking.travelerName || 'Traveler');
  const [recommend, setRecommend] = useState<boolean>(existingReview?.recommend ?? true);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    existingReview?.tags || ['Scenic Splendor', 'Punctual Transfers', 'Family Friendly']
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const availableTags = [
    'Scenic Splendor',
    'Punctual Transfers',
    'Delicious Local Food',
    'Cozy & Clean Rooms',
    'Knowledgeable Guide',
    'Family Friendly',
    'Romantic for Couples',
    'Smooth Flight / Cab',
    'Unbeatable Value',
    'Safe & Well Organized'
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 1:
        return { label: 'Poor Experience', color: 'text-rose-600', emoji: '😞' };
      case 2:
        return { label: 'Fair / Could Be Better', color: 'text-amber-600', emoji: '😐' };
      case 3:
        return { label: 'Good Holiday', color: 'text-blue-600', emoji: '😊' };
      case 4:
        return { label: 'Very Good Experience', color: 'text-emerald-600', emoji: '😃' };
      case 5:
        return { label: 'Exceptional & Memorable!', color: 'text-amber-500', emoji: '🌟' };
      default:
        return { label: 'Select Rating', color: 'text-slate-500', emoji: '⭐' };
    }
  };

  const currentDisplayRating = hoverRating || rating;
  const ratingMeta = getRatingLabel(currentDisplayRating);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      setErrorMsg('Please select a star rating from 1 to 5.');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('Please write a brief headline or title for your review.');
      return;
    }
    if (!comment.trim() || comment.trim().length < 15) {
      setErrorMsg('Please share at least a short sentence (min 15 characters) about your experience.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');

      // Find destinationId if applicable (e.g. if booking itemId was pkg-kashmir or dest-kashmir)
      let destinationId: string | undefined = undefined;
      if (booking.itemId.includes('kashmir')) destinationId = 'dest-kashmir';
      else if (booking.itemId.includes('goa')) destinationId = 'dest-goa';
      else if (booking.itemId.includes('kerala')) destinationId = 'dest-kerala';
      else if (booking.itemId.includes('rajasthan') || booking.itemId.includes('jaipur')) destinationId = 'dest-jaipur';
      else if (booking.itemId.includes('agra')) destinationId = 'dest-agra';
      else if (booking.itemId.includes('manali')) destinationId = 'dest-manali';
      else if (booking.itemId.includes('ladakh')) destinationId = 'dest-ladakh';
      else if (booking.itemId.includes('dubai')) destinationId = 'dest-dubai';
      else if (booking.itemId.includes('singapore')) destinationId = 'dest-singapore';
      else if (booking.itemId.includes('thailand')) destinationId = 'dest-thailand';
      else if (booking.itemId.includes('bali')) destinationId = 'dest-bali';
      else if (booking.itemId.includes('vietnam')) destinationId = 'dest-vietnam';
      else if (booking.itemId.includes('darjeeling')) destinationId = 'dest-darjeeling';
      else if (booking.itemId.includes('switzerland')) destinationId = 'dest-switzerland';

      await onSubmitReview({
        bookingId: booking.id,
        userId: booking.userId,
        travelerName: travelerName.trim() || 'Verified Traveler',
        travelerEmail: booking.travelerEmail,
        itemType: booking.itemType,
        itemId: booking.itemId,
        destinationId,
        itemTitle: booking.title,
        rating,
        title: title.trim(),
        comment: comment.trim(),
        tags: selectedTags,
        recommend
      });

      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit review. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Verified Post-Trip Review</span>
          </div>

          <h2 className="text-xl font-black">
            {existingReview ? 'Update Your Trip Experience' : 'Rate & Review Your Completed Trip'}
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            Your review updates live traveler ratings and helps fellow explorers choose their perfect getaway.
          </p>
        </div>

        {/* Success Banner */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Review Submitted Successfully!</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Thank you for sharing your feedback. The average ratings for this trip and destination have been recalculated and updated live!
            </p>
            <div className="flex items-center justify-center gap-1 text-amber-400 pt-2">
              {[...Array(rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Booking Reference Pill */}
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <img
                src={booking.image}
                alt={booking.title}
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-black text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                    {booking.bookingCode}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    {booking.itemType}
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-900 truncate mt-0.5">
                  {booking.title}
                </h4>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    {booking.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {booking.startDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Star Rating */}
            <div className="bg-amber-50/50 border border-amber-200/60 p-4 rounded-2xl text-center space-y-2">
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wide">
                Overall Experience Rating *
              </label>

              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((starValue) => {
                  const isActive = starValue <= currentDisplayRating;
                  return (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHoverRating(starValue)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 transition-transform hover:scale-125 active:scale-95 cursor-pointer focus:outline-hidden"
                      title={`${starValue} Stars`}
                    >
                      <Star
                        className={`w-9 h-9 transition-colors ${
                          isActive
                            ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs font-black pt-1">
                <span>{ratingMeta.emoji}</span>
                <span className={ratingMeta.color}>{ratingMeta.label}</span>
                <span className="text-slate-400 font-bold ml-1">({currentDisplayRating} of 5 Stars)</span>
              </div>
            </div>

            {/* Review Title */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                Headline / Review Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Dream vacation! Shikara cruise & snowfall in Gulmarg"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-blue-600 bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Detailed Comment */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1 flex items-center justify-between">
                <span>Detailed Feedback & Story *</span>
                <span className="text-[10px] text-slate-400 font-medium">Min 15 chars</span>
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe your journey: how was the driver, hotel room comfort, sightseeing roadmap, meals, and booking support? Share helpful tips for future guests."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-600 bg-slate-50 focus:bg-white resize-none"
              />
            </div>

            {/* Quick Trip Highlights / Tags */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1.5">
                Trip Highlights (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reviewer Name & Recommend Checkbox */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-[11px] font-black text-slate-600 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={travelerName}
                  onChange={(e) => setTravelerName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50"
                  placeholder="e.g. Rohan Sharma"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer pt-3 select-none">
                  <input
                    type="checkbox"
                    checked={recommend}
                    onChange={(e) => setRecommend(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded-sm"
                  />
                  <ThumbsUp className="w-3.5 h-3.5 text-blue-600" />
                  <span>I recommend this trip to other travelers</span>
                </label>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-200">
                {errorMsg}
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Publishing Review...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Post-Trip Review</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
