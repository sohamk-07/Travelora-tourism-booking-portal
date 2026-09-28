import React from 'react';
import { Shield, Headphones, Lock, RefreshCw, Award } from 'lucide-react';

export const ValuePropsRow: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        {/* 1. Best Price Guarantee */}
        <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs transition-colors">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 fill-amber-100 dark:fill-amber-900/40" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-tight">Best Price</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Guarantee</p>
          </div>
        </div>

        {/* 2. 24/7 Support */}
        <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs transition-colors">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-tight">24/7 Support</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">We are here</p>
          </div>
        </div>

        {/* 3. Secure Booking */}
        <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs transition-colors">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-tight">Secure Booking</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">100% safe</p>
          </div>
        </div>

        {/* 4. Easy Cancellation */}
        <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs transition-colors">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-tight">Easy Cancellation</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Hassle-free</p>
          </div>
        </div>

        {/* 5. Handpicked Hotels / Properties */}
        <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs col-span-2 md:col-span-1 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-tight">Handpicked Stays</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Top Rated</p>
          </div>
        </div>

      </div>
    </section>
  );
};
