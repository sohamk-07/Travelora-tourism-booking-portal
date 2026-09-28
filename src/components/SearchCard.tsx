/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plane, 
  Hotel as HotelIcon, 
  Package, 
  Compass,
  Calendar, 
  Users, 
  Search,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SearchCardProps {
  onSearch: (params: {
    tab: 'flights' | 'hotels' | 'packages' | 'activities';
    fromLocation: string;
    toLocation: string;
    checkIn: string;
    checkOut: string;
    travelers: { adults: number; children: number };
  }) => void;
  onNavigateSection: (tab: ActiveTab) => void;
  onOpenGlobalSearch?: () => void;
}

export const SearchCard: React.FC<SearchCardProps> = ({ onSearch, onNavigateSection, onOpenGlobalSearch }) => {
  const [selectedTab, setSelectedTab] = useState<'flights' | 'hotels' | 'packages' | 'activities'>('packages');
  const [fromLocation, setFromLocation] = useState('New Delhi (DEL)');
  const [toLocation, setToLocation] = useState('Kashmir (SXR)');
  const [checkIn, setCheckIn] = useState('2026-10-15');
  const [checkOut, setCheckOut] = useState('2026-10-22');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(1);
  const [travelersDropdownOpen, setTravelersDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      tab: selectedTab,
      fromLocation,
      toLocation,
      checkIn,
      checkOut,
      travelers: { adults, children }
    });

    if (selectedTab === 'hotels') {
      onNavigateSection('hotels');
    } else if (selectedTab === 'packages') {
      onNavigateSection('packages');
    } else {
      onNavigateSection('destinations');
    }
  };

  return (
    <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 lg:-mt-14 mb-12">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/70 dark:shadow-black/50 border border-slate-100 dark:border-slate-800 p-4 sm:p-6 transition-colors">
        
        {/* Navigation Tabs matching screenshot: Flights, Hotels, Packages, Activities */}
        <div className="flex items-center gap-1 sm:gap-2 pb-4 border-b border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedTab('flights')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
              selectedTab === 'flights'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Plane className="w-4 h-4" />
            <span>Flights</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedTab('hotels')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
              selectedTab === 'hotels'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <HotelIcon className="w-4 h-4" />
            <span>Hotels</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedTab('packages')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
              selectedTab === 'packages'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Packages</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedTab('activities')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
              selectedTab === 'activities'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Activities</span>
          </button>

          {onOpenGlobalSearch && (
            <button
              type="button"
              onClick={onOpenGlobalSearch}
              className="ml-auto hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200/60 dark:border-blue-800 transition-colors cursor-pointer"
              title="Search Destinations, Packages and Hotels"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Keyword Search</span>
            </button>
          )}
        </div>

        {/* Search Form Inputs */}
        <form onSubmit={handleSearchSubmit} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
            
            {/* From Input */}
            <div className="md:col-span-3">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                From
              </label>
              <div className="relative flex items-center">
                <MapPin className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                <select
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:outline-hidden transition-colors cursor-pointer"
                >
                  <option value="New Delhi (DEL)">New Delhi (DEL)</option>
                  <option value="Mumbai (BOM)">Mumbai (BOM)</option>
                  <option value="Bengaluru (BLR)">Bengaluru (BLR)</option>
                  <option value="Kolkata (CCU)">Kolkata (CCU)</option>
                  <option value="Chennai (MAA)">Chennai (MAA)</option>
                  <option value="Hyderabad (HYD)">Hyderabad (HYD)</option>
                  <option value="Ahmedabad (AMD)">Ahmedabad (AMD)</option>
                  <option value="Pune (PNQ)">Pune (PNQ)</option>
                </select>
              </div>
            </div>

            {/* To Input */}
            <div className="md:col-span-3">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                To Destination
              </label>
              <div className="relative flex items-center">
                <MapPin className="absolute left-3 w-4 h-4 text-blue-600 dark:text-blue-400 pointer-events-none" />
                <select
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:outline-hidden transition-colors cursor-pointer"
                >
                  <option value="Kashmir (SXR)">Kashmir (SXR)</option>
                  <option value="Goa (GOI)">Goa (GOI / GOX)</option>
                  <option value="Kerala / Cochin (COK)">Kerala (Cochin / Alleppey)</option>
                  <option value="Jaipur (JAI)">Jaipur & Udaipur</option>
                  <option value="Ladakh / Leh (IXL)">Ladakh / Leh (IXL)</option>
                  <option value="Andaman / Port Blair (IXZ)">Andaman & Nicobar (IXZ)</option>
                  <option value="Manali / Kullu (KUU)">Himachal (Manali & Shimla)</option>
                  <option value="Varanasi (VNS)">Varanasi (VNS)</option>
                  <option value="Dubai (DXB)">Dubai, UAE</option>
                  <option value="Bali (DPS)">Bali, Indonesia</option>
                </select>
              </div>
            </div>

            {/* Check-In Date */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Check-in
              </label>
              <div className="relative flex items-center">
                <Calendar className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full pl-9 pr-2 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:outline-hidden transition-colors cursor-pointer"
                />
              </div>
            </div>

            {/* Check-Out Date */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Check-out
              </label>
              <div className="relative flex items-center">
                <Calendar className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full pl-9 pr-2 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:outline-hidden transition-colors cursor-pointer"
                />
              </div>
            </div>

            {/* Travelers & Search Button */}
            <div className="md:col-span-2 relative">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Travelers
              </label>
              <button
                type="button"
                onClick={() => setTravelersDropdownOpen(!travelersDropdownOpen)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Users className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{adults} Adults, {children} Child</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {/* Travelers Dropdown Modal Popover */}
              {travelersDropdownOpen && (
                <div 
                  className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setTravelersDropdownOpen(false)}
                >
                  <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Adults</p>
                      <p className="text-[10px] text-slate-400">Ages 12+</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center text-xs"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold w-4 text-center text-slate-900 dark:text-white">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults(adults + 1)}
                        className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Children</p>
                      <p className="text-[10px] text-slate-400">Ages 0 - 11</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center text-xs"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold w-4 text-center text-slate-900 dark:text-white">{children}</span>
                      <button
                        type="button"
                        onClick={() => setChildren(children + 1)}
                        className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setTravelersDropdownOpen(false)}
                    className="w-full mt-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Submit Search Button */}
          <div className="mt-4 flex items-center justify-between sm:justify-end gap-3">
            {onOpenGlobalSearch && (
              <button
                type="button"
                onClick={onOpenGlobalSearch}
                className="sm:hidden flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Quick Search</span>
              </button>
            )}

            <button
              type="submit"
              id="search-submit-btn"
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-sm rounded-xl shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Search Now</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
