/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  MapPin, 
  Hotel as HotelIcon, 
  Package, 
  Star, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  TrendingUp,
  Tag
} from 'lucide-react';
import { TouristDestination, TourPackage, Hotel, Currency } from '../types';
import { formatPrice } from '../lib/currency';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinations: TouristDestination[];
  packages: TourPackage[];
  hotels: Hotel[];
  currency: Currency;
  onSelectDestination: (dest: TouristDestination) => void;
  onSelectPackage: (pkg: TourPackage) => void;
  onSelectHotel: (hotel: Hotel) => void;
}

type FilterCategory = 'all' | 'destinations' | 'packages' | 'hotels';

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  destinations,
  packages,
  hotels,
  currency,
  onSelectDestination,
  onSelectPackage,
  onSelectHotel
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setSearchTerm('');
      setActiveCategory('all');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Popular search suggestions
  const popularKeywords = [
    'Kashmir',
    'Goa Beaches',
    'Maldives Overwater',
    'Taj Lake Palace',
    'Swiss Alps',
    'Ladakh Pangong',
    'Jaisalmer Desert',
    'Tokyo & Kyoto',
    'Kerala Backwaters'
  ];

  // Filtered Results
  const searchResults = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    // 1. Destinations
    const matchedDestinations = destinations.filter(d => {
      if (!term) return true;
      return (
        d.name.toLowerCase().includes(term) ||
        (d.state && d.state.toLowerCase().includes(term)) ||
        d.country.toLowerCase().includes(term) ||
        d.region.toLowerCase().includes(term) ||
        d.description.toLowerCase().includes(term) ||
        (d.tags && d.tags.some(t => t.toLowerCase().includes(term)))
      );
    });

    // 2. Packages
    const matchedPackages = packages.filter(p => {
      if (!term) return true;
      return (
        p.title.toLowerCase().includes(term) ||
        p.destination.toLowerCase().includes(term) ||
        p.country.toLowerCase().includes(term) ||
        (p.highlights && p.highlights.some(h => h.toLowerCase().includes(term))) ||
        (p.badge && p.badge.toLowerCase().includes(term))
      );
    });

    // 3. Hotels
    const matchedHotels = hotels.filter(h => {
      if (!term) return true;
      return (
        h.name.toLowerCase().includes(term) ||
        h.location.toLowerCase().includes(term) ||
        h.city.toLowerCase().includes(term) ||
        (h.state && h.state.toLowerCase().includes(term)) ||
        h.country.toLowerCase().includes(term) ||
        (h.destinationName && h.destinationName.toLowerCase().includes(term)) ||
        (h.amenities && h.amenities.some(a => a.toLowerCase().includes(term)))
      );
    });

    return {
      destinations: matchedDestinations,
      packages: matchedPackages,
      hotels: matchedHotels,
      totalCount: matchedDestinations.length + matchedPackages.length + matchedHotels.length
    };
  }, [searchTerm, destinations, packages, hotels]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 sm:pt-20 bg-black/70 dark:bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header & Input */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Search className="w-5 h-5" />
          </div>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search destinations, packages, hotels, cities (e.g. Kashmir, Maldives, Goa)..."
              className="w-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium text-sm sm:text-base outline-none pr-8"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Search (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filters Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            All Results ({searchResults.totalCount})
          </button>

          <button
            onClick={() => setActiveCategory('destinations')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === 'destinations'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <MapPin className="w-3 h-3 text-rose-500" />
            <span>Destinations ({searchResults.destinations.length})</span>
          </button>

          <button
            onClick={() => setActiveCategory('packages')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === 'packages'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Package className="w-3 h-3 text-blue-500" />
            <span>Packages ({searchResults.packages.length})</span>
          </button>

          <button
            onClick={() => setActiveCategory('hotels')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === 'hotels'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <HotelIcon className="w-3 h-3 text-amber-500" />
            <span>Hotels ({searchResults.hotels.length})</span>
          </button>
        </div>

        {/* Popular Tags Row (shown if no search term yet) */}
        {!searchTerm && (
          <div className="px-4 sm:px-6 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
              <span>Popular Searches:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {popularKeywords.map((kw) => (
                <button
                  key={kw}
                  onClick={() => setSearchTerm(kw)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {searchResults.totalCount === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto">
                <Compass className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No matching travel results found</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Try searching for a different keyword like "Goa", "Kashmir", "Maldives", or "Palace".
              </p>
            </div>
          ) : (
            <>
              {/* Section 1: Destinations */}
              {(activeCategory === 'all' || activeCategory === 'destinations') && searchResults.destinations.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>Destinations ({searchResults.destinations.length})</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {searchResults.destinations.slice(0, activeCategory === 'all' ? 4 : 20).map((dest) => (
                      <div
                        key={dest.id}
                        onClick={() => {
                          onSelectDestination(dest);
                          onClose();
                        }}
                        className="group flex items-center gap-3 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/50 bg-white dark:bg-slate-850 hover:bg-blue-50/50 dark:hover:bg-slate-800/80 transition-all cursor-pointer shadow-xs hover:shadow-md"
                      >
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h5 className="text-sm font-black text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                              {dest.name}
                            </h5>
                            <span className="flex items-center text-[10px] font-bold text-amber-500 shrink-0">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                              {dest.rating}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {dest.state ? `${dest.state}, ` : ''}{dest.country}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-[11px] font-black text-blue-600 dark:text-blue-400">
                              From {formatPrice(dest.startingPrice, currency)}
                            </span>
                            <span className="text-[10px] text-slate-400 group-hover:text-blue-500 font-bold flex items-center gap-0.5">
                              Explore <ArrowRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 2: Tour Packages */}
              {(activeCategory === 'all' || activeCategory === 'packages') && searchResults.packages.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-blue-500" />
                      <span>Tour Packages ({searchResults.packages.length})</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {searchResults.packages.slice(0, activeCategory === 'all' ? 4 : 20).map((pkg) => (
                      <div
                        key={pkg.id}
                        onClick={() => {
                          onSelectPackage(pkg);
                          onClose();
                        }}
                        className="group flex items-center gap-3 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/50 bg-white dark:bg-slate-850 hover:bg-blue-50/50 dark:hover:bg-slate-800/80 transition-all cursor-pointer shadow-xs hover:shadow-md"
                      >
                        <img
                          src={pkg.image}
                          alt={pkg.title}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                              {pkg.duration}
                            </span>
                            {pkg.badge && (
                              <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                                {pkg.badge}
                              </span>
                            )}
                          </div>
                          <h5 className="text-xs font-black text-slate-900 dark:text-white truncate mt-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {pkg.title}
                          </h5>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                              {formatPrice(pkg.discountedPrice, currency)}
                            </span>
                            <span className="text-[10px] text-slate-400 group-hover:text-blue-500 font-bold flex items-center gap-0.5">
                              Book <ArrowRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 3: Luxury Hotels */}
              {(activeCategory === 'all' || activeCategory === 'hotels') && searchResults.hotels.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
                      <HotelIcon className="w-3.5 h-3.5 text-amber-500" />
                      <span>Luxury Hotels & Stays ({searchResults.hotels.length})</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {searchResults.hotels.slice(0, activeCategory === 'all' ? 4 : 20).map((hotel) => (
                      <div
                        key={hotel.id}
                        onClick={() => {
                          onSelectHotel(hotel);
                          onClose();
                        }}
                        className="group flex items-center gap-3 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/50 bg-white dark:bg-slate-850 hover:bg-amber-50/50 dark:hover:bg-slate-800/80 transition-all cursor-pointer shadow-xs hover:shadow-md"
                      >
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h5 className="text-xs font-black text-slate-900 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400">
                              {hotel.name}
                            </h5>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {hotel.location}, {hotel.city}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                              {formatPrice(hotel.pricePerNight, currency)} <span className="text-[10px] text-slate-400 font-normal">/ night</span>
                            </span>
                            <span className="text-[10px] text-slate-400 group-hover:text-amber-500 font-bold flex items-center gap-0.5">
                              Reserve <ArrowRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950/70 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-4 sm:px-6">
          <span>Click any destination, package, or hotel to view full details</span>
          <span className="hidden sm:inline font-mono text-[10px] bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-md">
            Press ESC to close
          </span>
        </div>
      </div>
    </div>
  );
};
