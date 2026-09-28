/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, 
  Hotel as HotelIcon, 
  Package, 
  Calendar, 
  Clock, 
  MapPin, 
  Edit3, 
  XCircle, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ArrowRight, 
  ShieldCheck, 
  User, 
  Phone, 
  FileText, 
  Printer, 
  X,
  Plane,
  Sparkles,
  Star,
  Award,
  CheckCheck,
  Eye,
  Bell,
  Activity,
  History,
  ChevronRight,
  Camera
} from 'lucide-react';
import { Booking, BookingStatus, Currency, TripReview, BookingNotification, UserProfile } from '../types';
import { formatPrice } from '../lib/currency';
import { 
  getReviewForBooking, 
  createTripReview, 
  getBookingStatusMessage, 
  getNotificationsSync,
  markNotificationAsRead
} from '../lib/supabase';
import { TripReviewModal } from './TripReviewModal';

interface MyBookingsDashboardProps {
  bookings: Booking[];
  currency: Currency;
  onUpdateBooking: (id: string, updates: Partial<Booking>) => Promise<void>;
  onCancelBooking: (id: string, reason?: string) => Promise<void>;
  onDeleteBooking: (id: string) => Promise<void>;
  onBrowseDestinations: () => void;
  onBrowsePackages: () => void;
  onBrowseHotels: () => void;
  onReviewSubmitted?: (review: TripReview) => void;
  currentUser?: UserProfile | null;
  onOpenProfile?: () => void;
}

export const MyBookingsDashboard: React.FC<MyBookingsDashboardProps> = ({
  bookings,
  currency,
  onUpdateBooking,
  onCancelBooking,
  onDeleteBooking,
  onBrowseDestinations,
  onBrowsePackages,
  onBrowseHotels,
  onReviewSubmitted,
  currentUser,
  onOpenProfile
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [selectedDetailBooking, setSelectedDetailBooking] = useState<Booking | null>(null);
  const [notifications, setNotifications] = useState<BookingNotification[]>(() => getNotificationsSync());
  const [liveAlertMessage, setLiveAlertMessage] = useState<{
    text: string;
    bookingCode: string;
    status: BookingStatus;
  } | null>(null);

  // Sync notifications & real-time booking status events
  useEffect(() => {
    const refreshData = () => {
      setNotifications(getNotificationsSync());
    };

    const handleBookingStatusUpdated = (e: any) => {
      refreshData();
      if (e.detail) {
        setLiveAlertMessage({
          text: e.detail.message || `Booking status updated to ${e.detail.newStatus}`,
          bookingCode: e.detail.updatedBooking?.bookingCode || e.detail.bookingId,
          status: e.detail.newStatus
        });
        setTimeout(() => setLiveAlertMessage(null), 8000);

        if (selectedDetailBooking && selectedDetailBooking.id === e.detail.bookingId) {
          setSelectedDetailBooking(e.detail.updatedBooking);
        }
      }
    };

    window.addEventListener('travelora_booking_status_updated', handleBookingStatusUpdated);
    window.addEventListener('travelora_notification_received', refreshData);
    window.addEventListener('travelora_notifications_updated', refreshData);
    window.addEventListener('storage', refreshData);

    return () => {
      window.removeEventListener('travelora_booking_status_updated', handleBookingStatusUpdated);
      window.removeEventListener('travelora_notification_received', refreshData);
      window.removeEventListener('travelora_notifications_updated', refreshData);
      window.removeEventListener('storage', refreshData);
    };
  }, [selectedDetailBooking]);

  const handleSimulateStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    const statusInfo = getBookingStatusMessage(newStatus);
    await onUpdateBooking(bookingId, {
      status: newStatus,
      statusMessage: statusInfo.headline
    });

    const target = bookings.find(b => b.id === bookingId);
    if (target) {
      setSelectedDetailBooking({
        ...target,
        status: newStatus,
        statusMessage: statusInfo.headline
      });
    }
  };
  
  // Edit state
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editAdults, setEditAdults] = useState(2);
  const [editChildren, setEditChildren] = useState(0);
  const [editPhone, setEditPhone] = useState('');
  const [editSpecialRequests, setEditSpecialRequests] = useState('');
  const [editGuide, setEditGuide] = useState(false);
  const [editTransfer, setEditTransfer] = useState(false);
  const [editInsurance, setEditInsurance] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Cancel state
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('Change of personal travel plans');
  const [isCancelling, setIsCancelling] = useState(false);

  // Delete state
  const [deletingBooking, setDeletingBooking] = useState<Booking | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Voucher view state
  const [viewingVoucher, setViewingVoucher] = useState<Booking | null>(null);

  // Post-trip Review state
  const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(null);
  const [existingReview, setExistingReview] = useState<TripReview | undefined>(undefined);

  const filteredBookings = bookings.filter(b => {
    if (filterStatus === 'pending') return b.status === 'pending';
    if (filterStatus === 'confirmed') return b.status === 'confirmed';
    if (filterStatus === 'completed') return b.status === 'completed' || b.reviewed;
    if (filterStatus === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  const handleOpenReview = (b: Booking) => {
    const existing = getReviewForBooking(b.id);
    setExistingReview(existing);
    setReviewingBooking(b);
  };

  const handleReviewSave = async (reviewData: Omit<TripReview, 'id' | 'createdAt'>) => {
    const saved = await createTripReview(reviewData);
    if (onReviewSubmitted) {
      onReviewSubmitted(saved);
    }
    // Update local booking status if prop allows
    if (reviewData.bookingId) {
      await onUpdateBooking(reviewData.bookingId, {
        status: 'completed',
        reviewed: true,
        reviewId: saved.id
      });
    }
  };

  const handleMarkAsCompleted = async (b: Booking) => {
    await onUpdateBooking(b.id, {
      status: 'completed'
    });
  };

  const handleOpenEdit = (b: Booking) => {
    setEditingBooking(b);
    setEditStartDate(b.startDate);
    setEditEndDate(b.endDate);
    setEditAdults(b.guests?.adults || 2);
    setEditChildren(b.guests?.children || 0);
    setEditPhone(b.travelerPhone || '');
    setEditSpecialRequests(b.specialRequests || '');
    setEditGuide(Boolean(b.customizationOptions?.privateTourGuide));
    setEditTransfer(Boolean(b.customizationOptions?.airportTransfer));
    setEditInsurance(Boolean(b.customizationOptions?.travelInsurance));
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;
    setIsSaving(true);

    try {
      await onUpdateBooking(editingBooking.id, {
        startDate: editStartDate,
        endDate: editEndDate,
        guests: { adults: editAdults, children: editChildren },
        travelerPhone: editPhone,
        specialRequests: editSpecialRequests,
        customizationOptions: {
          ...editingBooking.customizationOptions,
          privateTourGuide: editGuide,
          airportTransfer: editTransfer,
          travelInsurance: editInsurance
        }
      });
      setEditingBooking(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancellingBooking) return;
    setIsCancelling(true);
    try {
      await onCancelBooking(cancellingBooking.id, cancelReason);
      setCancellingBooking(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingBooking) return;
    setIsDeleting(true);
    try {
      await onDeleteBooking(deletingBooking.id);
      setDeletingBooking(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              My Trips & Bookings
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 rounded-full">
              Supabase Synced
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your booked holiday packages, luxury hotels, and custom travel itineraries.
          </p>

          {/* Traveler Profile Banner with Photo Upload Option */}
          {currentUser && (
            <div className="flex items-center gap-3 mt-4 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                alt={currentUser.fullName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-slate-900 dark:text-white truncate">{currentUser.fullName}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</p>
              </div>
              {onOpenProfile && (
                <button
                  type="button"
                  onClick={onOpenProfile}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Update Photo</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onBrowsePackages}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Trip</span>
          </button>
          <button
            onClick={onBrowseHotels}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Reserve Hotel
          </button>
        </div>
      </div>

      {/* Live Status Alert Broadcast Banner */}
      {liveAlertMessage && (
        <div className="mb-6 p-4 rounded-2xl border bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg flex items-center justify-between gap-4 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              {liveAlertMessage.status === 'confirmed' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              ) : liveAlertMessage.status === 'pending' ? (
                <Clock className="w-5 h-5 text-amber-300" />
              ) : liveAlertMessage.status === 'completed' ? (
                <Award className="w-5 h-5 text-amber-300" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-300" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded">
                  {liveAlertMessage.bookingCode}
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-blue-200">
                  Status Updated to {liveAlertMessage.status}
                </span>
              </div>
              <p className="text-sm font-bold mt-0.5 text-white">
                {liveAlertMessage.text}
              </p>
            </div>
          </div>

          <button
            onClick={() => setLiveAlertMessage(null)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors cursor-pointer text-white/80 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-3">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterStatus === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All Bookings ({bookings.length})
        </button>

        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filterStatus === 'pending'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-950/40'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Review ({bookings.filter(b => b.status === 'pending').length})</span>
        </button>

        <button
          onClick={() => setFilterStatus('confirmed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filterStatus === 'confirmed'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Confirmed & Active ({bookings.filter(b => b.status === 'confirmed').length})</span>
        </button>

        <button
          onClick={() => setFilterStatus('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filterStatus === 'completed'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Completed & Reviewed ({bookings.filter(b => b.status === 'completed' || b.reviewed).length})</span>
        </button>

        <button
          onClick={() => setFilterStatus('cancelled')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filterStatus === 'cancelled'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/40'
          }`}
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Cancelled ({bookings.filter(b => b.status === 'cancelled').length})</span>
        </button>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 shadow-xs">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarCheck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">No bookings found in this filter</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            You haven't reserved any trips under this category yet. Explore incredible domestic destinations like Kashmir, Goa, and Kerala!
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={onBrowseDestinations}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
            >
              Explore Destinations
            </button>
            <button
              onClick={onBrowsePackages}
              className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer"
            >
              View Tour Deals
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const isCancelled = b.status === 'cancelled';
            const isPending = b.status === 'pending';
            const isConfirmed = b.status === 'confirmed';
            const isCompleted = b.status === 'completed' || b.reviewed;

            return (
              <div
                key={b.id}
                id={`booking-card-${b.id}`}
                className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 transition-all shadow-xs hover:shadow-md flex flex-col md:flex-row gap-5 items-start md:items-center justify-between ${
                  isCancelled 
                    ? 'border-slate-200 dark:border-slate-800 opacity-80 bg-slate-50/50 dark:bg-slate-900/50' 
                    : isPending
                    ? 'border-amber-300 dark:border-amber-700/80 bg-amber-50/20 dark:bg-amber-950/20'
                    : isConfirmed
                    ? 'border-emerald-300 dark:border-emerald-700/80 bg-white dark:bg-slate-900'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Left: Image & Details */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                  <img
                    src={b.image}
                    alt={b.title}
                    className="w-full sm:w-32 h-28 rounded-xl object-cover shrink-0"
                  />

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 px-2 py-0.5 rounded-md">
                        {b.bookingCode}
                      </span>

                      {/* Explicit Status Badge */}
                      {isPending && (
                        <span className="px-2.5 py-1 text-[11px] font-black rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 flex items-center gap-1.5 shadow-2xs">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                          <Clock className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300" />
                          <span>PENDING CONFIRMATION</span>
                        </span>
                      )}
                      {isConfirmed && (
                        <span className="px-2.5 py-1 text-[11px] font-black rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1.5 shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
                          <span>CONFIRMED & ACTIVE</span>
                        </span>
                      )}
                      {isCompleted && (
                        <span className="px-2.5 py-1 text-[11px] font-black rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-700 flex items-center gap-1.5 shadow-2xs">
                          <Award className="w-3.5 h-3.5 text-indigo-700 dark:text-indigo-300" />
                          <span>TRIP COMPLETED</span>
                        </span>
                      )}
                      {isCancelled && (
                        <span className="px-2.5 py-1 text-[11px] font-black rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-700 flex items-center gap-1.5 shadow-2xs">
                          <XCircle className="w-3.5 h-3.5 text-rose-700 dark:text-rose-300" />
                          <span>CANCELLED</span>
                        </span>
                      )}

                      {b.reviewed && (
                        <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>REVIEWED</span>
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 capitalize">
                        • {b.itemType}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                      {b.title}
                    </h4>

                    {/* Prominent Status Callout Message Box (Required by user) */}
                    <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                      isPending
                        ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900/60 text-amber-950 dark:text-amber-200'
                        : isConfirmed
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-200'
                        : isCompleted
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-900/60 text-indigo-950 dark:text-indigo-200'
                        : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900/60 text-rose-950 dark:text-rose-200'
                    }`}>
                      {isPending && <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />}
                      {isConfirmed && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />}
                      {isCompleted && <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />}
                      {isCancelled && <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />}

                      <div className="flex-1">
                        <p className="font-bold text-xs">
                          {isPending && 'Your booking is pending. Please wait for admin confirmation.'}
                          {isConfirmed && 'Your booking has been confirmed successfully.'}
                          {isCompleted && 'Your booking is completed. We hope you had a fantastic journey!'}
                          {isCancelled && 'Your booking has been cancelled.'}
                        </p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                          {isPending && 'Our team is reviewing your reservation details and slot allocations. You will see live updates automatically.'}
                          {isConfirmed && 'Official travel permits, flights, and accommodations are locked in. Digital voucher is active.'}
                          {isCompleted && (b.reviewed ? 'Thank you for rating and reviewing this trip!' : 'Leave a verified traveler review to share your experience.')}
                          {isCancelled && (b.cancellationReason ? `Reason: ${b.cancellationReason}. ${b.refundAmount ? `Refund of ${formatPrice(b.refundAmount, currency)} processed.` : ''}` : 'Refund processing is in progress.')}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{b.location}</span>
                      {b.departureCity && <span>(From: {b.departureCity})</span>}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300 font-medium">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{b.startDate} to {b.endDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{b.guests.adults} Adults{b.guests.children > 0 ? `, ${b.guests.children} Children` : ''}</span>
                      </div>
                    </div>

                    {b.specialRequests && (
                      <p className="text-[11px] text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/60 px-2 py-1 rounded-md inline-block mt-1">
                        Note: {b.specialRequests}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Price and Actions */}
                <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col items-stretch sm:items-end justify-between gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
                  <div className="text-left md:text-right">
                    <p className="text-xs text-slate-400 dark:text-slate-400 font-medium">Total Paid / Booked</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white">
                      {formatPrice(b.totalPrice, currency)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Track Status & Details Modal Trigger */}
                    <button
                      type="button"
                      onClick={() => setSelectedDetailBooking(b)}
                      className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/70 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                      title="View complete booking details and live status tracker"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Track Status</span>
                    </button>

                    {/* View Voucher */}
                    <button
                      type="button"
                      onClick={() => setViewingVoucher(b)}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                      title="View Boarding Voucher"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Voucher</span>
                    </button>

                    {/* Post-Trip Review / Star Rating Button */}
                    {!isCancelled && (
                      <button
                        type="button"
                        onClick={() => handleOpenReview(b)}
                        className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                          b.reviewed
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white'
                        }`}
                        title={b.reviewed ? 'View or update your review' : 'Rate & review your completed trip'}
                      >
                        <Star className={`w-3.5 h-3.5 ${b.reviewed ? 'fill-amber-500 text-amber-500' : 'fill-white text-white'}`} />
                        <span>{b.reviewed ? 'Your Review' : 'Rate & Review'}</span>
                      </button>
                    )}

                    {/* Quick Mark Completed if active */}
                    {!isCancelled && b.status !== 'completed' && !b.reviewed && (
                      <button
                        type="button"
                        onClick={() => handleMarkAsCompleted(b)}
                        className="px-2.5 py-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 border border-slate-200/70"
                        title="Mark trip as completed"
                      >
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Completed</span>
                      </button>
                    )}

                    {/* Edit / Customize Booking */}
                    {!isCancelled && b.status !== 'completed' && (
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(b)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Customize</span>
                      </button>
                    )}

                    {/* Cancel Booking */}
                    {!isCancelled && b.status !== 'completed' && (
                      <button
                        type="button"
                        onClick={() => setCancellingBooking(b)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    )}

                    {/* Delete Booking Record */}
                    <button
                      type="button"
                      onClick={() => setDeletingBooking(b)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete booking from records"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* EDIT / CUSTOMIZE BOOKING MODAL */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900">
                  Customize Booking: {editingBooking.bookingCode}
                </h3>
              </div>
              <button
                onClick={() => setEditingBooking(null)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Travel Start Date</label>
                  <input
                    type="date"
                    required
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Return / End Date</label>
                  <input
                    type="date"
                    required
                    value={editEndDate}
                    onChange={(e) => setEditEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Adults Count</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={editAdults}
                    onChange={(e) => setEditAdults(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Children Count</label>
                  <input
                    type="number"
                    min="0"
                    max="6"
                    value={editChildren}
                    onChange={(e) => setEditChildren(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dietary & Room Requests</label>
                <input
                  type="text"
                  placeholder="e.g. Vegetarian only, ground floor room, late check-in"
                  value={editSpecialRequests}
                  onChange={(e) => setEditSpecialRequests(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              {/* Add-on toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700">Trip Customizations</label>
                <label className="flex items-center justify-between p-2 bg-slate-50 rounded-xl cursor-pointer">
                  <span className="text-xs text-slate-800">Private Tour Guide</span>
                  <input
                    type="checkbox"
                    checked={editGuide}
                    onChange={(e) => setEditGuide(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded-sm"
                  />
                </label>
                <label className="flex items-center justify-between p-2 bg-slate-50 rounded-xl cursor-pointer">
                  <span className="text-xs text-slate-800">Doorstep Airport Cab Pickup</span>
                  <input
                    type="checkbox"
                    checked={editTransfer}
                    onChange={(e) => setEditTransfer(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded-sm"
                  />
                </label>
                <label className="flex items-center justify-between p-2 bg-slate-50 rounded-xl cursor-pointer">
                  <span className="text-xs text-slate-800">Comprehensive Travel Insurance</span>
                  <input
                    type="checkbox"
                    checked={editInsurance}
                    onChange={(e) => setEditInsurance(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded-sm"
                  />
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  {isSaving ? 'Saving...' : 'Save & Sync Supabase'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* CANCEL BOOKING MODAL */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden p-6 space-y-4">
            
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-rose-50">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-black text-slate-900">
                Cancel Trip Booking?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Booking: <span className="font-mono font-bold text-slate-800">{cancellingBooking.bookingCode}</span>
              </p>
              <p className="text-xs font-bold text-slate-800 mt-2">
                {cancellingBooking.title}
              </p>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800">
              <p className="font-bold">Refund Policy Guarantee:</p>
              <p className="mt-0.5">
                95% refund ({formatPrice(Math.round(cancellingBooking.totalPrice * 0.95), currency)}) will be returned directly to your original payment method within 2-3 business days.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reason for Cancellation
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
              >
                <option value="Change of travel plans">Change of travel plans</option>
                <option value="Health or medical emergency">Health or medical emergency</option>
                <option value="Found alternative tour or flight">Found alternative tour or flight</option>
                <option value="Work / Leave scheduling conflict">Work / Leave scheduling conflict</option>
                <option value="Other reasons">Other reasons</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancellingBooking(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                {isCancelling ? 'Processing...' : 'Confirm Cancellation'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CONFIRM DELETE BOOKING MODAL */}
      {deletingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden p-6 space-y-4">
            
            <div className="text-center">
              <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Delete Booking Record?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Booking Reference: <span className="font-mono font-bold text-slate-800">{deletingBooking.bookingCode}</span>
              </p>
              <p className="text-xs font-bold text-slate-800 mt-2">
                {deletingBooking.title}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
              <p className="font-bold text-slate-800">Notice:</p>
              <p className="mt-0.5">
                This will permanently remove this booking record from your dashboard and saved history.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingBooking(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                {isDeleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TRAVEL VOUCHER MODAL */}
      {viewingVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900">
                  Official Travel Voucher
                </h3>
              </div>
              <button
                onClick={() => setViewingVoucher(null)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Voucher Body (Printable styling) */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="border-2 border-slate-900 rounded-2xl p-6 bg-slate-50/50 space-y-4">
                
                {/* Voucher Header */}
                <div className="flex items-center justify-between border-b-2 border-dashed border-slate-300 pb-4">
                  <div>
                    <span className="text-xl font-black text-slate-900">
                      Travel<span className="text-blue-600">ora</span>
                    </span>
                    <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                      Confirmed Itinerary Voucher
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Voucher No</span>
                    <p className="text-base font-mono font-black text-blue-600">{viewingVoucher.bookingCode}</p>
                  </div>
                </div>

                {/* Tour Title & Destination */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Destination & Package</span>
                  <h4 className="text-base font-black text-slate-900">{viewingVoucher.title}</h4>
                  <p className="text-xs text-slate-600">{viewingVoucher.location}</p>
                </div>

                {/* Grid Info */}
                <div className="grid grid-cols-2 gap-3 text-xs border-y border-slate-200 py-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Passenger</span>
                    <p className="font-bold text-slate-900">{viewingVoucher.travelerName}</p>
                    <p className="text-[11px] text-slate-500">{viewingVoucher.travelerEmail}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Contact Phone</span>
                    <p className="font-bold text-slate-900">{viewingVoucher.travelerPhone}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Travel Dates</span>
                    <p className="font-bold text-slate-900">{viewingVoucher.startDate} to {viewingVoucher.endDate}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Guests</span>
                    <p className="font-bold text-slate-900">
                      {viewingVoucher.guests.adults} Adults{viewingVoucher.guests.children > 0 ? `, ${viewingVoucher.guests.children} Children` : ''}
                    </p>
                  </div>
                </div>

                {/* Price and Status */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Amount Paid</span>
                    <p className="text-lg font-black text-slate-900">
                      {formatPrice(viewingVoucher.totalPrice, currency)}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase">Status</span>
                    <p className="text-xs font-black text-emerald-600 uppercase">
                      {viewingVoucher.status}
                    </p>
                  </div>
                </div>

                {/* Barcode representation */}
                <div className="pt-3 border-t-2 border-dashed border-slate-300 text-center">
                  <div className="font-mono text-xl tracking-[0.3em] font-black text-slate-800">
                    ||| | |||| | ||||| || ||| ||||
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1">
                    Present this voucher or booking code upon arrival / airport check-in.
                  </p>
                </div>

              </div>
            </div>

            {/* Voucher Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Voucher</span>
              </button>
              <button
                type="button"
                onClick={() => setViewingVoucher(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* POST-TRIP REVIEW & STAR RATING MODAL */}
      {reviewingBooking && (
        <TripReviewModal
          booking={reviewingBooking}
          onClose={() => setReviewingBooking(null)}
          onSubmitReview={handleReviewSave}
          existingReview={existingReview}
        />
      )}

      {/* BOOKING DETAILS & LIVE STATUS TRACKER MODAL */}
      {selectedDetailBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white">Booking Details & Live Status</h3>
                    <span className="font-mono text-xs font-bold text-blue-300 bg-blue-900/60 px-2 py-0.5 rounded">
                      {selectedDetailBooking.bookingCode}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Live reservation tracker & itinerary confirmation</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedDetailBooking(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 p-6 space-y-5 text-left">
              
              {/* Highlighted Status Message Box (User Requirement) */}
              <div className={`p-4 rounded-2xl border text-xs ${
                selectedDetailBooking.status === 'pending'
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : selectedDetailBooking.status === 'confirmed'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : selectedDetailBooking.status === 'completed'
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {selectedDetailBooking.status === 'pending' && <Clock className="w-5 h-5 text-amber-600" />}
                    {selectedDetailBooking.status === 'confirmed' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                    {selectedDetailBooking.status === 'completed' && <Award className="w-5 h-5 text-indigo-600" />}
                    {selectedDetailBooking.status === 'cancelled' && <AlertCircle className="w-5 h-5 text-rose-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        selectedDetailBooking.status === 'pending'
                          ? 'bg-amber-200 text-amber-900'
                          : selectedDetailBooking.status === 'confirmed'
                          ? 'bg-emerald-200 text-emerald-900'
                          : selectedDetailBooking.status === 'completed'
                          ? 'bg-indigo-200 text-indigo-900'
                          : 'bg-rose-200 text-rose-900'
                      }`}>
                        Current Status: {selectedDetailBooking.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-black">
                      {selectedDetailBooking.status === 'pending' && 'Your booking is pending. Please wait for admin confirmation.'}
                      {selectedDetailBooking.status === 'confirmed' && 'Your booking has been confirmed successfully.'}
                      {selectedDetailBooking.status === 'completed' && 'Your booking is completed. We hope you had a fantastic journey!'}
                      {selectedDetailBooking.status === 'cancelled' && 'Your booking has been cancelled.'}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {selectedDetailBooking.status === 'pending' && 'Our administrative team is reviewing your schedule, hotel availability, and local permits. You will automatically receive a notification the moment your status updates.'}
                      {selectedDetailBooking.status === 'confirmed' && 'All travel passes, vouchers, and local arrangements are locked in. Check your email or download your voucher below.'}
                      {selectedDetailBooking.status === 'completed' && 'Trip concluded. Please submit a star rating and leave traveler tips to help future explorers.'}
                      {selectedDetailBooking.status === 'cancelled' && (selectedDetailBooking.cancellationReason ? `Reason: ${selectedDetailBooking.cancellationReason}. ${selectedDetailBooking.refundAmount ? `Refund of ${formatPrice(selectedDetailBooking.refundAmount, currency)} processed.` : ''}` : 'Reservation cancelled. Any applicable refund is in process.')}
                    </p>
                  </div>
                </div>
              </div>

              {/* 4-Stage Visual Status Stepper */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Booking Progress Timeline
                </h5>
                <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                  {/* Step 1: Placed */}
                  <div className="space-y-1">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-xs font-bold shadow-xs">
                      ✓
                    </div>
                    <p className="font-bold text-slate-800">1. Placed</p>
                    <p className="text-[10px] text-slate-400">Submitted</p>
                  </div>

                  {/* Step 2: Under Review / Pending */}
                  <div className="space-y-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold shadow-xs ${
                      selectedDetailBooking.status === 'pending'
                        ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                        : selectedDetailBooking.status === 'confirmed' || selectedDetailBooking.status === 'completed'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {selectedDetailBooking.status === 'pending' ? <Clock className="w-4 h-4" /> : selectedDetailBooking.status === 'confirmed' || selectedDetailBooking.status === 'completed' ? '✓' : '2'}
                    </div>
                    <p className="font-bold text-slate-800">2. Review</p>
                    <p className="text-[10px] text-slate-400">Admin Queue</p>
                  </div>

                  {/* Step 3: Confirmed */}
                  <div className="space-y-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold shadow-xs ${
                      selectedDetailBooking.status === 'confirmed'
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                        : selectedDetailBooking.status === 'completed'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {selectedDetailBooking.status === 'confirmed' || selectedDetailBooking.status === 'completed' ? '✓' : '3'}
                    </div>
                    <p className="font-bold text-slate-800">3. Confirmed</p>
                    <p className="text-[10px] text-slate-400">Voucher Active</p>
                  </div>

                  {/* Step 4: Completed */}
                  <div className="space-y-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold shadow-xs ${
                      selectedDetailBooking.status === 'completed' || selectedDetailBooking.reviewed
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {selectedDetailBooking.status === 'completed' || selectedDetailBooking.reviewed ? '★' : '4'}
                    </div>
                    <p className="font-bold text-slate-800">4. Completed</p>
                    <p className="text-[10px] text-slate-400">Post-Trip Review</p>
                  </div>
                </div>
              </div>

              {/* Interactive Admin Quick-Simulator Widget */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-black text-blue-900">Simulate Admin Status Change</span>
                  </div>
                  <span className="text-[10px] bg-blue-200/70 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                    Test Mode
                  </span>
                </div>
                <p className="text-[11px] text-blue-800/80 leading-snug">
                  Click any status below to simulate an admin updating this booking. The user UI, notification area, and badges will update immediately:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => handleSimulateStatusChange(selectedDetailBooking.id, 'pending')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedDetailBooking.status === 'pending'
                        ? 'bg-amber-600 text-white ring-2 ring-amber-400 shadow-xs'
                        : 'bg-white hover:bg-amber-50 text-amber-800 border border-amber-300'
                    }`}
                  >
                    Set to Pending
                  </button>
                  <button
                    onClick={() => handleSimulateStatusChange(selectedDetailBooking.id, 'confirmed')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedDetailBooking.status === 'confirmed'
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 shadow-xs'
                        : 'bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    Set to Confirmed
                  </button>
                  <button
                    onClick={() => handleSimulateStatusChange(selectedDetailBooking.id, 'completed')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedDetailBooking.status === 'completed'
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 shadow-xs'
                        : 'bg-white hover:bg-indigo-50 text-indigo-800 border border-indigo-300'
                    }`}
                  >
                    Set to Completed
                  </button>
                  <button
                    onClick={() => handleSimulateStatusChange(selectedDetailBooking.id, 'cancelled')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedDetailBooking.status === 'cancelled'
                        ? 'bg-rose-600 text-white ring-2 ring-rose-400 shadow-xs'
                        : 'bg-white hover:bg-rose-50 text-rose-800 border border-rose-300'
                    }`}
                  >
                    Set to Cancelled
                  </button>
                </div>
              </div>

              {/* Booking Information Grid */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2.5">
                <h5 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                  Reservation Information
                </h5>
                <div className="grid grid-cols-2 gap-3 text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Title:</span>
                    <strong className="text-slate-900">{selectedDetailBooking.title}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Location:</span>
                    <strong className="text-slate-900">{selectedDetailBooking.location}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Dates:</span>
                    <span className="text-slate-900 font-bold">{selectedDetailBooking.startDate} to {selectedDetailBooking.endDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Lead Passenger:</span>
                    <span className="text-slate-900 font-bold">{selectedDetailBooking.travelerName} ({selectedDetailBooking.travelerPhone})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Guests:</span>
                    <span className="text-slate-900 font-bold">{selectedDetailBooking.guests.adults} Adults, {selectedDetailBooking.guests.children} Children</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Total Price:</span>
                    <strong className="text-blue-600 font-black text-sm">{formatPrice(selectedDetailBooking.totalPrice, currency)}</strong>
                  </div>
                </div>

                {selectedDetailBooking.specialRequests && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Special Requests:</span>
                    <p className="text-slate-700 italic">{selectedDetailBooking.specialRequests}</p>
                  </div>
                )}
              </div>

              {/* Status History Timeline */}
              {selectedDetailBooking.statusHistory && selectedDetailBooking.statusHistory.length > 0 && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center gap-1.5">
                    <History className="w-4 h-4 text-slate-500" />
                    <h5 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                      Status History Log
                    </h5>
                  </div>
                  <div className="divide-y divide-slate-200/80">
                    {selectedDetailBooking.statusHistory.map((h, idx) => (
                      <div key={idx} className="py-2 flex items-start justify-between gap-3 text-[11px]">
                        <div>
                          <span className="font-bold capitalize text-slate-800 mr-2">
                            {h.status}
                          </span>
                          <span className="text-slate-500">
                            {h.note || 'Status updated'}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            Updated by: <span className="font-mono">{h.updatedBy}</span>
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  const b = selectedDetailBooking;
                  setSelectedDetailBooking(null);
                  setViewingVoucher(b);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>View Voucher</span>
              </button>

              <button
                onClick={() => setSelectedDetailBooking(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
