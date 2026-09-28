/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Hotel as HotelIcon, 
  Star, 
  MapPin, 
  Check, 
  Calendar, 
  Users, 
  X, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Search,
  Compass,
  Map as MapIcon,
  Grid,
  Columns,
  Layers,
  AlertCircle,
  RefreshCw,
  Clock
} from 'lucide-react';
import { Hotel, UserProfile, Booking, Currency } from '../types';
import { createBooking } from '../lib/supabase';
import { formatPrice } from '../lib/currency';
import { HotelMapExplorer } from './HotelMapExplorer';
import { HotelMiniMap } from './HotelMiniMap';

interface HotelsSectionProps {
  hotels: Hotel[];
  currency: Currency;
  currentUser: UserProfile | null;
  onBookingCreated: (b: Booking) => void;
  onOpenMyBookings: () => void;
  externalSelectedHotel?: Hotel | null;
  onClearExternalSelectedHotel?: () => void;
}

export const HotelsSection: React.FC<HotelsSectionProps> = ({
  hotels,
  currency,
  currentUser,
  onBookingCreated,
  onOpenMyBookings,
  externalSelectedHotel,
  onClearExternalSelectedHotel
}) => {
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedDestinationFilter, setSelectedDestinationFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'map' | 'split'>('grid');
  const [highlightHotelId, setHighlightHotelId] = useState<string | null>(null);
  const [availabilityStatusFilter, setAvailabilityStatusFilter] = useState<'all' | 'available_only'>('all');
  const [checkInFilter, setCheckInFilter] = useState('2026-11-15');
  const [checkOutFilter, setCheckOutFilter] = useState('2026-11-18');
  const [guestsFilter, setGuestsFilter] = useState(2);
  const [isCheckingInventory, setIsCheckingInventory] = useState(false);

  // Destination filter categories for luxury hotels
  const destinationOptions = [
    { id: 'all', label: 'All Destinations', emoji: '🌟' },
    { id: 'dest-goa', label: 'Goa', emoji: '🏖️' },
    { id: 'dest-kashmir', label: 'Kashmir', emoji: '🏔️' },
    { id: 'dest-kerala', label: 'Kerala', emoji: '🌴' },
    { id: 'dest-jaipur', label: 'Rajasthan / Jaipur', emoji: '🏰' },
    { id: 'dest-agra', label: 'Agra & Mathura', emoji: '🕌' },
    { id: 'dest-manali', label: 'Manali', emoji: '❄️' },
    { id: 'dest-ladakh', label: 'Ladakh', emoji: '🏍️' },
    { id: 'dest-varanasi', label: 'Varanasi', emoji: '🕉️' },
    { id: 'dest-amritsar', label: 'Amritsar', emoji: '✨' },
    { id: 'dest-ooty', label: 'Ooty', emoji: '🌲' },
    { id: 'dest-meghalaya', label: 'Meghalaya', emoji: '🌧️' },
    { id: 'dest-hampi', label: 'Hampi', emoji: '🏛️' },
    { id: 'dest-dubai', label: 'Dubai', emoji: '✈️' },
    { id: 'dest-singapore', label: 'Singapore', emoji: '🏙️' },
    { id: 'dest-thailand', label: 'Thailand', emoji: '🏝️' },
    { id: 'dest-bali', label: 'Bali', emoji: '🌺' },
    { id: 'dest-vietnam', label: 'Vietnam', emoji: '🏮' },
    { id: 'dest-darjeeling', label: 'Darjeeling', emoji: '☕' },
    { id: 'dest-switzerland', label: 'Switzerland', emoji: '🏔️' }
  ];

  // Filtered hotels according to destination, search and availability
  const filteredHotels = hotels.filter((h) => {
    if (availabilityStatusFilter === 'available_only' && (h.roomsAvailable || 0) === 0) {
      return false;
    }
    if (selectedDestinationFilter !== 'all') {
      const matchId = h.destinationId === selectedDestinationFilter;
      const targetSlug = selectedDestinationFilter.replace('dest-', '').toLowerCase();
      const matchName = (h.destinationName && h.destinationName.toLowerCase().includes(targetSlug)) ||
                        h.city.toLowerCase().includes(targetSlug) ||
                        h.location.toLowerCase().includes(targetSlug);
      if (!matchId && !matchName) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.location.toLowerCase().includes(q) ||
        (h.destinationName && h.destinationName.toLowerCase().includes(q)) ||
        (h.closestAttraction && h.closestAttraction.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Sync external hotel trigger
  React.useEffect(() => {
    if (externalSelectedHotel) {
      const fresh = hotels.find((h) => h.id === externalSelectedHotel.id) || externalSelectedHotel;
      setSelectedHotel(fresh);
    }
  }, [externalSelectedHotel, hotels]);

  // Keep selectedHotel updated with live inventory from hotels prop
  React.useEffect(() => {
    if (selectedHotel) {
      const fresh = hotels.find((h) => h.id === selectedHotel.id);
      if (fresh && fresh.roomsAvailable !== selectedHotel.roomsAvailable) {
        setSelectedHotel((prev) => (prev ? { ...prev, roomsAvailable: fresh.roomsAvailable } : null));
      }
    }
  }, [hotels]);

  const closeModal = () => {
    setSelectedHotel(null);
    setConfirmedBooking(null);
    onClearExternalSelectedHotel?.();
  };
  const [selectedRoomIndex, setSelectedRoomIndex] = useState<number>(0);
  const [startDate, setStartDate] = useState('2026-11-15');
  const [endDate, setEndDate] = useState('2026-11-18');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [airportTransfer, setAirportTransfer] = useState(true);
  const [breakfastIncluded, setBreakfastIncluded] = useState(true);
  const [specialRequests, setSpecialRequests] = useState('');
  const [travelerName, setTravelerName] = useState(currentUser?.fullName || '');
  const [travelerEmail, setTravelerEmail] = useState(currentUser?.email || '');
  const [travelerPhone, setTravelerPhone] = useState(currentUser?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.fullName) setTravelerName(currentUser.fullName);
      if (currentUser.email) setTravelerEmail(currentUser.email);
      if (currentUser.phone) setTravelerPhone(currentUser.phone);
    }
  }, [currentUser]);

  const calculateNights = () => {
    const s = new Date(startDate).getTime();
    const e = new Date(endDate).getTime();
    const diff = Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24)));
    return isNaN(diff) ? 1 : diff;
  };

  const handleBookHotelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotel) return;
    setIsSubmitting(true);

    const nights = calculateNights();
    const roomRate = selectedHotel.roomTypes && selectedHotel.roomTypes[selectedRoomIndex]
      ? selectedHotel.roomTypes[selectedRoomIndex].pricePerNight
      : selectedHotel.pricePerNight;

    const base = roomRate * nights;
    const addOns = (airportTransfer ? 1800 : 0) + (breakfastIncluded ? 850 * nights * adults : 0);
    const total = base + addOns;

    const cleanEmail = travelerEmail.trim();
    const cleanName = travelerName.trim() || 'Traveler Guest';
    const cleanPhone = travelerPhone.trim();
    const resolvedUserId = currentUser?.id && currentUser.id !== 'user-demo-traveler'
      ? currentUser.id
      : (cleanEmail ? `usr-${cleanEmail.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : 'guest-traveler');

    try {
      const newBooking = await createBooking({
        userId: resolvedUserId,
        itemType: 'hotel',
        itemId: selectedHotel.id,
        title: `${selectedHotel.name} - ${selectedHotel.roomTypes ? selectedHotel.roomTypes[selectedRoomIndex].name : 'Luxury Stay'}`,
        image: selectedHotel.image,
        location: `${selectedHotel.city}, ${selectedHotel.country}`,
        startDate,
        endDate,
        guests: { adults, children },
        travelerName: cleanName,
        travelerEmail: cleanEmail,
        travelerPhone: cleanPhone,
        totalPrice: total,
        status: 'pending',
        specialRequests,
        customizationOptions: {
          airportTransfer,
          breakfastIncluded
        }
      });

      onBookingCreated(newBooking);
      setConfirmedBooking(newBooking);
      setSelectedHotel((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          roomsAvailable: Math.max(0, (prev.roomsAvailable || 1) - 1)
        };
      });
      setIsSubmitting(false);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const handleCheckAvailability = () => {
    setIsCheckingInventory(true);
    setTimeout(() => {
      setIsCheckingInventory(false);
    }, 400);
  };

  const availableHotelsCount = hotels.filter((h) => (h.roomsAvailable || 0) > 0).length;

  const renderHotelCard = (hotel: Hotel, isCompact = false) => {
    const isAvail = (hotel.roomsAvailable || 0) > 0;

    return (
      <div
        key={hotel.id}
        id={`hotel-card-${hotel.id}`}
        className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
      >
        {/* Image */}
        <div className={`relative ${isCompact ? 'aspect-[16/9]' : 'aspect-[16/10]'} overflow-hidden bg-slate-100 dark:bg-slate-800`}>
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-bold rounded-lg flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{hotel.stars}★ Luxury</span>
          </div>

          <div className={`absolute top-3 right-3 px-2 py-0.5 text-white text-[11px] font-black rounded-md shadow-xs ${
            isAvail ? 'bg-emerald-600' : 'bg-rose-600'
          }`}>
            {isAvail ? `${hotel.roomsAvailable} Rooms Left` : 'Sold Out'}
          </div>

          {/* Destination Badge on Image */}
          {hotel.destinationName && (
            <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold rounded-lg flex items-center gap-1">
              <MapPin className="w-3 h-3 text-rose-400" />
              <span>{hotel.destinationName}</span>
            </div>
          )}
        </div>

        {/* Hotel Content */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
              <div className="flex items-center gap-1 truncate">
                <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="truncate">{hotel.location}</span>
              </div>
              {hotel.destinationId && (
                <button
                  type="button"
                  onClick={() => setSelectedDestinationFilter(hotel.destinationId!)}
                  className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded cursor-pointer shrink-0"
                >
                  Destination
                </button>
              )}
            </div>

            <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {hotel.name}
            </h3>

            {/* LIVE AVAILABILITY STATUS BADGE (Before Booking) */}
            <div className="mt-2">
              {isAvail ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-bold border border-emerald-200/80 dark:border-emerald-800/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Status: Available ({hotel.roomsAvailable} Rooms Remaining)</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 rounded-lg text-xs font-bold border border-rose-200/80 dark:border-rose-800/80">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                  <span>Status: Sold Out for Selected Dates</span>
                </div>
              )}
            </div>

            {/* Closest Attraction Spotlight */}
            {hotel.closestAttraction && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-900/60 rounded-md text-[11px] font-bold text-amber-900 dark:text-amber-200">
                <span>⚡</span>
                <span>{hotel.closestAttraction}</span>
              </div>
            )}

            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
              {hotel.description}
            </p>

            {/* Amenities Badges */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {hotel.amenities.slice(0, 3).map((a, i) => (
                <span key={i} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold rounded-md">
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* Price and Action Buttons */}
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <div>
              {hotel.originalPrice && (
                <span className="text-[11px] text-slate-400 line-through mr-1.5">
                  {formatPrice(hotel.originalPrice, currency)}
                </span>
              )}
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {formatPrice(hotel.pricePerNight, currency)}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400"> / night</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setHighlightHotelId(hotel.id);
                  setViewMode('map');
                }}
                className="px-2.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-700 dark:hover:text-blue-300 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                title="View on Interactive Map"
              >
                <MapIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="hidden sm:inline">Map</span>
              </button>

              <button
                type="button"
                disabled={!isAvail}
                onClick={() => {
                  setSelectedHotel(hotel);
                  setSelectedRoomIndex(0);
                  setConfirmedBooking(null);
                }}
                className={`px-3.5 py-2 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer ${
                  isAvail
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isAvail ? 'Reserve Stay' : 'Sold Out'}
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header with Search and View Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Luxury Hotels & Heritage Stays
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 rounded-full">
              According to Destinations
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Handpicked 5-star & boutique heritage stays with real-time room availability status and interactive destination maps.
          </p>
        </div>

        {/* Search & View Mode Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search hotel, city or sight..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:outline-hidden"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'split'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Split</span>
            </button>
          </div>
        </div>
      </div>

      {/* LIVE AVAILABILITY & DATE CHECKER BAR */}
      <div className="mb-6 p-3.5 sm:p-4 bg-gradient-to-r from-blue-50 via-indigo-50/50 to-slate-50 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 border border-blue-200/70 dark:border-blue-900/60 rounded-2xl shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Status info */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Live Hotel Availability Status Checker
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Real-time Inventory
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Check available luxury rooms & guaranteed live rates across destinations before booking.
              </p>
            </div>
          </div>

          {/* Quick Date & Guest Inputs */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-slate-400 font-bold text-[10px]">IN:</span>
              <input
                type="date"
                value={checkInFilter}
                onChange={(e) => setCheckInFilter(e.target.value)}
                className="text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-hidden bg-transparent"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-slate-400 font-bold text-[10px]">OUT:</span>
              <input
                type="date"
                value={checkOutFilter}
                onChange={(e) => setCheckOutFilter(e.target.value)}
                className="text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-hidden bg-transparent"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={guestsFilter}
                onChange={(e) => setGuestsFilter(Number(e.target.value))}
                className="text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-hidden bg-transparent cursor-pointer"
              >
                <option value={1} className="dark:bg-slate-800">1 Guest</option>
                <option value={2} className="dark:bg-slate-800">2 Guests</option>
                <option value={3} className="dark:bg-slate-800">3 Guests</option>
                <option value={4} className="dark:bg-slate-800">4 Guests</option>
                <option value={6} className="dark:bg-slate-800">6 Guests</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleCheckAvailability}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCheckingInventory ? 'animate-spin' : ''}`} />
              <span>{isCheckingInventory ? 'Checking...' : 'Check Live Status'}</span>
            </button>
          </div>

        </div>

        {/* Quick Filter: All vs Available Only */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-blue-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 font-semibold text-[11px]">Filter by Status:</span>
            <button
              type="button"
              onClick={() => setAvailabilityStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                availabilityStatusFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-blue-600 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              All Hotels ({hotels.length})
            </button>
            <button
              type="button"
              onClick={() => setAvailabilityStatusFilter('available_only')}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center gap-1 ${
                availabilityStatusFilter === 'available_only'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-emerald-200 dark:border-slate-700'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Available Stays Only ({availableHotelsCount})</span>
            </button>
          </div>

          <span className="hidden md:inline text-[11px] text-slate-500 dark:text-slate-400">
            💡 Switch to <strong>Map View</strong> or <strong>Split View</strong> to explore hotel price pins and locations.
          </span>
        </div>
      </div>

      {/* Destination Filter Carousel (According to Destinations) */}
      <div className="mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>Select Destination:</span>
          </span>
          {selectedDestinationFilter !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedDestinationFilter('all')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer"
            >
              Reset to All ({hotels.length} Stays)
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {destinationOptions.map((dest) => {
            const count = dest.id === 'all' 
              ? hotels.length
              : hotels.filter(h => {
                  if (h.destinationId === dest.id) return true;
                  const slug = dest.id.replace('dest-', '').toLowerCase();
                  return (h.destinationName && h.destinationName.toLowerCase().includes(slug)) ||
                         h.city.toLowerCase().includes(slug);
                }).length;

            if (count === 0 && dest.id !== 'all') return null;

            const isSelected = selectedDestinationFilter === dest.id;

            return (
              <button
                key={dest.id}
                type="button"
                onClick={() => setSelectedDestinationFilter(dest.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{dest.emoji}</span>
                <span>{dest.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Destination Banner */}
      {selectedDestinationFilter !== 'all' && (
        <div className="mb-6 p-3.5 bg-blue-50/70 dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-600 text-white rounded-lg">
              <MapPin className="w-3.5 h-3.5" />
            </span>
            <div>
              <p className="font-black text-slate-900 dark:text-white">
                Showing Stays for: {destinationOptions.find(d => d.id === selectedDestinationFilter)?.label}
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                {filteredHotels.length} luxury & heritage property options available near key sightseeing spots.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedDestinationFilter('all')}
            className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-bold text-[11px] cursor-pointer"
          >
            Show All
          </button>
        </div>
      )}

      {/* VIEW MODE 1: INTERACTIVE HOTEL MAP EXPLORER */}
      {viewMode === 'map' && (
        <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900">
          <HotelMapExplorer
            hotels={filteredHotels}
            onSelectHotel={(hotel) => {
              setHighlightHotelId(hotel.id);
            }}
            onReserveHotel={(hotel) => {
              setSelectedHotel(hotel);
              setSelectedRoomIndex(0);
              setConfirmedBooking(null);
            }}
            currency={currency}
            selectedHotelId={highlightHotelId}
            height="620px"
          />
        </div>
      )}

      {/* VIEW MODE 2: SPLIT VIEW (Cards on Left + Interactive Map on Right) */}
      {viewMode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 space-y-4 max-h-[720px] overflow-y-auto pr-1 no-scrollbar">
            {filteredHotels.length === 0 ? (
              <div className="py-12 text-center bg-slate-50 rounded-2xl border border-slate-100">
                <HotelIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-800">No stays matching filters</h3>
                <button
                  type="button"
                  onClick={() => { setSelectedDestinationFilter('all'); setAvailabilityStatusFilter('all'); }}
                  className="mt-3 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredHotels.map((h) => renderHotelCard(h, true))
            )}
          </div>

          <div className="lg:col-span-6 sticky top-24 rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900">
            <HotelMapExplorer
              hotels={filteredHotels}
              onSelectHotel={(hotel) => {
                setHighlightHotelId(hotel.id);
              }}
              onReserveHotel={(hotel) => {
                setSelectedHotel(hotel);
                setSelectedRoomIndex(0);
                setConfirmedBooking(null);
              }}
              currency={currency}
              selectedHotelId={highlightHotelId}
              height="720px"
            />
          </div>
        </div>
      )}

      {/* VIEW MODE 3: STANDARD HOTEL CARDS GRID */}
      {viewMode === 'grid' && (
        filteredHotels.length === 0 ? (
          <div className="py-16 text-center bg-slate-50 rounded-2xl border border-slate-100">
            <HotelIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No luxury stays found</h3>
            <p className="text-xs text-slate-500 mt-1">Try selecting a different destination or clearing your search filters</p>
            <button
              type="button"
              onClick={() => { setSelectedDestinationFilter('all'); setSearchQuery(''); setAvailabilityStatusFilter('all'); }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map((hotel) => renderHotelCard(hotel, false))}
          </div>
        )
      )}

      {/* Hotel Reservation Modal with Verified Live Availability Status & Authentic MiniMap */}
      {selectedHotel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850">
              <div className="flex items-center gap-2">
                <HotelIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white truncate">
                  Reserve {selectedHotel.name}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scroll Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {confirmedBooking ? (
                /* Success Confirmation View */
                <div className="py-6 text-center space-y-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ring-8 ${
                    confirmedBooking.status === 'confirmed'
                      ? 'bg-emerald-100 text-emerald-600 ring-emerald-50'
                      : confirmedBooking.status === 'pending'
                      ? 'bg-amber-100 text-amber-600 ring-amber-50'
                      : 'bg-blue-100 text-blue-600 ring-blue-50'
                  }`}>
                    {confirmedBooking.status === 'confirmed' ? (
                      <CheckCircle2 className="w-10 h-10" />
                    ) : (
                      <Clock className="w-10 h-10" />
                    )}
                  </div>

                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 border ${
                      confirmedBooking.status === 'confirmed'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-amber-50 border-amber-300 text-amber-800'
                    }">
                      {confirmedBooking.status === 'pending' ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                          <span>Pending Admin Confirmation</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Confirmed & Active</span>
                        </>
                      )}
                    </div>

                    <h4 className="text-xl font-black text-slate-900">
                      {confirmedBooking.status === 'pending' ? 'Hotel Booking Request Placed!' : 'Hotel Reservation Confirmed!'}
                    </h4>

                    {/* Explicit Required Message Box */}
                    <div className={`mt-3 p-3.5 rounded-2xl border text-left text-xs max-w-md mx-auto ${
                      confirmedBooking.status === 'pending'
                        ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                        : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                    }`}>
                      <div className="flex items-start gap-2.5">
                        {confirmedBooking.status === 'pending' ? (
                          <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-black text-sm">
                            {confirmedBooking.status === 'pending'
                              ? 'Your booking is pending. Please wait for admin confirmation.'
                              : 'Your booking has been confirmed successfully.'}
                          </p>
                          <p className="text-slate-600 mt-0.5">
                            {confirmedBooking.status === 'pending'
                              ? 'Your room reservation is filed under reference #' + confirmedBooking.bookingCode + '. It is shown in My Bookings and will automatically update once verified by admin.'
                              : 'Your room reservation voucher has been generated.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 mt-2">
                      Booking Reference: <span className="font-mono font-bold text-blue-600">{confirmedBooking.bookingCode}</span>
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-100 text-xs space-y-2 max-w-md mx-auto">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Property:</span>
                      <span className="font-bold text-slate-900">{confirmedBooking.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dates:</span>
                      <span className="font-bold text-slate-900">{confirmedBooking.startDate} to {confirmedBooking.endDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Guests:</span>
                      <span className="font-bold text-slate-900">{confirmedBooking.guests.adults} Adults, {confirmedBooking.guests.children} Children</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-sm">
                      <span className="text-slate-900">Total Price:</span>
                      <span className="text-blue-600">{formatPrice(confirmedBooking.totalPrice, currency)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        closeModal();
                        onOpenMyBookings();
                      }}
                      className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>View in My Bookings</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={closeModal}
                      className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                /* Reservation Form */
                <form onSubmit={handleBookHotelSubmit} className="space-y-4">
                  
                  {/* REAL-TIME VERIFIED AVAILABILITY STATUS BANNER (Before Booking) */}
                  <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                    (selectedHotel.roomsAvailable || 0) > 0 
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200' 
                      : 'bg-rose-50/80 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      {(selectedHotel.roomsAvailable || 0) > 0 ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                      )}
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                          <span>{(selectedHotel.roomsAvailable || 0) > 0 ? 'STATUS: AVAILABLE FOR BOOKING' : 'STATUS: SOLD OUT'}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/60 dark:bg-slate-800/80 font-bold">Instant Check</span>
                        </p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300">
                          {(selectedHotel.roomsAvailable || 0) > 0
                            ? `Guaranteed confirmation: ${selectedHotel.roomsAvailable} rooms currently open for booking.`
                            : 'All standard and deluxe suites are reserved for your requested dates.'}
                        </p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-xl text-xs font-black shrink-0 ${
                      (selectedHotel.roomsAvailable || 0) > 0
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-rose-600 text-white shadow-xs'
                    }`}>
                      {(selectedHotel.roomsAvailable || 0) > 0 ? `${selectedHotel.roomsAvailable} Left` : 'Sold Out'}
                    </span>
                  </div>

                  {/* Hotel Quick Overview */}
                  <div className="flex gap-4 p-3 bg-blue-50/50 dark:bg-slate-800/80 rounded-2xl border border-blue-100 dark:border-slate-700 items-center">
                    <img
                      src={selectedHotel.image}
                      alt={selectedHotel.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white text-sm">{selectedHotel.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{selectedHotel.location}</p>
                      <p className="text-xs font-bold text-blue-700 dark:text-blue-400 mt-1">
                        Base Rate: {formatPrice(selectedHotel.pricePerNight, currency)} / night
                      </p>
                    </div>
                  </div>

                  {/* HOTEL ORIGINAL MAP & PROXIMITY MINI-VIEW */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <MapIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Hotel Location & Proximity Map</span>
                      </label>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Streets & Satellite hybrid</span>
                    </div>
                    <HotelMiniMap 
                      hotel={selectedHotel} 
                      isAvailable={(selectedHotel.roomsAvailable || 0) > 0} 
                      height="190px" 
                    />
                  </div>

                  {/* Room Type Selector if available */}
                  {selectedHotel.roomTypes && selectedHotel.roomTypes.length > 0 && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Select Room Category
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedHotel.roomTypes.map((room, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedRoomIndex(idx)}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              selectedRoomIndex === idx
                                ? 'border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/60 ring-2 ring-blue-500/20'
                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                            }`}
                          >
                            <p className="text-xs font-bold text-slate-900 dark:text-white">{room.name}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{room.capacity} • {room.bedType}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs font-black text-blue-700 dark:text-blue-400">
                                {formatPrice(room.pricePerNight, currency)} / nt
                              </span>
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">🟢 Available</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Check-in Date</label>
                      <input
                        type="date"
                        required
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-hidden focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Check-out Date</label>
                      <input
                        type="date"
                        required
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-hidden focus:border-blue-600"
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Adults (12+)</label>
                      <input
                        type="number"
                        min="1"
                        max="8"
                        value={adults}
                        onChange={(e) => setAdults(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Children (0-11)</label>
                      <input
                        type="number"
                        min="0"
                        max="6"
                        value={children}
                        onChange={(e) => setChildren(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100"
                      />
                    </div>
                  </div>

                  {/* Add-on Services */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Optional Add-ons</label>
                    <label className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 rounded-xl cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={breakfastIncluded}
                          onChange={(e) => setBreakfastIncluded(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded-sm"
                        />
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Daily Gourmet Buffet Breakfast</span>
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        +{formatPrice(850 * calculateNights() * adults, currency)}
                      </span>
                    </label>

                    <label className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 rounded-xl cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={airportTransfer}
                          onChange={(e) => setAirportTransfer(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded-sm"
                        />
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Private Airport AC Sedan Pickup</span>
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        +{formatPrice(1800, currency)}
                      </span>
                    </label>
                  </div>

                  {/* Primary Guest Contact Details */}
                  <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Primary Guest Contact Details
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Soham Kotalwar"
                          value={travelerName}
                          onChange={(e) => setTravelerName(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-hidden focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. soham@travelora.in"
                          value={travelerEmail}
                          onChange={(e) => setTravelerEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-hidden focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +91 98765 43210"
                          value={travelerPhone}
                          onChange={(e) => setTravelerPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-hidden focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Special Requests (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Vegetarian/Jain meal options, high floor, anniversary setup"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900"
                    />
                  </div>

                  {/* Total Calculation */}
                  <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Total for {calculateNights()} Night(s)</p>
                      <p className="text-xl font-black text-white">
                        {formatPrice(
                          ((selectedHotel.roomTypes && selectedHotel.roomTypes[selectedRoomIndex]
                            ? selectedHotel.roomTypes[selectedRoomIndex].pricePerNight
                            : selectedHotel.pricePerNight) * calculateNights()) +
                          (airportTransfer ? 1800 : 0) +
                          (breakfastIncluded ? 850 * calculateNights() * adults : 0),
                          currency
                        )}
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || (selectedHotel.roomsAvailable || 0) === 0}
                      className={`px-6 py-2.5 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer ${
                        (selectedHotel.roomsAvailable || 0) > 0
                          ? 'bg-blue-600 hover:bg-blue-500 active:scale-95'
                          : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {isSubmitting ? 'Confirming...' : ((selectedHotel.roomsAvailable || 0) > 0 ? 'Confirm & Reserve' : 'Sold Out')}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </form>
              )}
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
