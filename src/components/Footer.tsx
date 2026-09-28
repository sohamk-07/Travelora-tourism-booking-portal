/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Compass, 
  MapPin, 
  Phone, 
  Mail, 
  Heart, 
  Database, 
  CheckCircle2,
  Globe,
  Plane,
  ShieldCheck
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

interface FooterProps {
  onOpenSupabaseConfig?: () => void;
  isAdmin?: boolean;
  onNavigateToCategory: (cat: string) => void;
  onNavigateToSection: (sectionId: string) => void;
  onOpenAdminPortal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSupabaseConfig,
  isAdmin,
  onNavigateToCategory,
  onNavigateToSection,
  onOpenAdminPortal
}) => {
  const isConnected = isSupabaseConfigured();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                <Plane className="w-5 h-5 -rotate-45" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Travelora<span className="text-blue-500">.</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Explore More. Worry Less. India’s premier tourist travel portal & luxury holiday marketplace, powered by Supabase for reliable cloud sync, secure booking, and transparent INR currency pricing.
            </p>

            {isAdmin && onOpenSupabaseConfig && (
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={onOpenSupabaseConfig}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                    isConnected 
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800 hover:bg-emerald-900/60' 
                      : 'bg-blue-950/60 text-blue-300 border-blue-800 hover:bg-blue-900/60'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Supabase: {isConnected ? 'Connected' : 'Local Mode (Click to setup)'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Col 2: Incredible India Destinations */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Incredible India</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <button onClick={() => onNavigateToSection('destinations')} className="hover:text-blue-400 transition-colors cursor-pointer">
                  🏔️ Kashmir & Gulmarg
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateToSection('destinations')} className="hover:text-blue-400 transition-colors cursor-pointer">
                  🏖️ Goa Beaches & Scuba
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateToSection('destinations')} className="hover:text-blue-400 transition-colors cursor-pointer">
                  🌴 Kerala Backwaters
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateToSection('destinations')} className="hover:text-blue-400 transition-colors cursor-pointer">
                  🏰 Royal Jaipur & Udaipur
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateToSection('destinations')} className="hover:text-blue-400 transition-colors cursor-pointer">
                  🏍️ Ladakh High Mountain Passes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateToSection('destinations')} className="hover:text-blue-400 transition-colors cursor-pointer">
                  🏝️ Andaman & Nicobar Atolls
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Holiday Packages */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Holiday Packages</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <button onClick={() => onNavigateToSection('packages')} className="hover:text-blue-400 transition-colors cursor-pointer">
                  ✈️ Flights & Hotel Combos
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateToSection('packages')} className="hover:text-blue-400 transition-colors cursor-pointer">
                  💍 Honeymoon Specials
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateToSection('packages')} className="hover:text-blue-400 transition-colors cursor-pointer">
                  👨‍👩‍👧‍👦 Family Vacation Deals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateToSection('packages')} className="hover:text-blue-400 transition-colors cursor-pointer">
                  🏰 Golden Triangle Circuit
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateToSection('hotels')} className="hover:text-blue-400 transition-colors cursor-pointer">
                  🏨 5★ Heritage Palaces & Resorts
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Indian Office */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Contact & Support</h4>
            <div className="space-y-2.5 text-xs text-slate-400 font-medium">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Travelora Tower, Barakhamba Road, Connaught Place, New Delhi 110001, India</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+91 98765 43210 / +91 (11) 4567 8900</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>support@travelora.in</span>
              </p>
              <div className="pt-2">
                <span className="inline-block px-2.5 py-1 bg-blue-900/60 text-blue-300 text-[10px] font-bold rounded-md">
                  🇮🇳 Indian Rupee (₹) Pricing Guaranteed
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Travelora Travel Technologies Pvt Ltd. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Cancellation Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Sitemap</span>
            <div className="h-3 w-px bg-slate-800 hidden sm:block" />
            <button
              onClick={onOpenAdminPortal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-amber-400 border border-slate-800 transition-colors cursor-pointer font-medium"
              title="Restricted Staff & Master Admin Login / Setup"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Admin Access</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
