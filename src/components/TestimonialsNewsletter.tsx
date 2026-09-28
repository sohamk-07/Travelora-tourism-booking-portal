/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Star, Send, CheckCircle2, Plane, Quote, Mail } from 'lucide-react';

interface TestimonialsNewsletterProps {
  onOpenReviews?: () => void;
}

export const TestimonialsNewsletter: React.FC<TestimonialsNewsletterProps> = ({ onOpenReviews }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 4000);
    }
  };

  const testimonials = [
    {
      name: 'Rajesh Sharma',
      location: 'Mumbai, India',
      role: 'Family Holiday to Kashmir',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      quote: 'Travelora arranged our 6-day Kashmir trip flawlessly! The Gulmarg Gondola passes, Dal Lake houseboat, and private driver were top notch. Great pricing in rupees with zero hidden costs.'
    },
    {
      name: 'Priya Patel',
      location: 'Ahmedabad, India',
      role: 'Honeymoon in Kerala',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      quote: 'The Alleppey houseboat experience was dreamlike! Being able to customize dietary requests (Jain food for my family) and book seamlessly made this our best holiday ever.'
    },
    {
      name: 'Arjun Nambiar',
      location: 'Bengaluru, India',
      role: 'Ladakh High Pass Expedition',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      quote: 'Incredible customer support. When our flight was delayed, our local coordinator in Leh adjusted hotel pickup immediately. Transparent INR pricing and instant confirmation.'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        {/* Left 2 Cols: Testimonials */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                What Our Travelers Say
              </h2>
              <Plane className="w-5 h-5 text-blue-500 -rotate-12" />
            </div>

            {onOpenReviews && (
              <button
                type="button"
                onClick={onOpenReviews}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 border border-amber-200/80 dark:border-amber-800/80 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>Browse & Write Reviews (4.9 ★)</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {testimonials.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                    "{item.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20"
                  />
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">{item.name}</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-400">{item.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Newsletter */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
          {/* Subtle background circles */}
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>

            <h3 className="text-2xl font-black leading-tight">
              Get Exclusive Offers & Travel Inspiration
            </h3>

            <p className="text-xs text-blue-100 font-medium leading-relaxed">
              Subscribe to receive weekly flight flash sales, festival packages, and member-only coupons up to 30% OFF!
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="relative z-10 mt-6 space-y-3">
            {subscribed ? (
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl flex items-center gap-2 text-xs font-bold text-white animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Thank you! Welcome to the Travelora family. Check your inbox for your ₹1,500 welcome coupon.</span>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/15 backdrop-blur-md border border-white/25 rounded-xl text-xs sm:text-sm text-white placeholder-blue-200 focus:outline-hidden focus:bg-white/25 focus:border-white transition-all"
                />

                <button
                  type="submit"
                  className="w-full py-3 bg-white hover:bg-slate-100 active:scale-95 text-blue-800 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Subscribe Now</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            <p className="text-[10px] text-blue-200 text-center">
              No spam, ever. Unsubscribe with 1-click anytime.
            </p>
          </form>

        </div>

      </div>
    </section>
  );
};
