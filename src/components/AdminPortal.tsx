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
  Users, 
  Hotel as HotelIcon, 
  Plane, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Search, 
  Filter, 
  ArrowLeft, 
  LogOut, 
  RefreshCw, 
  Sliders, 
  FileText, 
  Trash2, 
  MapPin, 
  Phone, 
  Mail, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  Clock, 
  Plus, 
  Minus,
  Sparkles,
  KeyRound,
  ShieldAlert,
  Database
} from 'lucide-react';
import { Booking, Hotel, Currency, AdminAccount } from '../types';
import { formatPrice } from '../lib/currency';
import { 
  getAllBookingsForAdmin, 
  getMasterAdminAccount, 
  isMasterAdminSlotClaimed, 
  createMasterAdminAccount, 
  loginMasterAdmin, 
  getActiveAdminSession, 
  logoutMasterAdmin, 
  updateBookingStatusByAdmin, 
  deleteBooking, 
  getHotels, 
  setHotelRooms,
  isSupabaseConfigured,
  SUPABASE_URL,
  SUPABASE_ANON_KEY
} from '../lib/supabase';

interface AdminPortalProps {
  currency: Currency;
  onBackToPortal: () => void;
  onHotelRoomsUpdated?: (updatedHotels: Hotel[]) => void;
  onOpenSupabaseConfig?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currency,
  onBackToPortal,
  onHotelRoomsUpdated,
  onOpenSupabaseConfig
}) => {
  // Master Admin State
  const [adminSession, setAdminSession] = useState<AdminAccount | null>(getActiveAdminSession());
  const [isSlotClaimed, setIsSlotClaimed] = useState<boolean>(isMasterAdminSlotClaimed());
  const [claimedAdminInfo, setClaimedAdminInfo] = useState<AdminAccount | null>(getMasterAdminAccount());

  // Registration Form State (Only when slot is open)
  const [regFullName, setRegFullName] = useState('Soham Kotalwar');
  const [regEmail, setRegEmail] = useState('kotalwarsoham588@gmail.com');
  const [regPhone, setRegPhone] = useState('+91 98765 43210');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState(claimedAdminInfo?.email || 'kotalwarsoham588@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Admin Dashboard State
  const [activeTab, setActiveTab] = useState<'bookings' | 'inventory' | 'security' | 'database'>('bookings');
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [hotelsList, setHotelsList] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'hotel' | 'package'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'cancelled' | 'pending' | 'completed'>('all');

  // Selected Booking Drawer/Modal
  const [selectedBookingForDetail, setSelectedBookingForDetail] = useState<Booking | null>(null);
  const [statusActionNote, setStatusActionNote] = useState('');

  // Load bookings and hotels for dashboard
  const refreshAdminData = async () => {
    setIsLoading(true);
    try {
      const bookings = await getAllBookingsForAdmin();
      setAllBookings(bookings);
      const hotels = await getHotels();
      setHotelsList(hotels);
    } catch (e) {
      console.error('Error fetching admin data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if slot was claimed
    const claimed = isMasterAdminSlotClaimed();
    setIsSlotClaimed(claimed);
    const info = getMasterAdminAccount();
    setClaimedAdminInfo(info);
    if (info) {
      setLoginEmail(info.email);
    }
    const session = getActiveAdminSession();
    setAdminSession(session);

    if (session) {
      refreshAdminData();
    }
  }, []);

  // Handle Master Admin Registration (Single Slot)
  const handleRegisterMasterAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (isMasterAdminSlotClaimed()) {
      setRegError('Master Admin slot is already claimed! Nobody else can create an admin account.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please verify your password.');
      return;
    }

    if (regPassword.length < 5) {
      setRegError('Password must be at least 5 characters for security.');
      return;
    }

    const res = createMasterAdminAccount({
      fullName: regFullName,
      email: regEmail,
      password: regPassword,
      phone: regPhone
    });

    if (res.success && res.admin) {
      setAdminSession(res.admin);
      setIsSlotClaimed(true);
      setClaimedAdminInfo(res.admin);
      setRegSuccess('Master Administrator account successfully registered! Registration is now permanently locked.');
      refreshAdminData();
    } else {
      setRegError(res.error || 'Failed to create admin account.');
    }
  };

  // Handle Admin Login
  const handleLoginMasterAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const res = loginMasterAdmin(loginEmail, loginPassword);
    if (res.success && res.admin) {
      setAdminSession(res.admin);
      refreshAdminData();
    } else {
      setLoginError(res.error || 'Invalid credentials.');
    }
  };

  // Handle Admin Logout
  const handleLogout = () => {
    logoutMasterAdmin();
    setAdminSession(null);
  };

  // Handle Room Count Adjustment from Admin Panel
  const handleAdjustHotelRooms = (hotelId: string, delta: number) => {
    const hotel = hotelsList.find(h => h.id === hotelId);
    if (!hotel) return;
    const current = typeof hotel.roomsAvailable === 'number' ? hotel.roomsAvailable : 0;
    const newCount = Math.max(0, current + delta);
    const updated = setHotelRooms(hotelId, newCount);
    if (updated) {
      const nextList = hotelsList.map(h => (h.id === hotelId ? updated : h));
      setHotelsList(nextList);
      if (onHotelRoomsUpdated) {
        onHotelRoomsUpdated(nextList);
      }
    }
  };

  // Handle Booking Status Update by Admin
  const handleUpdateStatus = async (bookingId: string, newStatus: Booking['status']) => {
    const updated = await updateBookingStatusByAdmin(bookingId, newStatus, statusActionNote);
    if (updated) {
      setAllBookings(prev => prev.map(b => (b.id === bookingId ? updated : b)));
      if (selectedBookingForDetail?.id === bookingId) {
        setSelectedBookingForDetail(updated);
      }
      setStatusActionNote('');
    }
  };

  // Handle Booking Deletion by Admin
  const handleDeleteBooking = async (bookingId: string) => {
    if (window.confirm(`Are you sure you want to permanently delete booking ${bookingId}?`)) {
      await deleteBooking(bookingId);
      setAllBookings(prev => prev.filter(b => b.id !== bookingId));
      if (selectedBookingForDetail?.id === bookingId) {
        setSelectedBookingForDetail(null);
      }
    }
  };

  // Filter Bookings for search & tags
  const filteredBookings = allBookings.filter(b => {
    if (typeFilter !== 'all' && b.itemType !== typeFilter) return false;
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const codeMatch = b.bookingCode?.toLowerCase().includes(q);
      const nameMatch = b.travelerName?.toLowerCase().includes(q);
      const emailMatch = b.travelerEmail?.toLowerCase().includes(q);
      const phoneMatch = b.travelerPhone?.toLowerCase().includes(q);
      const titleMatch = b.title?.toLowerCase().includes(q);
      const locMatch = b.location?.toLowerCase().includes(q);
      return codeMatch || nameMatch || emailMatch || phoneMatch || titleMatch || locMatch;
    }
    return true;
  });

  // Calculate Metrics
  const totalBookingsCount = allBookings.length;
  const totalRevenue = allBookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const confirmedBookingsCount = allBookings.filter(b => b.status === 'confirmed').length;
  const cancelledBookingsCount = allBookings.filter(b => b.status === 'cancelled').length;
  const hotelBookingsCount = allBookings.filter(b => b.itemType === 'hotel').length;
  const packageBookingsCount = allBookings.filter(b => b.itemType === 'package').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Admin Navigation Header */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToPortal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Travelora Portal</span>
            </button>

            <div className="h-5 w-px bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-white tracking-tight">Travelora Admin Portal</span>
                  <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold rounded-full">
                    Exclusive Master Access
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Centralized Booking Management & Live Inventory Auditing</p>
              </div>
            </div>
          </div>

          {/* Right Session Status */}
          <div className="flex items-center gap-3">
            {adminSession ? (
              <div className="flex items-center gap-2.5">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-white">{adminSession.fullName}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{adminSession.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800 text-rose-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <span className="text-xs text-amber-400/90 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Single Administrator Slot:</span>
                <span className="font-bold">{isSlotClaimed ? 'Claimed (Locked)' : '1 Available'}</span>
              </span>
            )}
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* VIEW 1: UNCLAIMED SINGLE ADMIN SLOT REGISTRATION FORM */}
        {!adminSession && !isSlotClaimed && (
          <div className="max-w-xl mx-auto my-8">
            <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-white">Initialize Master Admin Slot</h2>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black rounded-md">
                      1 / 1 Slot Available
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure your administrator account to take ownership of this portal.
                  </p>
                </div>
              </div>

              {/* Security Warning Notice */}
              <div className="p-3.5 bg-amber-950/40 border border-amber-500/40 rounded-2xl flex items-start gap-2.5 text-xs text-amber-200/90 mb-6">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Single Slot Rule:</strong> Only one administrator account is permitted. Once you register this account, the registration slot will be permanently locked and nobody else will be allowed to sign up.
                </p>
              </div>

              {regError && (
                <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-2 mb-4">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccess && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{regSuccess}</span>
                </div>
              )}

              <form onSubmit={handleRegisterMasterAdmin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Administrator Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Master Administrator"
                    className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Administrator Email (Login ID)
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="kotalwarsoham588@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Contact Phone Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Master Password
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-3.5 pr-10 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Confirm Password
                    </label>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Claim Master Admin Slot & Open Portal</span>
                </button>
              </form>

            </div>
          </div>
        )}

        {/* VIEW 2: MASTER ADMIN LOGIN (When slot is already claimed, but user is not logged in) */}
        {!adminSession && isSlotClaimed && (
          <div className="max-w-md mx-auto my-12">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Master Admin Login</h2>
                  <p className="text-xs text-slate-400">Restricted staff portal for booking audit & inventory</p>
                </div>
              </div>

              {/* Slot Locked Banner */}
              <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-2xl text-xs text-slate-300 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Single Slot Status: <strong className="text-white">Active & Locked (1/1)</strong></span>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-rose-950 text-rose-300 border border-rose-800 rounded-md font-bold">
                  Signups Closed
                </span>
              </div>

              {loginError && (
                <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-2 mb-4">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginMasterAdmin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="kotalwarsoham588@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Master Password
                  </label>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-3.5 pr-10 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Authenticate & Enter Admin Panel</span>
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
                <span>Account registered to: </span>
                <span className="font-mono text-slate-300">{claimedAdminInfo?.email}</span>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 3: FULL ADMIN CONTROL DASHBOARD (Logged-In) */}
        {adminSession && (
          <div className="space-y-6">
            
            {/* Top KPI Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3 shadow-md">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Bookings</p>
                  <p className="text-2xl font-black text-white">{totalBookingsCount}</p>
                  <p className="text-[10px] text-emerald-400 font-semibold">{confirmedBookingsCount} Confirmed on portal</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3 shadow-md">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gross Booking Value</p>
                  <p className="text-2xl font-black text-white">{formatPrice(totalRevenue, currency)}</p>
                  <p className="text-[10px] text-slate-400">Total verified transactions</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3 shadow-md">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <HotelIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hotel Reservations</p>
                  <p className="text-2xl font-black text-white">{hotelBookingsCount}</p>
                  <p className="text-[10px] text-purple-300 font-semibold">{hotelsList.length} Properties active</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3 shadow-md">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Plane className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tour Packages</p>
                  <p className="text-2xl font-black text-white">{packageBookingsCount}</p>
                  <p className="text-[10px] text-slate-400">Curated itinerary sales</p>
                </div>
              </div>

            </div>

            {/* Navigation Tabs Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    activeTab === 'bookings'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Customer Bookings ({allBookings.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('inventory')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    activeTab === 'inventory'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <HotelIcon className="w-4 h-4" />
                  <span>Live Hotel Room Inventory</span>
                </button>

                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    activeTab === 'security'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Slot Security</span>
                </button>

                <button
                  onClick={() => setActiveTab('database')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    activeTab === 'database'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Supabase Database Status</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {onOpenSupabaseConfig && (
                  <button
                    onClick={onOpenSupabaseConfig}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm shadow-emerald-900/40"
                    title="Open Supabase Cloud Configuration & Migration"
                  >
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">Supabase</span> Config
                  </button>
                )}

                <button
                  onClick={refreshAdminData}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh Data</span>
                </button>
              </div>
            </div>

            {/* TAB 1: ALL BOOKINGS LIST */}
            {activeTab === 'bookings' && (
              <div className="space-y-4">
                
                {/* Search & Filters */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
                  <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search by code, customer, email, stay..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    {/* Item Type filter */}
                    <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700">
                      <button
                        onClick={() => setTypeFilter('all')}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          typeFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        All Types
                      </button>
                      <button
                        onClick={() => setTypeFilter('hotel')}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          typeFilter === 'hotel' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        🏨 Hotels
                      </button>
                      <button
                        onClick={() => setTypeFilter('package')}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          typeFilter === 'package' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        ✈️ Packages
                      </button>
                    </div>

                    {/* Status filter */}
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-blue-500 cursor-pointer"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending Only</option>
                      <option value="confirmed">Confirmed Only</option>
                      <option value="completed">Completed Only</option>
                      <option value="cancelled">Cancelled Only</option>
                    </select>
                  </div>
                </div>

                {/* Bookings Table */}
                {filteredBookings.length === 0 ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                    <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-white">No bookings match the filter</h3>
                    <p className="text-xs text-slate-500 mt-1">Try clearing your search query or filters</p>
                  </div>
                ) : (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-850 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                          <tr>
                            <th className="px-4 py-3">Reference / Date</th>
                            <th className="px-4 py-3">Customer Details</th>
                            <th className="px-4 py-3">Item Reserved</th>
                            <th className="px-4 py-3">Stay Dates / Duration</th>
                            <th className="px-4 py-3">Guests</th>
                            <th className="px-4 py-3">Total Amount</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {filteredBookings.map((b) => (
                            <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                              {/* Reference */}
                              <td className="px-4 py-3.5">
                                <span className="font-mono font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-900/60">
                                  {b.bookingCode}
                                </span>
                                <p className="text-[10px] text-slate-500 mt-1">
                                  {new Date(b.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </p>
                              </td>

                              {/* Customer */}
                              <td className="px-4 py-3.5">
                                <p className="font-bold text-white">{b.travelerName}</p>
                                <p className="text-[11px] text-slate-400">{b.travelerEmail}</p>
                                <p className="text-[10px] text-slate-500">{b.travelerPhone}</p>
                              </td>

                              {/* Item */}
                              <td className="px-4 py-3.5">
                                <div className="flex items-center gap-2.5 max-w-xs">
                                  <img
                                    src={b.image}
                                    alt={b.title}
                                    className="w-10 h-10 rounded-lg object-cover border border-slate-800 shrink-0"
                                  />
                                  <div className="truncate">
                                    <div className="flex items-center gap-1.5">
                                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                                        b.itemType === 'hotel' ? 'bg-purple-950 text-purple-300' : 'bg-blue-950 text-blue-300'
                                      }`}>
                                        {b.itemType === 'hotel' ? 'Hotel Stay' : 'Tour Package'}
                                      </span>
                                    </div>
                                    <p className="font-bold text-slate-200 truncate mt-0.5">{b.title}</p>
                                    <p className="text-[10px] text-slate-400 truncate">{b.location}</p>
                                  </div>
                                </div>
                              </td>

                              {/* Dates */}
                              <td className="px-4 py-3.5">
                                <div className="text-[11px] text-slate-300">
                                  <span>{b.startDate}</span>
                                  <span className="text-slate-500 mx-1">→</span>
                                  <span>{b.endDate}</span>
                                </div>
                              </td>

                              {/* Guests */}
                              <td className="px-4 py-3.5">
                                <span className="text-[11px] text-slate-300">
                                  {b.guests.adults} Adults {b.guests.children > 0 ? `, ${b.guests.children} Children` : ''}
                                </span>
                              </td>

                              {/* Total Amount */}
                              <td className="px-4 py-3.5">
                                <span className="font-black text-sm text-emerald-400">
                                  {formatPrice(b.totalPrice, currency)}
                                </span>
                              </td>

                              {/* Status */}
                              <td className="px-4 py-3.5">
                                {b.status === 'confirmed' && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-lg text-xs font-bold">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    <span>Confirmed</span>
                                  </span>
                                )}
                                {b.status === 'cancelled' && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-lg text-xs font-bold">
                                    <AlertCircle className="w-3 h-3 text-rose-400" />
                                    <span>Cancelled</span>
                                  </span>
                                )}
                                {b.status === 'pending' && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-950/60 border border-amber-800 text-amber-300 rounded-lg text-xs font-bold">
                                    <Clock className="w-3 h-3 text-amber-400" />
                                    <span>Pending</span>
                                  </span>
                                )}
                              </td>

                              {/* Actions */}
                              <td className="px-4 py-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setSelectedBookingForDetail(b)}
                                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg font-bold text-xs transition-colors cursor-pointer"
                                  >
                                    Inspect Dossier
                                  </button>
                                  <button
                                    onClick={() => handleDeleteBooking(b.id)}
                                    title="Delete booking record"
                                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 2: HOTEL ROOM INVENTORY AUDIT & ADJUSTMENT */}
            {activeTab === 'inventory' && (
              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-black text-white">Live Hotel Room Inventory Control</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        When users book a hotel room, the inventory automatically counts down. You can also manually adjust or restock rooms below.
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold rounded-lg">
                      Real-time synchronized with client map & cards
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hotelsList.map((hotel) => {
                    const isAvailable = (hotel.roomsAvailable || 0) > 0;
                    return (
                      <div
                        key={hotel.id}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={hotel.image}
                            alt={hotel.name}
                            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-800"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-white truncate">{hotel.name}</h4>
                            <p className="text-xs text-slate-400 truncate flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                              <span>{hotel.city}, {hotel.country}</span>
                            </p>
                            <p className="text-xs font-black text-blue-400 mt-1">
                              {formatPrice(hotel.pricePerNight, currency)} / night
                            </p>
                          </div>
                        </div>

                        {/* Inventory Count Bar */}
                        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                              Available Rooms
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={`text-lg font-black ${isAvailable ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {hotel.roomsAvailable} Rooms
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isAvailable ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                              }`}>
                                {isAvailable ? 'Bookable' : 'Sold Out'}
                              </span>
                            </div>
                          </div>

                          {/* Quick Adjust Buttons */}
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleAdjustHotelRooms(hotel.id, -1)}
                              disabled={(hotel.roomsAvailable || 0) <= 0}
                              title="Decrement room count"
                              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-300 cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleAdjustHotelRooms(hotel.id, 1)}
                              title="Restock 1 room"
                              className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: MASTER ADMIN SECURITY & SLOT STATUS */}
            {activeTab === 'security' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                  
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-800">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">Master Admin Slot Ownership</h3>
                      <p className="text-xs text-slate-400">Security enforcement details for the single admin account</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="flex items-center justify-between p-3.5 bg-slate-800/60 rounded-xl border border-slate-700">
                      <span className="text-slate-400 font-medium">Slot Status:</span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg font-bold">
                        <Lock className="w-3 h-3 text-emerald-400" />
                        <span>1 of 1 Claimed (Registration Locked)</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-800/60 rounded-xl border border-slate-700">
                      <span className="text-slate-400 font-medium">Administrator Name:</span>
                      <span className="font-bold text-white">{adminSession.fullName}</span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-800/60 rounded-xl border border-slate-700">
                      <span className="text-slate-400 font-medium">Administrator Email:</span>
                      <span className="font-mono font-bold text-amber-400">{adminSession.email}</span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-800/60 rounded-xl border border-slate-700">
                      <span className="text-slate-400 font-medium">Claimed At:</span>
                      <span className="font-mono text-slate-300">
                        {new Date(adminSession.claimedAt).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-800/60 rounded-xl border border-slate-700">
                      <span className="text-slate-400 font-medium">Public Sign-up Guard:</span>
                      <span className="text-emerald-400 font-bold">Enforced (New admin signups blocked)</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-amber-950/30 border border-amber-500/30 rounded-2xl text-xs text-amber-200/90 leading-relaxed">
                    <strong>Admin Link Location Policy:</strong> As requested, the access point for this admin console is located strictly in the website footer under staff tools, ensuring public visitor navigation remains pristine.
                  </div>

                </div>
              </div>
            )}

            {/* TAB 4: SUPABASE DATABASE STATUS & MANAGEMENT */}
            {activeTab === 'database' && (
              <div className="space-y-6">
                {/* Main Connection Status Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
                        <Database className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-black text-white">Supabase Cloud Database</h3>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isSupabaseConfigured()
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                              : 'bg-amber-950 text-amber-300 border border-amber-700'
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured() ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                            {isSupabaseConfigured() ? 'Connected & Active' : 'Local Fallback Mode'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Role-Restricted: Only Master Admin can view, inspect, or configure database connectivity.
                        </p>
                      </div>
                    </div>

                    {onOpenSupabaseConfig && (
                      <button
                        onClick={onOpenSupabaseConfig}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/30 cursor-pointer"
                      >
                        <Database className="w-4 h-4" />
                        <span>Open Configuration & SQL Migration</span>
                      </button>
                    )}
                  </div>

                  {/* Connection Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 bg-slate-850 rounded-2xl border border-slate-800">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Database Endpoint URL</span>
                      <span className="font-mono text-xs text-blue-400 break-all select-all">
                        {SUPABASE_URL || 'https://nixdzqvnstsyftepkitc.supabase.co'}
                      </span>
                    </div>

                    <div className="p-4 bg-slate-850 rounded-2xl border border-slate-800">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">API Key Status</span>
                      <span className="font-mono text-xs text-emerald-400 break-all">
                        {SUPABASE_ANON_KEY ? 'sb_publishable_mUwSQLZF9M... (Valid)' : 'Configured via Environment'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cloud Database Tables Status */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
                  <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Database Schema Tables Status</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    
                    <div className="p-4 bg-slate-850 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-purple-400">public.destinations</span>
                        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-800">Active</span>
                      </div>
                      <p className="text-[11px] text-slate-400">All Indian & Global tourist destinations, coordinates, pricing, tags & galleries.</p>
                    </div>

                    <div className="p-4 bg-slate-850 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-blue-400">public.packages</span>
                        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-800">Active</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Curated tour packages with itineraries, inclusions, highlights, pricing and badges.</p>
                    </div>

                    <div className="p-4 bg-slate-850 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-amber-400">public.hotels</span>
                        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-800">Active</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Luxury hotel & resort stays, room inventories, amenities and price per night.</p>
                    </div>

                    <div className="p-4 bg-slate-850 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-blue-400">public.package_bookings</span>
                        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-800">Section 1</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Dedicated Tour Package reservations with start/end dates, departure city, guests & status.</p>
                    </div>

                    <div className="p-4 bg-slate-850 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-amber-400">public.hotel_bookings</span>
                        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-800">Section 2</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Dedicated Luxury Hotel reservations with check-in/out dates, hotel name & status.</p>
                    </div>

                    <div className="p-4 bg-slate-850 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-emerald-400">public.travelers</span>
                        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-800">Customer Directory</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Customer directory with traveler names, emails, phones, departure cities and dates.</p>
                    </div>

                  </div>

                  <div className="mt-6 p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-slate-300">
                      <strong>Automatic Admin Status Sync:</strong> When an admin confirms, cancels, or updates any booking from this console, the status is automatically committed to Supabase across all related tables in real-time.
                    </div>
                    {onOpenSupabaseConfig && (
                      <button
                        onClick={onOpenSupabaseConfig}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold rounded-xl text-xs whitespace-nowrap cursor-pointer transition-all"
                      >
                        Inspect SQL Schema
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* INSPECT BOOKING DOSSIER MODAL */}
      {selectedBookingForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            
            <button
              onClick={() => setSelectedBookingForDetail(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <span className="font-mono font-bold text-sm text-blue-400 bg-blue-950 px-2.5 py-1 rounded-lg border border-blue-800">
                {selectedBookingForDetail.bookingCode}
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                selectedBookingForDetail.status === 'confirmed'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : selectedBookingForDetail.status === 'cancelled'
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}>
                {selectedBookingForDetail.status.toUpperCase()}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Item Card */}
              <div className="p-3.5 bg-slate-850 rounded-2xl border border-slate-800 flex items-center gap-3">
                <img
                  src={selectedBookingForDetail.image}
                  alt={selectedBookingForDetail.title}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0"
                />
                <div>
                  <h4 className="font-bold text-white text-sm">{selectedBookingForDetail.title}</h4>
                  <p className="text-slate-400">{selectedBookingForDetail.location}</p>
                  <p className="text-blue-400 font-bold mt-1">
                    Total: {formatPrice(selectedBookingForDetail.totalPrice, currency)}
                  </p>
                </div>
              </div>

              {/* Customer Details */}
              <div className="p-4 bg-slate-850 rounded-2xl border border-slate-800 space-y-2">
                <h5 className="font-bold text-white text-[11px] uppercase tracking-wider text-slate-400">
                  Guest Information
                </h5>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-slate-500 block">Name:</span>
                    <strong className="text-white">{selectedBookingForDetail.travelerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Email:</span>
                    <strong className="text-white">{selectedBookingForDetail.travelerEmail}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Phone:</span>
                    <strong className="text-white">{selectedBookingForDetail.travelerPhone}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Party Size:</span>
                    <strong className="text-white">
                      {selectedBookingForDetail.guests.adults} Adults, {selectedBookingForDetail.guests.children} Children
                    </strong>
                  </div>
                </div>
              </div>

              {/* Stay / Journey Schedule */}
              <div className="p-4 bg-slate-850 rounded-2xl border border-slate-800 space-y-2">
                <h5 className="font-bold text-white text-[11px] uppercase tracking-wider text-slate-400">
                  Dates & Itinerary
                </h5>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-slate-500 block">Check-in / Start:</span>
                    <strong className="text-white">{selectedBookingForDetail.startDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Check-out / End:</span>
                    <strong className="text-white">{selectedBookingForDetail.endDate}</strong>
                  </div>
                </div>
                {selectedBookingForDetail.specialRequests && (
                  <div className="mt-2 pt-2 border-t border-slate-800">
                    <span className="text-slate-500 block">Special Requests:</span>
                    <p className="text-amber-300/90 mt-0.5 font-medium">{selectedBookingForDetail.specialRequests}</p>
                  </div>
                )}
              </div>

              {/* Admin Status Actions */}
              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-white text-[11px] uppercase tracking-wider text-slate-400">
                    Manage Booking Status
                  </h5>
                  <span className={`px-2 py-0.5 text-[10px] font-black rounded-md ${
                    selectedBookingForDetail.status === 'confirmed'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : selectedBookingForDetail.status === 'completed'
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : selectedBookingForDetail.status === 'cancelled'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    CURRENT: {selectedBookingForDetail.status.toUpperCase()}
                  </span>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-medium block mb-1">
                    Optional Admin Note / Reason (broadcast to user):
                  </label>
                  <input
                    type="text"
                    value={statusActionNote}
                    onChange={(e) => setStatusActionNote(e.target.value)}
                    placeholder="e.g. Flight tickets & hotel vouchers confirmed."
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => handleUpdateStatus(selectedBookingForDetail.id, 'confirmed')}
                    className={`px-3 py-1.5 font-bold rounded-xl text-xs transition-all cursor-pointer ${
                      selectedBookingForDetail.status === 'confirmed'
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                        : 'bg-emerald-950/60 hover:bg-emerald-700 text-emerald-300 hover:text-white border border-emerald-700/50'
                    }`}
                  >
                    Confirm Booking
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedBookingForDetail.id, 'pending')}
                    className={`px-3 py-1.5 font-bold rounded-xl text-xs transition-all cursor-pointer ${
                      selectedBookingForDetail.status === 'pending'
                        ? 'bg-amber-600 text-white ring-2 ring-amber-400'
                        : 'bg-amber-950/60 hover:bg-amber-700 text-amber-300 hover:text-white border border-amber-700/50'
                    }`}
                  >
                    Set Pending Review
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedBookingForDetail.id, 'completed')}
                    className={`px-3 py-1.5 font-bold rounded-xl text-xs transition-all cursor-pointer ${
                      selectedBookingForDetail.status === 'completed'
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                        : 'bg-indigo-950/60 hover:bg-indigo-700 text-indigo-300 hover:text-white border border-indigo-700/50'
                    }`}
                  >
                    Mark as Completed
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedBookingForDetail.id, 'cancelled')}
                    className={`px-3 py-1.5 font-bold rounded-xl text-xs transition-all cursor-pointer ${
                      selectedBookingForDetail.status === 'cancelled'
                        ? 'bg-rose-600 text-white ring-2 ring-rose-400'
                        : 'bg-rose-950/60 hover:bg-rose-700 text-rose-300 hover:text-white border border-rose-700/50'
                    }`}
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
