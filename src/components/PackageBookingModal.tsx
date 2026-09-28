/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Users, 
  MapPin, 
  Plane, 
  Clock, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  User,
  Phone,
  Mail,
  FileText,
  Star
} from 'lucide-react';
import { TourPackage, UserProfile, Booking, Currency } from '../types';
import { createBooking } from '../lib/supabase';
import { formatPrice } from '../lib/currency';
import { RoadmapView } from './RoadmapView';

interface PackageBookingModalProps {
  tourPackage: TourPackage | null;
  currency: Currency;
  currentUser: UserProfile | null;
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
  onOpenMyBookings: () => void;
  onExploreSpotOnMap?: (spotName: string) => void;
  initialTab?: 'customize' | 'itinerary';
}

export const PackageBookingModal: React.FC<PackageBookingModalProps> = ({
  tourPackage,
  currency,
  currentUser,
  onClose,
  onBookingSuccess,
  onOpenMyBookings,
  onExploreSpotOnMap,
  initialTab = 'customize'
}) => {
  const [departureCity, setDepartureCity] = useState('New Delhi (DEL)');
  const [startDate, setStartDate] = useState('2026-11-12');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Traveler info - dynamically derived from authenticated user or user input
  const [travelerName, setTravelerName] = useState(currentUser?.fullName || '');
  const [travelerEmail, setTravelerEmail] = useState(currentUser?.email || '');
  const [travelerPhone, setTravelerPhone] = useState(currentUser?.phone || '');
  const [specialRequests, setSpecialRequests] = useState('');

  // Sync if authenticated user logs in or profile changes
  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.fullName) setTravelerName(currentUser.fullName);
      if (currentUser.email) setTravelerEmail(currentUser.email);
      if (currentUser.phone) setTravelerPhone(currentUser.phone);
    }
  }, [currentUser]);

  // Customization add-ons
  const [privateTourGuide, setPrivateTourGuide] = useState(true);
  const [travelInsurance, setTravelInsurance] = useState(true);
  const [airportTransfer, setAirportTransfer] = useState(true);
  const [jeepSafariPass, setJeepSafariPass] = useState(false);
  const [luxuryVehicleUpgrade, setLuxuryVehicleUpgrade] = useState(false);

  const [activeTab, setActiveTab] = useState<'customize' | 'itinerary'>(initialTab);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  if (!tourPackage) return null;

  // Calculate return date
  const computeEndDate = () => {
    const s = new Date(startDate);
    s.setDate(s.getDate() + (tourPackage.daysCount || 5) - 1);
    return s.toISOString().split('T')[0];
  };

  // Price calculation in INR
  const basePrice = tourPackage.discountedPrice * adults + (tourPackage.discountedPrice * 0.6 * children);
  const guideCost = privateTourGuide ? 3500 : 0;
  const insuranceCost = travelInsurance ? 650 * (adults + children) : 0;
  const transferCost = airportTransfer ? 1500 : 0;
  const safariCost = jeepSafariPass ? 2200 * adults : 0;
  const upgradeCost = luxuryVehicleUpgrade ? 4500 : 0;

  const grandTotal = Math.round(basePrice + guideCost + insuranceCost + transferCost + safariCost + upgradeCost);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const cleanEmail = travelerEmail.trim();
    const cleanName = travelerName.trim() || 'Traveler';
    const cleanPhone = travelerPhone.trim();
    const resolvedUserId = currentUser?.id && currentUser.id !== 'user-demo-traveler'
      ? currentUser.id
      : (cleanEmail ? `usr-${cleanEmail.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : 'guest-traveler');

    try {
      const newBooking = await createBooking({
        userId: resolvedUserId,
        itemType: 'package',
        itemId: tourPackage.id,
        title: tourPackage.title,
        image: tourPackage.image,
        location: `${tourPackage.destination}, ${tourPackage.country}`,
        departureCity,
        startDate,
        endDate: computeEndDate(),
        guests: { adults, children },
        travelerName: cleanName,
        travelerEmail: cleanEmail,
        travelerPhone: cleanPhone,
        totalPrice: grandTotal,
        status: 'pending',
        specialRequests,
        customizationOptions: {
          privateTourGuide,
          travelInsurance,
          airportTransfer,
          jeepSafariPass,
          luxuryVehicleUpgrade
        }
      });

      setConfirmedBooking(newBooking);
      onBookingSuccess(newBooking);
    } catch (err) {
      console.error('Booking failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-600 text-white rounded-xl">
              <Plane className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {tourPackage.title}
              </h2>
              <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
                <span className="text-blue-600 font-bold">{tourPackage.duration}</span>
                <span>•</span>
                <span>{tourPackage.destination}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-500 font-black">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{Number(tourPackage.rating).toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({tourPackage.reviewsCount?.toLocaleString()} reviews)</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          
          {confirmedBooking ? (
            /* Confirmation Voucher View */
            <div className="py-6 text-center space-y-5 max-w-xl mx-auto">
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

                <h3 className="text-2xl font-black text-slate-900">
                  {confirmedBooking.status === 'pending' ? 'Booking Placed Successfully!' : 'Trip Successfully Booked!'}
                </h3>

                {/* Explicit Required Message Box */}
                <div className={`mt-3 p-3.5 rounded-2xl border text-left text-xs ${
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
                          ? 'We have recorded your booking in My Bookings. Our admin concierge is reviewing slot allocations and your status will automatically update upon approval.'
                          : 'We have dispatched your verified boarding voucher and reservation pass.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Printable-style Boarding Voucher Box */}
              <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-5 text-left space-y-3 relative">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Booking Reference</span>
                    <p className="text-lg font-mono font-black text-blue-600">{confirmedBooking.bookingCode}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Current Status</span>
                    <p className={`text-xs font-black ${confirmedBooking.status === 'pending' ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {confirmedBooking.status.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">Lead Passenger:</span>
                    <p className="font-bold text-slate-900">{confirmedBooking.travelerName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Departure:</span>
                    <p className="font-bold text-slate-900">{confirmedBooking.departureCity}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Travel Dates:</span>
                    <p className="font-bold text-slate-900">{confirmedBooking.startDate} to {confirmedBooking.endDate}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Travelers:</span>
                    <p className="font-bold text-slate-900">
                      {confirmedBooking.guests.adults} Adults{confirmedBooking.guests.children > 0 ? `, ${confirmedBooking.guests.children} Children` : ''}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Total Amount:</span>
                  <span className="text-base font-black text-slate-900">
                    {formatPrice(confirmedBooking.totalPrice, currency)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenMyBookings();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>View in My Bookings</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Booking & Customization View */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Top View Toggle: Customize Tour vs Itinerary */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl max-w-md">
                <button
                  type="button"
                  onClick={() => setActiveTab('customize')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === 'customize' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Customize & Book
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('itinerary')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'itinerary' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Coverage & Roadmap</span>
                  <span className="px-1.5 py-0.2 bg-blue-100 text-blue-700 text-[10px] rounded-full font-bold">
                    Hotels & Food
                  </span>
                </button>
              </div>

              {activeTab === 'itinerary' ? (
                /* Itinerary & Coverage Roadmap View */
                <div className="space-y-6">
                  {/* Rich Roadmap View detailing destination coverage, hotel stays, restaurants, and sights */}
                  <RoadmapView
                    mode="package"
                    packageData={tourPackage}
                    onExploreSpotOnMap={onExploreSpotOnMap}
                  />

                  {/* Inclusions & Exclusions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                      <p className="text-xs font-black text-emerald-800 mb-2">Package Inclusions</p>
                      <ul className="space-y-1.5 text-xs text-emerald-900">
                        {(tourPackage.inclusions || [
                          '4-star & boutique resort accommodations',
                          'Daily breakfast and select dinners',
                          'Private AC transfers for all sightseeing',
                          'All monument entries and permits',
                          '24/7 on-ground customer helpline'
                        ]).map((inc, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100">
                      <p className="text-xs font-black text-rose-800 mb-2">Package Exclusions</p>
                      <ul className="space-y-1.5 text-xs text-rose-900">
                        {(tourPackage.exclusions || [
                          'Personal expenses and room service',
                          'Optional adventure sports equipment hire',
                          'Custom camera and drone permits'
                        ]).map((exc, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="text-rose-500 font-bold shrink-0">✕</span>
                            <span>{exc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                /* Customization & Booking Form */
                <div className="space-y-5">
                  
                  {/* Departure & Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Departure City
                      </label>
                      <select
                        value={departureCity}
                        onChange={(e) => setDepartureCity(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-blue-600"
                      >
                        <option value="New Delhi (DEL)">New Delhi (DEL)</option>
                        <option value="Mumbai (BOM)">Mumbai (BOM)</option>
                        <option value="Bengaluru (BLR)">Bengaluru (BLR)</option>
                        <option value="Kolkata (CCU)">Kolkata (CCU)</option>
                        <option value="Chennai (MAA)">Chennai (MAA)</option>
                        <option value="Hyderabad (HYD)">Hyderabad (HYD)</option>
                        <option value="Ahmedabad (AMD)">Ahmedabad (AMD)</option>
                        <option value="Direct (Self Arrival)">Direct Arrival at Destination</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Travel Start Date
                      </label>
                      <input
                        type="date"
                        required
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-blue-600"
                      />
                    </div>
                  </div>

                  {/* Travelers */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Adults (12+ yrs)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={adults}
                        onChange={(e) => setAdults(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Children (2-11 yrs, 40% Off)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="8"
                        value={children}
                        onChange={(e) => setChildren(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Customization Add-ons */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-700">
                      Customize Your Trip With Add-ons
                    </label>

                    <label className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl cursor-pointer transition-colors">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={privateTourGuide}
                          onChange={(e) => setPrivateTourGuide(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded-sm"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800">Private English & Hindi Licensed Guide</p>
                          <p className="text-[10px] text-slate-500">Dedicated local expert for all monument tours</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-blue-700">
                        +{formatPrice(3500, currency)}
                      </span>
                    </label>

                    <label className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl cursor-pointer transition-colors">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={travelInsurance}
                          onChange={(e) => setTravelInsurance(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded-sm"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800">Comprehensive Travel Insurance</p>
                          <p className="text-[10px] text-slate-500">Flight delay, baggage protection & medical cover up to ₹5,00,000</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-blue-700">
                        +{formatPrice(650 * (adults + children), currency)}
                      </span>
                    </label>

                    <label className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl cursor-pointer transition-colors">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={airportTransfer}
                          onChange={(e) => setAirportTransfer(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded-sm"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800">Doorstep Private Airport Cab Pickup</p>
                          <p className="text-[10px] text-slate-500">Chauffeur waiting with name placard upon arrival</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-blue-700">
                        +{formatPrice(1500, currency)}
                      </span>
                    </label>

                    <label className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl cursor-pointer transition-colors">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={luxuryVehicleUpgrade}
                          onChange={(e) => setLuxuryVehicleUpgrade(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded-sm"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800">Upgrade to Luxury SUV (Toyota Crysta / Fortuner)</p>
                          <p className="text-[10px] text-slate-500">Captain leather seats, complimentary WiFi and mineral water</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-blue-700">
                        +{formatPrice(4500, currency)}
                      </span>
                    </label>
                  </div>

                  {/* Primary Passenger Contact Info */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-700">
                      Primary Traveler Contact Details
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Soham Kotalwar"
                          value={travelerName}
                          onChange={(e) => setTravelerName(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-blue-600 focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. soham@travelora.in"
                          value={travelerEmail}
                          onChange={(e) => setTravelerEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-blue-600 focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +91 98765 43210"
                          value={travelerPhone}
                          onChange={(e) => setTravelerPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-blue-600 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">
                        Dietary or Special Requests (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Jain / Vegetarian food only, wheelchair assistance, ground floor rooms"
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Price Summary & Submit CTA */}
                  <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-slate-400">Total Price ({adults} Adults{children > 0 ? `, ${children} Children` : ''})</p>
                      <p className="text-2xl font-black text-white">
                        {formatPrice(grandTotal, currency)}
                      </p>
                      <p className="text-[10px] text-emerald-400 font-bold mt-0.5">
                        ✓ All Taxes, GST & Inclusions Covered
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? 'Confirming Reservation...' : 'Confirm & Book Trip'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              )}

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
