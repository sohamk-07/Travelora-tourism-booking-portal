/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Currency = 'INR' | 'USD';

export type DestinationCategory = 
  | 'all'
  | 'india_domestic'
  | 'hill_station'
  | 'beach'
  | 'heritage'
  | 'spiritual'
  | 'adventure'
  | 'international';

export interface NearbyRestaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  reviewsCount: number;
  priceLevel: '₹' | '₹₹' | '₹₹₹' | '₹₹₹₹';
  specialty: string;
  distance: string;
  image: string;
  tags: string[];
  address: string;
  coordinates?: { lat: number; lng: number };
}

export interface DestinationRoadmapSpot {
  step: number;
  phase: 'Morning' | 'Mid-Day' | 'Afternoon' | 'Sunset / Evening' | 'Sunset / Night' | 'Night' | string;
  spotName: string;
  spotCategory: 'monument' | 'beach' | 'nature' | 'temple' | 'viewpoint' | 'market' | 'adventure' | 'spiritual' | string;
  duration: string;
  whatToExplore: string;
  howToExplore: string;
  nearbyEatery?: {
    name: string;
    cuisine: string;
    specialty: string;
  };
  insiderTip: string;
}

export interface TouristDestination {
  id: string;
  name: string;
  state?: string;
  country: string;
  region: string;
  category: DestinationCategory;
  image: string;
  gallery?: string[];
  rating: number;
  reviewsCount: number;
  discountPercent?: number;
  startingPrice: number; // In INR by default
  originalPrice?: number;
  description: string;
  longDescription?: string;
  bestSeason: string;
  climate?: string;
  coordinates: { lat: number; lng: number };
  tags: string[];
  popularAttractions: string[];
  thingsToDo?: string[];
  nearbyHotels?: Hotel[];
  nearbyRestaurants?: NearbyRestaurant[];
  explorationRoadmap?: DestinationRoadmapSpot[];
}

export interface HotelRoom {
  name: string;
  pricePerNight: number;
  capacity: string;
  bedType: string;
  amenities: string[];
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  city: string;
  state?: string;
  country: string;
  destinationId?: string; // Links hotel directly to a destination (e.g. 'dest-goa')
  destinationName?: string; // Display name e.g. 'Goa'
  closestAttraction?: string; // e.g. '1.5 km to Fort Aguada'
  image: string;
  gallery?: string[];
  pricePerNight: number; // In INR
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  stars: number;
  amenities: string[];
  coordinates: { lat: number; lng: number };
  roomsAvailable: number;
  description: string;
  roomTypes?: HotelRoom[];
  type?: 'resort' | 'heritage_palace' | 'luxury_hotel' | 'boutique_stay' | 'boutique_hotel';
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface PackageRoadmapDay {
  day: number;
  phaseTitle: string;
  destinationCovered: string;
  spotsCovered: {
    name: string;
    description: string;
    activityHighlight: string;
  }[];
  howCovered: string; // e.g., 'Private AC Sedan & Shikara boat transfer'
  stayHotel: {
    name: string;
    location: string;
    roomCategory: string;
    mealPlan: string; // e.g., 'Buffet Breakfast & Dinner Included'
    starRating?: number;
  };
  diningExperience: {
    restaurantName: string;
    cuisine: string;
    specialtyDish: string;
    mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Breakfast & Dinner' | 'Special Traditional Feast' | string;
  };
  highlights: string;
}

export interface TourPackage {
  id: string;
  title: string;
  destination: string;
  destinationId?: string;
  state?: string;
  country: string;
  duration: string;
  daysCount: number;
  nightsCount: number;
  originalPrice: number; // In INR
  discountedPrice: number; // In INR
  badge: 'Best Seller' | 'Hot Deal' | 'New Offer' | 'Ultra Luxury';
  image: string;
  gallery?: string[];
  rating: number;
  reviewsCount?: number;
  highlights: string[];
  includesFlight?: boolean;
  category?: DestinationCategory;
  itinerary?: ItineraryDay[];
  roadmap?: PackageRoadmapDay[];
  inclusions?: string[];
  exclusions?: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  city?: string;
  role?: 'admin' | 'user' | 'traveler';
  createdAt: string;
}

export interface AdminAccount {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'master_admin';
  claimedAt: string;
  lastLoginAt?: string;
}

export interface CustomizationOptions {
  airportTransfer?: boolean;
  breakfastIncluded?: boolean;
  travelInsurance?: boolean;
  privateTourGuide?: boolean;
  jeepSafariPass?: boolean;
  photographerSession?: boolean;
  luxuryVehicleUpgrade?: boolean;
  roomsCount?: number;
}

export interface TripReview {
  id: string;
  bookingId?: string;
  userId?: string;
  travelerName: string;
  travelerEmail?: string;
  itemType: 'package' | 'hotel' | 'destination' | 'activity' | 'custom_tour';
  itemId: string; // ID of package, hotel, or destination
  destinationId?: string; // Optional linked destination ID
  itemTitle: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  tags?: string[];
  recommend?: boolean;
  createdAt: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface BookingStatusHistoryEntry {
  status: BookingStatus;
  timestamp: string;
  note?: string;
  updatedBy: 'user' | 'admin' | 'system';
}

export interface BookingNotification {
  id: string;
  bookingId: string;
  bookingCode: string;
  userId?: string;
  type: 'status_change' | 'confirmation' | 'cancellation' | 'completion' | 'admin_alert';
  title: string;
  message: string;
  status: BookingStatus;
  read: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  userId: string;
  itemType: 'package' | 'hotel' | 'activity' | 'custom_tour';
  itemId: string;
  title: string;
  image: string;
  location: string;
  departureCity?: string;
  startDate: string;
  endDate: string;
  guests: {
    adults: number;
    children: number;
  };
  travelerName: string;
  travelerEmail: string;
  travelerPhone: string;
  totalPrice: number; // In INR
  status: BookingStatus;
  statusMessage?: string;
  statusHistory?: BookingStatusHistoryEntry[];
  cancellationReason?: string;
  cancelledAt?: string;
  refundAmount?: number;
  specialRequests?: string;
  customizationOptions: CustomizationOptions;
  createdAt: string;
  reviewed?: boolean;
  reviewId?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
  location: string;
}

export type ActiveTab = 
  | 'home' 
  | 'destinations' 
  | 'packages' 
  | 'hotels' 
  | 'flights' 
  | 'activities' 
  | 'map' 
  | 'my-bookings';
