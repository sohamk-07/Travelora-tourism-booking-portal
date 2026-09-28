/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Source: Google Maps Platform Code Assist
import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  X, 
  Hotel as HotelIcon, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Compass
} from 'lucide-react';
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { Hotel, Currency } from '../types';
import { formatPrice } from '../lib/currency';
import { DEMO_MAP_ID, GMP_ATTRIBUTION_IDS, GoogleMapType, MapCameraController } from '../lib/googleMaps';

interface HotelMapExplorerProps {
  hotels: Hotel[];
  currency: Currency;
  selectedHotelId?: string | null;
  onSelectHotel: (hotel: Hotel) => void;
  onReserveHotel: (hotel: Hotel) => void;
  className?: string;
  height?: string;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
}

export const HotelMapExplorer: React.FC<HotelMapExplorerProps> = ({
  hotels,
  currency,
  selectedHotelId,
  onSelectHotel,
  onReserveHotel,
  className = '',
  height = '500px',
  initialCenter,
  initialZoom = 5
}) => {
  const [mapType, setMapType] = useState<GoogleMapType>('roadmap');
  const [activeHotel, setActiveHotel] = useState<Hotel | null>(null);

  const [cameraCenter, setCameraCenter] = useState<{ lat: number; lng: number }>(
    initialCenter || { lat: 20.5937, lng: 78.9629 }
  );
  const [cameraZoom, setCameraZoom] = useState<number>(initialZoom);

  // Sync selected hotel from prop
  useEffect(() => {
    if (selectedHotelId) {
      const match = hotels.find(h => h.id === selectedHotelId);
      if (match) {
        setActiveHotel(match);
        setCameraCenter(match.coordinates);
        setCameraZoom(13);
      }
    }
  }, [selectedHotelId, hotels]);

  const handleResetView = () => {
    if (hotels.length === 1) {
      setCameraCenter(hotels[0].coordinates);
      setCameraZoom(13);
    } else {
      setCameraCenter({ lat: 22.5937, lng: 78.9629 });
      setCameraZoom(5);
    }
    setActiveHotel(null);
  };

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-slate-200 shadow-md ${className}`}>
      
      {/* Real Google Map Canvas */}
      <div style={{ height }} className="w-full h-full min-h-[350px] z-0 bg-slate-100">
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

          {hotels.map((hotel) => {
            const isSelected = selectedHotelId === hotel.id || (activeHotel && activeHotel.id === hotel.id);
            const isAvailable = (hotel.roomsAvailable || 0) > 0;
            const formattedPrice = formatPrice(hotel.pricePerNight, currency);

            return (
              <AdvancedMarker
                key={hotel.id}
                position={{ lat: hotel.coordinates.lat, lng: hotel.coordinates.lng }}
                onClick={() => {
                  setActiveHotel(hotel);
                  onSelectHotel(hotel);
                  setCameraCenter(hotel.coordinates);
                  setCameraZoom(14);
                }}
                title={`${hotel.name} - ${formattedPrice}/night`}
                zIndex={isSelected ? 1000 : 100}
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
          })}
        </Map>
      </div>

      {/* Layer Switcher (Streets, Satellite Hybrid, Terrain) */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-lg border border-slate-200/80">
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
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs font-black'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{mode.icon}</span>
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right Map Controls: Compass Center */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleResetView}
          className="p-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl shadow-md border border-slate-200 transition-all cursor-pointer flex items-center justify-center"
          title="Center on All India"
        >
          <Compass className="w-4 h-4 text-blue-600" />
        </button>
      </div>

      {/* Map Legend Banner at bottom left */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-950/85 backdrop-blur-md px-3.5 py-2 rounded-xl text-white text-[11px] font-medium shadow-lg flex items-center gap-3">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Available</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span>Few Left</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          <span>Sold Out</span>
        </span>
      </div>

      {/* Selected Hotel Quick Preview Drawer */}
      {activeHotel && (
        <div className="absolute bottom-4 right-4 z-20 max-w-sm w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-3 duration-300">
          <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
            <img 
              src={activeHotel.image} 
              alt={activeHotel.name} 
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setActiveHotel(null)}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors cursor-pointer"
              aria-label="Close hotel card"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Availability Status Ribbon */}
            <div className="absolute bottom-2 left-2">
              {(activeHotel.roomsAvailable || 0) > 0 ? (
                <span className="px-2.5 py-1 bg-emerald-600/95 backdrop-blur-xs text-white text-[10px] font-black rounded-lg shadow-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Available ({activeHotel.roomsAvailable} Rooms Left)</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 bg-rose-600/95 backdrop-blur-xs text-white text-[10px] font-black rounded-lg shadow-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Sold Out for Dates</span>
                </span>
              )}
            </div>
          </div>

          <div className="p-3.5 space-y-2">
            <div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{activeHotel.location}</span>
              </div>
              <h4 className="text-sm font-black text-slate-900 leading-snug">
                {activeHotel.name}
              </h4>
            </div>

            {activeHotel.closestAttraction && (
              <p className="text-[11px] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 truncate">
                ⚡ {activeHotel.closestAttraction}
              </p>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-base font-black text-slate-900">
                  {formatPrice(activeHotel.pricePerNight, currency)}
                </span>
                <span className="text-[10px] text-slate-500"> / night</span>
              </div>

              <button
                type="button"
                onClick={() => onReserveHotel(activeHotel)}
                disabled={(activeHotel.roomsAvailable || 0) === 0}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer ${
                  (activeHotel.roomsAvailable || 0) > 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>{(activeHotel.roomsAvailable || 0) > 0 ? 'Check & Reserve' : 'Sold Out'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
