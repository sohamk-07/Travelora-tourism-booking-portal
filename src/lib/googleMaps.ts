/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

export const GOOGLE_MAPS_API_KEY =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) ||
  'AIzaSyB3LkCZS4OyaS3N3T9pBhbhvzWzrGsRkko';

export const DEMO_MAP_ID = 'DEMO_MAP_ID';

export const GMP_ATTRIBUTION_IDS = ['gmp_mcp_codeassist_v1_aistudio'];

export type GoogleMapType = 'roadmap' | 'satellite' | 'hybrid' | 'terrain';

interface MapCameraControllerProps {
  center?: { lat: number; lng: number } | null;
  zoom?: number;
  mapTypeId?: GoogleMapType;
}

/**
 * Declarative camera and layer controller for @vis.gl/react-google-maps Map instances
 */
export const MapCameraController: React.FC<MapCameraControllerProps> = ({
  center,
  zoom,
  mapTypeId = 'roadmap'
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (center && typeof center.lat === 'number' && typeof center.lng === 'number') {
      map.panTo({ lat: center.lat, lng: center.lng });
    }
  }, [map, center?.lat, center?.lng]);

  useEffect(() => {
    if (!map || typeof zoom !== 'number') return;
    map.setZoom(zoom);
  }, [map, zoom]);

  useEffect(() => {
    if (!map || !mapTypeId) return;
    map.setMapTypeId(mapTypeId);
  }, [map, mapTypeId]);

  return null;
};
