/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  X, 
  CheckCheck, 
  Trash2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { BookingNotification, BookingStatus } from '../types';
import { 
  getNotificationsSync, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  clearAllNotifications,
  deleteNotification 
} from '../lib/supabase';

interface NotificationCenterProps {
  userId?: string;
  onNavigateToBooking: (bookingId?: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  userId,
  onNavigateToBooking
}) => {
  const [notifications, setNotifications] = useState<BookingNotification[]>(() => getNotificationsSync(userId));
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const refreshNotifs = () => {
    setNotifications(getNotificationsSync(userId));
  };

  useEffect(() => {
    refreshNotifs();

    const handleNotifEvent = () => refreshNotifs();
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === 'travelora_notifications_db' || e.key === 'travelora_bookings_db') {
        refreshNotifs();
      }
    };

    window.addEventListener('travelora_notification_received', handleNotifEvent);
    window.addEventListener('travelora_notifications_updated', handleNotifEvent);
    window.addEventListener('travelora_booking_status_updated', handleNotifEvent);
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('travelora_notification_received', handleNotifEvent);
      window.removeEventListener('travelora_notifications_updated', handleNotifEvent);
      window.removeEventListener('travelora_booking_status_updated', handleNotifEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [userId]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = async (notif: BookingNotification) => {
    if (!notif.read) {
      await markNotificationAsRead(notif.id);
      refreshNotifs();
    }
    setIsOpen(false);
    onNavigateToBooking(notif.bookingId);
  };

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await markAllNotificationsAsRead(userId);
    refreshNotifs();
  };

  const handleClearAll = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await clearAllNotifications(userId);
    refreshNotifs();
  };

  const handleDeleteOne = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteNotification(id);
    refreshNotifs();
  };

  const formatTimeAgo = (isoDate: string) => {
    try {
      const diffMs = Date.now() - new Date(isoDate).getTime();
      const mins = Math.floor(diffMs / 60000);
      if (mins < 1) return 'Just now';
      if (mins < 60) return `${mins}m ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch {
      return 'Recently';
    }
  };

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'completed':
        return <Sparkles className="w-4 h-4 text-indigo-600" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        id="nav-notification-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Booking Status Notifications"
        className={`relative p-2 rounded-full transition-all cursor-pointer ${
          isOpen 
            ? 'bg-blue-50 text-blue-600' 
            : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
        }`}
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-amber-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 sm:right-auto sm:-left-32 md:-left-48 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          
          {/* Header */}
          <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 tracking-tight">Status Notifications</h4>
                <p className="text-[10px] text-slate-400">Live booking confirmation updates</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="px-2 py-1 text-[10px] font-bold text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3 h-3" />
                  <span>Mark read</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                  title="Clear all notifications"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* List of Notifications */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="py-8 px-4 text-center">
                <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Bell className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-700">No new notifications</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  When your booking status changes (pending, confirmed, completed, or cancelled), updates will appear here in real-time.
                </p>
              </div>
            ) : (
              notifications.map((notif) => {
                const isPending = notif.status === 'pending';
                const isConfirmed = notif.status === 'confirmed';
                const isCompleted = notif.status === 'completed';
                const isCancelled = notif.status === 'cancelled';

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-3.5 transition-colors cursor-pointer flex gap-3 items-start relative group ${
                      notif.read ? 'bg-white hover:bg-slate-50' : 'bg-blue-50/40 hover:bg-blue-50/70'
                    }`}
                  >
                    {/* Unread blue dot */}
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5 animate-pulse" />
                    )}

                    {/* Status Icon */}
                    <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${
                      isPending 
                        ? 'bg-amber-100' 
                        : isConfirmed 
                        ? 'bg-emerald-100' 
                        : isCompleted
                        ? 'bg-indigo-100'
                        : 'bg-rose-100'
                    }`}>
                      {getStatusIcon(notif.status)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-black text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {notif.bookingCode}
                        </span>
                        <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                          isPending 
                            ? 'bg-amber-100 text-amber-800' 
                            : isConfirmed 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : isCompleted
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {notif.status}
                        </span>
                      </div>

                      <h5 className="text-xs font-bold text-slate-900 mt-1 truncate">
                        {notif.title}
                      </h5>

                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                        {notif.message}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-1 text-[10px] text-slate-400">
                        <span>{formatTimeAgo(notif.createdAt)}</span>
                        <span className="text-blue-600 font-bold group-hover:underline flex items-center gap-0.5">
                          <span>View booking</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>

                    {/* Quick Delete Single Notification */}
                    <button
                      onClick={(e) => handleDeleteOne(e, notif.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity absolute top-2 right-2 cursor-pointer"
                      title="Dismiss notification"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                onNavigateToBooking();
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 py-1 px-3 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 mx-auto"
            >
              <span>Manage all reservations in My Trips</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
