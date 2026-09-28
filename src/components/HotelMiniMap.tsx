/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Source: Google Maps Platform Code Assist
import React, { useState } from 'react';
import { MapPin, Layers } from 'lucide-react';
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { Hotel } from '../types';
import { DEMO_MAP_ID, GMP_ATTRIBUTION_IDS, GoogleMapType, MapCameraController } from '../lib/googleMaps';

interface HotelMiniMapProps {
  hotel: Hotel;
  height?: string;
  isAvailable?: boolean;
}

export const HotelMiniMap: React.FC<HotelMiniMapProps> = ({
  hotel,
  height = '200px',
  isAvailable = true
}) => {
  const [mapType, setMapType] = useState<GoogleMapType>('roadmap');

  const toggleLayer = () => {
    setMapType(prev => (prev === 'roadmap' ? 'hybrid' : 'roadmap'));
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs bg-slate-100">
      <div style={{ height }} className="w-full">
        <Map
          mapId={DEMO_MAP_ID}
          defaultCenter={hotel.coordinates}
          defaultZoom={14}
          gestureHandling="greedy"
          disableDefaultUI={true}
          internalUsageAttributionIds={GMP_ATTRIBUTION_IDS}
          style={{ width: '100%', height: '100%' }}
        >
          <MapCameraController
            center={hotel.coordinates}
            zoom={14}
            mapTypeId={mapType}
          />

          <AdvancedMarker position={hotel.coordinates} title={hotel.name}>
            <div className="relative flex items-center justify-center cursor-pointer">
              <div className="absolute w-11 h-11 rounded-full bg-blue-500/30 animate-ping"></div>
              <div className="relative z-10 w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-base font-bold shadow-lg border-2 border-white">
                🏨
              </div>
            </div>
          </AdvancedMarker>
        </Map>
      </div>

      {/* Layer Toggle Button (Streets / Satellite) */}
      <div className="absolute top-2.5 right-2.5 z-10">
        <button
          type="button"
          onClick={toggleLayer}
          className="px-2.5 py-1 bg-white/95 backdrop-blur-xs hover:bg-white text-slate-800 rounded-xl text-[11px] font-bold shadow-md border border-slate-200 flex items-center gap-1 cursor-pointer transition-all"
        >
          <Layers className="w-3 h-3 text-blue-600" />
          <span>{mapType === 'roadmap' ? '🛰️ Satellite' : '🗺️ Streets'}</span>
        </button>
      </div>

      {/* Location Badge & Closest Landmark */}
      <div className="absolute bottom-2.5 inset-x-2.5 z-10 flex items-center justify-between gap-2 p-2 bg-slate-900/90 backdrop-blur-md rounded-xl text-white text-[11px] shadow-lg">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span className="truncate font-semibold">{hotel.location}</span>
        </div>

        {hotel.closestAttraction && (
          <span className="px-2 py-0.5 bg-blue-500/30 text-blue-200 rounded-md font-bold text-[10px] shrink-0 border border-blue-400/30 truncate max-w-[160px]">
            ⚡ {hotel.closestAttraction}
          </span>
        )}
      </div>
    </div>
  );
};
