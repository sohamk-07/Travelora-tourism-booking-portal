/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  Search, 
  Heart, 
  User, 
  CalendarCheck, 
  Database, 
  LogOut, 
  Menu, 
  X, 
  MapPin,
  Sparkles,
  Plane,
  ChevronDown,
  Sun,
  Moon,
  Camera,
  Home,
  Package,
  Hotel as HotelIcon,
  Star,
  LogIn,
  Upload
} from 'lucide-react';
import { ActiveTab, UserProfile, Currency } from '../types';
import { isSupabaseConfigured } from '../lib/supabase';
import { NotificationCenter } from './NotificationCenter';

const QUICK_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80'
];

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
  onOpenSupabaseConfig?: () => void;
  onOpenMap: () => void;
  onOpenBookNow: () => void;
  favoritesCount: number;
  bookingsCount: number;
  onOpenFavorites: () => void;
  onSearchClick: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onOpenProfile?: () => void;
  onOpenReviews?: () => void;
  onUpdateUser?: (updated: UserProfile) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  currentUser,
  onOpenAuth,
  onSignOut,
  onOpenSupabaseConfig,
  onOpenMap,
  onOpenBookNow,
  favoritesCount,
  bookingsCount,
  onOpenFavorites,
  onSearchClick,
  theme = 'light',
  onToggleTheme,
  onOpenProfile,
  onOpenReviews,
  onUpdateUser
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const isConnected = isSupabaseConfigured();

  const quickPhotoInputRef = useRef<HTMLInputElement>(null);

  const handleQuickPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const updated: UserProfile = currentUser ? {
          ...currentUser,
          avatarUrl: dataUrl
        } : {
          id: 'usr-guest-' + Math.random().toString(36).substring(2, 7),
          fullName: 'Traveler',
          email: 'traveler@travelora.com',
          avatarUrl: dataUrl,
          createdAt: new Date().toISOString()
        };
        if (onUpdateUser) onUpdateUser(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPresetAvatar = (url: string) => {
    const updated: UserProfile = currentUser ? {
      ...currentUser,
      avatarUrl: url
    } : {
      id: 'usr-guest-' + Math.random().toString(36).substring(2, 7),
      fullName: 'Traveler',
      email: 'traveler@travelora.com',
      avatarUrl: url,
      createdAt: new Date().toISOString()
    };
    if (onUpdateUser) onUpdateUser(updated);
  };

  // Close navigation menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleNav = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo - Matching the Travelora screenshot */}
          <button 
            id="nav-brand-logo"
            onClick={() => handleNav('home')} 
            className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-hidden cursor-pointer"
          >
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white shadow-md shadow-blue-500/25 transition-all group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-blue-500/30">
              <Compass className="w-5 h-5 text-white transition-transform group-hover:rotate-45" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-xs">
                <span className="text-[7px] text-amber-950 font-black">✦</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                Travel<span className="text-blue-600 dark:text-blue-400">ora</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase mt-1">
                Explore More. Worry Less.
              </span>
            </div>
          </button>

          {/* Right Header Utility Icons (Search, Heart, Theme, Currency, User, Book Now, Menu Toggle) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Search Icon - Opens Interactive Global Search */}
            <button
              id="nav-search-btn"
              onClick={onSearchClick}
              title="Search Destinations, Packages & Hotels"
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist / Heart */}
            <button
              id="nav-favorites-btn"
              onClick={onOpenFavorites}
              title="Saved Wishlist"
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-full transition-colors cursor-pointer"
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Real-time Booking Notifications Center */}
            <NotificationCenter
              userId={currentUser?.id}
              onNavigateToBooking={(_bookingId) => {
                handleNav('my-bookings');
              }}
            />

            {/* Theme Toggle Button (Light / Dark Mode) */}
            {onToggleTheme && (
              <button
                id="nav-theme-toggle-btn"
                onClick={onToggleTheme}
                title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                className="p-2 text-slate-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-700" />
                )}
              </button>
            )}

            {/* Currency Selector (₹ INR default / $ USD) */}
            <div className="relative">
              <button
                id="currency-selector-btn"
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 transition-colors cursor-pointer bg-slate-50/70 dark:bg-slate-800/80"
                title="Select Currency"
              >
                <span>{currency === 'INR' ? '₹ INR' : '$ USD'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {currencyDropdownOpen && (
                <div 
                  className="absolute right-0 mt-1 w-28 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setCurrencyDropdownOpen(false)}
                >
                  <button
                    onClick={() => { setCurrency('INR'); setCurrencyDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-bold flex items-center justify-between cursor-pointer ${
                      currency === 'INR' ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>₹ INR</span>
                    {currency === 'INR' && <span className="text-blue-600">✓</span>}
                  </button>
                  <button
                    onClick={() => { setCurrency('USD'); setCurrencyDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-bold flex items-center justify-between cursor-pointer ${
                      currency === 'USD' ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>$ USD</span>
                    {currency === 'USD' && <span className="text-blue-600">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* User Account / Uploaded Photo Icon Menu - Contains All Options & Review/Rating */}
            <div className="relative">
              <button
                id="user-profile-menu-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700 cursor-pointer shadow-xs group"
                title={currentUser ? `${currentUser.fullName} - Account & Navigation Menu` : 'Account & All Navigation Options'}
              >
                <div className="relative">
                  <img
                    src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                    alt={currentUser?.fullName || 'Traveler Profile'}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/80 group-hover:ring-blue-600 transition-all"
                  />
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${currentUser ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
              </button>

              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  {/* Hidden Photo File Input for Direct Upload */}
                  <input 
                    type="file" 
                    ref={quickPhotoInputRef} 
                    onChange={handleQuickPhotoUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />

                  {/* Profile Card Header with Direct Photo Upload */}
                  <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div 
                      className="relative group cursor-pointer" 
                      onClick={() => quickPhotoInputRef.current?.click()} 
                      title="Click to upload/change photo"
                    >
                      <img
                        src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=140&q=80'}
                        alt={currentUser?.fullName || 'Traveler'}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-500 shadow-md group-hover:opacity-90 transition-all"
                      />
                      <button
                        type="button"
                        className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors cursor-pointer"
                        title="Upload Photo"
                      >
                        <Camera className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-base font-black text-slate-900 dark:text-white truncate">
                          {currentUser?.fullName || 'Guest Traveler'}
                        </p>
                        <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full">
                          {currentUser?.role === 'admin' ? 'Admin' : 'Traveler'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {currentUser?.email || 'Customize your traveler profile'}
                      </p>
                      <button
                        type="button"
                        onClick={() => quickPhotoInputRef.current?.click()}
                        className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Change Photo</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Avatar Presets */}
                  <div className="py-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                      Choose Quick Avatar
                    </p>
                    <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
                      {QUICK_AVATARS.map((av, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectPresetAvatar(av)}
                          className={`relative rounded-full shrink-0 transition-transform hover:scale-110 cursor-pointer ${
                            currentUser?.avatarUrl === av ? 'ring-2 ring-blue-600 scale-105' : 'opacity-80 hover:opacity-100'
                          }`}
                          title="Select Avatar"
                        >
                          <img src={av} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Profile Edit & User Options */}
                  <div className="py-2.5 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (onOpenProfile) onOpenProfile();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <Camera className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span>Edit Profile, Photo & Info</span>
                      </span>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-extrabold uppercase">Edit →</span>
                    </button>

                    {/* Reviews & Ratings Option */}
                    {onOpenReviews && (
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenReviews();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                          <span>Reviews & Ratings</span>
                        </span>
                        <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 rounded-full text-[10px] font-black">
                          4.9 ★
                        </span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleNav('my-bookings');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <CalendarCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>My Trips & Bookings</span>
                      </span>
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full text-[10px] font-black">
                        {bookingsCount}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenFavorites();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <Heart className="w-4 h-4 text-rose-500" />
                        <span>Saved Wishlist</span>
                      </span>
                      <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300 rounded-full text-[10px] font-black">
                        {favoritesCount}
                      </span>
                    </button>

                    {currentUser?.role === 'admin' && onOpenSupabaseConfig && (
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenSupabaseConfig();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer transition-colors"
                      >
                        <Database className="w-4 h-4" />
                        <span>Supabase Database Status</span>
                      </button>
                    )}
                  </div>

                  {/* Footer: Sign Out / Sign In */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    {currentUser ? (
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onSignOut();
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenAuth();
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Sign In / Create Account</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Blue "Book Now" CTA Button - Matching Screenshot */}
            <button
              id="nav-book-now-btn"
              onClick={onOpenBookNow}
              className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-full shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Plane className="w-3.5 h-3.5" />
              <span>Book Now</span>
            </button>

            {/* Navigation Menu Toggle - Matching Image 2 */}
            <div className="relative">
              <button
                id="nav-menu-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                aria-label="Toggle Navigation Menu"
                title="Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Navigation Menu Dropdown - EXACTLY Matching Image 1 */}
              {mobileMenuOpen && (
                <>
                  {/* Backdrop Overlay to close on outside click */}
                  <div 
                    className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-2xs cursor-pointer" 
                    onClick={() => setMobileMenuOpen(false)}
                  />

                  {/* Dropdown Panel matching Image 1 */}
                  <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-[#070e1d] border border-slate-800/90 shadow-2xl rounded-2xl py-3 px-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[85vh] overflow-y-auto">
                    
                    {/* EXPLORE & BOOK Section */}
                    <div className="space-y-1">
                      <p className="px-3 pt-1 pb-1.5 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                        EXPLORE & BOOK
                      </p>

                      <button
                        onClick={() => handleNav('home')}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-3 transition-colors cursor-pointer ${
                          activeTab === 'home'
                            ? 'bg-[#132347] text-blue-400 font-bold'
                            : 'text-white hover:bg-[#132347]/60'
                        }`}
                      >
                        <Home className="w-4 h-4 text-blue-400" />
                        <span>Home</span>
                      </button>

                      <button
                        onClick={() => handleNav('destinations')}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-3 transition-colors cursor-pointer ${
                          activeTab === 'destinations'
                            ? 'bg-[#132347] text-blue-400 font-bold'
                            : 'text-white hover:bg-[#132347]/60'
                        }`}
                      >
                        <Compass className="w-4 h-4 text-amber-500" />
                        <span>Popular Destinations</span>
                      </button>

                      <button
                        onClick={() => handleNav('packages')}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-3 transition-colors cursor-pointer ${
                          activeTab === 'packages'
                            ? 'bg-[#132347] text-blue-400 font-bold'
                            : 'text-white hover:bg-[#132347]/60'
                        }`}
                      >
                        <Package className="w-4 h-4 text-emerald-400" />
                        <span>Holiday Packages</span>
                      </button>

                      <button
                        onClick={() => handleNav('hotels')}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-3 transition-colors cursor-pointer ${
                          activeTab === 'hotels'
                            ? 'bg-[#132347] text-blue-400 font-bold'
                            : 'text-white hover:bg-[#132347]/60'
                        }`}
                      >
                        <HotelIcon className="w-4 h-4 text-purple-400" />
                        <span>Hotels & Resorts</span>
                      </button>

                      <button
                        onClick={() => handleNav('flights')}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-3 transition-colors cursor-pointer ${
                          activeTab === 'flights'
                            ? 'bg-[#132347] text-blue-400 font-bold'
                            : 'text-white hover:bg-[#132347]/60'
                        }`}
                      >
                        <Plane className="w-4 h-4 text-cyan-400" />
                        <span>Flight Booking</span>
                      </button>

                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onOpenMap();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-3 text-white hover:bg-[#132347]/60 transition-colors cursor-pointer"
                      >
                        <MapPin className="w-4 h-4 text-rose-400" />
                        <span>Interactive Map Explorer</span>
                      </button>

                      <button
                        onClick={() => handleNav('my-bookings')}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          activeTab === 'my-bookings'
                            ? 'bg-[#132347] text-blue-400 font-bold'
                            : 'text-white hover:bg-[#132347]/60'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <CalendarCheck className="w-4 h-4 text-blue-400" />
                          <span>My Trips & Bookings</span>
                        </span>
                        <span className="px-2 py-0.5 bg-[#172b5c] text-blue-300 text-xs font-black rounded-full min-w-5 text-center">
                          {bookingsCount}
                        </span>
                      </button>

                      {onOpenReviews && (
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            onOpenReviews();
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold flex items-center justify-between text-white hover:bg-[#132347]/60 transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-3">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span>Reviews & Ratings</span>
                          </span>
                          <span className="px-2.5 py-0.5 bg-[#3a2505] text-amber-400 border border-amber-800/60 text-[11px] font-black rounded-full shadow-xs">
                            4.9 ★ Write
                          </span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onOpenFavorites();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold flex items-center justify-between text-white hover:bg-[#132347]/60 transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-3">
                          <Heart className="w-4 h-4 text-rose-400" />
                          <span>Saved Wishlist</span>
                        </span>
                        <span className="px-2 py-0.5 bg-rose-600 text-white text-xs font-black rounded-full min-w-5 text-center">
                          {favoritesCount}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onSearchClick();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-3 text-white hover:bg-[#132347]/60 transition-colors cursor-pointer"
                      >
                        <Search className="w-4 h-4 text-blue-400" />
                        <span>Search Destinations & Deals</span>
                      </button>
                    </div>

                    {/* PREFERENCES Section */}
                    <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
                      <p className="px-3 pb-1 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                        PREFERENCES
                      </p>

                      {onToggleTheme && (
                        <button
                          onClick={onToggleTheme}
                          className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold flex items-center justify-between text-white hover:bg-[#132347]/60 transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-3">
                            <Sun className="w-4 h-4 text-amber-400" />
                            <span>Theme</span>
                          </span>
                          <span className="text-xs font-black text-slate-400 tracking-wider uppercase">
                            {theme === 'dark' ? 'DARK' : 'LIGHT'}
                          </span>
                        </button>
                      )}

                      <div className="flex items-center justify-between px-3 py-1.5 rounded-xl text-sm font-bold text-white">
                        <span>Currency</span>
                        <div className="flex items-center bg-[#0f172a] p-1 rounded-xl border border-slate-800 gap-1">
                          <button
                            type="button"
                            onClick={() => setCurrency('INR')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                              currency === 'INR' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            ₹ INR
                          </button>
                          <button
                            type="button"
                            onClick={() => setCurrency('USD')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                              currency === 'USD' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            $ USD
                          </button>
                        </div>
                      </div>

                      {currentUser?.role === 'admin' && onOpenSupabaseConfig && (
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            onOpenSupabaseConfig();
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-emerald-400 hover:bg-[#132347]/60 flex items-center gap-2.5 cursor-pointer"
                        >
                          <Database className="w-4 h-4 text-emerald-400" />
                          <span>Supabase Database Status</span>
                        </button>
                      )}
                    </div>

                    {/* Account / User Section */}
                    <div className="mt-3 pt-3 border-t border-slate-800/80 px-2">
                      {currentUser ? (
                        <div className="space-y-1">
                          <div className="px-2 py-1.5 flex items-center gap-2.5">
                            <img
                              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                              alt={currentUser.fullName}
                              className="w-7 h-7 rounded-full object-cover ring-1 ring-blue-500"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-white truncate">{currentUser.fullName}</p>
                              <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                            </div>
                          </div>
                          {onOpenProfile && (
                            <button
                              onClick={() => {
                                setMobileMenuOpen(false);
                                onOpenProfile();
                              }}
                              className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold text-purple-400 hover:bg-[#132347]/60 flex items-center gap-2 cursor-pointer"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span>Edit Profile & Photo</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setMobileMenuOpen(false);
                              onSignOut();
                            }}
                            className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold text-rose-400 hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            onOpenAuth();
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-blue-400 hover:bg-blue-950/50 flex items-center gap-2 cursor-pointer"
                        >
                          <LogIn className="w-4 h-4" />
                          <span>Sign In / Register</span>
                        </button>
                      )}
                    </div>

                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
