/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  UserCheck, 
  X, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Download, 
  RefreshCw, 
  Hotel as HotelIcon, 
  Compass, 
  DollarSign, 
  Sliders, 
  Eye, 
  EyeOff, 
  KeyRound,
  FileSpreadsheet,
  AlertTriangle,
  LogOut,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { 
  AdminAccount, 
  getAdminAccount, 
  isAdminSlotAvailable, 
  registerSingleAdminAccount, 
  loginAdmin, 
  getActiveAdminSession, 
  logoutAdminSession,
  resetAdminPasswordWithPin 
} from '../lib/adminAuth';
import { Booking, Currency, Hotel } from '../types';
import { formatPrice } from '../lib/currency';
import { 
  getBookings, 
  updateBooking, 
  cancelBooking, 
  getHotels, 
  setHotelRoomInventory, 
  restoreHotelRooms 
} from '../lib/supabase';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  onHotelsUpdated?: (updatedHotels: Hotel[]) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  currency,
  onHotelsUpdated
}) => {
  // Admin Auth States
  const [adminAccount, setAdminAccount] = useState<AdminAccount | null>(null);
  const [activeAdmin, setActiveAdmin] = useState<AdminAccount | null>(null);
  const [isSlotAvailable, setIsSlotAvailable] = useState<boolean>(true);

  // Forms States
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRecoveryPin, setRegRecoveryPin] = useState('');
  const [regTermsAgreed, setRegTermsAgreed] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Password Recovery States
  const [showRecoveryView, setShowRecoveryView] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryPin, setRecoveryPin] = useState('');
  const [recoveryNewPassword, setRecoveryNewPassword] = useState('');

  // Dashboard States
  const [activeTab, setActiveTab] = useState<'bookings' | 'inventory' | 'profile'>('bookings');
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [hotelsList, setHotelsList] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'hotel' | 'package'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [selectedBookingForDetail, setSelectedBookingForDetail] = useState<Booking | null>(null);

  // Feedback notifications
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Refresh admin state and load data
  const refreshAdminState = () => {
    const acc = getAdminAccount();
    const session = getActiveAdminSession();
    setAdminAccount(acc);
    setActiveAdmin(session);
    setIsSlotAvailable(!acc);
  };

  const loadAdminDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load ALL bookings without user filtering
      const bookings = await getBookings();
      setAllBookings(bookings);

      const hotels = await getHotels();
      setHotelsList(hotels);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshAdminState();
      loadAdminDashboardData();
      setStatusMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // HANDLERS: Registration
  const handleRegisterAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!regTermsAgreed) {
      setStatusMessage({ type: 'error', text: 'Please confirm that you understand this is the sole administrative account.' });
      return;
    }

    const result = registerSingleAdminAccount({
      fullName: regFullName,
      email: regEmail,
      password: regPassword,
      recoveryPin: regRecoveryPin
    });

    if (result.success && result.account) {
      setAdminAccount(result.account);
      setActiveAdmin(result.account);
      setIsSlotAvailable(false);
      setStatusMessage({ type: 'success', text: 'Admin account provisioned successfully! The single administrative slot is now permanently locked.' });
      loadAdminDashboardData();
    } else {
      setStatusMessage({ type: 'error', text: result.error || 'Failed to create admin account' });
    }
  };

  // HANDLERS: Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const result = loginAdmin(loginEmail, loginPassword);
    if (result.success && result.account) {
      setActiveAdmin(result.account);
      setStatusMessage({ type: 'success', text: `Welcome back, ${result.account.fullName}!` });
      loadAdminDashboardData();
    } else {
      setStatusMessage({ type: 'error', text: result.error || 'Login failed. Please verify your credentials.' });
    }
  };

  // HANDLERS: Password Recovery
  const handlePasswordRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const result = resetAdminPasswordWithPin(recoveryEmail, recoveryPin, recoveryNewPassword);
    if (result.success) {
      setStatusMessage({ type: 'success', text: 'Admin password reset successfully! You can now log in.' });
      setShowRecoveryView(false);
      setLoginPassword(recoveryNewPassword);
    } else {
      setStatusMessage({ type: 'error', text: result.error || 'Recovery failed' });
    }
  };

  // HANDLERS: Logout
  const handleLogout = () => {
    logoutAdminSession();
    setActiveAdmin(null);
    setStatusMessage({ type: 'success', text: 'Admin session terminated.' });
  };

  // HANDLERS: Cancel Booking & Restore Hotel Rooms
  const handleAdminCancelBooking = async (booking: Booking) => {
    if (!window.confirm(`Are you sure you want to cancel booking ${booking.bookingCode}? If this is a hotel reservation, the room(s) will be restored to available inventory.`)) {
      return;
    }

    const success = await cancelBooking(booking.id, 'Administrative cancellation');
    if (success) {
      // If it was a hotel booking, restore room inventory
      if (booking.itemType === 'hotel') {
        const roomsToRestore = booking.customizationOptions?.roomsCount || 1;
        const updatedHotel = restoreHotelRooms(booking.itemId, roomsToRestore);
        if (updatedHotel) {
          const nextHotels = hotelsList.map(h => h.id === updatedHotel.id ? updatedHotel : h);
          setHotelsList(nextHotels);
          onHotelsUpdated?.(nextHotels);
        }
      }

      await loadAdminDashboardData();
      setStatusMessage({ type: 'success', text: `Booking ${booking.bookingCode} cancelled and room inventory restored.` });
    }
  };

  // HANDLERS: Mark Booking as Confirmed
  const handleAdminConfirmBooking = async (bookingId: string) => {
    const updated = await updateBooking(bookingId, { status: 'confirmed' });
    if (updated) {
      await loadAdminDashboardData();
      setStatusMessage({ type: 'success', text: `Booking status updated to Confirmed.` });
    }
  };

  // HANDLERS: Adjust Hotel Room Inventory Directly
  const handleAdjustHotelInventory = (hotelId: string, delta: number) => {
    const target = hotelsList.find(h => h.id === hotelId);
    if (!target) return;

    const nextCount = Math.max(0, (target.roomsAvailable || 0) + delta);
    const updated = setHotelRoomInventory(hotelId, nextCount);
    if (updated) {
      const nextHotels = hotelsList.map(h => h.id === updated.id ? updated : h);
      setHotelsList(nextHotels);
      onHotelsUpdated?.(nextHotels);
      setStatusMessage({ type: 'success', text: `Inventory for ${target.name} updated to ${nextCount} rooms.` });
    }
  };

  // HANDLERS: Export CSV
  const handleExportCSV = () => {
    const headers = ['Booking Code', 'Item Type', 'Title', 'Customer Name', 'Customer Email', 'Customer Phone', 'Start Date', 'End Date', 'Total Price (INR)', 'Status', 'Created At'];
    const rows = allBookings.map(b => [
      b.bookingCode,
      b.itemType,
      `"${b.title.replace(/"/g, '""')}"`,
      `"${b.travelerName.replace(/"/g, '""')}"`,
      b.travelerEmail,
      b.travelerPhone,
      b.startDate,
      b.endDate,
      b.totalPrice,
      b.status,
      b.createdAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `travelora_all_bookings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Bookings
  const filteredBookings = allBookings.filter(b => {
    if (typeFilter !== 'all' && b.itemType !== typeFilter) return false;
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCode = b.bookingCode?.toLowerCase().includes(q);
      const matchName = b.travelerName?.toLowerCase().includes(q);
      const matchEmail = b.travelerEmail?.toLowerCase().includes(q);
      const matchPhone = b.travelerPhone?.toLowerCase().includes(q);
      const matchTitle = b.title?.toLowerCase().includes(q);
      if (!matchCode && !matchName && !matchEmail && !matchPhone && !matchTitle) {
        return false;
      }
    }
    return true;
  });

  // KPI Calculations
  const totalRevenue = allBookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const totalConfirmed = allBookings.filter(b => b.status === 'confirmed').length;
  const totalCancelled = allBookings.filter(b => b.status === 'cancelled').length;
  const totalHotelsBooked = allBookings.filter(b => b.itemType === 'hotel').length;
  const totalPackagesBooked = allBookings.filter(b => b.itemType === 'package').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">Travelora Admin Portal</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-900/60 text-blue-300 border border-blue-700/50">
                  Master Control
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Single Slot Administrative Security & Central Booking Records
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Slot Lock Status Pill */}
            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              isSlotAvailable 
                ? 'bg-amber-950/60 text-amber-300 border-amber-800/80' 
                : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80'
            }`}>
              {isSlotAvailable ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Slot: 1 Available (Unclaimed)</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Admin Slot: 1/1 Claimed & Permanently Locked</span>
                </>
              )}
            </div>

            {activeAdmin && (
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {statusMessage && (
          <div className={`px-6 py-2.5 text-xs font-bold flex items-center justify-between ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-950/80 text-emerald-200 border-b border-emerald-800' 
              : 'bg-rose-950/80 text-rose-200 border-b border-rose-800'
          }`}>
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button 
              onClick={() => setStatusMessage(null)}
              className="text-slate-400 hover:text-white"
            >
              ×
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* VIEW STATE 1: NOT AUTHENTICATED */}
          {!activeAdmin ? (
            <div className="max-w-xl mx-auto py-4">
              
              {/* CASE 1A: ADMIN SLOT IS AVAILABLE (0 of 1 account registered) */}
              {isSlotAvailable ? (
                <div className="bg-slate-950/80 border border-blue-900/60 rounded-3xl p-6 sm:p-8 shadow-xl">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/10">
                      <KeyRound className="w-7 h-7" />
                    </div>
                    <span className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-black rounded-full uppercase tracking-wider mb-2">
                      Single Slot Allocation: Slot 1 of 1
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      Create Your Administrator Account
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      You are initializing the primary administrator credentials for Travelora. 
                      <strong className="text-slate-200"> Exactly one admin slot is provided.</strong> Once this account is created, administrative sign-up is permanently closed and no one else can register.
                    </p>
                  </div>

                  <form onSubmit={handleRegisterAdmin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Admin Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Soham Kotalwar"
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Admin Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="kotalwarsoham588@gmail.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Secret Admin Master Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="At least 6 characters"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                        <span>4-Digit Security Recovery PIN</span>
                        <span className="text-[10px] text-amber-400 font-semibold">Keep this private</span>
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        required
                        placeholder="e.g. 5882"
                        value={regRecoveryPin}
                        onChange={(e) => setRegRecoveryPin(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 font-mono tracking-widest text-center"
                      />
                    </div>

                    <div className="pt-2">
                      <label className="flex items-start gap-3 p-3 bg-blue-950/40 border border-blue-900/60 rounded-xl cursor-pointer">
                        <input
                          type="checkbox"
                          checked={regTermsAgreed}
                          onChange={(e) => setRegTermsAgreed(e.target.checked)}
                          className="mt-0.5 w-4 h-4 text-blue-600 rounded-sm"
                        />
                        <span className="text-xs text-slate-300 leading-relaxed">
                          I confirm I am the authorized owner. I understand this single slot locks the admin creation process permanently.
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Claim Single Admin Slot & Initialize</span>
                    </button>
                  </form>
                </div>
              ) : (
                /* CASE 1B: ADMIN SLOT IS CLAIMED (1 of 1 account registered) - LOGIN ONLY */
                <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
                  
                  {/* Slot Locked Banner */}
                  <div className="mb-6 p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Lock className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-white">
                          Single Admin Slot Claimed (1/1)
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Sign-ups are permanently disabled. Please sign in with your registered admin credentials.
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-[10px] font-black rounded-lg uppercase tracking-wider shrink-0">
                      Locked
                    </span>
                  </div>

                  {!showRecoveryView ? (
                    <div>
                      <div className="text-center mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto mb-2.5">
                          <Lock className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-white">Admin Secure Sign In</h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Enter your administrative credentials to manage bookings and inventory
                        </p>
                      </div>

                      <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1.5">
                            Admin Email
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="admin@travelora.in"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-bold text-slate-300">
                              Password
                            </label>
                            <button
                              type="button"
                              onClick={() => setShowRecoveryView(true)}
                              className="text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer"
                            >
                              Forgot Password?
                            </button>
                          </div>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              required
                              placeholder="••••••••"
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Authenticate & Open Admin Dashboard</span>
                        </button>
                      </form>
                    </div>
                  ) : (
                    /* RECOVERY VIEW USING PIN */
                    <div>
                      <div className="text-center mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-2.5">
                          <KeyRound className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-black text-white">Reset Admin Password</h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Verify with the 4-digit Security PIN you configured during initial setup
                        </p>
                      </div>

                      <form onSubmit={handlePasswordRecovery} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Registered Admin Email
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="admin@travelora.in"
                            value={recoveryEmail}
                            onChange={(e) => setRecoveryEmail(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            4-Digit Recovery PIN
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            required
                            placeholder="••••"
                            value={recoveryPin}
                            onChange={(e) => setRecoveryPin(e.target.value.replace(/\D/g, ''))}
                            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono tracking-widest text-center"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            New Password
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="Minimum 6 characters"
                            value={recoveryNewPassword}
                            onChange={(e) => setRecoveryNewPassword(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                          />
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                          <button
                            type="submit"
                            className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                          >
                            Update Password
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowRecoveryView(false)}
                            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                </div>
              )}

            </div>
          ) : (
            /* VIEW STATE 2: AUTHENTICATED ADMIN DASHBOARD */
            <div className="space-y-6">
              
              {/* Admin Welcome Bar & Navigation Tabs */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-600/30">
                    {activeAdmin.fullName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <span>{activeAdmin.fullName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                        Super Admin (Slot 1/1)
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      {activeAdmin.email} • Administrator Access Active
                    </p>
                  </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveTab('bookings')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'bookings'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>All Bookings ({allBookings.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('inventory')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'inventory'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <HotelIcon className="w-3.5 h-3.5" />
                    <span>Hotel Rooms Inventory</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'profile'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Admin Slot Security</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: ALL BOOKINGS DONE ON WEBSITE */}
              {activeTab === 'bookings' && (
                <div className="space-y-6">
                  
                  {/* KPI Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      <p className="text-xs text-slate-400 font-semibold">Total Platform Bookings</p>
                      <p className="text-2xl font-black text-white mt-1">{allBookings.length}</p>
                      <span className="text-[10px] text-blue-400 font-bold mt-1 inline-block">
                        {totalConfirmed} Confirmed • {totalCancelled} Cancelled
                      </span>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      <p className="text-xs text-slate-400 font-semibold">Total Confirmed Revenue</p>
                      <p className="text-2xl font-black text-emerald-400 mt-1">
                        {formatPrice(totalRevenue, currency)}
                      </p>
                      <span className="text-[10px] text-slate-500 font-bold mt-1 inline-block">
                        Calculated from confirmed trips
                      </span>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      <p className="text-xs text-slate-400 font-semibold">Hotel Stays Reserved</p>
                      <p className="text-2xl font-black text-blue-400 mt-1">{totalHotelsBooked}</p>
                      <span className="text-[10px] text-slate-500 font-bold mt-1 inline-block">
                        With room inventory tracking
                      </span>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      <p className="text-xs text-slate-400 font-semibold">Tour Packages Booked</p>
                      <p className="text-2xl font-black text-purple-400 mt-1">{totalPackagesBooked}</p>
                      <span className="text-[10px] text-slate-500 font-bold mt-1 inline-block">
                        Domestic & International
                      </span>
                    </div>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
                    <div className="flex-1 relative w-full">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Search by Traveler Name, Email, Phone, Booking Code, Hotel, or Tour..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as any)}
                        className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-hidden"
                      >
                        <option value="all">All Booking Types</option>
                        <option value="hotel">Hotels Only</option>
                        <option value="package">Packages Only</option>
                      </select>

                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-hidden"
                      >
                        <option value="all">All Statuses</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <button
                        type="button"
                        onClick={handleExportCSV}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                        title="Download CSV report of all bookings"
                      >
                        <Download className="w-3.5 h-3.5 text-blue-400" />
                        <span className="hidden sm:inline">Export CSV</span>
                      </button>

                      <button
                        type="button"
                        onClick={loadAdminDashboardData}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all cursor-pointer"
                        title="Refresh live data"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Bookings Table / Cards List */}
                  {filteredBookings.length === 0 ? (
                    <div className="py-16 text-center bg-slate-950 rounded-2xl border border-slate-800">
                      <FileSpreadsheet className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                      <h4 className="text-sm font-bold text-white">No bookings found</h4>
                      <p className="text-xs text-slate-500 mt-1">Try changing your search terms or filters</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="bg-slate-950 p-4 rounded-2xl border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                        >
                          {/* Left: Thumbnail & Item Details */}
                          <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                            <img
                              src={booking.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80'}
                              alt={booking.title}
                              className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-800"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="font-mono text-xs font-black text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-800/50">
                                  {booking.bookingCode}
                                </span>
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                                  booking.status === 'confirmed' 
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                                }`}>
                                  {booking.status}
                                </span>
                                <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md font-semibold">
                                  {booking.itemType === 'hotel' ? '🏨 Hotel Stay' : '✈️ Tour Package'}
                                </span>
                              </div>

                              <h4 className="text-sm font-bold text-white truncate">
                                {booking.title}
                              </h4>

                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-slate-500" />
                                  <span>{booking.startDate} → {booking.endDate}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-500" />
                                  <span className="truncate">{booking.location}</span>
                                </span>
                                {booking.itemType === 'hotel' && booking.customizationOptions?.roomsCount && (
                                  <span className="text-emerald-400 font-bold">
                                    🛏️ {booking.customizationOptions.roomsCount} Room(s)
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Middle: Traveler Details */}
                          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/60 text-xs space-y-1 lg:w-72 shrink-0">
                            <div className="flex items-center gap-1.5 font-bold text-slate-200">
                              <User className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                              <span className="truncate">{booking.travelerName}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span className="truncate">{booking.travelerEmail}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span>{booking.travelerPhone}</span>
                            </div>
                          </div>

                          {/* Right: Total Price & Actions */}
                          <div className="flex items-center justify-between lg:justify-end gap-3 pt-2 lg:pt-0 border-t border-slate-800 lg:border-t-0 shrink-0">
                            <div className="text-left lg:text-right">
                              <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Amount</span>
                              <span className="text-base font-black text-white">
                                {formatPrice(booking.totalPrice, currency)}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedBookingForDetail(booking)}
                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
                              >
                                View Details
                              </button>

                              {booking.status === 'confirmed' ? (
                                <button
                                  type="button"
                                  onClick={() => handleAdminCancelBooking(booking)}
                                  className="px-3 py-1.5 bg-rose-950/70 hover:bg-rose-900/80 text-rose-300 border border-rose-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
                                  title="Cancel and restore rooms"
                                >
                                  Cancel & Restore
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleAdminConfirmBooking(booking.id)}
                                  className="px-3 py-1.5 bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
                                >
                                  Re-confirm
                                </button>
                              )}
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {/* TAB 2: HOTEL ROOM INVENTORY MANAGEMENT */}
              {activeTab === 'inventory' && (
                <div className="space-y-4">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Real-Time Hotel Room Inventory</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        When users book a stay, rooms decrement automatically (e.g. 6 → 5). You can also manually adjust allocations here.
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-blue-950 text-blue-400 border border-blue-800 text-xs font-bold rounded-xl">
                      {hotelsList.length} Stays Tracked
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {hotelsList.map(hotel => {
                      const avail = hotel.roomsAvailable || 0;
                      return (
                        <div
                          key={hotel.id}
                          className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={hotel.image}
                              alt={hotel.name}
                              className="w-14 h-14 rounded-xl object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <h5 className="text-xs font-bold text-white truncate">{hotel.name}</h5>
                              <p className="text-[11px] text-slate-400 truncate">{hotel.city}, {hotel.country}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                                  avail > 0 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                                }`}>
                                  {avail > 0 ? `${avail} Rooms Available` : 'Sold Out'}
                                </span>
                                <span className="text-[11px] text-slate-300 font-bold">
                                  {formatPrice(hotel.pricePerNight, currency)}/nt
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Inventory Stepper */}
                          <div className="flex items-center gap-1.5 shrink-0 bg-slate-900 p-1 rounded-xl border border-slate-800">
                            <button
                              type="button"
                              onClick={() => handleAdjustHotelInventory(hotel.id, -1)}
                              disabled={avail <= 0}
                              className="w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white rounded-lg text-xs font-bold cursor-pointer"
                              title="Decrease 1 room"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-mono font-bold text-xs text-white">
                              {avail}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleAdjustHotelInventory(hotel.id, 1)}
                              className="w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                              title="Increase 1 room"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: ADMIN SLOT SECURITY & PROFILE */}
              {activeTab === 'profile' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  
                  <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                        <Lock className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-white">Single Admin Slot Allocation</h4>
                        <p className="text-xs text-slate-400">Strict Enforcement Status: Active & Locked</p>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Slot Capacity:</span>
                        <span className="font-bold text-white">1 Admin Slot Max</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Slot Status:</span>
                        <span className="font-bold text-emerald-400">Claimed (1 of 1 Filled)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Public Registration:</span>
                        <span className="font-bold text-rose-400">Permanently Closed</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Account Owner:</span>
                        <span className="font-bold text-white">{activeAdmin.fullName}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Admin Email:</span>
                        <span className="font-bold text-blue-400">{activeAdmin.email}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-400">Account Initialized:</span>
                        <span className="font-bold text-slate-300">{new Date(activeAdmin.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
                      💡 <strong>Security Note:</strong> Since you have claimed the only slot, any other user visiting the website will only ever see the secure login prompt. No other person can sign up or overwrite your admin rights.
                    </p>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* FULL BOOKING DOSSIER MODAL */}
      {selectedBookingForDetail && (
        <div className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-blue-400 font-black uppercase tracking-wider">Booking Dossier</span>
                <h4 className="text-base font-black">{selectedBookingForDetail.bookingCode}</h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBookingForDetail(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Item:</span>
                <span className="font-bold text-right">{selectedBookingForDetail.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Customer Name:</span>
                <span className="font-bold">{selectedBookingForDetail.travelerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="font-bold text-blue-400">{selectedBookingForDetail.travelerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phone:</span>
                <span className="font-bold">{selectedBookingForDetail.travelerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Travel Dates:</span>
                <span className="font-bold">{selectedBookingForDetail.startDate} to {selectedBookingForDetail.endDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Guests:</span>
                <span className="font-bold">{selectedBookingForDetail.guests.adults} Adults, {selectedBookingForDetail.guests.children} Children</span>
              </div>
              {selectedBookingForDetail.customizationOptions?.roomsCount && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Rooms Booked:</span>
                  <span className="font-bold text-emerald-400">{selectedBookingForDetail.customizationOptions.roomsCount} Room(s)</span>
                </div>
              )}
              {selectedBookingForDetail.specialRequests && (
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                  <span className="text-slate-500 font-bold block mb-0.5">Special Requests:</span>
                  {selectedBookingForDetail.specialRequests}
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-black">
                <span>Total Amount:</span>
                <span className="text-emerald-400">{formatPrice(selectedBookingForDetail.totalPrice, currency)}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedBookingForDetail(null)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
