/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ArrowRight, 
  Sparkles,
  Camera,
  Upload
} from 'lucide-react';
import { UserProfile } from '../types';
import { signInUser, signUpUser, signInDemoUser } from '../lib/supabase';
import { PRESET_AVATARS } from './ProfileEditModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'signin'
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(PRESET_AVATARS[0].url);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const signupFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      if (mode === 'signup') {
        const result = await signUpUser(email, password, fullName, phone, avatarUrl);
        if (result.error || !result.user) {
          setErrorMsg(result.error || 'Registration failed');
          return;
        }
        onAuthSuccess(result.user);
        onClose();
      } else {
        const result = await signInUser(email, password);
        if (result.error || !result.user) {
          setErrorMsg(result.error || 'Sign in failed');
          return;
        }
        onAuthSuccess(result.user);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (type: 'traveler' | 'investor') => {
    try {
      const user = signInDemoUser(type);
      onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Demo sign-in failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 dark:bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden my-auto flex flex-col transition-colors">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div>
            <span className="text-[11px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {mode === 'signin' ? 'Sign in to Travelora' : 'Join Travelora'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Quick Demo Buttons */}
          <div className="p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              ⚡ Instant 1-Click Demo Login
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('traveler')}
                className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg shadow-2xs hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors text-left cursor-pointer"
              >
                🎒 Rohan (Traveler)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('investor')}
                className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg shadow-2xs hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors text-left cursor-pointer"
              >
                💼 Ananya (Explorer)
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-700 dark:text-rose-300 font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <>
                {/* Profile Photo Option on Sign Up */}
                <div className="p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                      Profile Avatar / Photo
                    </label>
                    <button
                      type="button"
                      onClick={() => signupFileInputRef.current?.click()}
                      className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload Device Photo</span>
                    </button>
                    <input
                      type="file"
                      ref={signupFileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={avatarUrl}
                      alt="Selected avatar"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500 shrink-0"
                    />
                    <div className="flex-1 flex gap-1.5 overflow-x-auto py-1 no-scrollbar">
                      {PRESET_AVATARS.slice(0, 5).map((av) => (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => setAvatarUrl(av.url)}
                          className={`w-8 h-8 rounded-full overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                            avatarUrl === av.url ? 'border-blue-600 scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <span>Authenticating with Supabase...</span>
              ) : mode === 'signin' ? (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Create Account with Photo</span>
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <div className="text-center pt-2">
            {mode === 'signin' ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMsg('');
                  }}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMsg('');
                  }}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
