/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  TouristDestination, 
  TourPackage, 
  Hotel, 
  Booking, 
  BookingStatus,
  BookingNotification,
  UserProfile, 
  DestinationCategory,
  AdminAccount,
  TripReview
} from '../types';
import { 
  POPULAR_DESTINATIONS, 
  TOP_DEALS_PACKAGES, 
  HOTELS_LIST, 
  INITIAL_DEMO_BOOKINGS,
  INITIAL_DEMO_REVIEWS,
  INITIAL_DEMO_NOTIFICATIONS
} from '../data/mockData';

// Default Supabase Project Configuration (Project ID: nixdzqvnstsyftepkitc)
export const DEFAULT_SUPABASE_PROJECT_ID = 'nixdzqvnstsyftepkitc';
export const DEFAULT_SUPABASE_URL = 'https://nixdzqvnstsyftepkitc.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_mUwSQLZF9M-RZpaSy7IN0g_OSHYg0cJ';

// Check environment configuration
const envUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL as string) || '';
const envKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY as string) || '';

// Stored keys from UI config if configured dynamically
const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('travelora_custom_supabase_url') || '' : '';
const storedKey = typeof window !== 'undefined' ? localStorage.getItem('travelora_custom_supabase_key') || '' : '';

export const SUPABASE_URL = storedUrl || envUrl;
export const SUPABASE_ANON_KEY = storedKey || envKey;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    SUPABASE_URL.startsWith('http') &&
    SUPABASE_ANON_KEY.length > 10
  );
};

// Create client if configured
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Storage keys for local persistence & offline fallback
const STORAGE_KEYS = {
  USER: 'travelora_active_user',
  USERS_LIST: 'travelora_users_db',
  DESTINATIONS: 'travelora_destinations_db',
  PACKAGES: 'travelora_packages_db',
  HOTELS: 'travelora_hotels_db',
  BOOKINGS: 'travelora_bookings_db',
  REVIEWS: 'travelora_reviews_db',
  FAVORITES: 'travelora_favorites_db',
  CURRENCY: 'travelora_currency_pref',
  NOTIFICATIONS: 'travelora_notifications_db',
  MASTER_ADMIN: 'travelora_master_admin_v1',
  MASTER_ADMIN_CREDS: 'travelora_master_admin_creds_v1',
  ADMIN_SESSION: 'travelora_active_admin_session_v1'
};

// Helper to get local data safely
function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing ${key} to storage:`, e);
  }
}

// Seed initial collections in local database
export function initLocalDatabase() {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(STORAGE_KEYS.DESTINATIONS)) {
    setLocal(STORAGE_KEYS.DESTINATIONS, POPULAR_DESTINATIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PACKAGES)) {
    setLocal(STORAGE_KEYS.PACKAGES, TOP_DEALS_PACKAGES);
  }
  if (localStorage.getItem(STORAGE_KEYS.HOTELS)) {
    const cached = getLocal<Hotel[]>(STORAGE_KEYS.HOTELS, []);
    const filtered = cached.filter(h => h.id !== 'hotel-hoshinoya-kyoto');
    if (filtered.length !== cached.length) {
      setLocal(STORAGE_KEYS.HOTELS, filtered);
    }
  } else {
    setLocal(STORAGE_KEYS.HOTELS, HOTELS_LIST);
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    setLocal(STORAGE_KEYS.BOOKINGS, INITIAL_DEMO_BOOKINGS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    setLocal(STORAGE_KEYS.REVIEWS, INITIAL_DEMO_REVIEWS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    setLocal(STORAGE_KEYS.NOTIFICATIONS, INITIAL_DEMO_NOTIFICATIONS);
  }
}

// Auto init on import
initLocalDatabase();

// ================= AUTHENTICATION APIS =================

export async function getCurrentUser(): Promise<UserProfile | null> {
  if (supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        return {
          id: user.id,
          email: user.email || '',
          fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Traveler',
          avatarUrl: user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          phone: user.user_metadata?.phone || '+91 98765 43210',
          city: user.user_metadata?.city || 'New Delhi',
          createdAt: user.created_at || new Date().toISOString()
        };
      }
    } catch (e) {
      console.warn('Supabase auth session check failed, using local user store', e);
    }
  }
  return getLocal<UserProfile | null>(STORAGE_KEYS.USER, null);
}

export async function signUpUser(
  email: string, 
  pass: string, 
  fullName: string, 
  phone?: string,
  avatarUrl?: string
): Promise<{ user: UserProfile | null; error: string | null }> {
  const chosenAvatar = avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName || email)}`;
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: { 
            full_name: fullName,
            phone: phone || '+91 98765 43210',
            avatar_url: chosenAvatar
          }
        }
      });
      if (error) throw error;
      if (data.user) {
        const profile: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          fullName,
          avatarUrl: chosenAvatar,
          phone: phone || '+91 98765 43210',
          city: 'India',
          createdAt: data.user.created_at || new Date().toISOString()
        };
        setLocal(STORAGE_KEYS.USER, profile);
        return { user: profile, error: null };
      }
    } catch (err: any) {
      console.warn('Supabase signup fallback triggered:', err.message);
    }
  }

  // Local/Sandbox Sign Up
  const users = getLocal<any[]>(STORAGE_KEYS.USERS_LIST, []);
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return { user: null, error: 'An account with this email address already exists. Please sign in instead.' };
  }

  const newProfile: UserProfile = {
    id: 'usr-' + Math.random().toString(36).substring(2, 9),
    email,
    fullName: fullName || 'Indian Traveler',
    avatarUrl: chosenAvatar,
    phone: phone || '+91 98765 43210',
    city: 'Mumbai',
    createdAt: new Date().toISOString()
  };

  users.push({ ...newProfile, password: pass });
  setLocal(STORAGE_KEYS.USERS_LIST, users);
  setLocal(STORAGE_KEYS.USER, newProfile);
  return { user: newProfile, error: null };
}

export async function signInUser(email: string, pass: string): Promise<{ user: UserProfile | null; error: string | null }> {
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass
      });
      if (!error && data.user) {
        const profile: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          fullName: data.user.user_metadata?.full_name || email.split('@')[0],
          avatarUrl: data.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
          phone: data.user.user_metadata?.phone || '+91 98765 43210',
          createdAt: data.user.created_at || new Date().toISOString()
        };
        setLocal(STORAGE_KEYS.USER, profile);
        return { user: profile, error: null };
      }
    } catch (err: any) {
      console.warn('Supabase signin failed, checking local registry:', err.message);
    }
  }

  // Local fallback
  const users = getLocal<any[]>(STORAGE_KEYS.USERS_LIST, []);
  const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!found && email !== 'traveler@travelora.in' && email !== 'traveler@travelora.com') {
    return { user: null, error: 'Invalid credentials. You can also sign up or click Quick Demo Login.' };
  }

  const profile: UserProfile = found ? {
    id: found.id,
    email: found.email,
    fullName: found.fullName,
    avatarUrl: found.avatarUrl,
    phone: found.phone,
    city: found.city,
    createdAt: found.createdAt
  } : {
    id: 'user-demo-traveler',
    email: 'rohan.sharma@travelora.in',
    fullName: 'Rohan Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    phone: '+91 98765 43210',
    city: 'New Delhi',
    createdAt: new Date().toISOString()
  };

  setLocal(STORAGE_KEYS.USER, profile);
  return { user: profile, error: null };
}

export async function signOutUser(): Promise<void> {
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signOut notice:', e);
    }
  }
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
}

export function signInDemoUser(role: 'traveler' | 'explorer' | 'investor' = 'traveler'): UserProfile {
  const profile: UserProfile = role === 'traveler' ? {
    id: 'user-demo-traveler',
    email: 'rohan.sharma@travelora.in',
    fullName: 'Rohan Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    phone: '+91 98765 43210',
    city: 'New Delhi',
    createdAt: new Date().toISOString()
  } : {
    id: 'user-demo-explorer',
    email: 'ananya.sen@travelora.in',
    fullName: 'Ananya Sen',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    phone: '+91 91234 56789',
    city: 'Bengaluru',
    createdAt: new Date().toISOString()
  };
  setLocal(STORAGE_KEYS.USER, profile);
  return profile;
}

// ================= DATA NORMALIZERS & DB MAPPERS =================

function mapDbDestination(row: any): TouristDestination {
  const fallback = POPULAR_DESTINATIONS.find(d => d.id === row.id);
  return {
    id: row.id,
    name: row.name || fallback?.name || 'Destination',
    state: row.state ?? fallback?.state,
    country: row.country || fallback?.country || 'India',
    region: row.region || fallback?.region || 'India',
    category: (row.category || fallback?.category || 'hill_station') as DestinationCategory,
    image: row.image || fallback?.image || 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
    gallery: Array.isArray(row.gallery) && row.gallery.length > 0 ? row.gallery : (fallback?.gallery || [row.image]),
    rating: Number(row.rating ?? fallback?.rating ?? 4.9),
    reviewsCount: Number(row.reviews_count ?? row.reviewsCount ?? fallback?.reviewsCount ?? 1200),
    discountPercent: Number(row.discount_percent ?? row.discountPercent ?? fallback?.discountPercent ?? 20),
    startingPrice: Number(row.starting_price ?? row.startingPrice ?? fallback?.startingPrice ?? 14999),
    originalPrice: row.original_price ? Number(row.original_price) : (row.originalPrice ? Number(row.originalPrice) : fallback?.originalPrice),
    description: row.description || fallback?.description || '',
    longDescription: row.long_description || row.longDescription || fallback?.longDescription || row.description,
    bestSeason: row.best_season || row.bestSeason || fallback?.bestSeason || 'Year-round',
    climate: row.climate || fallback?.climate || 'Pleasant',
    coordinates: (typeof row.coordinates === 'object' && row.coordinates && typeof row.coordinates.lat === 'number') 
      ? row.coordinates 
      : (fallback?.coordinates || { lat: 20.5937, lng: 78.9629 }),
    tags: Array.isArray(row.tags) && row.tags.length > 0 ? row.tags : (fallback?.tags || ['Travel', 'Explore']),
    popularAttractions: Array.isArray(row.popular_attractions) && row.popular_attractions.length > 0 
      ? row.popular_attractions 
      : (Array.isArray(row.popularAttractions) && row.popularAttractions.length > 0 ? row.popularAttractions : (fallback?.popularAttractions || [])),
    thingsToDo: Array.isArray(row.things_to_do) && row.things_to_do.length > 0 
      ? row.things_to_do 
      : (Array.isArray(row.thingsToDo) && row.thingsToDo.length > 0 ? row.thingsToDo : (fallback?.thingsToDo || [])),
    nearbyHotels: fallback?.nearbyHotels,
    nearbyRestaurants: fallback?.nearbyRestaurants,
    explorationRoadmap: fallback?.explorationRoadmap
  };
}

function mapDbPackage(row: any): TourPackage {
  const fallback = TOP_DEALS_PACKAGES.find(p => p.id === row.id);
  return {
    id: row.id,
    title: row.title || fallback?.title || 'Tour Package',
    destination: row.destination || fallback?.destination || 'India',
    state: row.state ?? fallback?.state,
    country: row.country || fallback?.country || 'India',
    duration: row.duration || fallback?.duration || `${row.days_count || 5} Days / ${row.nights_count || 4} Nights`,
    daysCount: Number(row.days_count ?? row.daysCount ?? fallback?.daysCount ?? 5),
    nightsCount: Number(row.nights_count ?? row.nightsCount ?? fallback?.nightsCount ?? 4),
    originalPrice: Number(row.original_price ?? row.originalPrice ?? fallback?.originalPrice ?? 24999),
    discountedPrice: Number(row.discounted_price ?? row.discountedPrice ?? fallback?.discountedPrice ?? 18999),
    badge: (row.badge || fallback?.badge || 'Best Seller') as any,
    image: row.image || fallback?.image || 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
    rating: Number(row.rating ?? fallback?.rating ?? 4.9),
    reviewsCount: Number(row.reviews_count ?? row.reviewsCount ?? fallback?.reviewsCount ?? 450),
    highlights: Array.isArray(row.highlights) && row.highlights.length > 0 ? row.highlights : (fallback?.highlights || []),
    includesFlight: Boolean(row.includes_flight ?? row.includesFlight ?? fallback?.includesFlight),
    category: (row.category || fallback?.category || 'hill_station') as any,
    itinerary: Array.isArray(row.itinerary) && row.itinerary.length > 0 ? row.itinerary : (fallback?.itinerary || []),
    inclusions: Array.isArray(row.inclusions) && row.inclusions.length > 0 ? row.inclusions : (fallback?.inclusions || []),
    exclusions: Array.isArray(row.exclusions) && row.exclusions.length > 0 ? row.exclusions : (fallback?.exclusions || [])
  };
}

function mapDbHotel(row: any): Hotel {
  const fallback = HOTELS_LIST.find(h => h.id === row.id);
  return {
    id: row.id,
    name: row.name || fallback?.name || 'Luxury Hotel',
    destinationId: row.destination_id || row.destinationId || fallback?.destinationId,
    destinationName: row.destination_name || row.destinationName || fallback?.destinationName,
    closestAttraction: row.closest_attraction || row.closestAttraction || fallback?.closestAttraction,
    location: row.location || fallback?.location || 'Central Location',
    city: row.city || fallback?.city || 'India',
    state: row.state ?? fallback?.state,
    country: row.country || fallback?.country || 'India',
    image: row.image || fallback?.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    pricePerNight: Number(row.price_per_night ?? row.pricePerNight ?? fallback?.pricePerNight ?? 14999),
    originalPrice: row.original_price ? Number(row.original_price) : (row.originalPrice ? Number(row.originalPrice) : fallback?.originalPrice),
    rating: Number(row.rating ?? fallback?.rating ?? 4.9),
    reviewsCount: Number(row.reviews_count ?? row.reviewsCount ?? fallback?.reviewsCount ?? 600),
    stars: Number(row.stars ?? fallback?.stars ?? 5),
    type: (row.type || fallback?.type || 'luxury_hotel') as any,
    amenities: Array.isArray(row.amenities) && row.amenities.length > 0 ? row.amenities : (fallback?.amenities || []),
    coordinates: (typeof row.coordinates === 'object' && row.coordinates && typeof row.coordinates.lat === 'number') 
      ? row.coordinates 
      : (fallback?.coordinates || { lat: 24.5754, lng: 73.6800 }),
    roomsAvailable: Number(row.rooms_available ?? row.roomsAvailable ?? fallback?.roomsAvailable ?? 5),
    description: row.description || fallback?.description || '',
    roomTypes: Array.isArray(row.room_types) && row.room_types.length > 0 ? row.room_types : (fallback?.roomTypes || [])
  };
}

// ================= DESTINATIONS APIS =================

export async function getDestinations(category?: DestinationCategory | 'all'): Promise<TouristDestination[]> {
  let list = getLocal<TouristDestination[]>(STORAGE_KEYS.DESTINATIONS, POPULAR_DESTINATIONS);
  if (!list || list.length === 0) {
    list = POPULAR_DESTINATIONS;
    setLocal(STORAGE_KEYS.DESTINATIONS, list);
  } else {
    // Ensure fresh verified galleries for destinations (e.g. Kashmir)
    const kashmirFresh = POPULAR_DESTINATIONS.find(d => d.id === 'dest-kashmir');
    if (kashmirFresh) {
      list = list.map(d => d.id === 'dest-kashmir' ? { ...d, image: kashmirFresh.image, gallery: kashmirFresh.gallery } : d);
    }
  }

  if (supabase) {
    try {
      let query = supabase.from('destinations').select('*');
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        // Merge Supabase items with default catalog so NO destination is ever lost
        const destMap = new Map<string, TouristDestination>();
        POPULAR_DESTINATIONS.forEach(d => destMap.set(d.id, d));
        data.forEach((row: any) => {
          const mapped = mapDbDestination(row);
          destMap.set(mapped.id, mapped);
        });
        list = Array.from(destMap.values());
        setLocal(STORAGE_KEYS.DESTINATIONS, list);
      }
    } catch (e) {
      console.warn('Supabase destinations fallback triggered:', e);
    }
  }

  // Apply real-time user reviews & dynamic rating averages
  list = applyAggregatedRatingsToDestinations(list);

  if (category && category !== 'all') {
    if (category === 'india_domestic') {
      return list.filter(d => d.country === 'India');
    }
    return list.filter(d => d.category === category || (category === 'beach' && d.tags.includes('Beaches')));
  }
  return list;
}

export async function getDestinationById(id: string): Promise<TouristDestination | undefined> {
  const all = await getDestinations('all');
  return all.find(d => d.id === id);
}

// ================= TOUR PACKAGES APIS =================

export async function getTourPackages(category?: string): Promise<TourPackage[]> {
  let list = getLocal<TourPackage[]>(STORAGE_KEYS.PACKAGES, TOP_DEALS_PACKAGES);
  if (!list || list.length === 0) {
    list = TOP_DEALS_PACKAGES;
    setLocal(STORAGE_KEYS.PACKAGES, list);
  }

  if (supabase) {
    try {
      let query = supabase.from('packages').select('*');
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const pkgMap = new Map<string, TourPackage>();
        TOP_DEALS_PACKAGES.forEach(p => pkgMap.set(p.id, p));
        data.forEach((row: any) => {
          const mapped = mapDbPackage(row);
          pkgMap.set(mapped.id, mapped);
        });
        list = Array.from(pkgMap.values());
        setLocal(STORAGE_KEYS.PACKAGES, list);
      }
    } catch (e) {
      console.warn('Supabase packages fallback triggered:', e);
    }
  }

  // Apply real-time user reviews & dynamic rating averages
  list = applyAggregatedRatingsToPackages(list);

  if (category && category !== 'all') {
    return list.filter(p => p.category === category || p.destination.toLowerCase().includes(category.toLowerCase()));
  }
  return list;
}

export async function getTourPackageById(id: string): Promise<TourPackage | undefined> {
  const all = await getTourPackages('all');
  return all.find(p => p.id === id);
}

// ================= HOTELS APIS =================

export async function getHotels(filter?: string): Promise<Hotel[]> {
  let list = getLocal<Hotel[]>(STORAGE_KEYS.HOTELS, HOTELS_LIST);
  if (!list || list.length === 0) {
    list = HOTELS_LIST;
    setLocal(STORAGE_KEYS.HOTELS, list);
  }

  if (supabase) {
    try {
      const { data, error } = await supabase.from('hotels').select('*');
      if (!error && data && data.length > 0) {
        const hotelMap = new Map<string, Hotel>();
        HOTELS_LIST.forEach(h => hotelMap.set(h.id, h));
        data.forEach((row: any) => {
          const mapped = mapDbHotel(row);
          hotelMap.set(mapped.id, mapped);
        });
        hotelMap.delete('hotel-hoshinoya-kyoto');
        list = Array.from(hotelMap.values());
        setLocal(STORAGE_KEYS.HOTELS, list);
      }
    } catch (e) {
      console.warn('Supabase hotels fallback triggered:', e);
    }
  }

  // Ensure removed hotel is never present
  list = list.filter(h => h.id !== 'hotel-hoshinoya-kyoto');

  // Apply real-time user reviews & dynamic rating averages
  list = applyAggregatedRatingsToHotels(list);

  if (filter && filter !== 'all') {
    return list.filter(h => 
      h.city.toLowerCase().includes(filter.toLowerCase()) || 
      h.state?.toLowerCase().includes(filter.toLowerCase()) ||
      h.name.toLowerCase().includes(filter.toLowerCase())
    );
  }
  return list;
}

export async function getHotelById(id: string): Promise<Hotel | undefined> {
  const all = await getHotels();
  return all.find(h => h.id === id);
}

// ================= DATABASE CATALOG SYNC UTILITY =================

export async function syncAllCatalogToSupabase(): Promise<{ success: boolean; count: number; error?: string }> {
  if (!supabase) return { success: false, count: 0, error: 'Supabase client is not initialized.' };

  try {
    const destinationsPayload = POPULAR_DESTINATIONS.map(d => ({
      id: d.id,
      name: d.name,
      state: d.state || null,
      country: d.country,
      region: d.region,
      category: d.category,
      image: d.image,
      gallery: d.gallery || [d.image],
      rating: d.rating,
      reviews_count: d.reviewsCount,
      discount_percent: d.discountPercent,
      starting_price: d.startingPrice,
      original_price: d.originalPrice || null,
      description: d.description,
      long_description: d.longDescription,
      best_season: d.bestSeason,
      climate: d.climate,
      coordinates: d.coordinates,
      tags: d.tags,
      popular_attractions: d.popularAttractions
    }));

    const packagesPayload = TOP_DEALS_PACKAGES.map(p => ({
      id: p.id,
      title: p.title,
      destination: p.destination,
      state: p.state || null,
      country: p.country,
      duration: p.duration,
      days_count: p.daysCount,
      nights_count: p.nightsCount,
      original_price: p.originalPrice,
      discounted_price: p.discountedPrice,
      badge: p.badge,
      image: p.image,
      rating: p.rating,
      reviews_count: p.reviewsCount,
      highlights: p.highlights,
      includes_flight: p.includesFlight,
      category: p.category,
      itinerary: p.itinerary,
      inclusions: p.inclusions,
      exclusions: p.exclusions
    }));

    const hotelsPayload = HOTELS_LIST.map(h => ({
      id: h.id,
      name: h.name,
      location: h.location,
      city: h.city,
      state: h.state || null,
      country: h.country,
      image: h.image,
      price_per_night: h.pricePerNight,
      original_price: h.originalPrice || null,
      rating: h.rating,
      reviews_count: h.reviewsCount,
      stars: h.stars,
      type: h.type,
      amenities: h.amenities,
      coordinates: h.coordinates,
      rooms_available: h.roomsAvailable,
      description: h.description,
      room_types: h.roomTypes
    }));

    const { error: destErr } = await supabase.from('destinations').upsert(destinationsPayload);
    if (destErr) throw destErr;

    const { error: pkgErr } = await supabase.from('packages').upsert(packagesPayload);
    if (pkgErr) throw pkgErr;

    const { error: hotelErr } = await supabase.from('hotels').upsert(hotelsPayload);
    if (hotelErr) throw hotelErr;

    return { 
      success: true, 
      count: destinationsPayload.length + packagesPayload.length + hotelsPayload.length 
    };
  } catch (err: any) {
    return { success: false, count: 0, error: err.message || 'Upsert failed' };
  }
}

// ================= STATUS & NOTIFICATION HELPERS =================

export function getBookingStatusMessage(status: BookingStatus): {
  headline: string;
  description: string;
  badgeText: string;
  color: 'amber' | 'emerald' | 'rose' | 'indigo';
} {
  switch (status) {
    case 'pending':
      return {
        headline: 'Your booking is pending. Please wait for admin confirmation.',
        description: 'Our team is reviewing your reservation details and slot allocations. You will receive an instant notification once confirmed.',
        badgeText: 'PENDING CONFIRMATION',
        color: 'amber'
      };
    case 'confirmed':
      return {
        headline: 'Your booking has been confirmed successfully.',
        description: 'Your itinerary is officially confirmed, vouchers are ready, and hotel rooms/permits are secured.',
        badgeText: 'CONFIRMED',
        color: 'emerald'
      };
    case 'cancelled':
      return {
        headline: 'Your booking has been cancelled.',
        description: 'This booking has been cancelled. Any eligible refund is being processed to your original payment method.',
        badgeText: 'CANCELLED',
        color: 'rose'
      };
    case 'completed':
      return {
        headline: 'Your booking is completed. We hope you had a fantastic journey!',
        description: 'Trip concluded! We hope you had memorable experiences. Please leave a verified review to guide fellow travelers.',
        badgeText: 'COMPLETED',
        color: 'indigo'
      };
    default:
      return {
        headline: 'Your booking status has been updated.',
        description: 'Please review your reservation details.',
        badgeText: 'UPDATED',
        color: 'amber'
      };
  }
}

// ================= NOTIFICATION APIS =================

export async function getNotifications(userId?: string): Promise<BookingNotification[]> {
  const notifs = getLocal<BookingNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_DEMO_NOTIFICATIONS);
  if (userId) {
    return notifs.filter(n => !n.userId || n.userId === userId);
  }
  return notifs;
}

export function getNotificationsSync(userId?: string): BookingNotification[] {
  const notifs = getLocal<BookingNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_DEMO_NOTIFICATIONS);
  if (userId) {
    return notifs.filter(n => !n.userId || n.userId === userId);
  }
  return notifs;
}

export async function createNotification(
  notifData: Omit<BookingNotification, 'id' | 'createdAt'>
): Promise<BookingNotification> {
  const newNotif: BookingNotification = {
    ...notifData,
    id: 'notif-' + Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString()
  };

  const list = getLocal<BookingNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_DEMO_NOTIFICATIONS);
  const updated = [newNotif, ...list];
  setLocal(STORAGE_KEYS.NOTIFICATIONS, updated);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('travelora_notification_received', { detail: newNotif }));
  }

  return newNotif;
}

export async function markNotificationAsRead(id: string): Promise<void> {
  const list = getLocal<BookingNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_DEMO_NOTIFICATIONS);
  const updated = list.map(n => n.id === id ? { ...n, read: true } : n);
  setLocal(STORAGE_KEYS.NOTIFICATIONS, updated);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('travelora_notifications_updated'));
  }
}

export async function markAllNotificationsAsRead(userId?: string): Promise<void> {
  const list = getLocal<BookingNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_DEMO_NOTIFICATIONS);
  const updated = list.map(n => (!userId || n.userId === userId) ? { ...n, read: true } : n);
  setLocal(STORAGE_KEYS.NOTIFICATIONS, updated);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('travelora_notifications_updated'));
  }
}

export async function clearAllNotifications(userId?: string): Promise<void> {
  const list = getLocal<BookingNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_DEMO_NOTIFICATIONS);
  const remaining = userId ? list.filter(n => n.userId && n.userId !== userId) : [];
  setLocal(STORAGE_KEYS.NOTIFICATIONS, remaining);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('travelora_notifications_updated'));
  }
}

export async function deleteNotification(id: string): Promise<void> {
  const list = getLocal<BookingNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_DEMO_NOTIFICATIONS);
  const updated = list.filter(n => n.id !== id);
  setLocal(STORAGE_KEYS.NOTIFICATIONS, updated);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('travelora_notifications_updated'));
  }
}

// ================= BOOKING & RESERVATION APIS =================

export async function getBookings(userId?: string): Promise<Booking[]> {
  let bookings = getLocal<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_DEMO_BOOKINGS);

  if (supabase) {
    try {
      let query = supabase.from('bookings').select('*').order('created_at', { ascending: false });
      if (userId) {
        query = query.eq('user_id', userId);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        bookings = data.map((d: any) => ({
          id: d.id,
          bookingCode: d.booking_code || `TRV-${d.id.substring(0, 6).toUpperCase()}`,
          userId: d.user_id,
          itemType: d.item_type,
          itemId: d.item_id,
          title: d.title,
          image: d.image,
          location: d.location,
          departureCity: d.departure_city,
          startDate: d.start_date,
          endDate: d.end_date,
          guests: d.guests || { adults: 2, children: 0 },
          travelerName: d.traveler_name || 'Traveler',
          travelerEmail: d.traveler_email || '',
          travelerPhone: d.traveler_phone || '+91 98765 43210',
          totalPrice: Number(d.total_price),
          status: d.status || 'pending',
          statusMessage: d.status_message || getBookingStatusMessage(d.status || 'pending').headline,
          cancellationReason: d.cancellation_reason,
          cancelledAt: d.cancelled_at,
          refundAmount: d.refund_amount ? Number(d.refund_amount) : undefined,
          specialRequests: d.special_requests,
          customizationOptions: d.customization_options || {},
          createdAt: d.created_at,
          reviewed: d.reviewed,
          reviewId: d.review_id
        }));
        if (!userId) {
          setLocal(STORAGE_KEYS.BOOKINGS, bookings);
        }
      }
    } catch (e) {
      // Local fallback
    }
  }

  // Cross-reference with existing reviews to ensure reviewed status is synced
  const allReviews = getLocal<TripReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_DEMO_REVIEWS);
  const reviewedBookingMap = new Map(allReviews.map(r => [r.bookingId, r.id]));
  bookings = bookings.map(b => {
    const isRev = reviewedBookingMap.has(b.id);
    const statusMsg = b.statusMessage || getBookingStatusMessage(b.status).headline;
    return {
      ...b,
      statusMessage: statusMsg,
      reviewed: isRev || b.reviewed,
      reviewId: isRev ? reviewedBookingMap.get(b.id) : b.reviewId
    };
  });

  if (userId) {
    return bookings.filter(b => b.userId === userId);
  }
  return bookings;
}

export async function createBooking(
  bookingData: Omit<Booking, 'id' | 'createdAt' | 'bookingCode'>
): Promise<Booking> {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const code = `TRV-${bookingData.itemType.substring(0, 3).toUpperCase()}-${randomSuffix}`;
  const initialStatus: BookingStatus = bookingData.status || 'pending';
  const statusInfo = getBookingStatusMessage(initialStatus);
  
  const cleanEmail = (bookingData.travelerEmail || '').trim();
  const cleanName = (bookingData.travelerName || '').trim() || 'Traveler';
  const cleanPhone = (bookingData.travelerPhone || '').trim();
  
  // Resolve user ID cleanly (never default to hardcoded demo ID)
  const resolvedUserId = bookingData.userId && bookingData.userId !== 'user-demo-traveler'
    ? bookingData.userId
    : (cleanEmail ? `usr-${cleanEmail.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : 'guest-traveler');

  const newBooking: Booking = {
    ...bookingData,
    id: 'book-' + Math.random().toString(36).substring(2, 9),
    bookingCode: code,
    userId: resolvedUserId,
    travelerName: cleanName,
    travelerEmail: cleanEmail,
    travelerPhone: cleanPhone,
    status: initialStatus,
    statusMessage: statusInfo.headline,
    statusHistory: [
      {
        status: initialStatus,
        timestamp: new Date().toISOString(),
        note: initialStatus === 'pending'
          ? 'Booking request submitted. Awaiting administrative review and confirmation.'
          : 'Booking placed and confirmed.',
        updatedBy: 'system'
      }
    ],
    createdAt: new Date().toISOString()
  };

  // Try Supabase insert
  if (supabase) {
    try {
      await supabase.from('bookings').insert([{
        id: newBooking.id,
        booking_code: newBooking.bookingCode,
        user_id: newBooking.userId,
        item_type: newBooking.itemType,
        item_id: newBooking.itemId,
        title: newBooking.title,
        image: newBooking.image,
        location: newBooking.location,
        departure_city: newBooking.departureCity,
        start_date: newBooking.startDate,
        end_date: newBooking.endDate,
        guests: newBooking.guests,
        traveler_name: newBooking.travelerName,
        traveler_email: newBooking.travelerEmail,
        traveler_phone: newBooking.travelerPhone,
        total_price: newBooking.totalPrice,
        status: newBooking.status,
        special_requests: newBooking.specialRequests,
        customization_options: newBooking.customizationOptions,
        created_at: newBooking.createdAt
      }]);

      // Insert into dedicated package_bookings table if package
      if (newBooking.itemType === 'package') {
        try {
          await supabase.from('package_bookings').insert([{
            id: newBooking.id,
            booking_code: newBooking.bookingCode,
            user_id: newBooking.userId,
            package_id: newBooking.itemId,
            package_title: newBooking.title,
            destination: newBooking.location,
            departure_city: newBooking.departureCity || 'New Delhi (DEL)',
            start_date: newBooking.startDate,
            end_date: newBooking.endDate,
            adults: newBooking.guests?.adults || 1,
            children: newBooking.guests?.children || 0,
            traveler_name: newBooking.travelerName,
            traveler_email: newBooking.travelerEmail,
            traveler_phone: newBooking.travelerPhone,
            total_price: newBooking.totalPrice,
            status: newBooking.status,
            special_requests: newBooking.specialRequests,
            customization_options: newBooking.customizationOptions,
            created_at: newBooking.createdAt
          }]);
        } catch {
          // Table may not exist yet
        }
      }

      // Insert into dedicated hotel_bookings table if hotel
      if (newBooking.itemType === 'hotel') {
        try {
          await supabase.from('hotel_bookings').insert([{
            id: newBooking.id,
            booking_code: newBooking.bookingCode,
            user_id: newBooking.userId,
            hotel_id: newBooking.itemId,
            hotel_name: newBooking.title,
            location: newBooking.location,
            check_in_date: newBooking.startDate,
            check_out_date: newBooking.endDate,
            adults: newBooking.guests?.adults || 1,
            children: newBooking.guests?.children || 0,
            traveler_name: newBooking.travelerName,
            traveler_email: newBooking.travelerEmail,
            traveler_phone: newBooking.travelerPhone,
            total_price: newBooking.totalPrice,
            status: newBooking.status,
            special_requests: newBooking.specialRequests,
            customization_options: newBooking.customizationOptions,
            created_at: newBooking.createdAt
          }]);
        } catch {
          // Table may not exist yet
        }
      }

      // Also upsert to travelers table in Supabase if exists
      if (cleanEmail) {
        try {
          await supabase.from('travelers').upsert([{
            email: cleanEmail,
            full_name: cleanName,
            phone: cleanPhone,
            departure_city: newBooking.departureCity || 'Direct Arrival',
            travel_date: newBooking.startDate,
            adults: newBooking.guests?.adults || 1,
            children: newBooking.guests?.children || 0,
            last_booking_code: newBooking.bookingCode,
            updated_at: new Date().toISOString()
          }], { onConflict: 'email' });
        } catch {
          // Table may not exist yet in cloud instance
        }
      }
    } catch (e) {
      console.warn('Supabase booking insert fallback:', e);
    }
  }

  // Local storage
  const bookings = getLocal<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_DEMO_BOOKINGS);
  const updated = [newBooking, ...bookings];
  setLocal(STORAGE_KEYS.BOOKINGS, updated);

  // Automatically decrement available rooms for hotel bookings
  if (bookingData.itemType === 'hotel' && bookingData.itemId) {
    decrementHotelRooms(bookingData.itemId, 1);
  }

  // Create real-time notification for the user
  await createNotification({
    bookingId: newBooking.id,
    bookingCode: newBooking.bookingCode,
    userId: newBooking.userId,
    type: initialStatus === 'pending' ? 'status_change' : 'confirmation',
    title: initialStatus === 'pending' ? 'Booking Placed (Pending Confirmation)' : 'Booking Confirmed!',
    message: statusInfo.headline,
    status: initialStatus,
    read: false
  });

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('travelora_booking_created', { detail: newBooking }));
  }

  return newBooking;
}

export async function updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | null> {
  const bookings = getLocal<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_DEMO_BOOKINGS);
  const index = bookings.findIndex(b => b.id === id);
  if (index === -1) return null;

  const currentBooking = bookings[index];
  const isStatusChanging = updates.status && updates.status !== currentBooking.status;
  const newStatus = (updates.status || currentBooking.status) as BookingStatus;
  const statusInfo = getBookingStatusMessage(newStatus);

  const newStatusHistory = [...(currentBooking.statusHistory || [])];
  if (isStatusChanging) {
    newStatusHistory.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: updates.statusMessage || statusInfo.description,
      updatedBy: 'admin'
    });
  }

  const finalUpdates: Partial<Booking> = {
    ...updates,
    status: newStatus,
    statusMessage: updates.statusMessage || statusInfo.headline,
    statusHistory: newStatusHistory
  };

  // Sync to Supabase
  if (supabase) {
    try {
      const payload: any = {};
      if (finalUpdates.startDate) payload.start_date = finalUpdates.startDate;
      if (finalUpdates.endDate) payload.end_date = finalUpdates.endDate;
      if (finalUpdates.guests) payload.guests = finalUpdates.guests;
      if (finalUpdates.status) payload.status = finalUpdates.status;
      if (finalUpdates.specialRequests !== undefined) payload.special_requests = finalUpdates.specialRequests;
      if (finalUpdates.customizationOptions) payload.customization_options = finalUpdates.customizationOptions;
      if (finalUpdates.travelerPhone) payload.traveler_phone = finalUpdates.travelerPhone;
      if (finalUpdates.totalPrice !== undefined) payload.total_price = finalUpdates.totalPrice;
      if (finalUpdates.cancellationReason) payload.cancellation_reason = finalUpdates.cancellationReason;
      if (finalUpdates.cancelledAt) payload.cancelled_at = finalUpdates.cancelledAt;
      if (finalUpdates.refundAmount !== undefined) payload.refund_amount = finalUpdates.refundAmount;

      await supabase.from('bookings').update(payload).eq('id', id);

      // Also sync status update to package_bookings and hotel_bookings
      if (finalUpdates.status) {
        try {
          await supabase.from('package_bookings').update({ status: finalUpdates.status }).eq('id', id);
        } catch {}
        try {
          await supabase.from('hotel_bookings').update({ status: finalUpdates.status }).eq('id', id);
        } catch {}
      }
    } catch (e) {
      console.warn('Supabase booking update fallback:', e);
    }
  }

  // Local storage update
  bookings[index] = { ...currentBooking, ...finalUpdates };
  setLocal(STORAGE_KEYS.BOOKINGS, bookings);

  // If status changed, create notification & dispatch event
  if (isStatusChanging) {
    let notifTitle = 'Booking Status Update';
    if (newStatus === 'confirmed') notifTitle = 'Booking Confirmed!';
    else if (newStatus === 'cancelled') notifTitle = 'Booking Cancelled';
    else if (newStatus === 'completed') notifTitle = 'Booking Completed';
    else if (newStatus === 'pending') notifTitle = 'Booking Awaiting Review';

    await createNotification({
      bookingId: id,
      bookingCode: currentBooking.bookingCode,
      userId: currentBooking.userId,
      type: newStatus === 'confirmed' ? 'confirmation' : newStatus === 'cancelled' ? 'cancellation' : newStatus === 'completed' ? 'completion' : 'status_change',
      title: notifTitle,
      message: finalUpdates.statusMessage || statusInfo.headline,
      status: newStatus,
      read: false
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('travelora_booking_status_updated', {
        detail: {
          bookingId: id,
          newStatus,
          message: finalUpdates.statusMessage,
          updatedBooking: bookings[index]
        }
      }));
    }
  }

  return bookings[index];
}

export async function cancelBooking(id: string, reason: string = 'User requested cancellation'): Promise<boolean> {
  const bookings = getLocal<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_DEMO_BOOKINGS);
  const found = bookings.find(b => b.id === id);
  
  // Calculate refundable amount
  const refund = found ? Math.round(found.totalPrice * 0.95) : 0;
  const statusInfo = getBookingStatusMessage('cancelled');

  const result = await updateBooking(id, {
    status: 'cancelled',
    statusMessage: statusInfo.headline,
    cancellationReason: reason,
    cancelledAt: new Date().toISOString(),
    refundAmount: refund
  });

  if (result && found && found.itemType === 'hotel' && found.itemId) {
    restockHotelRooms(found.itemId, 1);
  }

  return result !== null;
}

// ================= HOTEL INVENTORY MANAGEMENT =================

export function decrementHotelRooms(hotelId: string, count: number = 1): Hotel | null {
  const hotels = getLocal<Hotel[]>(STORAGE_KEYS.HOTELS, HOTELS_LIST);
  const index = hotels.findIndex(h => h.id === hotelId);
  if (index === -1) return null;
  const current = typeof hotels[index].roomsAvailable === 'number' ? hotels[index].roomsAvailable : 6;
  const updatedRooms = Math.max(0, current - count);
  hotels[index] = { ...hotels[index], roomsAvailable: updatedRooms };
  setLocal(STORAGE_KEYS.HOTELS, hotels);

  if (supabase) {
    try {
      supabase.from('hotels').update({ rooms_available: updatedRooms }).eq('id', hotelId);
    } catch (_) {}
  }
  return hotels[index];
}

export function restockHotelRooms(hotelId: string, count: number = 1): Hotel | null {
  const hotels = getLocal<Hotel[]>(STORAGE_KEYS.HOTELS, HOTELS_LIST);
  const index = hotels.findIndex(h => h.id === hotelId);
  if (index === -1) return null;
  const current = typeof hotels[index].roomsAvailable === 'number' ? hotels[index].roomsAvailable : 0;
  const updatedRooms = current + count;
  hotels[index] = { ...hotels[index], roomsAvailable: updatedRooms };
  setLocal(STORAGE_KEYS.HOTELS, hotels);

  if (supabase) {
    try {
      supabase.from('hotels').update({ rooms_available: updatedRooms }).eq('id', hotelId);
    } catch (_) {}
  }
  return hotels[index];
}

export function setHotelRooms(hotelId: string, count: number): Hotel | null {
  const hotels = getLocal<Hotel[]>(STORAGE_KEYS.HOTELS, HOTELS_LIST);
  const index = hotels.findIndex(h => h.id === hotelId);
  if (index === -1) return null;
  const updatedRooms = Math.max(0, count);
  hotels[index] = { ...hotels[index], roomsAvailable: updatedRooms };
  setLocal(STORAGE_KEYS.HOTELS, hotels);

  if (supabase) {
    try {
      supabase.from('hotels').update({ rooms_available: updatedRooms }).eq('id', hotelId);
    } catch (_) {}
  }
  return hotels[index];
}

export const setHotelRoomInventory = setHotelRooms;
export const restoreHotelRooms = restockHotelRooms;

// ================= MASTER ADMIN & AUDIT MANAGEMENT =================

export function getMasterAdminAccount(): AdminAccount | null {
  return getLocal<AdminAccount | null>(STORAGE_KEYS.MASTER_ADMIN, null);
}

export function isMasterAdminSlotClaimed(): boolean {
  const account = getMasterAdminAccount();
  return Boolean(account && account.id);
}

export function createMasterAdminAccount(data: {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}): { success: boolean; error?: string; admin?: AdminAccount } {
  if (isMasterAdminSlotClaimed()) {
    return {
      success: false,
      error: 'Master Administrator slot has already been claimed! Only 1 admin account is allowed.'
    };
  }

  if (!data.email || !data.email.includes('@')) {
    return { success: false, error: 'Please enter a valid administrator email address.' };
  }

  if (!data.password || data.password.length < 4) {
    return { success: false, error: 'Password must be at least 4 characters.' };
  }

  const newAdmin: AdminAccount = {
    id: 'admin-master-' + Math.random().toString(36).substring(2, 9),
    fullName: data.fullName.trim() || 'Master Administrator',
    email: data.email.trim().toLowerCase(),
    phone: data.phone?.trim() || '',
    role: 'master_admin',
    claimedAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };

  // Save admin profile
  setLocal(STORAGE_KEYS.MASTER_ADMIN, newAdmin);
  // Save credentials securely in local storage
  setLocal(STORAGE_KEYS.MASTER_ADMIN_CREDS, {
    email: newAdmin.email,
    password: data.password
  });
  // Set current active admin session
  setLocal(STORAGE_KEYS.ADMIN_SESSION, newAdmin);

  return { success: true, admin: newAdmin };
}

export function loginMasterAdmin(
  email: string,
  password: string
): { success: boolean; error?: string; admin?: AdminAccount } {
  const account = getMasterAdminAccount();
  const creds = getLocal<{ email: string; password: string } | null>(STORAGE_KEYS.MASTER_ADMIN_CREDS, null);

  if (!account || !creds) {
    return {
      success: false,
      error: 'No Master Administrator account exists yet. Please initialize the master admin slot first.'
    };
  }

  if (
    creds.email.toLowerCase() !== email.trim().toLowerCase() ||
    creds.password !== password
  ) {
    return {
      success: false,
      error: 'Invalid administrator email or password.'
    };
  }

  // Update last login
  const updatedAdmin: AdminAccount = {
    ...account,
    lastLoginAt: new Date().toISOString()
  };
  setLocal(STORAGE_KEYS.MASTER_ADMIN, updatedAdmin);
  setLocal(STORAGE_KEYS.ADMIN_SESSION, updatedAdmin);

  return { success: true, admin: updatedAdmin };
}

export function getActiveAdminSession(): AdminAccount | null {
  return getLocal<AdminAccount | null>(STORAGE_KEYS.ADMIN_SESSION, null);
}

export function logoutMasterAdmin(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  }
}

export async function getAllBookingsForAdmin(): Promise<Booking[]> {
  return getBookings();
}

export async function updateBookingStatusByAdmin(
  id: string,
  status: BookingStatus,
  notes?: string
): Promise<Booking | null> {
  const statusInfo = getBookingStatusMessage(status);
  const customMessage = notes && notes.trim().length > 0 
    ? `${statusInfo.headline} (${notes.trim()})`
    : statusInfo.headline;

  const updates: Partial<Booking> = { 
    status,
    statusMessage: customMessage
  };
  if (notes !== undefined && notes.trim().length > 0) {
    updates.specialRequests = notes;
  }
  return updateBooking(id, updates);
}

// ================= POST-TRIP REVIEW & RATING APIS =================

export function getAllTripReviewsSync(): TripReview[] {
  return getLocal<TripReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_DEMO_REVIEWS);
}

export async function getTripReviews(itemId?: string): Promise<TripReview[]> {
  let reviews = getLocal<TripReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_DEMO_REVIEWS);
  if (supabase) {
    try {
      let query = supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (itemId) {
        query = query.or(`item_id.eq.${itemId},destination_id.eq.${itemId}`);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        reviews = data.map((d: any) => ({
          id: d.id,
          bookingId: d.booking_id,
          userId: d.user_id,
          travelerName: d.traveler_name,
          travelerEmail: d.traveler_email,
          itemType: d.item_type,
          itemId: d.item_id,
          destinationId: d.destination_id,
          itemTitle: d.item_title,
          rating: Number(d.rating),
          title: d.title,
          comment: d.comment,
          tags: d.tags || [],
          recommend: d.recommend ?? true,
          createdAt: d.created_at
        }));
      }
    } catch (e) {
      // Local fallback
    }
  }

  if (itemId) {
    return reviews.filter(r => r.itemId === itemId || r.destinationId === itemId);
  }
  return reviews;
}

export function getReviewForBooking(bookingId: string): TripReview | undefined {
  const reviews = getAllTripReviewsSync();
  return reviews.find(r => r.bookingId === bookingId);
}

export async function createTripReview(
  reviewData: Omit<TripReview, 'id' | 'createdAt'>
): Promise<TripReview> {
  const newReview: TripReview = {
    ...reviewData,
    id: 'rev-' + Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString()
  };

  // Try Supabase insert
  if (supabase) {
    try {
      await supabase.from('reviews').insert([{
        id: newReview.id,
        booking_id: newReview.bookingId,
        user_id: newReview.userId,
        traveler_name: newReview.travelerName,
        traveler_email: newReview.travelerEmail,
        item_type: newReview.itemType,
        item_id: newReview.itemId,
        destination_id: newReview.destinationId,
        item_title: newReview.itemTitle,
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
        tags: newReview.tags,
        recommend: newReview.recommend,
        created_at: newReview.createdAt
      }]);
    } catch (e) {
      console.warn('Supabase review insert fallback:', e);
    }
  }

  // Update local storage
  const currentReviews = getLocal<TripReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_DEMO_REVIEWS);
  const updatedReviews = [newReview, ...currentReviews];
  setLocal(STORAGE_KEYS.REVIEWS, updatedReviews);

  // Mark the corresponding booking as completed & reviewed
  if (newReview.bookingId) {
    await updateBooking(newReview.bookingId, {
      status: 'completed',
      reviewed: true,
      reviewId: newReview.id
    });
  }

  return newReview;
}

export function calculateAggregatedRating(
  itemId: string,
  baseRating: number,
  baseReviewsCount: number = 0,
  allReviews?: TripReview[]
): { rating: number; reviewsCount: number; userReviewsCount: number } {
  const count = baseReviewsCount || 0;
  const reviews = allReviews || getAllTripReviewsSync();
  const matched = reviews.filter(r => r.itemId === itemId || r.destinationId === itemId);

  if (matched.length === 0) {
    return {
      rating: Number(baseRating.toFixed(1)),
      reviewsCount: count,
      userReviewsCount: 0
    };
  }

  const userRatingsSum = matched.reduce((sum, r) => sum + r.rating, 0);
  const totalRatingSum = (baseRating * count) + userRatingsSum;
  const totalCount = count + matched.length;
  const avg = Math.min(5, Math.max(1, totalRatingSum / totalCount));

  return {
    rating: Number(avg.toFixed(1)),
    reviewsCount: totalCount,
    userReviewsCount: matched.length
  };
}

export function applyAggregatedRatingsToDestinations(
  destinations: TouristDestination[],
  reviews?: TripReview[]
): TouristDestination[] {
  const allReviews = reviews || getAllTripReviewsSync();
  return destinations.map(dest => {
    const agg = calculateAggregatedRating(dest.id, dest.rating, dest.reviewsCount, allReviews);
    return {
      ...dest,
      rating: agg.rating,
      reviewsCount: agg.reviewsCount
    };
  });
}

export function applyAggregatedRatingsToPackages(
  packages: TourPackage[],
  reviews?: TripReview[]
): TourPackage[] {
  const allReviews = reviews || getAllTripReviewsSync();
  return packages.map(pkg => {
    const agg = calculateAggregatedRating(pkg.id, pkg.rating, pkg.reviewsCount || 0, allReviews);
    return {
      ...pkg,
      rating: agg.rating,
      reviewsCount: agg.reviewsCount
    };
  });
}

export function applyAggregatedRatingsToHotels(
  hotels: Hotel[],
  reviews?: TripReview[]
): Hotel[] {
  const allReviews = reviews || getAllTripReviewsSync();
  return hotels.map(hotel => {
    const agg = calculateAggregatedRating(hotel.id, hotel.rating, hotel.reviewsCount, allReviews);
    return {
      ...hotel,
      rating: agg.rating,
      reviewsCount: agg.reviewsCount
    };
  });
}

export async function markBookingCompleted(id: string): Promise<Booking | null> {
  return updateBooking(id, { status: 'completed' });
}

export async function deleteBooking(id: string): Promise<boolean> {
  if (supabase) {
    try {
      await supabase.from('bookings').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase booking delete fallback:', e);
    }
  }
  const bookings = getLocal<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_DEMO_BOOKINGS);
  const filtered = bookings.filter(b => b.id !== id);
  setLocal(STORAGE_KEYS.BOOKINGS, filtered);
  return true;
}

// ================= SQL SCHEMA MIGRATION SCRIPT =================

export function generateSupabaseMigrationSQL(): string {
  return `-- ========================================================
-- TRAVELORA TOURIST & TRAVEL BOOKING PORTAL SCHEMA (SUPABASE)
-- Fully compatible with PostgreSQL & Supabase Database
-- ========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Destinations Table (Indian & Global Tourist Destinations)
CREATE TABLE IF NOT EXISTS public.destinations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT,
  country TEXT NOT NULL DEFAULT 'India',
  region TEXT,
  category TEXT NOT NULL, -- 'hill_station', 'beach', 'heritage', 'spiritual', 'adventure', 'international'
  image TEXT NOT NULL,
  gallery TEXT[] DEFAULT '{}',
  rating NUMERIC(3, 2) DEFAULT 4.9,
  reviews_count INTEGER DEFAULT 1200,
  discount_percent INTEGER DEFAULT 20,
  starting_price NUMERIC(10, 2) NOT NULL, -- In INR (₹)
  original_price NUMERIC(10, 2),
  description TEXT NOT NULL,
  long_description TEXT,
  best_season TEXT,
  climate TEXT,
  coordinates JSONB NOT NULL DEFAULT '{"lat": 20.5937, "lng": 78.9629}',
  tags TEXT[] DEFAULT '{}',
  popular_attractions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tour Packages Table
CREATE TABLE IF NOT EXISTS public.packages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  state TEXT,
  country TEXT NOT NULL DEFAULT 'India',
  duration TEXT NOT NULL, -- e.g. '5 Days / 4 Nights'
  days_count INTEGER DEFAULT 5,
  nights_count INTEGER DEFAULT 4,
  original_price NUMERIC(10, 2) NOT NULL, -- In INR (₹)
  discounted_price NUMERIC(10, 2) NOT NULL, -- In INR (₹)
  badge TEXT DEFAULT 'Best Seller', -- 'Best Seller', 'Hot Deal', 'New Offer'
  image TEXT NOT NULL,
  rating NUMERIC(3, 2) DEFAULT 4.9,
  reviews_count INTEGER DEFAULT 450,
  highlights TEXT[] DEFAULT '{}',
  includes_flight BOOLEAN DEFAULT false,
  category TEXT,
  itinerary JSONB DEFAULT '[]',
  inclusions TEXT[] DEFAULT '{}',
  exclusions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Luxury Hotels & Heritage Stays Table
CREATE TABLE IF NOT EXISTS public.hotels (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  country TEXT NOT NULL DEFAULT 'India',
  image TEXT NOT NULL,
  price_per_night NUMERIC(10, 2) NOT NULL, -- In INR (₹)
  original_price NUMERIC(10, 2),
  rating NUMERIC(3, 2) DEFAULT 4.9,
  reviews_count INTEGER DEFAULT 800,
  stars INTEGER DEFAULT 5,
  type TEXT DEFAULT 'luxury_hotel',
  amenities TEXT[] DEFAULT '{}',
  coordinates JSONB NOT NULL DEFAULT '{"lat": 24.5754, "lng": 73.6800}',
  rooms_available INTEGER DEFAULT 5,
  description TEXT NOT NULL,
  room_types JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Bookings & Reservations Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY DEFAULT ('book-' || substr(md5(random()::text), 1, 8)),
  booking_code TEXT NOT NULL,
  user_id TEXT NOT NULL,
  item_type TEXT NOT NULL, -- 'package', 'hotel', 'activity', 'custom_tour'
  item_id TEXT NOT NULL,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  location TEXT NOT NULL,
  departure_city TEXT DEFAULT 'New Delhi (DEL)',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  guests JSONB NOT NULL DEFAULT '{"adults": 2, "children": 0}',
  traveler_name TEXT NOT NULL,
  traveler_email TEXT NOT NULL,
  traveler_phone TEXT NOT NULL,
  total_price NUMERIC(12, 2) NOT NULL, -- In INR (₹)
  status TEXT NOT NULL DEFAULT 'confirmed', -- 'confirmed', 'pending', 'cancelled'
  cancellation_reason TEXT,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  refund_amount NUMERIC(12, 2),
  special_requests TEXT,
  customization_options JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Travelers & Registered Guests Table
CREATE TABLE IF NOT EXISTS public.travelers (
  email TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  departure_city TEXT DEFAULT 'New Delhi (DEL)',
  travel_date DATE,
  adults INTEGER DEFAULT 1,
  children INTEGER DEFAULT 0,
  last_booking_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure columns exist if table was previously created
ALTER TABLE public.travelers ADD COLUMN IF NOT EXISTS departure_city TEXT DEFAULT 'New Delhi (DEL)';
ALTER TABLE public.travelers ADD COLUMN IF NOT EXISTS travel_date DATE;
ALTER TABLE public.travelers ADD COLUMN IF NOT EXISTS adults INTEGER DEFAULT 1;
ALTER TABLE public.travelers ADD COLUMN IF NOT EXISTS children INTEGER DEFAULT 0;

-- 7. Tour Package Bookings Table (Dedicated Section 1)
CREATE TABLE IF NOT EXISTS public.package_bookings (
  id TEXT PRIMARY KEY DEFAULT ('book-' || substr(md5(random()::text), 1, 8)),
  booking_code TEXT NOT NULL,
  user_id TEXT NOT NULL,
  package_id TEXT NOT NULL,
  package_title TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_city TEXT DEFAULT 'New Delhi (DEL)',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  adults INTEGER DEFAULT 1,
  children INTEGER DEFAULT 0,
  traveler_name TEXT NOT NULL,
  traveler_email TEXT NOT NULL,
  traveler_phone TEXT NOT NULL,
  total_price NUMERIC(12, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  special_requests TEXT,
  customization_options JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Luxury Hotel Bookings Table (Dedicated Section 2)
CREATE TABLE IF NOT EXISTS public.hotel_bookings (
  id TEXT PRIMARY KEY DEFAULT ('book-' || substr(md5(random()::text), 1, 8)),
  booking_code TEXT NOT NULL,
  user_id TEXT NOT NULL,
  hotel_id TEXT NOT NULL,
  hotel_name TEXT NOT NULL,
  location TEXT NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  adults INTEGER DEFAULT 1,
  children INTEGER DEFAULT 0,
  traveler_name TEXT NOT NULL,
  traveler_email TEXT NOT NULL,
  traveler_phone TEXT NOT NULL,
  total_price NUMERIC(12, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  special_requests TEXT,
  customization_options JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Indexes for ultra fast searches
CREATE INDEX IF NOT EXISTS idx_destinations_category ON public.destinations(category);
CREATE INDEX IF NOT EXISTS idx_packages_category ON public.packages(category);
CREATE INDEX IF NOT EXISTS idx_hotels_city ON public.hotels(city);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_package_bookings_user ON public.package_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_hotel_bookings_user ON public.hotel_bookings(user_id);

-- 10. Row Level Security (RLS)
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travelers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_bookings ENABLE ROW LEVEL SECURITY;

-- 11. Policies for Read and Write Access
DROP POLICY IF EXISTS "Public Read Destinations" ON public.destinations;
CREATE POLICY "Public Read Destinations" ON public.destinations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Packages" ON public.packages;
CREATE POLICY "Public Read Packages" ON public.packages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Hotels" ON public.hotels;
CREATE POLICY "Public Read Hotels" ON public.hotels FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Bookings" ON public.bookings;
CREATE POLICY "Public Read Bookings" ON public.bookings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Bookings" ON public.bookings;
CREATE POLICY "Public Insert Bookings" ON public.bookings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Update Bookings" ON public.bookings;
CREATE POLICY "Public Update Bookings" ON public.bookings FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public Delete Bookings" ON public.bookings;
CREATE POLICY "Public Delete Bookings" ON public.bookings FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public Read Travelers" ON public.travelers;
CREATE POLICY "Public Read Travelers" ON public.travelers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Travelers" ON public.travelers;
CREATE POLICY "Public Insert Travelers" ON public.travelers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Update Travelers" ON public.travelers;
CREATE POLICY "Public Update Travelers" ON public.travelers FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public Read Package Bookings" ON public.package_bookings;
CREATE POLICY "Public Read Package Bookings" ON public.package_bookings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Package Bookings" ON public.package_bookings;
CREATE POLICY "Public Insert Package Bookings" ON public.package_bookings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Update Package Bookings" ON public.package_bookings;
CREATE POLICY "Public Update Package Bookings" ON public.package_bookings FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public Delete Package Bookings" ON public.package_bookings;
CREATE POLICY "Public Delete Package Bookings" ON public.package_bookings FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public Read Hotel Bookings" ON public.hotel_bookings;
CREATE POLICY "Public Read Hotel Bookings" ON public.hotel_bookings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Hotel Bookings" ON public.hotel_bookings;
CREATE POLICY "Public Insert Hotel Bookings" ON public.hotel_bookings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Update Hotel Bookings" ON public.hotel_bookings;
CREATE POLICY "Public Update Hotel Bookings" ON public.hotel_bookings FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public Delete Hotel Bookings" ON public.hotel_bookings;
CREATE POLICY "Public Delete Hotel Bookings" ON public.hotel_bookings FOR DELETE USING (true);

-- 12. Migrate any existing bookings from public.bookings into their respective tables
INSERT INTO public.package_bookings (
  id, booking_code, user_id, package_id, package_title, destination, departure_city,
  start_date, end_date, adults, children, traveler_name, traveler_email, traveler_phone,
  total_price, status, special_requests, customization_options, created_at
)
SELECT 
  id, booking_code, user_id, item_id, title, location, departure_city,
  start_date, end_date, COALESCE((guests->>'adults')::INTEGER, 1), COALESCE((guests->>'children')::INTEGER, 0),
  traveler_name, traveler_email, traveler_phone, total_price, status,
  special_requests, customization_options, created_at
FROM public.bookings
WHERE item_type = 'package'
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.hotel_bookings (
  id, booking_code, user_id, hotel_id, hotel_name, location,
  check_in_date, check_out_date, adults, children, traveler_name, traveler_email, traveler_phone,
  total_price, status, special_requests, customization_options, created_at
)
SELECT 
  id, booking_code, user_id, item_id, title, location,
  start_date, end_date, COALESCE((guests->>'adults')::INTEGER, 1), COALESCE((guests->>'children')::INTEGER, 0),
  traveler_name, traveler_email, traveler_phone, total_price, status,
  special_requests, customization_options, created_at
FROM public.bookings
WHERE item_type = 'hotel'
ON CONFLICT (id) DO NOTHING;

-- ========================================================
-- 9. SEED ALL 12 POPULAR DESTINATIONS
-- ========================================================
INSERT INTO public.destinations (
  id, name, state, country, region, category, image, gallery, rating, reviews_count, discount_percent, starting_price, original_price, description, long_description, best_season, climate, coordinates, tags, popular_attractions
) VALUES 
${POPULAR_DESTINATIONS.map(d => {
  const galleryArr = (d.gallery || [d.image]).map(g => `'${g.replace(/'/g, "''")}'`).join(', ');
  const tagsArr = (d.tags || []).map(t => `'${t.replace(/'/g, "''")}'`).join(', ');
  const attractionsArr = (d.popularAttractions || []).map(a => `'${a.replace(/'/g, "''")}'`).join(', ');
  return `(
    '${d.id}',
    '${d.name.replace(/'/g, "''")}',
    ${d.state ? `'${d.state.replace(/'/g, "''")}'` : 'NULL'},
    '${d.country.replace(/'/g, "''")}',
    '${d.region.replace(/'/g, "''")}',
    '${d.category}',
    '${d.image.replace(/'/g, "''")}',
    ARRAY[${galleryArr}],
    ${d.rating},
    ${d.reviewsCount},
    ${d.discountPercent || 20},
    ${d.startingPrice},
    ${d.originalPrice || 'NULL'},
    '${d.description.replace(/'/g, "''")}',
    '${(d.longDescription || d.description).replace(/'/g, "''")}',
    '${(d.bestSeason || 'Year-round').replace(/'/g, "''")}',
    '${(d.climate || 'Pleasant').replace(/'/g, "''")}',
    '${JSON.stringify(d.coordinates)}'::jsonb,
    ARRAY[${tagsArr}],
    ARRAY[${attractionsArr}]
  )`;
}).join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  region = EXCLUDED.region,
  category = EXCLUDED.category,
  image = EXCLUDED.image,
  gallery = EXCLUDED.gallery,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  discount_percent = EXCLUDED.discount_percent,
  starting_price = EXCLUDED.starting_price,
  original_price = EXCLUDED.original_price,
  description = EXCLUDED.description,
  long_description = EXCLUDED.long_description,
  best_season = EXCLUDED.best_season,
  climate = EXCLUDED.climate,
  coordinates = EXCLUDED.coordinates,
  tags = EXCLUDED.tags,
  popular_attractions = EXCLUDED.popular_attractions;

-- ========================================================
-- 10. SEED ALL TOUR PACKAGES
-- ========================================================
INSERT INTO public.packages (
  id, title, destination, state, country, duration, days_count, nights_count, original_price, discounted_price, badge, image, rating, reviews_count, highlights, includes_flight, category, itinerary, inclusions, exclusions
) VALUES 
${TOP_DEALS_PACKAGES.map(p => {
  const highlightsArr = (p.highlights || []).map(h => `'${h.replace(/'/g, "''")}'`).join(', ');
  const inclusionsArr = (p.inclusions || []).map(i => `'${i.replace(/'/g, "''")}'`).join(', ');
  const exclusionsArr = (p.exclusions || []).map(e => `'${e.replace(/'/g, "''")}'`).join(', ');
  return `(
    '${p.id}',
    '${p.title.replace(/'/g, "''")}',
    '${p.destination.replace(/'/g, "''")}',
    ${p.state ? `'${p.state.replace(/'/g, "''")}'` : 'NULL'},
    '${p.country.replace(/'/g, "''")}',
    '${p.duration.replace(/'/g, "''")}',
    ${p.daysCount},
    ${p.nightsCount},
    ${p.originalPrice},
    ${p.discountedPrice},
    '${p.badge || 'Best Seller'}',
    '${p.image.replace(/'/g, "''")}',
    ${p.rating},
    ${p.reviewsCount},
    ARRAY[${highlightsArr}],
    ${p.includesFlight ? 'true' : 'false'},
    '${p.category || 'hill_station'}',
    '${JSON.stringify(p.itinerary || []).replace(/'/g, "''")}'::jsonb,
    ARRAY[${inclusionsArr}],
    ARRAY[${exclusionsArr}]
  )`;
}).join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  destination = EXCLUDED.destination,
  original_price = EXCLUDED.original_price,
  discounted_price = EXCLUDED.discounted_price,
  image = EXCLUDED.image,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary;

-- ========================================================
-- 11. SEED ALL HOTELS & RESORTS
-- ========================================================
INSERT INTO public.hotels (
  id, name, location, city, state, country, image, price_per_night, original_price, rating, reviews_count, stars, type, amenities, coordinates, rooms_available, description, room_types
) VALUES 
${HOTELS_LIST.map(h => {
  const amenitiesArr = (h.amenities || []).map(a => `'${a.replace(/'/g, "''")}'`).join(', ');
  return `(
    '${h.id}',
    '${h.name.replace(/'/g, "''")}',
    '${h.location.replace(/'/g, "''")}',
    '${h.city.replace(/'/g, "''")}',
    ${h.state ? `'${h.state.replace(/'/g, "''")}'` : 'NULL'},
    '${h.country.replace(/'/g, "''")}',
    '${h.image.replace(/'/g, "''")}',
    ${h.pricePerNight},
    ${h.originalPrice || 'NULL'},
    ${h.rating},
    ${h.reviewsCount},
    ${h.stars},
    '${h.type || 'luxury_hotel'}',
    ARRAY[${amenitiesArr}],
    '${JSON.stringify(h.coordinates)}'::jsonb,
    ${h.roomsAvailable},
    '${h.description.replace(/'/g, "''")}',
    '${JSON.stringify(h.roomTypes || []).replace(/'/g, "''")}'::jsonb
  )`;
}).join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_per_night = EXCLUDED.price_per_night,
  rooms_available = EXCLUDED.rooms_available,
  image = EXCLUDED.image,
  description = EXCLUDED.description;
`;
}

export const SUPABASE_SQL_SCHEMA = generateSupabaseMigrationSQL();
