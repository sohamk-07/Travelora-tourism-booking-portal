/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Package, 
  Clock, 
  Check, 
  Plane, 
  Star, 
  Filter, 
  Search,
  Sparkles,
  Heart
} from 'lucide-react';
import { TourPackage, Currency } from '../types';
import { formatPrice } from '../lib/currency';

interface PackagesSectionProps {
  packages: TourPackage[];
  currency: Currency;
  onSelectPackage: (pkg: TourPackage, initialTab?: 'customize' | 'itinerary') => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  packages,
  currency,
  onSelectPackage,
  favorites,
  onToggleFavorite
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [flightFilter, setFlightFilter] = useState<boolean>(false);

  const categories = [
    { key: 'all', label: 'All Packages' },
    { key: 'hill_station', label: '🏔️ Kashmir & Hills' },
    { key: 'beach', label: '🏖️ Goa & Kerala Beaches' },
    { key: 'heritage', label: '🏰 Royal Rajasthan & Heritage' },
    { key: 'adventure', label: '🏍️ Ladakh High Passes' },
    { key: 'international', label: '✈️ International Tours' }
  ];

  const filteredPackages = packages.filter(pkg => {
    if (selectedCategory !== 'all') {
      if (pkg.category !== selectedCategory && !pkg.destination.toLowerCase().includes(selectedCategory)) {
        return false;
      }
    }
    if (flightFilter && !pkg.includesFlight) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        pkg.title.toLowerCase().includes(q) ||
        pkg.destination.toLowerCase().includes(q) ||
        pkg.country.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Curated Tour Packages
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 rounded-full">
              All-Inclusive
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Carefully designed itineraries including flights, boutique hotels, transfers, sightseeing, and meals.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Kashmir, Kerala, Goa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === c.key
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Flight inclusion checkbox */}
        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={flightFilter}
            onChange={(e) => setFlightFilter(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded-sm"
          />
          <Plane className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Flights Included Only</span>
        </label>
      </div>

      {/* Packages Grid */}
      {filteredPackages.length === 0 ? (
        <div className="py-16 text-center">
          <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No packages match your search</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try clearing filters or searching for Kashmir, Goa, or Kerala</p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setFlightFilter(false); }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {filteredPackages.map((pkg) => {
            const isFav = favorites.includes(pkg.id);
            return (
              <div
                key={pkg.id}
                onClick={() => onSelectPackage(pkg)}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />

                  <div className={`absolute top-3 left-3 px-2.5 py-1 text-[11px] font-black rounded-lg text-white shadow-xs ${
                    pkg.badge === 'Best Seller'
                      ? 'bg-amber-500'
                      : pkg.badge === 'Hot Deal'
                      ? 'bg-rose-600'
                      : 'bg-emerald-600'
                  }`}>
                    {pkg.badge}
                  </div>

                  {pkg.includesFlight && (
                    <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold rounded-md flex items-center gap-1">
                      <Plane className="w-3 h-3 text-blue-400" />
                      <span>Roundtrip Airfare Included</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(pkg.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                      isFav ? 'bg-rose-500 text-white' : 'bg-black/35 text-white hover:bg-white hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-semibold">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>{pkg.duration}</span>
                      </div>
                      <span className="text-slate-400 truncate max-w-[140px]">{pkg.destination}</span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                      {pkg.title}
                    </h3>

                    {/* Star Rating & Reviews Count */}
                    <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold mt-1.5">
                      <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-900/60">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-slate-900 dark:text-white font-black">{Number(pkg.rating).toFixed(1)}</span>
                      </div>
                      <span className="text-slate-400 text-[11px] font-normal">
                        ({pkg.reviewsCount ? pkg.reviewsCount.toLocaleString() : '0'} verified reviews)
                      </span>
                    </div>

                    {/* Highlights */}
                    <ul className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {pkg.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-1.5 truncate">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{h}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Quick Roadmap Coverage Badge */}
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPackage(pkg, 'itinerary');
                      }}
                      className="mt-3 p-2 bg-blue-50/70 dark:bg-blue-950/60 hover:bg-blue-100/70 dark:hover:bg-blue-900/60 rounded-xl flex items-center justify-between cursor-pointer border border-blue-100/80 dark:border-blue-900/60 transition-colors"
                    >
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-900 dark:text-blue-200">
                        <span>🗺️</span>
                        <span>{pkg.daysCount || 5}-Day Coverage Roadmap</span>
                      </div>
                      <span className="text-[10px] font-black text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md shadow-xs">
                        Hotels & Food →
                      </span>
                    </div>
                  </div>

                  {/* Pricing Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
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
                        className="px-2.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
                        title="View Day-by-Day Hotels & Food Roadmap"
                      >
                        Roadmap
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPackage(pkg, 'customize');
                        }}
                        className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </section>
  );
};
