/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import L from 'leaflet';

export type MapTileMode = 'streets' | 'satellite' | 'terrain' | 'standard';

export interface MapTileProvider {
  id: MapTileMode;
  name: string;
  icon: string;
  url: string;
  labelsUrl?: string;
  attribution: string;
  maxZoom: number;
}

export const MAP_TILE_PROVIDERS: Record<MapTileMode, MapTileProvider> = {
  streets: {
    id: 'streets',
    name: 'OpenStreetMap',
    icon: '🗺️',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    maxZoom: 19
  },
  satellite: {
    id: 'satellite',
    name: 'Satellite Imagery',
    icon: '🛰️',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    labelsUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, Maxar, Earthstar Geographics',
    maxZoom: 19
  },
  terrain: {
    id: 'terrain',
    name: 'Topographic Terrain',
    icon: '⛰️',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, HERE, Garmin, Intermap, USGS',
    maxZoom: 18
  },
  standard: {
    id: 'standard',
    name: 'World Street Map',
    icon: '🧭',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 19
  }
};

/**
 * Helper to mount authentic map tiles onto any Leaflet map instance
 */
export function setMapTileLayer(
  map: L.Map, 
  mode: MapTileMode, 
  currentLayersRef: { base?: L.TileLayer; labels?: L.TileLayer }
) {
  if (currentLayersRef.base) {
    try {
      map.removeLayer(currentLayersRef.base);
    } catch (_) {}
  }
  if (currentLayersRef.labels) {
    try {
      map.removeLayer(currentLayersRef.labels);
    } catch (_) {}
  }

  const provider = MAP_TILE_PROVIDERS[mode] || MAP_TILE_PROVIDERS.streets;
  const hasSubdomains = provider.url.includes('{s}');

  const baseLayer = L.tileLayer(provider.url, {
    maxZoom: provider.maxZoom,
    attribution: provider.attribution,
    ...(hasSubdomains ? { subdomains: ['a', 'b', 'c'] } : {})
  }).addTo(map);

  currentLayersRef.base = baseLayer;

  // Add labels layer for satellite hybrid
  if (provider.labelsUrl) {
    const hasLabelsSubdomains = provider.labelsUrl.includes('{s}');
    const labelsLayer = L.tileLayer(provider.labelsUrl, {
      maxZoom: provider.maxZoom,
      attribution: '',
      pane: 'shadowPane',
      ...(hasLabelsSubdomains ? { subdomains: ['a', 'b', 'c'] } : {})
    }).addTo(map);
    currentLayersRef.labels = labelsLayer;
  }
}

/**
 * Creates authentic Google / Airbnb style price pin markers for hotels
 */
export function createHotelPriceMarker(
  price: string, 
  isAvailable: boolean, 
  roomsLeft: number,
  isSelected: boolean = false
) {
  const bgClass = isSelected
    ? 'background: #1d4ed8; color: white; transform: scale(1.12);'
    : isAvailable
    ? 'background: #ffffff; color: #0f172a;'
    : 'background: #f1f5f9; color: #94a3b8; text-decoration: line-through;';

  const dotColor = isAvailable 
    ? (roomsLeft <= 2 ? '#f59e0b' : '#10b981')
    : '#ef4444';

  const html = `
    <div style="
      ${bgClass}
      padding: 5px 9px;
      border-radius: 9999px;
      font-weight: 800;
      font-size: 11px;
      font-family: system-ui, -apple-system, sans-serif;
      box-shadow: 0 4px 14px rgba(0,0,0,0.22);
      border: 2px solid ${isSelected ? '#3b82f6' : '#ffffff'};
      display: inline-flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
    ">
      <span style="
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background-color: ${dotColor};
        display: inline-block;
      "></span>
      <span>${price}</span>
    </div>
  `;

  return L.divIcon({
    className: 'custom-hotel-price-pill',
    html: html,
    iconSize: [80, 28],
    iconAnchor: [40, 14]
  });
}
