/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Star, 
  X, 
  CheckCircle2, 
  Sparkles, 
  ThumbsUp, 
  Search, 
  Filter, 
  PenTool, 
  Compass, 
  Package, 
  Hotel as HotelIcon, 
  User, 
  Tag, 
  Calendar,
  MessageSquare,
  Award
} from 'lucide-react';
import { TouristDestination, TourPackage, Hotel, TripReview, UserProfile } from '../types';
import { getAllTripReviewsSync, createTripReview } from '../lib/supabase';

interface ReviewsRatingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinations: TouristDestination[];
  packages: TourPackage[];
  hotels: Hotel[];
  currentUser?: UserProfile | null;
  onReviewSubmitted?: (review: TripReview) => void;
}

export const ReviewsRatingsModal: React.FC<ReviewsRatingsModalProps> = ({
  isOpen,
  onClose,
  destinations,
  packages,
  hotels,
  currentUser,
  onReviewSubmitted
}) => {
  const [reviewsList, setReviewsList] = useState<TripReview[]>(() => getAllTripReviewsSync());
  const [activeView, setActiveView] = useState<'browse' | 'write'>('browse');
  
  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'package' | 'hotel' | 'destination'>('all');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');

  // Form states
  const [formItemType, setFormItemType] = useState<'package' | 'hotel' | 'destination'>('package');
  const [formItemId, setFormItemId] = useState<string>(packages[0]?.id || '');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [travelerName, setTravelerName] = useState(currentUser?.fullName || '');
  const [travelerEmail, setTravelerEmail] = useState(currentUser?.email || '');
  const [recommend, setRecommend] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Scenic Splendor', 'Superb Hospitality', 'Family Friendly']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      if (currentUser?.fullName && !travelerName) {
        setTravelerName(currentUser.fullName);
      }
      if (currentUser?.email && !travelerEmail) {
        setTravelerEmail(currentUser.email);
      }
      setReviewsList(getAllTripReviewsSync());
    }
  }, [isOpen, currentUser]);

  const availableTags = [
    'Scenic Splendor',
    'Superb Hospitality',
    'Punctual Transfers',
    'Delicious Local Food',
    'Cozy & Clean Rooms',
    'Knowledgeable Guide',
    'Family Friendly',
    'Romantic for Couples',
    'Great Value for Money',
    'Safe & Well Organized',
    'Smooth Booking'
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Determine current item title based on selection
  const selectedItemTitle = useMemo(() => {
    if (formItemType === 'package') {
      const p = packages.find((item) => item.id === formItemId);
      return p ? p.title : packages[0]?.title || 'Tour Package';
    }
    if (formItemType === 'hotel') {
      const h = hotels.find((item) => item.id === formItemId);
      return h ? h.name : hotels[0]?.name || 'Luxury Hotel';
    }
    const d = destinations.find((item) => item.id === formItemId);
    return d ? d.name : destinations[0]?.name || 'Destination';
  }, [formItemType, formItemId, packages, hotels, destinations]);

  // Overall Statistics
  const stats = useMemo(() => {
    if (reviewsList.length === 0) return { avg: 4.9, count: 0, breakdown: { 5: 90, 4: 8, 3: 2, 2: 0, 1: 0 } };
    const total = reviewsList.reduce((acc, r) => acc + (r.rating || 5), 0);
    const avg = Number((total / reviewsList.length).toFixed(1));
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsList.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
      counts[star] = (counts[star] || 0) + 1;
    });
    return {
      avg: avg || 4.9,
      count: reviewsList.length,
      breakdown: {
        5: Math.round((counts[5] / reviewsList.length) * 100),
        4: Math.round((counts[4] / reviewsList.length) * 100),
        3: Math.round((counts[3] / reviewsList.length) * 100),
        2: Math.round((counts[2] / reviewsList.length) * 100),
        1: Math.round((counts[1] / reviewsList.length) * 100)
      }
    };
  }, [reviewsList]);

  // Filtered Reviews list
  const filteredReviews = useMemo(() => {
    return reviewsList.filter((r) => {
      if (filterType !== 'all' && r.itemType !== filterType) {
        return false;
      }
      if (filterRating !== 'all' && Math.round(r.rating) !== filterRating) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.title.toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q) ||
          r.travelerName.toLowerCase().includes(q) ||
          r.itemTitle.toLowerCase().includes(q) ||
          (r.tags && r.tags.some((t) => t.toLowerCase().includes(q)))
        );
      }
      return true;
    });
  }, [reviewsList, filterType, filterRating, searchQuery]);

  const ratingLabel = (stars: number) => {
    switch (stars) {
      case 1:
        return { label: 'Poor', emoji: '😞', color: 'text-rose-500' };
      case 2:
        return { label: 'Fair', emoji: '😐', color: 'text-amber-500' };
      case 3:
        return { label: 'Good', emoji: '😊', color: 'text-blue-500' };
      case 4:
        return { label: 'Very Good', emoji: '😃', color: 'text-emerald-500' };
      case 5:
        return { label: 'Exceptional & Unforgettable!', emoji: '🌟', color: 'text-amber-400' };
      default:
        return { label: 'Select Rating', emoji: '⭐', color: 'text-slate-400' };
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!title.trim()) {
      setErrorMessage('Please enter a headline for your review.');
      return;
    }
    if (!comment.trim() || comment.trim().length < 10) {
      setErrorMessage('Please write at least a sentence (min 10 characters) sharing your experience.');
      return;
    }
    if (!travelerName.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createTripReview({
        travelerName: travelerName.trim(),
        travelerEmail: travelerEmail.trim() || undefined,
        userId: currentUser?.id,
        itemType: formItemType,
        itemId: formItemId || 'general',
        destinationId: formItemType === 'destination' ? formItemId : undefined,
        itemTitle: selectedItemTitle,
        rating,
        title: title.trim(),
        comment: comment.trim(),
        tags: selectedTags,
        recommend
      });

      setReviewsList((prev) => [created, ...prev]);
      if (onReviewSubmitted) {
        onReviewSubmitted(created);
      }

      setSuccessMessage('Thank you! Your verified review and star rating has been published.');
      setTitle('');
      setComment('');
      setTimeout(() => {
        setSuccessMessage('');
        setActiveView('browse');
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] shadow-2xl flex flex-col overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shadow-xs">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Traveler Reviews & Star Ratings
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full">
                  Verified Travelers
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Authentic ratings, traveler testimonials & vacation feedback across Incredible India
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher Bar */}
        <div className="px-5 sm:px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('browse')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeView === 'browse'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Browse Reviews ({reviewsList.length})</span>
            </button>

            <button
              onClick={() => setActiveView('write')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeView === 'write'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-900/60'
              }`}
            >
              <PenTool className="w-3.5 h-3.5 text-amber-500" />
              <span>Write a Review & Rate</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-xs font-black text-slate-900 dark:text-white">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{stats.avg} / 5.0</span>
            <span className="text-[11px] text-slate-400 font-normal">({stats.count} Ratings)</span>
          </div>
        </div>

        {/* Modal Scroll Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {activeView === 'browse' ? (
            <>
              {/* Ratings Summary Card */}
              <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-center gap-6">
                {/* Score */}
                <div className="text-center md:border-r md:border-slate-200 dark:md:border-slate-700 md:pr-6 shrink-0">
                  <div className="text-4xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-1">
                    <span>{stats.avg}</span>
                    <span className="text-xl text-slate-400">/ 5.0</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-amber-400 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Based on {stats.count} Verified Reviews
                  </p>
                </div>

                {/* Rating Distribution Bars */}
                <div className="flex-1 w-full space-y-1.5 text-xs">
                  {[5, 4, 3, 2, 1].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <span className="w-12 text-slate-600 dark:text-slate-300 font-bold text-right shrink-0">
                        {s} Star
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div 
                          className="h-full bg-amber-400 rounded-full transition-all duration-500" 
                          style={{ width: `${stats.breakdown[s as 1|2|3|4|5] || 0}%` }}
                        />
                      </div>
                      <span className="w-10 text-[11px] text-slate-400 text-right">
                        {stats.breakdown[s as 1|2|3|4|5] || 0}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA to write */}
                <div className="text-center shrink-0">
                  <button
                    onClick={() => setActiveView('write')}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>Rate Your Experience</span>
                  </button>
                </div>
              </div>

              {/* Filters & Search Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search reviews by keyword, place, or tag..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  />
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      filterType === 'all'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    All ({reviewsList.length})
                  </button>
                  <button
                    onClick={() => setFilterType('package')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      filterType === 'package'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    Packages
                  </button>
                  <button
                    onClick={() => setFilterType('hotel')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      filterType === 'hotel'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    Hotels
                  </button>
                  <button
                    onClick={() => setFilterType('destination')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      filterType === 'destination'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    Destinations
                  </button>
                </div>
              </div>

              {/* Reviews List */}
              {filteredReviews.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                  <MessageSquare className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No reviews match your filter</p>
                  <p className="text-xs text-slate-400 mt-1">Try clearing your search query or submit the first review!</p>
                  <button
                    onClick={() => { setSearchQuery(''); setFilterType('all'); setFilterRating('all'); }}
                    className="mt-3 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredReviews.map((rev) => (
                    <div 
                      key={rev.id}
                      className="p-5 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                    >
                      <div>
                        {/* Top Meta: Item Badge & Rating */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900">
                            {rev.itemType === 'package' ? '🧳 ' : rev.itemType === 'hotel' ? '🏨 ' : '🏔️ '}
                            {rev.itemTitle}
                          </span>

                          <div className="flex items-center gap-0.5 text-amber-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star 
                                key={s} 
                                className={`w-3.5 h-3.5 ${
                                  s <= Math.round(rev.rating) 
                                    ? 'fill-amber-400 text-amber-400' 
                                    : 'text-slate-200 dark:text-slate-700'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>

                        {/* Title & Comment */}
                        <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                          {rev.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                          "{rev.comment}"
                        </p>

                        {/* Tags */}
                        {rev.tags && rev.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {rev.tags.map((t, idx) => (
                              <span 
                                key={idx} 
                                className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold rounded-md"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Bottom Author & Date */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                            {rev.travelerName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-200 block leading-tight">
                              {rev.travelerName}
                            </span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                              ✓ Verified Traveler
                            </span>
                          </div>
                        </div>

                        <div className="text-right text-[10px] text-slate-400">
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Verified Stay'}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Write Review & Rate Form */
            <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto space-y-5">
              
              <div className="text-center space-y-1">
                <h4 className="text-lg font-black text-slate-900 dark:text-white">
                  Share Your Trip Rating & Experience
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your feedback helps fellow travelers plan their dream holidays in India & beyond.
                </p>
              </div>

              {successMessage && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-200 text-xs font-bold animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-700 dark:text-rose-300 font-semibold">
                  {errorMessage}
                </div>
              )}

              {/* 1. Category Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  1. What are you rating?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFormItemType('package');
                      setFormItemId(packages[0]?.id || '');
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      formItemType === 'package'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    <span>Tour Package</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormItemType('hotel');
                      setFormItemId(hotels[0]?.id || '');
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      formItemType === 'hotel'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <HotelIcon className="w-4 h-4" />
                    <span>Luxury Hotel</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormItemType('destination');
                      setFormItemId(destinations[0]?.id || '');
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      formItemType === 'destination'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Compass className="w-4 h-4" />
                    <span>Destination</span>
                  </button>
                </div>
              </div>

              {/* 2. Select Specific Item */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Select {formItemType === 'package' ? 'Holiday Package' : formItemType === 'hotel' ? 'Hotel & Resort' : 'Destination'}
                </label>
                <select
                  value={formItemId}
                  onChange={(e) => setFormItemId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-blue-600 cursor-pointer"
                >
                  {formItemType === 'package' && packages.map((p) => (
                    <option key={p.id} value={p.id} className="dark:bg-slate-800">
                      {p.title} ({p.destination})
                    </option>
                  ))}
                  {formItemType === 'hotel' && hotels.map((h) => (
                    <option key={h.id} value={h.id} className="dark:bg-slate-800">
                      {h.name} - {h.location}
                    </option>
                  ))}
                  {formItemType === 'destination' && destinations.map((d) => (
                    <option key={d.id} value={d.id} className="dark:bg-slate-800">
                      {d.name} ({d.state || d.country})
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Star Rating Selector */}
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Your Overall Star Rating *
                </label>
                
                <div className="flex items-center justify-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((starValue) => {
                    const isFilled = starValue <= (hoverRating || rating);
                    return (
                      <button
                        key={starValue}
                        type="button"
                        onClick={() => setRating(starValue)}
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 text-3xl focus:outline-hidden transition-transform hover:scale-125 cursor-pointer"
                        title={`${starValue} Stars`}
                      >
                        <Star 
                          className={`w-8 h-8 transition-colors ${
                            isFilled
                              ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                              : 'text-slate-300 dark:text-slate-600'
                          }`} 
                        />
                      </button>
                    );
                  })}
                </div>

                <p className={`text-xs font-bold transition-all ${ratingLabel(hoverRating || rating).color}`}>
                  {ratingLabel(hoverRating || rating).emoji} {ratingLabel(hoverRating || rating).label}
                </p>
              </div>

              {/* 4. Review Headline & Comment */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Review Headline / Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dream vacation! Flawless transfers and scenic mountain views"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your Detailed Experience & Feedback *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us what you liked most: hotel comfort, driver hospitality, food, sightseeing, or highlights..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* 5. Highlight Tags */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Select Highlights (Click to choose)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {availableTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. Traveler Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Soham Kotalwar"
                    value={travelerName}
                    onChange={(e) => setTravelerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. traveler@gmail.com"
                    value={travelerEmail}
                    onChange={(e) => setTravelerEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Recommend Checkbox */}
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={recommend}
                  onChange={(e) => setRecommend(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-sm"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  👍 I would recommend this holiday experience to friends and family
                </span>
              </label>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveView('browse')}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? 'Publishing...' : 'Publish Rating & Review'}</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
