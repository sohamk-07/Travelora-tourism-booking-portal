/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Star, ArrowUpRight, MapPin, Heart } from 'lucide-react';
import { TouristDestination, DestinationCategory, Currency } from '../types';
import { formatPrice } from '../lib/currency';

interface DestinationsSectionProps {
  destinations: TouristDestination[];
  currency: Currency;
  onSelectDestination: (dest: TouristDestination, initialTab?: 'overview' | 'roadmap' | 'map' | 'hotels' | 'restaurants') => void;
  onOpenMapForDestination?: (dest: TouristDestination) => void;
  onExploreAll: () => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const DestinationsSection: React.FC<DestinationsSectionProps> = ({
  destinations,
  currency,
  onSelectDestination,
  onOpenMapForDestination,
  onExploreAll,
  favorites,
  onToggleFavorite
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<DestinationCategory>('all');

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -360 : 360;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const categories = [
    { key: 'all' as DestinationCategory, label: 'All Destinations' },
    { key: 'india_domestic' as DestinationCategory, label: '🇮🇳 Incredible India' },
    { key: 'hill_station' as DestinationCategory, label: '🏔️ Hills & Snow' },
    { key: 'beach' as DestinationCategory, label: '🏖️ Beaches & Islands' },
    { key: 'heritage' as DestinationCategory, label: '🏰 Royal Heritage' },
    { key: 'spiritual' as DestinationCategory, label: '🕉️ Spiritual & Ghats' },
    { key: 'adventure' as DestinationCategory, label: '🏍️ High Passes & Adventure' },
    { key: 'international' as DestinationCategory, label: '✈️ International' }
  ];

  const filteredDestinations = destinations.filter(dest => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'india_domestic') return dest.country === 'India';
    return dest.category === selectedCategory || (selectedCategory === 'beach' && dest.tags.includes('Beaches'));
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Section Header with airplane doodle matching screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Popular Destinations
            </h2>
            {/* Playful curved airplane doodle */}
            <svg className="w-8 h-6 text-blue-500 opacity-80" viewBox="0 0 50 30" fill="none">
              <path d="M5 20 C 15 5, 30 5, 45 15" stroke="currentColor" strokeWidth="1.8" strokeDasharray="3 3" />
              <polygon points="45,15 40,11 41,18" fill="currentColor" />
            </svg>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Explore India’s most scenic wonders, royal palaces, tropical beaches, and world landmarks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="destinations-view-all-btn"
            onClick={onExploreAll}
            className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View All Destinations</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          {/* Carousel Navigation Arrows */}
          <div className="flex items-center gap-1.5 ml-2">
            <button
              onClick={() => handleScroll('left')}
              className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 transition-colors shadow-xs active:scale-95 cursor-pointer"
              aria-label="Previous Destinations"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 transition-colors shadow-xs active:scale-95 cursor-pointer"
              aria-label="Next Destinations"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.key
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Destinations Horizontal Scroll Grid - Exact Portrait 3:4 Aspect Ratio from Screenshot */}
      <div 
        ref={scrollRef}
        className="flex items-stretch gap-5 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth"
      >
        {filteredDestinations.map((dest) => {
          const isFav = favorites.includes(dest.id);
          return (
            <div
              key={dest.id}
              id={`destination-card-${dest.id}`}
              onClick={() => onSelectDestination(dest)}
              className="group relative flex-none w-[240px] sm:w-[270px] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
                <img
                  src={dest.image}
                  alt={`${dest.name}, ${dest.country}`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Discount Badge matching screenshot (-30%, -25%, -20%) */}
                {dest.discountPercent && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-amber-500/95 backdrop-blur-xs text-white text-xs font-black rounded-lg shadow-sm">
                    -{dest.discountPercent}%
                  </div>
                )}

                {/* Action buttons: Roadmap, Map & Heart */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDestination(dest, 'roadmap');
                    }}
                    className="px-2.5 py-1 rounded-full bg-black/45 hover:bg-indigo-600 text-white text-[11px] font-bold backdrop-blur-md transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                    title={`View ${dest.name} sightseeing roadmap`}
                  >
                    <span>🗺️ Roadmap</span>
                  </button>

                  {onOpenMapForDestination && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenMapForDestination(dest);
                      }}
                      className="px-2.5 py-1 rounded-full bg-black/45 hover:bg-blue-600 text-white text-[11px] font-bold backdrop-blur-md transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                      title={`View ${dest.name} map`}
                    >
                      <MapPin className="w-3 h-3 text-rose-400" />
                      <span>Map</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(dest.id);
                    }}
                    className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                      isFav 
                        ? 'bg-rose-500 text-white shadow-md' 
                        : 'bg-black/35 text-white hover:bg-white hover:text-rose-500'
                    }`}
                    title={isFav ? 'Remove from wishlist' : 'Save to wishlist'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Gradient overlay for bottom card legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />

                {/* Bottom Card Content matching screenshot */}
                <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                  <div className="flex items-center gap-1.5 text-xs text-blue-200 font-semibold mb-1">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    <span>{dest.state ? `${dest.state}, ${dest.country}` : dest.country}</span>
                  </div>

                  <h3 className="text-xl font-black tracking-tight leading-snug group-hover:text-blue-200 transition-colors">
                    {dest.name}
                  </h3>
                  
                  {/* Indian Currency Rate */}
                  <p className="text-xs text-slate-300 font-medium mt-1">
                    Starting from <span className="text-white font-black text-base">{formatPrice(dest.startingPrice, currency)}</span>
                  </p>

                  {/* Rating & Reviews */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/15">
                    <div className="flex items-center gap-1.5 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-black text-white">{Number(dest.rating).toFixed(1)}</span>
                      <span className="text-[10px] text-slate-300 font-medium">({dest.reviewsCount ? dest.reviewsCount.toLocaleString() : '0'} reviews)</span>
                    </div>

                    <span className="text-[11px] font-bold text-blue-300 group-hover:underline">
                      Explore Tour →
                    </span>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
