/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Check, 
  Camera, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Sparkles, 
  ShieldCheck,
  Image as ImageIcon
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

// Curated high-res aesthetic travel avatars
export const PRESET_AVATARS = [
  {
    id: 'avatar-1',
    label: 'Mountain Hiker',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'avatar-2',
    label: 'Backpacker',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'avatar-3',
    label: 'Beach Explorer',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'avatar-4',
    label: 'Urban Nomad',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'avatar-5',
    label: 'Photographer',
    url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'avatar-6',
    label: 'Road Tripper',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'avatar-7',
    label: 'Safari Guide',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'avatar-8',
    label: 'Luxury Traveler',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80'
  }
];

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser
}) => {
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [city, setCity] = useState(currentUser.city || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || PRESET_AVATARS[0].url);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showUrlField, setShowUrlField] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle local file upload (converts to data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFileError('File size exceeds 5MB. Please choose a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyCustomUrl = () => {
    if (customUrlInput.trim()) {
      setAvatarUrl(customUrlInput.trim());
      setCustomUrlInput('');
      setShowUrlField(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...currentUser,
      fullName: fullName.trim() || currentUser.fullName,
      phone: phone.trim() || undefined,
      city: city.trim() || undefined,
      avatarUrl: avatarUrl
    };

    // Save to localStorage for persistence
    localStorage.setItem('travelora_current_user', JSON.stringify(updated));
    onUpdateUser(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 dark:bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Edit Profile & Avatar</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Update your photo and traveler details</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Active Avatar Preview & Upload Action */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
            <div className="relative group shrink-0">
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-500/30 dark:ring-blue-500/50 shadow-md"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                title="Upload Photo"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white">Profile Photo</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Upload your picture or pick from travel avatars below.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowUrlField(!showUrlField)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Image URL</span>
                </button>
              </div>

              {fileError && (
                <p className="text-xs text-rose-500 font-semibold mt-1">
                  {fileError}
                </p>
              )}
            </div>
          </div>

          {/* Optional Web URL Input */}
          {showUrlField && (
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex gap-2">
              <input
                type="url"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                placeholder="Paste public image link (https://...)"
                className="flex-1 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-1.5 rounded-lg text-xs outline-none border border-slate-300 dark:border-slate-700"
              />
              <button
                type="button"
                onClick={handleApplyCustomUrl}
                className="px-3 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                Apply
              </button>
            </div>
          )}

          {/* Preset Travel Avatars Grid */}
          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Select Preset Traveler Avatar
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {PRESET_AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setAvatarUrl(av.url)}
                  title={av.label}
                  className={`relative group rounded-full overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                    avatarUrl === av.url
                      ? 'border-blue-600 ring-2 ring-blue-500/40 scale-105'
                      : 'border-transparent hover:border-blue-400 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={av.url}
                    alt={av.label}
                    className="w-full h-full object-cover"
                  />
                  {avatarUrl === av.url && (
                    <div className="absolute inset-0 bg-blue-600/40 flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Traveler Details Fields */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-800 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-800 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Home City
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Mumbai, Delhi, Pune..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saveSuccess}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/30 cursor-pointer"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
