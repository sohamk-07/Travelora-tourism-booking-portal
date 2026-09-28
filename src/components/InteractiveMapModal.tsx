/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Source: Google Maps Platform Code Assist
import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Hotel as HotelIcon, 
  Compass, 
  Layers,
  Star,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { Hotel, TouristDestination, Currency, NearbyRestaurant } from '../types';
import { formatPrice } from '../lib/currency';
import { DESTINATION_NEARBY_MAP, getNearbyInfoForDestination, DestinationAttractionPin } from '../data/nearbyData';
import { DEMO_MAP_ID, GMP_ATTRIBUTION_IDS, GoogleMapType, MapCameraController } from '../lib/googleMaps';

interface InteractiveMapModalProps {
  destinations: TouristDestination[];
  hotels: Hotel[];
  currency: Currency;
  onClose: () => void;
  onSelectDestination: (dest: TouristDestination) => void;
  onSelectHotel: (hotel: Hotel) => void;
  onBookDestinationTour: (dest: TouristDestination) => void;
  initialCoordinates?: { lat: number; lng: number } | null;
  initialDestinationId?: string | null;
}

export const InteractiveMapModal: React.FC<InteractiveMapModalProps> = ({
  destinations,
  hotels,
  currency,
  onClose,
  onSelectDestination,
  onSelectHotel,
  onBookDestinationTour,
  initialCoordinates,
  initialDestinationId
}) => {
  const [mapType, setMapType] = useState<GoogleMapType>('roadmap');
  const [activeFilter, setActiveFilter] = useState<'all' | 'india' | 'hills' | 'beaches' | 'heritage' | 'hotels' | 'restaurants'>('all');
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(initialDestinationId || null);
  
  // Camera state for the MapCameraController
  const [cameraCenter, setCameraCenter] = useState<{ lat: number; lng: number }>({
    lat: 22.5937,
    lng: 78.9629
  });
  const [cameraZoom, setCameraZoom] = useState<number>(5);

  const [selectedItem, setSelectedItem] = useState<{
    type: 'destination' | 'hotel' | 'restaurant' | 'attraction';
    data: any;
  } | null>(null);

  // Quick jump destinations list
  const quickJumpDestinations = destinations.slice(0, 12);

  // Initialize camera center on mount if initial destination/coords provided
  useEffect(() => {
    if (initialDestinationId) {
      const match = destinations.find(d => d.id === initialDestinationId);
      if (match) {
        setCameraCenter(match.coordinates);
        setCameraZoom(12);
        setSelectedDestinationId(match.id);
        setSelectedItem({ type: 'destination', data: match });
      }
    } else if (initialCoordinates) {
      setCameraCenter(initialCoordinates);
      setCameraZoom(12);
    }
  }, [initialDestinationId, initialCoordinates, destinations]);

  // Handle jump to city
  const handleJumpToCity = (dest: TouristDestination) => {
    setSelectedDestinationId(dest.id);
    setSelectedItem({ type: 'destination', data: dest });
    setCameraCenter(dest.coordinates);
    setCameraZoom(12);
  };

  const handleResetToIndia = () => {
    setSelectedDestinationId(null);
    setSelectedItem(null);
    setCameraCenter({ lat: 22.5937, lng: 78.9629 });
    setCameraZoom(5);
  };

  // Retrieve current destination's local attractions and restaurants if selected
  const currentSelectedDest = selectedDestinationId 
    ? destinations.find(d => d.id === selectedDestinationId) 
    : null;
  const currentNearbyInfo = currentSelectedDest 
    ? (DESTINATION_NEARBY_MAP[currentSelectedDest.id] || getNearbyInfoForDestination(currentSelectedDest))
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[94vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header Bar */}
        <div className="px-5 sm:px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Compass className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  Google Maps Travel & Destination Explorer
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                  Real Google Maps
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Crystal-clear Google Maps with authentic satellite imagery, live hotel rates, scenic spots, and local dining.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetToIndia}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              <span>🇮🇳 Reset to All India</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close Map"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Jump Bar across top cities */}
        <div className="px-5 sm:px-6 py-2 bg-slate-50 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto text-xs z-10 shrink-0">
          <span className="font-extrabold text-slate-400 uppercase tracking-wider text-[10px] shrink-0">
            Jump to City:
          </span>
          {quickJumpDestinations.map(dest => {
            const isSelected = selectedDestinationId === dest.id;
            return (
              <button
                key={dest.id}
                type="button"
                onClick={() => handleJumpToCity(dest)}
                className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                  isSelected 
                    ? 'bg-blue-600 text-white shadow-xs font-black' 
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-400'
                }`}
              >
                <span>{dest.name}</span>
                {dest.id === 'dest-goa' && <span className="text-[10px]">🏖️</span>}
                {dest.id === 'dest-kashmir' && <span className="text-[10px]">🏔️</span>}
                {dest.id === 'dest-kerala' && <span className="text-[10px]">🌴</span>}
                {dest.id === 'dest-jaipur' && <span className="text-[10px]">🏰</span>}
              </button>
            );
          })}
        </div>

        {/* Map Container Area */}
        <div className="relative flex-1 w-full h-full min-h-[300px]">
          
          <Map
            mapId={DEMO_MAP_ID}
            defaultCenter={cameraCenter}
            defaultZoom={cameraZoom}
            gestureHandling="greedy"
            disableDefaultUI={false}
            mapTypeControl={false}
            internalUsageAttributionIds={GMP_ATTRIBUTION_IDS}
            style={{ width: '100%', height: '100%' }}
          >
            <MapCameraController
              center={cameraCenter}
              zoom={cameraZoom}
              mapTypeId={mapType}
            />

            {/* 1. Destination Pins */}
            {activeFilter !== 'hotels' && activeFilter !== 'restaurants' && (
              destinations.map(dest => {
                if (activeFilter === 'india' && dest.country !== 'India') return null;
                if (activeFilter === 'hills' && dest.category !== 'hill_station' && dest.category !== 'adventure') return null;
                if (activeFilter === 'beaches' && dest.category !== 'beach') return null;
                if (activeFilter === 'heritage' && dest.category !== 'heritage' && dest.category !== 'spiritual') return null;

                const isSelected = selectedDestinationId === dest.id;
                let bgGradient = 'from-blue-600 to-indigo-700';
                let iconSymbol = '📍';

                if (dest.category === 'hill_station') {
                  bgGradient = 'from-sky-500 to-blue-600';
                  iconSymbol = '🏔️';
                } else if (dest.category === 'beach') {
                  bgGradient = 'from-teal-500 to-emerald-600';
                  iconSymbol = '🏖️';
                } else if (dest.category === 'heritage' || dest.category === 'spiritual') {
                  bgGradient = 'from-amber-500 to-orange-600';
                  iconSymbol = '🏰';
                } else if (dest.category === 'adventure') {
                  bgGradient = 'from-rose-500 to-red-600';
                  iconSymbol = '🏍️';
                }

                return (
                  <AdvancedMarker
                    key={dest.id}
                    position={{ lat: dest.coordinates.lat, lng: dest.coordinates.lng }}
                    onClick={() => {
                      setSelectedDestinationId(dest.id);
                      setSelectedItem({ type: 'destination', data: dest });
                      setCameraCenter(dest.coordinates);
                      setCameraZoom(12);
                    }}
                    title={dest.name}
                    zIndex={isSelected ? 1000 : 100}
                  >
                    <div className="relative group cursor-pointer transition-transform duration-200 hover:scale-110">
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${bgGradient} text-white font-extrabold text-xs shadow-lg border-2 border-white whitespace-nowrap`}>
                        <span className="text-sm">{iconSymbol}</span>
                        <span>{dest.name}</span>
                      </div>
                      <div className="w-2.5 h-2.5 bg-indigo-700 rotate-45 mx-auto -mt-1 shadow-sm"></div>
                    </div>
                  </AdvancedMarker>
                );
              })
            )}

            {/* 2. Hotel Pins with Authentic Google/Airbnb style Price Badges */}
            {(activeFilter === 'all' || activeFilter === 'hotels' || activeFilter === 'india') && (
              hotels.map(hotel => {
                if (activeFilter === 'india' && hotel.country !== 'India') return null;

                const isSelected = selectedItem?.type === 'hotel' && selectedItem.data.id === hotel.id;
                const isAvailable = (hotel.roomsAvailable || 0) > 0;
                const formattedPrice = formatPrice(hotel.pricePerNight, currency);

                return (
                  <AdvancedMarker
                    key={hotel.id}
                    position={{ lat: hotel.coordinates.lat, lng: hotel.coordinates.lng }}
                    onClick={() => {
                      setSelectedItem({ type: 'hotel', data: hotel });
                      setCameraCenter(hotel.coordinates);
                      setCameraZoom(14);
                    }}
                    title={`${hotel.name} - ${formattedPrice}/night`}
                    zIndex={isSelected ? 1000 : 200}
                  >
                    <div className={`cursor-pointer transition-all duration-200 transform ${isSelected ? 'scale-110' : 'hover:scale-105'}`}>
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black shadow-xl border-2 transition-colors whitespace-nowrap ${
                        isSelected 
                          ? 'bg-blue-600 text-white border-white ring-2 ring-blue-400' 
                          : isAvailable
                          ? 'bg-white text-slate-900 border-white hover:border-blue-400'
                          : 'bg-slate-100 text-slate-400 line-through border-slate-200'
                      }`}>
                        <span className={`w-2 h-2 rounded-full shrink-0 ${
                          !isAvailable 
                            ? 'bg-rose-500' 
                            : (hotel.roomsAvailable || 0) <= 2 
                            ? 'bg-amber-500 animate-pulse' 
                            : 'bg-emerald-500'
                        }`}></span>
                        <span>{formattedPrice}</span>
                      </div>
                    </div>
                  </AdvancedMarker>
                );
              })
            )}

            {/* 3. Local Attractions for Selected Destination */}
            {selectedDestinationId && currentNearbyInfo && (activeFilter === 'all' || activeFilter === 'beaches' || activeFilter === 'hills') && (
              currentNearbyInfo.attractionPins.map((att, idx) => (
                <AdvancedMarker
                  key={`att-${idx}-${att.name}`}
                  position={{ lat: att.coordinates.lat, lng: att.coordinates.lng }}
                  onClick={() => {
                    setSelectedItem({
                      type: 'attraction',
                      data: { ...att, destinationName: currentSelectedDest?.name }
                    });
                    setCameraCenter(att.coordinates);
                  }}
                  title={att.name}
                  zIndex={300}
                >
                  <div className="cursor-pointer group flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center text-sm shadow-md border-2 border-white hover:scale-110 transition-transform">
                      📸
                    </div>
                    <span className="mt-0.5 px-1.5 py-0.5 bg-slate-900/90 text-white rounded text-[10px] font-bold shadow-xs whitespace-nowrap hidden group-hover:block">
                      {att.name}
                    </span>
                  </div>
                </AdvancedMarker>
              ))
            )}

            {/* 4. Local Restaurants for Selected Destination */}
            {selectedDestinationId && currentNearbyInfo && (activeFilter === 'all' || activeFilter === 'restaurants') && (
              currentNearbyInfo.restaurants.map((rest, idx) => {
                if (!rest.coordinates) return null;
                return (
                  <AdvancedMarker
                    key={`rest-${idx}-${rest.name}`}
                    position={{ lat: rest.coordinates.lat, lng: rest.coordinates.lng }}
                    onClick={() => {
                      setSelectedItem({ type: 'restaurant', data: rest });
                      setCameraCenter(rest.coordinates!);
                    }}
                    title={rest.name}
                    zIndex={250}
                  >
                    <div className="cursor-pointer group flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm shadow-md border-2 border-white hover:scale-110 transition-transform">
                        🍽️
                      </div>
                      <span className="mt-0.5 px-1.5 py-0.5 bg-slate-900/90 text-white rounded text-[10px] font-bold shadow-xs whitespace-nowrap hidden group-hover:block">
                        {rest.name}
                      </span>
                    </div>
                  </AdvancedMarker>
                );
              })
            )}

          </Map>

          {/* Floating Category Filter Pills (Top Left) */}
          <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-lg border border-slate-200/80 flex flex-wrap gap-1 max-w-[70vw]">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              All Pins
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('beaches')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'beaches' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              🏖️ Goa & Beaches
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('hills')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'hills' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              🏔️ Hills & Snow
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('heritage')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'heritage' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              🏰 Heritage & Palaces
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('hotels')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'hotels' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              🏨 Hotels
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('restaurants')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'restaurants' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              🍽️ Restaurants
            </button>
          </div>

          {/* Top Right: Google Maps Layer Switcher (Roadmap, Satellite Hybrid, Terrain) */}
          <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-2">
            <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-slate-200/80 flex items-center gap-1">
              {[
                { id: 'roadmap' as GoogleMapType, label: 'Streets', icon: '🗺️' },
                { id: 'hybrid' as GoogleMapType, label: 'Satellite', icon: '🛰️' },
                { id: 'terrain' as GoogleMapType, label: 'Terrain', icon: '⛰️' },
              ].map(mode => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setMapType(mode.id)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    mapType === mode.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{mode.icon}</span>
                  <span className="hidden sm:inline">{mode.label}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleResetToIndia}
              className="p-2.5 bg-white/95 hover:bg-white text-slate-700 rounded-xl shadow-md border border-slate-200 cursor-pointer transition-all flex items-center justify-center"
              title="Center on All India"
            >
              <Compass className="w-4 h-4 text-blue-600" />
            </button>
          </div>

          {/* Floating Selected Item Slide-Up Drawer */}
          {selectedItem && (
            <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-20 sm:w-96 bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 p-4 animate-in slide-in-from-bottom-3 duration-200">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-blue-50 text-blue-700">
                  {selectedItem.type === 'destination' && '📍 Destination'}
                  {selectedItem.type === 'hotel' && '🏨 Recommended Hotel'}
                  {selectedItem.type === 'restaurant' && '🍽️ Famous Restaurant'}
                  {selectedItem.type === 'attraction' && '🏖️ Sightseeing Spot'}
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
                  aria-label="Close drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* DESTINATION PREVIEW */}
              {selectedItem.type === 'destination' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={selectedItem.data.image} 
                      alt={selectedItem.data.name} 
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <h3 className="text-base font-black text-slate-900 leading-tight">
                        {selectedItem.data.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {selectedItem.data.state ? `${selectedItem.data.state}, ${selectedItem.data.country}` : selectedItem.data.country}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-xs">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-slate-800">{selectedItem.data.rating}</span>
                        <span className="text-slate-400">({selectedItem.data.reviewsCount})</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {selectedItem.data.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Starting From</span>
                      <span className="text-base font-black text-slate-900">
                        {formatPrice(selectedItem.data.startingPrice, currency)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectDestination(selectedItem.data);
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        Explore Details
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onBookDestinationTour(selectedItem.data);
                        }}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        Book Tour
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* HOTEL PREVIEW */}
              {selectedItem.type === 'hotel' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={selectedItem.data.image} 
                      alt={selectedItem.data.name} 
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-black text-slate-900 leading-tight truncate">
                        {selectedItem.data.name}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">{selectedItem.data.location}</p>
                      
                      <div className="mt-1">
                        {(selectedItem.data.roomsAvailable || 0) > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-md text-[10px] font-black">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Available ({selectedItem.data.roomsAvailable} Rooms Left)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200/80 rounded-md text-[10px] font-black">
                            <AlertCircle className="w-3 h-3 text-rose-600" />
                            <span>Sold Out</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedItem.data.closestAttraction && (
                    <div className="text-[11px] font-bold text-amber-900 bg-amber-50 px-2 py-1 rounded border border-amber-200/60 truncate">
                      ⚡ {selectedItem.data.closestAttraction}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Rate / Night</span>
                      <span className="text-base font-black text-slate-900">
                        {formatPrice(selectedItem.data.pricePerNight, currency)}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={(selectedItem.data.roomsAvailable || 0) === 0}
                      onClick={() => {
                        onClose();
                        onSelectHotel(selectedItem.data);
                      }}
                      className={`px-4 py-2 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1 ${
                        (selectedItem.data.roomsAvailable || 0) > 0
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <HotelIcon className="w-3.5 h-3.5" />
                      <span>{(selectedItem.data.roomsAvailable || 0) > 0 ? 'Reserve Room' : 'Sold Out'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* RESTAURANT PREVIEW */}
              {selectedItem.type === 'restaurant' && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <img 
                      src={selectedItem.data.image} 
                      alt={selectedItem.data.name} 
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <h3 className="text-sm font-black text-slate-900 leading-tight">
                        {selectedItem.data.name}
                      </h3>
                      <p className="text-xs font-bold text-orange-600">{selectedItem.data.cuisine}</p>
                      <span className="text-xs text-slate-500">{selectedItem.data.distance}</span>
                    </div>
                  </div>

                  <div className="p-2 bg-amber-50/80 rounded-xl text-xs">
                    <span className="text-[10px] font-bold text-amber-800 uppercase block">Must-Try Dish:</span>
                    <strong className="text-slate-900">{selectedItem.data.specialty}</strong>
                  </div>

                  <p className="text-xs text-slate-500 truncate">📍 {selectedItem.data.address}</p>
                </div>
              )}

              {/* ATTRACTION PREVIEW */}
              {selectedItem.type === 'attraction' && (
                <div className="space-y-2">
                  <h3 className="text-sm font-black text-slate-900">{selectedItem.data.name}</h3>
                  <p className="text-xs text-slate-600">{selectedItem.data.description}</p>
                  <p className="text-[11px] text-blue-600 font-bold">In {selectedItem.data.destinationName}</p>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
