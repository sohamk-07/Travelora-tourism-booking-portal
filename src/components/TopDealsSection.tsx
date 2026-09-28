/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, Star, Clock, Check, Plane, Sparkles, Heart } from 'lucide-react';
import { TourPackage, Currency } from '../types';
import { formatPrice } from '../lib/currency';

interface TopDealsSectionProps {
  packages: TourPackage[];
  currency: Currency;
  onSelectPackage: (pkg: TourPackage, initialTab?: 'customize' | 'itinerary') => void;
  onExploreAllPackages: () => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const TopDealsSection: React.FC<TopDealsSectionProps> = ({
  packages,
  currency,
  onSelectPackage,
  onExploreAllPackages,
  favorites,
  onToggleFavorite
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Section Headline */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Top Deals This Week
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 rounded-full animate-pulse">
              Limited Time Offers
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Handcrafted holiday packages across India & dream global getaways with flight and resort inclusions.
          </p>
        </div>

        <button
          id="deals-view-all-btn"
          onClick={onExploreAllPackages}
          className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>View All Deals</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid: Left Promo Card + Right Deal Package Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left Stylized Banner Card matching screenshot (Deep Blue with 3D airplane & globe) */}
        <div className="lg:col-span-3 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 rounded-2xl p-6 text-white flex flex-col justify-between relative overflow-hidden shadow-lg">
          {/* Subtle background world map / rings */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="1.5" strokeDasharray="4 4" />
              <circle cx="100" cy="100" r="50" stroke="white" strokeWidth="1" />
              <ellipse cx="100" cy="100" rx="90" ry="30" stroke="white" strokeWidth="1" />
            </svg>
          </div>

          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[11px] font-bold text-blue-200 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Flash Holiday Sale</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight">
              Top Deals <br />
              This Week
            </h3>

            <p className="text-xs text-blue-100 font-medium leading-relaxed">
              Save up to 30% on curated Indian tours and international travel packages. Instant confirmation with zero cancellation penalties.
            </p>
          </div>

          {/* Stylized 3D airplane soaring graphic matching screenshot */}
          <div className="relative z-10 py-6 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-blue-500/30 flex items-center justify-center backdrop-blur-xs ring-4 ring-blue-400/20">
                <span className="text-5xl filter drop-shadow-lg transform -rotate-12">✈️</span>
              </div>
              <div className="absolute -bottom-2 right-0 px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded-md">
                ₹ SAVE BIG
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <button
              onClick={onExploreAllPackages}
              className="w-full py-3 bg-white hover:bg-slate-100 active:scale-95 text-blue-800 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Grab Deals Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right 3 or 4 Package Deal Cards */}
        <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {packages.slice(0, 3).map((pkg) => {
            const isFav = favorites.includes(pkg.id);
            return (
              <div
                key={pkg.id}
                id={`package-card-${pkg.id}`}
                onClick={() => onSelectPackage(pkg)}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
              >
                {/* Image & Badges */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  
                  {/* Badge: Best Seller / Hot Deal / New Offer */}
                  <div className={`absolute top-3 left-3 px-2.5 py-1 text-[11px] font-black rounded-lg text-white shadow-xs ${
                    pkg.badge === 'Best Seller'
                      ? 'bg-amber-500'
                      : pkg.badge === 'Hot Deal'
                      ? 'bg-rose-600'
                      : 'bg-emerald-600'
                  }`}>
                    {pkg.badge}
                  </div>

                  {/* Flight Included Tag */}
                  {pkg.includesFlight && (
                    <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold rounded-md flex items-center gap-1">
                      <Plane className="w-3 h-3 text-blue-400" />
                      <span>Flights Included</span>
                    </div>
                  )}

                  {/* Wishlist Heart */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(pkg.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                      isFav 
                        ? 'bg-rose-500 text-white shadow-md' 
                        : 'bg-black/35 text-white hover:bg-white hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Duration & Destination */}
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-semibold">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>{pkg.duration}</span>
                      </div>
                      <span className="text-slate-400 truncate max-w-[120px]">{pkg.destination}</span>
                    </div>

                    <h4 className="text-base font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
                      {pkg.title}
                    </h4>

                    {/* Star Rating & Reviews Count */}
                    <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold mt-1">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-slate-900 dark:text-white font-black">{Number(pkg.rating).toFixed(1)}</span>
                      </div>
                      <span className="text-slate-400 text-[10px] font-normal">
                        ({pkg.reviewsCount ? pkg.reviewsCount.toLocaleString() : '0'} reviews)
                      </span>
                    </div>

                    {/* Highlights bullet points */}
                    <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                      {pkg.highlights.slice(0, 2).map((h, i) => (
                        <li key={i} className="flex items-center gap-1.5 truncate">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing and Action Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1.5">
                    <div>
                      <p className="text-[11px] text-slate-400 line-through">
                        {formatPrice(pkg.originalPrice, currency)}
                      </p>
                      <p className="text-lg font-black text-slate-900 dark:text-white leading-none">
                        {formatPrice(pkg.discountedPrice, currency)}
                        <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 ml-1">/ person</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPackage(pkg, 'itinerary');
                        }}
                        className="px-2 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
                        title="View Coverage Roadmap"
                      >
                        🗺️ Roadmap
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPackage(pkg, 'customize');
                        }}
                        className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/70 hover:bg-blue-600 text-blue-700 dark:text-blue-300 hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Book →
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
};
