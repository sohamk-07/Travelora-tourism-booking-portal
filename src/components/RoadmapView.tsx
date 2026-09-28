/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  MapPin, 
  Hotel as HotelIcon, 
  Utensils, 
  Car, 
  Clock, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Compass, 
  Star, 
  Coffee, 
  Camera, 
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { PackageRoadmapDay, DestinationRoadmapSpot, TourPackage, TouristDestination, Currency } from '../types';
import { getJourneyRoadmapForPackage, getExplorationRoadmapForDestination } from '../data/roadmapData';

interface PackageRoadmapProps {
  packageData: TourPackage;
  currency?: Currency;
  onSelectHotel?: (hotelName: string) => void;
  onExploreSpotOnMap?: (spotName: string) => void;
}

interface DestinationRoadmapProps {
  destinationData: TouristDestination;
  onExploreSpotOnMap?: (spotName: string) => void;
}

type RoadmapViewProps = 
  | { mode: 'package'; packageData: TourPackage; destinationData?: never; currency?: Currency; onSelectHotel?: (hotelName: string) => void; onExploreSpotOnMap?: (spotName: string) => void; }
  | { mode: 'destination'; destinationData: TouristDestination; packageData?: never; onExploreSpotOnMap?: (spotName: string) => void; currency?: Currency; };

export const RoadmapView: React.FC<RoadmapViewProps> = (props) => {
  if (props.mode === 'package') {
    return <PackageRoadmapComponent packageData={props.packageData} onSelectHotel={props.onSelectHotel} onExploreSpotOnMap={props.onExploreSpotOnMap} />;
  }
  return <DestinationRoadmapComponent destinationData={props.destinationData} onExploreSpotOnMap={props.onExploreSpotOnMap} />;
};

/**
 * PACKAGE JOURNEY ROADMAP COMPONENT
 * Answers user request: "in packages i have a small roadmap for what and how are cover destination hotel or restorent for stay all detail show in user"
 */
const PackageRoadmapComponent: React.FC<PackageRoadmapProps> = ({ packageData, onSelectHotel, onExploreSpotOnMap }) => {
  const roadmapDays: PackageRoadmapDay[] = packageData.roadmap && packageData.roadmap.length > 0
    ? packageData.roadmap
    : getJourneyRoadmapForPackage(packageData);

  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>(() => {
    // By default, keep all days expanded for clear scanning
    const initial: Record<number, boolean> = {};
    roadmapDays.forEach(d => { initial[d.day] = true; });
    return initial;
  });

  const toggleDay = (day: number) => {
    setExpandedDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const expandAll = () => {
    const all: Record<number, boolean> = {};
    roadmapDays.forEach(d => { all[d.day] = true; });
    setExpandedDays(all);
  };

  const collapseAll = () => {
    setExpandedDays({});
  };

  const visibleDays = selectedDay === 'all' 
    ? roadmapDays 
    : roadmapDays.filter(d => d.day === selectedDay);

  return (
    <div className="space-y-4">
      
      {/* Header and Summary Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-500/30 text-blue-300 rounded-lg backdrop-blur-xs">
                <Compass className="w-4 h-4" />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-blue-300">
                Complete Journey Roadmap
              </span>
            </div>
            <h3 className="text-lg font-black mt-1 text-white">
              {packageData.title}
            </h3>
            <p className="text-xs text-blue-100/80 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>📅 {packageData.duration}</span>
              <span>•</span>
              <span>🏨 {roadmapDays.length} Night Luxury Stays Covered</span>
              <span>•</span>
              <span>🍽️ Handpicked Dining & Meal Plans Included</span>
            </p>
          </div>

          {/* Quick Expand / Collapse controls */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={expandAll}
              className="px-2.5 py-1 text-[11px] font-bold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="px-2.5 py-1 text-[11px] font-bold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
            >
              Collapse
            </button>
          </div>
        </div>

        {/* Day Jump Selector Carousel */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => setSelectedDay('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedDay === 'all'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-white/10 text-blue-100 hover:bg-white/20'
            }`}
          >
            All Days ({roadmapDays.length})
          </button>
          {roadmapDays.map(d => (
            <button
              key={d.day}
              type="button"
              onClick={() => setSelectedDay(d.day)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                selectedDay === d.day
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-white/10 text-blue-100 hover:bg-white/20'
              }`}
            >
              <span>Day {d.day}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Days Timeline Flow */}
      <div className="relative pl-3 sm:pl-6 space-y-5 before:absolute before:left-[17px] sm:before:left-[29px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-indigo-400 before:to-emerald-500">
        {visibleDays.map((dayData) => {
          const isExpanded = expandedDays[dayData.day] ?? true;

          return (
            <div 
              key={dayData.day}
              className="relative pl-7 sm:pl-8 group"
            >
              {/* Day Milestone Badge on connector line */}
              <div className="absolute -left-[1px] sm:left-[11px] top-1.5 w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-md ring-4 ring-white z-10">
                D{dayData.day}
              </div>

              {/* Day Container Card */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden">
                
                {/* Day Header - Clickable for accordion */}
                <div 
                  onClick={() => toggleDay(dayData.day)}
                  className="p-4 sm:p-4.5 bg-slate-50/70 hover:bg-slate-100/70 cursor-pointer transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded-md uppercase tracking-wider">
                        Day {dayData.day}
                      </span>
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        <span>{dayData.destinationCovered}</span>
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 truncate">
                      {dayData.phaseTitle}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">
                      {isExpanded ? 'Hide details' : 'View stays & dining'}
                    </span>
                    <span className="p-1 rounded-lg bg-white border border-slate-200 text-slate-600">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </div>
                </div>

                {/* Day Details Body */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 space-y-4 text-xs">
                    
                    {/* 1. What Spots & Attractions Are Covered */}
                    <div className="bg-blue-50/50 rounded-xl p-3.5 border border-blue-100/80">
                      <div className="flex items-center gap-2 mb-2">
                        <Camera className="w-4 h-4 text-blue-600" />
                        <h5 className="font-black text-slate-900 uppercase tracking-wider text-[11px]">
                          What Sights & Spots You Explore
                        </h5>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {dayData.spotsCovered.map((spot, idx) => (
                          <div key={idx} className="bg-white p-2.5 rounded-lg border border-blue-100 shadow-2xs">
                            <p className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span>{spot.name}</span>
                            </p>
                            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                              {spot.description}
                            </p>
                            <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              <span>⭐ {spot.activityHighlight}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 2. Hotel & Stay Covered (Exact Answer to User Request) */}
                    <div className="bg-purple-50/50 rounded-xl p-3.5 border border-purple-100/80">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <HotelIcon className="w-4 h-4 text-purple-600" />
                          <h5 className="font-black text-slate-900 uppercase tracking-wider text-[11px]">
                            Hotel & Resort Arranged for Stay
                          </h5>
                        </div>
                        {dayData.stayHotel.starRating && (
                          <span className="flex items-center gap-0.5 text-amber-500 font-bold text-[11px]">
                            <Star className="w-3 h-3 fill-current" />
                            <span>{dayData.stayHotel.starRating}-Star Luxury Stay</span>
                          </span>
                        )}
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-purple-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="font-black text-slate-900 text-sm">
                            {dayData.stayHotel.name}
                          </p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-purple-500 shrink-0" />
                            <span>{dayData.stayHotel.location}</span>
                          </p>
                          <p className="text-[11px] font-bold text-purple-700 mt-1">
                            🛏️ Room: <span className="font-medium text-slate-800">{dayData.stayHotel.roomCategory}</span>
                          </p>
                        </div>

                        <div className="sm:text-right shrink-0">
                          <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-[11px] rounded-lg">
                            ✓ {dayData.stayHotel.mealPlan}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 3. Restaurant & Dining Experience */}
                    <div className="bg-amber-50/50 rounded-xl p-3.5 border border-amber-100/80">
                      <div className="flex items-center gap-2 mb-2">
                        <Utensils className="w-4 h-4 text-amber-600" />
                        <h5 className="font-black text-slate-900 uppercase tracking-wider text-[11px]">
                          Curated Restaurant & Food Experience
                        </h5>
                        <span className="ml-auto px-2 py-0.5 bg-amber-200/60 text-amber-900 font-bold text-[10px] rounded">
                          {dayData.diningExperience.mealType}
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-amber-100 shadow-2xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <p className="font-black text-slate-900 text-xs">
                            🍽️ {dayData.diningExperience.restaurantName}
                          </p>
                          <span className="text-[11px] font-semibold text-amber-700">
                            Cuisine: {dayData.diningExperience.cuisine}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-700 font-medium mt-1">
                          <span className="text-slate-500 font-normal">Featured Specialty:</span>{' '}
                          <strong className="text-slate-900">{dayData.diningExperience.specialtyDish}</strong>
                        </p>
                      </div>
                    </div>

                    {/* 4. How It's Covered / Transport Details */}
                    <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 text-slate-700">
                      <Car className="w-4 h-4 text-blue-600 shrink-0" />
                      <div className="flex-1">
                        <span className="font-bold text-slate-900">How You Travel: </span>
                        <span>{dayData.howCovered}</span>
                      </div>
                    </div>

                    {/* Day Highlights note */}
                    {dayData.highlights && (
                      <p className="text-[11px] text-slate-500 italic pl-1 border-l-2 border-indigo-400">
                        "{dayData.highlights}"
                      </p>
                    )}

                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

/**
 * DESTINATION EXPLORATION ROADMAP COMPONENT
 * Answers user request: "in destination user see which spots or place it explore in simple roadmap similarly all destinations"
 */
const DestinationRoadmapComponent: React.FC<DestinationRoadmapProps> = ({ destinationData, onExploreSpotOnMap }) => {
  const roadmapSpots: DestinationRoadmapSpot[] = destinationData.explorationRoadmap && destinationData.explorationRoadmap.length > 0
    ? destinationData.explorationRoadmap
    : getExplorationRoadmapForDestination(destinationData);

  const [activeStep, setActiveStep] = useState<number | 'all'>('all');

  const visibleSpots = activeStep === 'all'
    ? roadmapSpots
    : roadmapSpots.filter(s => s.step === activeStep);

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'monument':
        return { label: '🏰 Royal Heritage & Monument', bg: 'bg-amber-100 text-amber-800' };
      case 'nature':
        return { label: '🌲 Nature & Scenic', bg: 'bg-emerald-100 text-emerald-800' };
      case 'beach':
        return { label: '🏖️ Coastal Shoreline', bg: 'bg-cyan-100 text-cyan-800' };
      case 'temple':
      case 'spiritual':
        return { label: '🕉️ Sacred Spiritual Shrine', bg: 'bg-orange-100 text-orange-800' };
      case 'adventure':
        return { label: '🏍️ High Pass & Adventure', bg: 'bg-rose-100 text-rose-800' };
      default:
        return { label: '📍 Sightseeing Attraction', bg: 'bg-blue-100 text-blue-800' };
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Morning':
        return 'from-amber-500 to-orange-400';
      case 'Mid-Day':
        return 'from-blue-500 to-cyan-500';
      case 'Afternoon':
        return 'from-indigo-500 to-purple-500';
      case 'Sunset / Evening':
      case 'Sunset':
        return 'from-rose-500 to-amber-500';
      default:
        return 'from-slate-700 to-indigo-900';
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-500/30 text-blue-300 rounded-lg">
                <Compass className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-300">
                Sightseeing Roadmap ({destinationData.name})
              </span>
            </div>
            <h3 className="text-lg font-black text-white mt-1">
              Top Spots & Places To Explore
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Curated step-by-step route covering key sights, timings, how to explore, nearby food, and travel tips.
            </p>
          </div>

          {/* Quick Step Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <button
              type="button"
              onClick={() => setActiveStep('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStep === 'all'
                  ? 'bg-blue-500 text-white shadow-xs'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              All Steps
            </button>
            {roadmapSpots.map(s => (
              <button
                key={s.step}
                type="button"
                onClick={() => setActiveStep(s.step)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeStep === s.step
                    ? 'bg-blue-500 text-white shadow-xs'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                Step {s.step}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step by Step Timeline */}
      <div className="relative pl-3 sm:pl-6 space-y-4 before:absolute before:left-[17px] sm:before:left-[29px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-amber-400 via-blue-500 to-purple-600">
        {visibleSpots.map((spot) => {
          const badge = getCategoryBadge(spot.spotCategory);
          const gradient = getPhaseColor(spot.phase);

          return (
            <div key={spot.step} className="relative pl-7 sm:pl-8 group">
              
              {/* Step indicator node */}
              <div className={`absolute -left-[1px] sm:left-[11px] top-2 w-8 h-8 rounded-full bg-gradient-to-tr ${gradient} text-white font-black text-xs flex items-center justify-center shadow-md ring-4 ring-white z-10`}>
                {spot.step}
              </div>

              {/* Spot Card */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-4 sm:p-5 space-y-3">
                
                {/* Spot Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white">
                        {spot.phase}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>
                    <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <span>{spot.spotName}</span>
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      <span>{spot.duration}</span>
                    </span>
                    {onExploreSpotOnMap && (
                      <button
                        type="button"
                        onClick={() => onExploreSpotOnMap(spot.spotName)}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <MapPin className="w-3 h-3 text-rose-500" />
                        <span>Map</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* What to Explore */}
                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong className="text-slate-900 font-bold block mb-0.5">What to Explore & See:</strong>
                  <p>{spot.whatToExplore}</p>
                </div>

                {/* How to Explore (Travel & Route details) */}
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100/70 text-xs text-slate-800">
                  <div className="flex items-center gap-1.5 font-black text-blue-900 mb-1">
                    <Car className="w-3.5 h-3.5 text-blue-600" />
                    <span>How To Explore & Reach:</span>
                  </div>
                  <p className="text-slate-700">{spot.howToExplore}</p>
                </div>

                {/* Recommended Eatery Nearby */}
                {spot.nearbyEatery && (
                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100/70 text-xs text-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center gap-1.5 font-black text-amber-900">
                        <Utensils className="w-3.5 h-3.5 text-amber-600" />
                        <span>Nearby Restaurant / Food Stop:</span>
                      </span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                        {spot.nearbyEatery.cuisine}
                      </span>
                    </div>
                    <p className="text-slate-900 font-bold">
                      {spot.nearbyEatery.name}
                    </p>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Must Try: <span className="font-semibold text-slate-800">{spot.nearbyEatery.specialty}</span>
                    </p>
                  </div>
                )}

                {/* Insider Travel Tip */}
                {spot.insiderTip && (
                  <div className="flex items-start gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800">Insider Tip: </span>
                      <span>{spot.insiderTip}</span>
                    </div>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
