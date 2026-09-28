/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { GOOGLE_MAPS_API_KEY } from './lib/googleMaps';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SearchCard } from './components/SearchCard';
import { DestinationsSection } from './components/DestinationsSection';
import { TopDealsSection } from './components/TopDealsSection';
import { PackagesSection } from './components/PackagesSection';
import { HotelsSection } from './components/HotelsSection';
import { ValuePropsRow } from './components/ValuePropsRow';
import { TestimonialsNewsletter } from './components/TestimonialsNewsletter';
import { Footer } from './components/Footer';
import { DestinationDetailModal } from './components/DestinationDetailModal';
import { PackageBookingModal } from './components/PackageBookingModal';
import { InteractiveMapModal } from './components/InteractiveMapModal';
import { MyBookingsDashboard } from './components/MyBookingsDashboard';
import { AuthModal } from './components/AuthModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { FavoritesModal } from './components/FavoritesModal';
import { AdminPortal } from './components/AdminPortal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { ProfileEditModal } from './components/ProfileEditModal';
import { ReviewsRatingsModal } from './components/ReviewsRatingsModal';

import { 
  Booking, 
  UserProfile, 
  ActiveTab,
  TouristDestination,
  Hotel,
  TourPackage,
  Currency,
  TripReview
} from './types';

import { 
  POPULAR_DESTINATIONS, 
  HOTELS_LIST, 
  TOP_DEALS_PACKAGES 
} from './data/mockData';

import { 
  getBookings, 
  getCurrentUser, 
  signOutUser,
  updateBooking,
  cancelBooking,
  deleteBooking,
  getDestinations,
  getTourPackages,
  getHotels
} from './lib/supabase';

export default function App() {
  // Global Currency State (Default to INR as requested)
  const [currency, setCurrency] = useState<Currency>('INR');

  // Main Data States
  const [destinations, setDestinations] = useState<TouristDestination[]>(POPULAR_DESTINATIONS);
  const [packages, setPackages] = useState<TourPackage[]>(TOP_DEALS_PACKAGES);
  const [hotels, setHotels] = useState<Hotel[]>(HOTELS_LIST);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [favorites, setFavorites] = useState<string[]>(['dest-kashmir', 'pkg-kashmir-heaven']);

  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [currentView, setCurrentView] = useState<'portal' | 'my-bookings' | 'admin'>('portal');

  // Modal States
  const [selectedDestinationForDetail, setSelectedDestinationForDetail] = useState<TouristDestination | null>(null);
  const [destinationInitialTab, setDestinationInitialTab] = useState<'overview' | 'roadmap' | 'map' | 'hotels' | 'restaurants'>('overview');
  const [selectedPackageForBooking, setSelectedPackageForBooking] = useState<TourPackage | null>(null);
  const [packageInitialTab, setPackageInitialTab] = useState<'customize' | 'itinerary'>('customize');
  const [externalSelectedHotelToBook, setExternalSelectedHotelToBook] = useState<Hotel | null>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapTargetCoordinates, setMapTargetCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [mapTargetDestinationId, setMapTargetDestinationId] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signin');
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [isGlobalSearchModalOpen, setIsGlobalSearchModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);

  // High-contrast Dark & Light Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('travelora_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('travelora_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Google Maps Quota Handling
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  // Open destination with specific tab (e.g. roadmap, overview, map)
  const handleSelectDestination = (
    dest: TouristDestination, 
    tab: 'overview' | 'roadmap' | 'map' | 'hotels' | 'restaurants' = 'overview'
  ) => {
    setDestinationInitialTab(tab);
    setSelectedDestinationForDetail(dest);
  };

  // Open package with specific tab (customize or roadmap itinerary)
  const handleSelectPackage = (
    pkg: TourPackage, 
    tab: 'customize' | 'itinerary' = 'customize'
  ) => {
    setPackageInitialTab(tab);
    setSelectedPackageForBooking(pkg);
  };

  // Open map focused on a specific destination
  const handleOpenMapForDestination = (dest: TouristDestination) => {
    setMapTargetCoordinates(dest.coordinates);
    setMapTargetDestinationId(dest.id);
    setIsMapModalOpen(true);
  };

  // Open direct hotel booking
  const handleOpenHotelBooking = (hotel: Hotel) => {
    setExternalSelectedHotelToBook(hotel);
    setCurrentView('portal');
    scrollToSection('hotels-section');
  };

  // Load initial data from Supabase / localStorage
  const loadPortalData = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);

      const dbDestinations = await getDestinations();
      if (dbDestinations && dbDestinations.length > 0) {
        setDestinations(dbDestinations);
      }

      const dbPackages = await getTourPackages();
      if (dbPackages && dbPackages.length > 0) {
        setPackages(dbPackages);
      }

      const dbHotels = await getHotels();
      if (dbHotels && dbHotels.length > 0) {
        setHotels(dbHotels);
      }

      const bookingsData = await getBookings(user?.id);
      setBookings(bookingsData);

      // Load favorites
      const savedFavs = localStorage.getItem('travelora_favorites');
      if (savedFavs) {
        try {
          setFavorites(JSON.parse(savedFavs));
        } catch (_) {}
      }
    } catch (err) {
      console.error('Error loading portal data:', err);
    }
  };

  useEffect(() => {
    loadPortalData();
  }, []);

  // Favorites Toggle
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('travelora_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  // Auth Handlers
  const handleAuthSuccess = async (user: UserProfile) => {
    setCurrentUser(user);
    const userBookings = await getBookings(user.id);
    setBookings(userBookings);
  };

  const handleSignOut = async () => {
    await signOutUser();
    setCurrentUser(null);
    loadPortalData();
  };

  const handleUpdateUser = (updated: UserProfile) => {
    setCurrentUser(updated);
    localStorage.setItem('travelora_current_user', JSON.stringify(updated));
  };

  // Booking Handlers
  const handleBookingCreated = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    // If it's a hotel booking, update available rooms count immediately
    if (newBooking.itemType === 'hotel' && newBooking.itemId) {
      setHotels((prev) =>
        prev.map((h) =>
          h.id === newBooking.itemId
            ? { ...h, roomsAvailable: Math.max(0, (h.roomsAvailable || 1) - 1) }
            : h
        )
      );
    }
  };

  const handleUpdateBooking = async (id: string, updates: Partial<Booking>) => {
    const updated = await updateBooking(id, updates);
    if (updated) {
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    }
  };

  const handleCancelBooking = async (id: string, reason?: string) => {
    const bookingItem = bookings.find((b) => b.id === id);
    const success = await cancelBooking(id, reason);
    if (success) {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                status: 'cancelled',
                cancellationReason: reason,
                cancelledAt: new Date().toISOString(),
                refundAmount: Math.round(b.totalPrice * 0.95)
              }
            : b
        )
      );

      // If hotel booking was cancelled, restock room count
      if (bookingItem && bookingItem.itemType === 'hotel' && bookingItem.itemId) {
        setHotels((prev) =>
          prev.map((h) =>
            h.id === bookingItem.itemId
              ? { ...h, roomsAvailable: (h.roomsAvailable || 0) + 1 }
              : h
          )
        );
      }
    }
  };

  const handleDeleteBooking = async (id: string) => {
    await deleteBooking(id);
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const handleReviewSubmitted = async (_review: TripReview) => {
    // Refresh ratings across destinations, packages, hotels, and bookings
    const [dbDestinations, dbPackages, dbHotels, userBookings] = await Promise.all([
      getDestinations(),
      getTourPackages(),
      getHotels(),
      getBookings(currentUser?.id)
    ]);
    if (dbDestinations) setDestinations(dbDestinations);
    if (dbPackages) setPackages(dbPackages);
    if (dbHotels) setHotels(dbHotels);
    if (userBookings) setBookings(userBookings);
  };

  const scrollToSection = (sectionId: string) => {
    setCurrentView('portal');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Handle Search Submission
  const handleSearch = (params: {
    tab: 'flights' | 'hotels' | 'packages' | 'activities';
    fromLocation: string;
    toLocation: string;
    checkIn: string;
    checkOut: string;
    travelers: { adults: number; children: number };
  }) => {
    setCurrentView('portal');
    if (params.tab === 'hotels') {
      setActiveTab('hotels');
      scrollToSection('hotels-section');
    } else if (params.tab === 'packages' || params.tab === 'flights') {
      setActiveTab('packages');
      scrollToSection('packages-section');
    } else {
      setActiveTab('destinations');
      scrollToSection('destinations-section');
    }
  };

  // Helper when user selects a destination to book a tour
  const handleBookDestinationTour = (dest: TouristDestination) => {
    const matched = packages.find(
      (p) => p.destination.toLowerCase().includes(dest.name.toLowerCase()) || dest.name.toLowerCase().includes(p.destination.toLowerCase())
    );

    if (matched) {
      setSelectedPackageForBooking(matched);
    } else {
      const dynamicPackage: TourPackage = {
        id: `pkg-${dest.id}`,
        title: `${dest.name} Discovery & Highlights Holiday`,
        destination: dest.name,
        country: dest.country,
        image: dest.image,
        duration: '5 Days / 4 Nights',
        daysCount: 5,
        nightsCount: 4,
        originalPrice: dest.originalPrice || Math.round(dest.startingPrice * 1.3),
        discountedPrice: dest.startingPrice,
        rating: dest.rating,
        reviewsCount: dest.reviewsCount,
        category: dest.category,
        badge: 'Hot Deal',
        highlights: dest.popularAttractions.slice(0, 3),
        includesFlight: true,
        itinerary: [
          { day: 1, title: 'Arrival & Welcome Reception', description: `Airport transfer, check-in to resort, evening scenic tour of ${dest.name}.` },
          { day: 2, title: 'Heritage & Iconic Monuments', description: `Full day exploration of ${dest.popularAttractions.slice(0, 2).join(' & ')}.` },
          { day: 3, title: 'Nature & Cultural Trails', description: `Scenic excursions, local village walks, and traditional cuisine experience.` },
          { day: 4, title: 'Leisure & Photography', description: `Free morning for relaxation, sunset viewpoint visit, farewell dinner.` },
          { day: 5, title: 'Departure with Souvenirs', description: `Breakfast at resort, checkout, transfer back to airport.` }
        ],
        inclusions: [
          '4-star & luxury resort accommodations',
          'Daily buffet breakfast and selected dinners',
          'Private AC vehicle for all tours & airport transfers',
          'Monument admission fees & experienced tour guide'
        ],
        exclusions: ['Airfare add-on options', 'Personal expenses', 'Optional sports equipment']
      };
      setSelectedPackageForBooking(dynamicPackage);
    }
  };

  // Filtered favorite entities
  const favoriteDestinations = destinations.filter((d) => favorites.includes(d.id));
  const favoritePackages = packages.filter((p) => favorites.includes(p.id));

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['marker', 'places']}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-600 selection:text-white transition-colors">
        
        {/* Tier 1 & 2 Quota Exceeded Notification */}
        {quotaExceeded && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
            <span>
              Google Maps Platform quota reached. If you are the app owner, visit{' '}
              <a
                href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-amber-950 hover:text-amber-800"
              >
                maps developer site
              </a>{' '}
              for instructions to update your account.
            </span>
          </div>
        )}

        {/* Top Navigation Bar with Indian Rupee (INR) Currency Switcher */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab: ActiveTab) => {
          setActiveTab(tab);
          if (tab === 'my-bookings') {
            setCurrentView('my-bookings');
          } else {
            setCurrentView('portal');
            if (tab === 'destinations') scrollToSection('destinations-section');
            if (tab === 'packages') scrollToSection('packages-section');
            if (tab === 'hotels') scrollToSection('hotels-section');
            if (tab === 'home') scrollToSection('hero-section');
          }
        }}
        currentUser={currentUser}
        bookingsCount={bookings.length}
        favoritesCount={favorites.length}
        onOpenAuth={() => {
          setAuthInitialMode('signin');
          setIsAuthModalOpen(true);
        }}
        onSignOut={handleSignOut}
        onOpenFavorites={() => setIsFavoritesModalOpen(true)}
        onOpenSupabaseConfig={currentUser?.role === 'admin' ? () => setIsSupabaseModalOpen(true) : undefined}
        onOpenMap={() => setIsMapModalOpen(true)}
        onOpenBookNow={() => scrollToSection('packages-section')}
        onSearchClick={() => setIsGlobalSearchModalOpen(true)}
        currency={currency}
        setCurrency={setCurrency}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenReviews={() => setIsReviewsModalOpen(true)}
        onUpdateUser={handleUpdateUser}
      />

      {/* Main View Switcher */}
      {currentView === 'admin' ? (
        <AdminPortal
          currency={currency}
          onBackToPortal={() => {
            setCurrentView('portal');
            loadPortalData();
          }}
          onHotelRoomsUpdated={(updatedHotels) => {
            setHotels(updatedHotels);
          }}
          onOpenSupabaseConfig={() => setIsSupabaseModalOpen(true)}
        />
      ) : currentView === 'my-bookings' ? (
        <main className="flex-1">
          <MyBookingsDashboard
            bookings={bookings}
            currency={currency}
            onUpdateBooking={handleUpdateBooking}
            onCancelBooking={handleCancelBooking}
            onDeleteBooking={handleDeleteBooking}
            onBrowseDestinations={() => {
              setCurrentView('portal');
              setActiveTab('destinations');
              scrollToSection('destinations-section');
            }}
            onBrowsePackages={() => {
              setCurrentView('portal');
              setActiveTab('packages');
              scrollToSection('packages-section');
            }}
            onBrowseHotels={() => {
              setCurrentView('portal');
              setActiveTab('hotels');
              scrollToSection('hotels-section');
            }}
            onReviewSubmitted={handleReviewSubmitted}
            currentUser={currentUser}
            onOpenProfile={() => setIsProfileModalOpen(true)}
          />
        </main>
      ) : (
        <main className="flex-1">
          
          {/* Hero Section matching user screenshot */}
          <div id="hero-section">
            <HeroSection
              onExploreDestinations={() => scrollToSection('destinations-section')}
              onViewPackages={() => scrollToSection('packages-section')}
              onExploreHotels={() => scrollToSection('hotels-section')}
              onOpenReviews={() => setIsReviewsModalOpen(true)}
            />
          </div>

          {/* Search Card with Flights, Hotels, Packages, Activities */}
          <SearchCard
            onSearch={handleSearch}
            onOpenGlobalSearch={() => setIsGlobalSearchModalOpen(true)}
            onNavigateSection={(tab: ActiveTab) => {
              setActiveTab(tab);
              if (tab === 'hotels') scrollToSection('hotels-section');
              if (tab === 'packages') scrollToSection('packages-section');
              if (tab === 'destinations') scrollToSection('destinations-section');
            }}
          />

          {/* Value Propositions Row (5 badges from screenshot) */}
          <ValuePropsRow />

          {/* Popular Destinations Section (Portrait 3:4 cards with -30% discount ribbons and INR rates) */}
          <div id="destinations-section">
            <DestinationsSection
              destinations={destinations}
              currency={currency}
              onSelectDestination={handleSelectDestination}
              onOpenMapForDestination={handleOpenMapForDestination}
              onExploreAll={() => scrollToSection('destinations-section')}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>

          {/* Top Deals This Week Section (Deep blue promo banner + deal cards) */}
          <div id="deals-section">
            <TopDealsSection
              packages={packages}
              currency={currency}
              onSelectPackage={handleSelectPackage}
              onExploreAllPackages={() => scrollToSection('packages-section')}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>

          {/* All Curated Tour Packages Section */}
          <div id="packages-section">
            <PackagesSection
              packages={packages}
              currency={currency}
              onSelectPackage={handleSelectPackage}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>

          {/* Luxury Hotels & Heritage Stays Section */}
          <div id="hotels-section">
            <HotelsSection
              hotels={hotels}
              currency={currency}
              currentUser={currentUser}
              onBookingCreated={handleBookingCreated}
              onOpenMyBookings={() => setCurrentView('my-bookings')}
              externalSelectedHotel={externalSelectedHotelToBook}
              onClearExternalSelectedHotel={() => setExternalSelectedHotelToBook(null)}
            />
          </div>

          {/* Testimonials & Newsletter Section */}
          <TestimonialsNewsletter onOpenReviews={() => setIsReviewsModalOpen(true)} />

        </main>
      )}

      {/* Global Footer (shown in portal & user trips view) */}
      {currentView !== 'admin' && (
        <Footer
          isAdmin={currentUser?.role === 'admin'}
          onOpenSupabaseConfig={currentUser?.role === 'admin' ? () => setIsSupabaseModalOpen(true) : undefined}
          onNavigateToCategory={(_cat) => {
            setCurrentView('portal');
            setActiveTab('destinations');
            scrollToSection('destinations-section');
          }}
          onNavigateToSection={(sec) => {
            setCurrentView('portal');
            scrollToSection(`${sec}-section`);
          }}
          onOpenAdminPortal={() => {
            setCurrentView('admin');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* MODALS */}

      {/* 1. Destination Detail Modal */}
      {selectedDestinationForDetail && (
        <DestinationDetailModal
          destination={selectedDestinationForDetail}
          currency={currency}
          onClose={() => setSelectedDestinationForDetail(null)}
          onBookTour={(dest) => handleBookDestinationTour(dest)}
          onBookHotel={(hotel) => handleOpenHotelBooking(hotel)}
          onOpenFullscreenMap={(dest) => handleOpenMapForDestination(dest)}
          isFavorite={favorites.includes(selectedDestinationForDetail.id)}
          onToggleFavorite={handleToggleFavorite}
          initialTab={destinationInitialTab}
        />
      )}

      {/* 2. Package Booking & Customization Modal */}
      {selectedPackageForBooking && (
        <PackageBookingModal
          tourPackage={selectedPackageForBooking}
          currency={currency}
          currentUser={currentUser}
          onClose={() => setSelectedPackageForBooking(null)}
          onBookingSuccess={(booking) => {
            handleBookingCreated(booking);
          }}
          onOpenMyBookings={() => {
            setSelectedPackageForBooking(null);
            setCurrentView('my-bookings');
          }}
          onExploreSpotOnMap={(_spot) => {
            setSelectedPackageForBooking(null);
            setIsMapModalOpen(true);
          }}
          initialTab={packageInitialTab}
        />
      )}

      {/* 3. Interactive Map Modal with Indian pins and hotel locations */}
      {isMapModalOpen && (
        <InteractiveMapModal
          destinations={destinations}
          hotels={hotels}
          currency={currency}
          onClose={() => {
            setIsMapModalOpen(false);
            setMapTargetCoordinates(null);
            setMapTargetDestinationId(null);
          }}
          onSelectDestination={(dest) => setSelectedDestinationForDetail(dest)}
          onSelectHotel={(hotel) => {
            setIsMapModalOpen(false);
            handleOpenHotelBooking(hotel);
          }}
          onBookDestinationTour={(dest) => handleBookDestinationTour(dest)}
          initialCoordinates={mapTargetCoordinates}
          initialDestinationId={mapTargetDestinationId}
        />
      )}

      {/* 4. Supabase User Authentication Modal (Sign In / Sign Up / Sign Out) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authInitialMode}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* 5. Supabase Configuration & Migration Modal */}
      <SupabaseConfigModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onRefreshData={() => loadPortalData()}
      />

      {/* 6. Wishlist / Favorites Modal */}
      <FavoritesModal
        isOpen={isFavoritesModalOpen}
        onClose={() => setIsFavoritesModalOpen(false)}
        currency={currency}
        favoriteDestinations={favoriteDestinations}
        favoritePackages={favoritePackages}
        onRemoveFavorite={handleToggleFavorite}
        onSelectDestination={(dest) => setSelectedDestinationForDetail(dest)}
        onSelectPackage={(pkg) => setSelectedPackageForBooking(pkg)}
      />

      {/* 7. Interactive Global Search Modal */}
      <GlobalSearchModal
        isOpen={isGlobalSearchModalOpen}
        onClose={() => setIsGlobalSearchModalOpen(false)}
        destinations={destinations}
        packages={packages}
        hotels={hotels}
        currency={currency}
        onSelectDestination={(dest) => {
          setIsGlobalSearchModalOpen(false);
          setSelectedDestinationForDetail(dest);
        }}
        onSelectPackage={(pkg) => {
          setIsGlobalSearchModalOpen(false);
          setSelectedPackageForBooking(pkg);
        }}
        onSelectHotel={(hotel) => {
          setIsGlobalSearchModalOpen(false);
          handleOpenHotelBooking(hotel);
        }}
      />

      {/* 8. User Profile & Avatar Edit Modal */}
      {isProfileModalOpen && (
        <ProfileEditModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          currentUser={currentUser || {
            id: 'usr-traveler',
            fullName: 'Guest Traveler',
            email: 'traveler@travelora.com',
            createdAt: new Date().toISOString()
          }}
          onUpdateUser={handleUpdateUser}
        />
      )}

      {/* 9. Traveler Reviews & Star Ratings Modal */}
      {isReviewsModalOpen && (
        <ReviewsRatingsModal
          isOpen={isReviewsModalOpen}
          onClose={() => setIsReviewsModalOpen(false)}
          destinations={destinations}
          packages={packages}
          hotels={hotels}
          currentUser={currentUser}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}

      </div>
    </APIProvider>
  );
}
