/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Heart, MapPin, Star, ArrowRight, Trash2 } from 'lucide-react';
import { TouristDestination, TourPackage, Currency } from '../types';
import { formatPrice } from '../lib/currency';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  favoriteDestinations: TouristDestination[];
  favoritePackages: TourPackage[];
  onRemoveFavorite: (id: string) => void;
  onSelectDestination: (dest: TouristDestination) => void;
  onSelectPackage: (pkg: TourPackage) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  currency,
  favoriteDestinations,
  favoritePackages,
  onRemoveFavorite,
  onSelectDestination,
  onSelectPackage
}) => {
  if (!isOpen) return null;

  const totalFavorites = favoriteDestinations.length + favoritePackages.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <Heart className="w-5 h-5 fill-rose-600" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Saved Wishlist</h3>
              <p className="text-xs text-slate-500">{totalFavorites} saved destinations & tours</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {totalFavorites === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Heart className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-700">Your wishlist is empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Click the heart icon on any destination or tour package card to save it here for fast booking.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Destinations */}
              {favoriteDestinations.map((dest) => (
                <div
                  key={dest.id}
                  className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100 gap-3 hover:bg-slate-100/70 transition-colors"
                >
                  <div 
                    onClick={() => { onSelectDestination(dest); onClose(); }}
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{dest.name}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        <span>{dest.state ? `${dest.state}, ` : ''}{dest.country}</span>
                      </p>
                      <p className="text-xs font-bold text-blue-600 mt-1">
                        From {formatPrice(dest.startingPrice, currency)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { onSelectDestination(dest); onClose(); }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onRemoveFavorite(dest.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Packages */}
              {favoritePackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100 gap-3 hover:bg-slate-100/70 transition-colors"
                >
                  <div 
                    onClick={() => { onSelectPackage(pkg); onClose(); }}
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-black text-slate-900 line-clamp-1">{pkg.title}</h4>
                      <p className="text-xs text-slate-500">{pkg.duration} • {pkg.destination}</p>
                      <p className="text-xs font-bold text-blue-600 mt-1">
                        {formatPrice(pkg.discountedPrice, currency)} / person
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { onSelectPackage(pkg); onClose(); }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
                    >
                      Book
                    </button>
                    <button
                      onClick={() => onRemoveFavorite(pkg.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
