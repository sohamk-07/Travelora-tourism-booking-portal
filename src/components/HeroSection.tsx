/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, Star } from 'lucide-react';

interface HeroSectionProps {
  onExploreDestinations: () => void;
  onViewPackages: () => void;
  onExploreHotels: () => void;
  onOpenReviews?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreDestinations,
  onViewPackages,
  onExploreHotels,
  onOpenReviews
}) => {
  return (
    <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Background Image: Backpacker traveler overlooking turquoise mountain lake with hot air balloons */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85"
          alt="Explore The Tour and Create Memories"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.80] contrast-[1.05]"
        />
        {/* Soft vignette gradients to make the white text crisp and legible */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-900/35 to-slate-950/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />
      </div>

      {/* Decorative Floating Hot Air Balloons */}
      <div className="hidden md:block absolute top-16 right-[24%] z-10 opacity-85 pointer-events-none transition-transform hover:scale-110">
        <span className="text-4xl filter drop-shadow-lg">🎈</span>
      </div>
      <div className="hidden md:block absolute top-28 right-[38%] z-10 opacity-70 scale-75 pointer-events-none">
        <span className="text-3xl filter drop-shadow-md">🎈</span>
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="max-w-3xl text-white space-y-6">
          
          {/* Playful Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-blue-100 shadow-sm">
            <span className="text-amber-400">✈</span>
            <span>Journey Through Incredible India</span>
          </div>

          {/* Main Headline - Exact Typography from Screenshot */}
          <div className="relative">
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black tracking-tight text-white leading-[1.1]">
              Explore The Tour <br />
              Create <span className="italic font-serif text-amber-400 relative inline-block">
                Memories
                {/* Curved airplane doodle flight path matching screenshot */}
                <svg className="absolute -top-7 -right-12 w-20 h-14 text-blue-300 opacity-90 hidden sm:block pointer-events-none" viewBox="0 0 100 60" fill="none">
                  <path d="M10 45 C 30 10, 60 10, 85 25" stroke="currentColor" strokeWidth="2.2" strokeDasharray="4 4" strokeLinecap="round" />
                  <polygon points="85,25 78,20 81,28" fill="currentColor" />
                </svg>
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-100 max-w-2xl font-normal leading-relaxed text-shadow">
            Discover amazing places at exclusive prices and unforgettable experiences.
          </p>

          {/* CTA Buttons - Styled after the screenshot */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              id="hero-explore-destinations-btn"
              onClick={onExploreDestinations}
              className="flex items-center gap-2.5 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-sm sm:text-base rounded-full shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <span>Explore Destinations</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-view-packages-btn"
              onClick={onViewPackages}
              className="px-7 py-3.5 bg-white/95 hover:bg-white active:scale-95 text-slate-900 font-extrabold text-sm sm:text-base rounded-full shadow-md backdrop-blur-xs transition-all cursor-pointer"
            >
              View Packages
            </button>

            <button
              id="hero-view-hotels-btn"
              onClick={onExploreHotels}
              className="px-6 py-3.5 bg-slate-900/60 hover:bg-slate-900/80 active:scale-95 border border-white/20 text-white font-bold text-sm sm:text-base rounded-full backdrop-blur-xs transition-all cursor-pointer"
            >
              🏨 Luxury Hotels
            </button>
          </div>

          {/* Social Proof Avatars - Exactly matching the screenshot */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <div className="flex -space-x-2 overflow-hidden">
              <img
                className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Traveler 1"
              />
              <img
                className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                alt="Traveler 2"
              />
              <img
                className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                alt="Traveler 3"
              />
              <img
                className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                alt="Traveler 4"
              />
            </div>

            <button
              type="button"
              onClick={onOpenReviews}
              className="text-left cursor-pointer hover:opacity-90 transition-opacity focus:outline-hidden"
              title="View Verified Traveler Reviews & Ratings"
            >
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1 text-xs font-bold text-white">4.9 / 5.0</span>
              </div>
              <p className="text-slate-200 text-xs font-medium mt-0.5">
                Trusted by <span className="text-white font-bold underline decoration-amber-400">250,000+</span> happy travelers (Reviews & Ratings)
              </p>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
