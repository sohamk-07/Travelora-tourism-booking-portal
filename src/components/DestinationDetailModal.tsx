/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { 
  X, 
  MapPin, 
  Star, 
  Calendar, 
  Thermometer, 
  CheckCircle2, 
  Compass, 
  Heart,
  Share2,
  Sparkles,
  ArrowRight,
  Utensils,
  Hotel as HotelIcon,
  Maximize2,
  Navigation,
  Layers,
  Award,
  Clock,
  PhoneCall,
  ChevronLeft,
  ChevronRight,
  Camera
} from 'lucide-react';
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { TouristDestination, Currency, Hotel, NearbyRestaurant } from '../types';
import { formatPrice } from '../lib/currency';
import { DESTINATION_NEARBY_MAP, getNearbyInfoForDestination, DestinationAttractionPin } from '../data/nearbyData';
import { RoadmapView } from './RoadmapView';
import { DEMO_MAP_ID, GMP_ATTRIBUTION_IDS, GoogleMapType, MapCameraController } from '../lib/googleMaps';

interface DestinationDetailModalProps {
  destination: TouristDestination | null;
  currency: Currency;
  onClose: () => void;
  onBookTour: (destination: TouristDestination) => void;
  onBookHotel?: (hotel: Hotel) => void;
  onOpenFullscreenMap?: (destination: TouristDestination) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  initialTab?: 'overview' | 'roadmap' | 'map' | 'hotels' | 'restaurants';
}

export const DestinationDetailModal: React.FC<DestinationDetailModalProps> = ({
  destination,
  currency,
  onClose,
  onBookTour,
  onBookHotel,
  onOpenFullscreenMap,
  isFavorite,
  onToggleFavorite,
  initialTab = 'overview'
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'roadmap' | 'map' | 'hotels' | 'restaurants'>(initialTab);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // Sync initial tab when changed
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  
  // Map state
  const [mapFilter, setMapFilter] = useState<'all' | 'attractions' | 'hotels' | 'restaurants'>('all');
  const [mapType, setMapType] = useState<GoogleMapType>('roadmap');
  const [selectedPin, setSelectedPin] = useState<{ type: 'hotel' | 'restaurant' | 'attraction'; data: any } | null>(null);

  if (!destination) return null;

  // Retrieve nearby data
  const nearbyInfo = DESTINATION_NEARBY_MAP[destination.id] || getNearbyInfoForDestination(destination);
  const hotels = destination.nearbyHotels && destination.nearbyHotels.length > 0 
    ? destination.nearbyHotels 
    : nearbyInfo.hotels;
  const restaurants = destination.nearbyRestaurants && destination.nearbyRestaurants.length > 0 
    ? destination.nearbyRestaurants 
    : nearbyInfo.restaurants;
  const attractionPins = nearbyInfo.attractionPins;

  const images = destination.gallery && destination.gallery.length > 0
    ? destination.gallery
    : [destination.image];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFocusOnMap = () => {
    setActiveTab('map');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[94vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="px-5 sm:px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Compass className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 leading-tight">
                  {destination.name}
                </h2>
                <span className="px-2 py-0.5 bg-blue-100/70 text-blue-700 text-[10px] font-extrabold rounded-md uppercase tracking-wider">
                  {destination.category.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>{destination.state ? `${destination.state}, ${destination.country}` : destination.country}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(destination.id)}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isFavorite 
                  ? 'bg-rose-50 border-rose-200 text-rose-600' 
                  : 'border-slate-200 text-slate-500 hover:bg-slate-100'
              }`}
              title={isFavorite ? 'Saved in wishlist' : 'Save to wishlist'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Share destination"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="flex items-center gap-1 px-5 sm:px-6 bg-slate-50/80 border-b border-slate-100 overflow-x-auto text-xs font-bold py-2">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'overview'
                ? 'bg-white text-blue-600 shadow-xs border border-slate-200/80 font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Overview & Sights</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('roadmap')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'roadmap'
                ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/80 font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>🗺️ Sightseeing Roadmap</span>
            <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-700 text-[10px] rounded-full font-bold">
              Step-by-Step
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'map'
                ? 'bg-white text-blue-600 shadow-xs border border-slate-200/80 font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>Interactive Map ({destination.name})</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5"></span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hotels')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'hotels'
                ? 'bg-white text-purple-600 shadow-xs border border-slate-200/80 font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <HotelIcon className="w-3.5 h-3.5 text-purple-600" />
            <span>Nearby Hotels ({hotels.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('restaurants')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'restaurants'
                ? 'bg-white text-orange-600 shadow-xs border border-slate-200/80 font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Utensils className="w-3.5 h-3.5 text-orange-500" />
            <span>Famous Restaurants & Food ({restaurants.length})</span>
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              {/* Main Photo Gallery */}
              <div className="space-y-3">
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 shadow-inner group">
                  <img
                    src={images[activeImageIndex] || destination.image}
                    alt={`${destination.name} - Photo ${activeImageIndex + 1}`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80';
                    }}
                    className="w-full h-full object-cover transition-all duration-300"
                  />

                  {/* Previous / Next Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md z-10 cursor-pointer"
                        aria-label="Previous Photo"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md z-10 cursor-pointer"
                        aria-label="Next Photo"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  
                  {destination.discountPercent && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-amber-500 text-white text-xs font-black rounded-lg shadow-sm z-10">
                      Special Offer -{destination.discountPercent}%
                    </div>
                  )}

                  {/* Photo Counter Badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-lg flex items-center gap-1.5 z-10">
                    <Camera className="w-3.5 h-3.5 text-blue-300" />
                    <span>{activeImageIndex + 1} / {images.length}</span>
                  </div>

                  {/* Scenic Subtitle Label for Kashmir */}
                  {destination.id === 'dest-kashmir' && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-black/75 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/20 shadow-md pointer-events-none max-w-[85%] truncate text-center z-10">
                      🏔️ {[
                        'Dal Lake Shikara Ride at Sunrise (Srinagar)',
                        'Gulmarg Snow Slopes & Apharwat Peak',
                        'Betaab Valley & Lidder River (Pahalgam)',
                        'Sonamarg Alpine Glaciers & Meadows',
                        'Tranquil Mountain Lake & Houseboats',
                        'Winter Snow Pine Wonderland (Kashmir)'
                      ][activeImageIndex] || 'Kashmir, India'}
                    </div>
                  )}

                  <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-lg flex items-center gap-1.5 z-10">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{destination.rating} ({destination.reviewsCount} reviews)</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleFocusOnMap}
                    className="absolute bottom-3 left-3 px-3 py-1.5 bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-bold rounded-xl backdrop-blur-md shadow-md flex items-center gap-1.5 transition-all cursor-pointer z-10"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>View on Map</span>
                  </button>
                </div>

                {/* Thumbnail selector if multiple images */}
                {images.length > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          activeImageIndex === idx ? 'border-blue-600 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img 
                          src={img} 
                          alt={`Thumb ${idx + 1}`} 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=400&q=80';
                          }}
                          className="w-full h-full object-cover" 
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Fact Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Starting Tour Rate</p>
                  <p className="text-lg font-black text-slate-900 mt-0.5">
                    {formatPrice(destination.startingPrice, currency)}
                  </p>
                  {destination.originalPrice && (
                    <p className="text-[10px] text-slate-400 line-through">
                      {formatPrice(destination.originalPrice, currency)}
                    </p>
                  )}
                </div>

                <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
                  <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Best Season</p>
                  <p className="text-xs font-bold text-slate-800 mt-1 line-clamp-2">
                    {destination.bestSeason}
                  </p>
                </div>

                <div className="p-3.5 bg-amber-50/70 border border-amber-100 rounded-2xl">
                  <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Climate</p>
                  <p className="text-xs font-bold text-slate-800 mt-1 line-clamp-2">
                    {destination.climate || 'Pleasant & Tropical'}
                  </p>
                </div>

                <div 
                  onClick={handleFocusOnMap}
                  className="p-3.5 bg-purple-50/70 border border-purple-100 rounded-2xl cursor-pointer hover:bg-purple-100/60 transition-colors"
                >
                  <p className="text-[10px] font-bold text-purple-700 uppercase tracking-wider flex items-center justify-between">
                    <span>GPS Coordinates</span>
                    <Navigation className="w-3 h-3 text-purple-500" />
                  </p>
                  <p className="text-xs font-mono font-bold text-slate-800 mt-1">
                    {destination.coordinates.lat.toFixed(2)}°N, {destination.coordinates.lng.toFixed(2)}°E
                  </p>
                </div>
              </div>

              {/* Overview & Description */}
              <div>
                <h3 className="text-base font-black text-slate-900 mb-2">Overview & Experience</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {destination.longDescription || destination.description}
                </p>
              </div>

              {/* Key Tags */}
              <div className="flex flex-wrap gap-2">
                {destination.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Top Attractions & Things To Do */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                
                {/* Top Attractions */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-rose-500" />
                      <span>Popular Sightseeing Spots</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setActiveTab('map')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700"
                    >
                      Show on Map →
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {destination.popularAttractions.map((attraction, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{attraction}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Things to Do */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Unmissable Activities</span>
                  </h4>
                  <ul className="space-y-2">
                    {(destination.thingsToDo || [
                      'Guided city heritage walk',
                      'Local culinary & street food tour',
                      'Sunset scenic photography spot',
                      'Artisan souvenir handicraft shopping'
                    ]).map((todo, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span>{todo}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Sightseeing Exploration Roadmap Banner */}
              <div 
                onClick={() => setActiveTab('roadmap')}
                className="p-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl flex items-center justify-between cursor-pointer hover:shadow-md transition-all shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/30 text-blue-300 rounded-xl backdrop-blur-xs">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-white">Curated Sightseeing Roadmap</h4>
                      <span className="px-2 py-0.5 bg-blue-500 text-white text-[10px] font-black rounded-md">
                        {destination.explorationRoadmap?.length || 4} Key Spots
                      </span>
                    </div>
                    <p className="text-xs text-blue-200 mt-0.5">
                      Explore {destination.name} step-by-step: Morning, Mid-day, Sunset spots, recommended food & transit tips.
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 bg-white text-blue-900 rounded-xl text-xs font-black shadow-xs shrink-0">
                  <span>View Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Quick Callout to Hotels and Restaurants */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div 
                  onClick={() => setActiveTab('hotels')}
                  className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl flex items-center justify-between cursor-pointer hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-600 text-white rounded-xl">
                      <HotelIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Luxury & Boutique Stays</h4>
                      <p className="text-[11px] text-slate-500">{hotels.length} verified stays nearby {destination.name}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-purple-700">View Stays →</span>
                </div>

                <div 
                  onClick={() => setActiveTab('restaurants')}
                  className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-2xl flex items-center justify-between cursor-pointer hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-orange-500 text-white rounded-xl">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Food & Dining Guide</h4>
                      <p className="text-[11px] text-slate-500">{restaurants.length} famous restaurants & cafes</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-orange-700">View Food →</span>
                </div>
              </div>
            </>
          )}

          {/* TAB: SIGHTSEEING ROADMAP */}
          {activeTab === 'roadmap' && (
            <div className="space-y-4">
              <RoadmapView
                mode="destination"
                destinationData={destination}
                onExploreSpotOnMap={(spotName) => {
                  setActiveTab('map');
                }}
              />
            </div>
          )}

          {/* TAB 2: INTERACTIVE MAP FOR DESTINATION */}
          {activeTab === 'map' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-700">
                    Live Map centered on <strong>{destination.name}</strong> ({destination.coordinates.lat.toFixed(2)}°N, {destination.coordinates.lng.toFixed(2)}°E)
                  </span>
                </div>

                {onOpenFullscreenMap && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenFullscreenMap(destination);
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer w-fit"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Open Fullscreen Map</span>
                  </button>
                )}
              </div>

              {/* Filter controls and Original Layer Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-slate-500 font-medium mr-1">Show:</span>
                  <button
                    type="button"
                    onClick={() => setMapFilter('all')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      mapFilter === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    All Places
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapFilter('attractions')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      mapFilter === 'attractions' ? 'bg-sky-600 text-white shadow-xs' : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
                    }`}
                  >
                    🏖️ Attractions ({attractionPins.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapFilter('hotels')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      mapFilter === 'hotels' ? 'bg-purple-600 text-white shadow-xs' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                    }`}
                  >
                    🏨 Hotels ({hotels.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapFilter('restaurants')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      mapFilter === 'restaurants' ? 'bg-orange-600 text-white shadow-xs' : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                    }`}
                  >
                    🍽️ Restaurants ({restaurants.length})
                  </button>
                </div>

                {/* Layer Switcher (Streets, Satellite, Terrain) */}
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl self-start sm:self-auto">
                  {[
                    { id: 'roadmap' as GoogleMapType, label: 'Streets', icon: '🗺️' },
                    { id: 'hybrid' as GoogleMapType, label: 'Satellite', icon: '🛰️' },
                    { id: 'terrain' as GoogleMapType, label: 'Terrain', icon: '⛰️' },
                  ].map((mode) => {
                    const isActive = mapType === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setMapType(mode.id)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                          isActive
                            ? 'bg-white text-blue-600 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>{mode.icon}</span>
                        <span>{mode.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* The Google Maps Container */}
              <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
                <Map
                  mapId={DEMO_MAP_ID}
                  defaultCenter={destination.coordinates}
                  defaultZoom={12}
                  gestureHandling="greedy"
                  disableDefaultUI={false}
                  mapTypeControl={false}
                  internalUsageAttributionIds={GMP_ATTRIBUTION_IDS}
                  style={{ width: '100%', height: '100%' }}
                >
                  <MapCameraController
                    center={destination.coordinates}
                    zoom={12}
                    mapTypeId={mapType}
                  />

                  {/* Destination Center Marker */}
                  <AdvancedMarker
                    position={destination.coordinates}
                    title={destination.name}
                    zIndex={500}
                  >
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black text-xs shadow-lg border-2 border-white whitespace-nowrap cursor-pointer hover:scale-105 transition-transform">
                      <span>📍</span>
                      <span>{destination.name}</span>
                    </div>
                  </AdvancedMarker>

                  {/* Sightseeing Attractions */}
                  {(mapFilter === 'all' || mapFilter === 'attractions') && (
                    attractionPins.map((att, idx) => (
                      <AdvancedMarker
                        key={`att-${idx}`}
                        position={att.coordinates}
                        title={att.name}
                        onClick={() => setSelectedPin({ type: 'attraction', data: att })}
                        zIndex={300}
                      >
                        <div className="cursor-pointer group flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center text-sm shadow-md border-2 border-white hover:scale-110 transition-transform">
                            📸
                          </div>
                        </div>
                      </AdvancedMarker>
                    ))
                  )}

                  {/* Hotels */}
                  {(mapFilter === 'all' || mapFilter === 'hotels') && (
                    hotels.map((hotel) => {
                      const isAvail = (hotel.roomsAvailable || 0) > 0;
                      const formattedPrice = formatPrice(hotel.pricePerNight, currency);
                      return (
                        <AdvancedMarker
                          key={hotel.id}
                          position={hotel.coordinates}
                          title={`${hotel.name} - ${formattedPrice}/nt`}
                          onClick={() => setSelectedPin({ type: 'hotel', data: hotel })}
                          zIndex={400}
                        >
                          <div className="cursor-pointer hover:scale-105 transition-transform">
                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black shadow-lg border-2 whitespace-nowrap ${
                              isAvail ? 'bg-white text-slate-900 border-white hover:border-blue-400' : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                            }`}>
                              <span className={`w-2 h-2 rounded-full ${isAvail ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                              <span>{formattedPrice}</span>
                            </div>
                          </div>
                        </AdvancedMarker>
                      );
                    })
                  )}

                  {/* Restaurants */}
                  {(mapFilter === 'all' || mapFilter === 'restaurants') && (
                    restaurants.map((rest, idx) => {
                      if (!rest.coordinates) return null;
                      return (
                        <AdvancedMarker
                          key={`rest-${idx}`}
                          position={rest.coordinates}
                          title={rest.name}
                          onClick={() => setSelectedPin({ type: 'restaurant', data: rest })}
                          zIndex={250}
                        >
                          <div className="cursor-pointer group flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm shadow-md border-2 border-white hover:scale-110 transition-transform">
                              🍽️
                            </div>
                          </div>
                        </AdvancedMarker>
                      );
                    })
                  )}
                </Map>

                {/* Selected Pin Info Popover */}
                {selectedPin && (
                  <div className="absolute bottom-3 right-3 z-10 max-w-xs w-full bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 p-3.5 animate-in slide-in-from-bottom-2 duration-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {selectedPin.type === 'hotel' ? '🏨 Hotel' : selectedPin.type === 'restaurant' ? '🍽️ Dining' : '📸 Sightseeing'}
                      </span>
                      <button
                        onClick={() => setSelectedPin(null)}
                        className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                        aria-label="Close pin details"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="text-xs font-black text-slate-900 leading-snug">
                      {selectedPin.data.name}
                    </h4>

                    {selectedPin.type === 'hotel' && (
                      <div className="mt-2 space-y-1.5">
                        <p className="text-[11px] text-slate-500">{selectedPin.data.location}</p>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                          <span className="text-xs font-black text-slate-900">{formatPrice(selectedPin.data.pricePerNight, currency)}/nt</span>
                          {onBookHotel && (
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onBookHotel(selectedPin.data);
                              }}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg shadow-xs cursor-pointer"
                            >
                              Reserve
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedPin.type === 'restaurant' && (
                      <div className="mt-1.5 space-y-1 text-[11px]">
                        <p className="font-semibold text-orange-600">{selectedPin.data.cuisine}</p>
                        <p className="text-slate-600">Must-try: <strong>{selectedPin.data.specialty}</strong></p>
                        <p className="text-slate-400">📍 {selectedPin.data.address || selectedPin.data.distance}</p>
                      </div>
                    )}

                    {selectedPin.type === 'attraction' && (
                      <div className="mt-1.5 space-y-1 text-[11px]">
                        <p className="text-slate-600">{selectedPin.data.description}</p>
                        <span className="inline-block text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
                          {selectedPin.data.category}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Map Legend */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                  <span className="font-semibold text-slate-700">Destination Center</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="w-3 h-3 rounded-full bg-sky-500"></span>
                  <span className="font-semibold text-slate-700">Top Attractions</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="w-3 h-3 rounded-full bg-purple-600"></span>
                  <span className="font-semibold text-slate-700">Recommended Hotels</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                  <span className="font-semibold text-slate-700">Famous Restaurants</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NEARBY HOTELS */}
          {activeTab === 'hotels' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Recommended Hotels & Resorts in {destination.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Handpicked 4-star and 5-star properties offering comfort, top ratings, and close proximity to key attractions.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hotels.map((hotel) => (
                  <div 
                    key={hotel.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                        <img 
                          src={hotel.image} 
                          alt={hotel.name}
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold rounded-lg flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{hotel.rating}</span>
                        </div>
                        <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-purple-600 text-white text-[10px] font-black rounded-md uppercase tracking-wider">
                          {hotel.stars} Star {hotel.type?.replace('_', ' ') || 'Stay'}
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <h4 className="text-sm font-black text-slate-900 leading-snug">
                          {hotel.name}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                          <span className="truncate">{hotel.location}</span>
                        </p>
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {hotel.description}
                        </p>

                        <div className="flex flex-wrap gap-1 pt-1">
                          {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-md">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold">Per Night</p>
                        <p className="text-base font-black text-slate-900">
                          {formatPrice(hotel.pricePerNight, currency)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (onBookHotel) {
                            onClose();
                            onBookHotel(hotel);
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1"
                      >
                        <HotelIcon className="w-3.5 h-3.5" />
                        <span>Book Room</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FAMOUS RESTAURANTS & FOOD */}
          {activeTab === 'restaurants' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Famous Restaurants & Iconic Eateries in {destination.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Experience authentic regional culinary delights, legendary family kitchens, and scenic food spots.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {restaurants.map((rest) => (
                  <div 
                    key={rest.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                        <img 
                          src={rest.image} 
                          alt={rest.name}
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute top-2.5 right-2.5 px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold rounded-lg flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{rest.rating} ({rest.reviewsCount})</span>
                        </div>
                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-orange-600 text-white text-[10px] font-black rounded-md uppercase tracking-wider">
                          {rest.priceLevel} • {rest.cuisine}
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-black text-slate-900 leading-snug">
                            {rest.name}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-semibold shrink-0">
                            {rest.distance}
                          </span>
                        </div>

                        <div className="p-2.5 bg-amber-50/80 border border-amber-100 rounded-xl">
                          <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">
                            ⭐ Chef’s Must-Try Specialty:
                          </p>
                          <p className="text-xs font-black text-slate-900 mt-0.5">
                            {rest.specialty}
                          </p>
                        </div>

                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                          <span className="truncate">{rest.address}</span>
                        </p>

                        <div className="flex flex-wrap gap-1 pt-1">
                          {rest.tags.map((tag, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">
                        Cuisine: <strong className="text-slate-800">{rest.cuisine}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveTab('map')}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Locate on Map</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-5 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 z-20">
          <div>
            <p className="text-xs text-slate-500 font-medium">Starting Package Price</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-slate-900">
                {formatPrice(destination.startingPrice, currency)}
              </span>
              <span className="text-xs text-slate-500">/ traveler</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBookTour(destination);
              }}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Book Holiday Package</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
