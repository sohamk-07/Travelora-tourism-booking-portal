/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Hotel, NearbyRestaurant, TouristDestination } from '../types';

export interface DestinationAttractionPin {
  name: string;
  category: 'beach' | 'monument' | 'nature' | 'adventure' | 'temple';
  coordinates: { lat: number; lng: number };
  description: string;
}

export interface DestinationNearbyInfo {
  attractionPins: DestinationAttractionPin[];
  hotels: Hotel[];
  restaurants: NearbyRestaurant[];
}

export const DESTINATION_NEARBY_MAP: Record<string, DestinationNearbyInfo> = {
  'dest-goa': {
    attractionPins: [
      { name: 'Baga Beach & Water Sports', category: 'beach', coordinates: { lat: 15.5553, lng: 73.7517 }, description: 'Vibrant nightlife, parasailing, jet skiing and beach shacks.' },
      { name: 'Aguada Fort & Lighthouse', category: 'monument', coordinates: { lat: 15.4921, lng: 73.7736 }, description: '17th-century Portuguese fortress overlooking the Arabian Sea.' },
      { name: 'Calangute Queen of Beaches', category: 'beach', coordinates: { lat: 15.5439, lng: 73.7554 }, description: 'Goa’s busiest and liveliest golden sand shoreline.' },
      { name: 'Fontainhas Latin Quarter', category: 'monument', coordinates: { lat: 15.4989, lng: 73.8312 }, description: 'Colorful Portuguese colonial mansions and tiled cafes in Panaji.' },
      { name: 'Dudhsagar Waterfalls', category: 'nature', coordinates: { lat: 15.3144, lng: 74.3143 }, description: 'Spectacular four-tiered milk-white cascade on the Mandovi River.' }
    ],
    hotels: [
      {
        id: 'hotel-w-goa',
        name: 'W Goa Luxury Coastal Resort',
        location: 'Vagator Beach',
        city: 'Vagator',
        state: 'Goa',
        country: 'India',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
        pricePerNight: 16500,
        originalPrice: 22000,
        rating: 4.9,
        reviewsCount: 1100,
        stars: 5,
        type: 'luxury_hotel',
        amenities: ['Rock Pool Sunset Lounge', 'AWAY Spa', 'Direct Beach Walkway', 'Fitness Center', 'Cocktail Bar'],
        coordinates: { lat: 15.6028, lng: 73.7342 },
        roomsAvailable: 8,
        description: 'Chic beach resort overlooking dramatic red Vagator cliffs and the Arabian Sea.'
      },
      {
        id: 'hotel-taj-aguada',
        name: 'Taj Fort Aguada Resort & Spa',
        location: 'Sinquerim Beach, Candolim',
        city: 'Candolim',
        state: 'Goa',
        country: 'India',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        pricePerNight: 18500,
        originalPrice: 24000,
        rating: 4.95,
        reviewsCount: 1420,
        stars: 5,
        type: 'resort',
        amenities: ['Cliffside Infinity Pool', 'Historic Fort Ramparts', 'Jiva Ayurveda Spa', 'Water Sports Desk'],
        coordinates: { lat: 15.4965, lng: 73.7712 },
        roomsAvailable: 6,
        description: 'Iconic luxury property built within the ramparts of a 16th-century Portuguese fortress.'
      },
      {
        id: 'hotel-fairfield-calangute',
        name: 'Fairfield by Marriott Goa Calangute',
        location: 'Post Office Road, Calangute',
        city: 'Calangute',
        state: 'Goa',
        country: 'India',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
        pricePerNight: 6800,
        originalPrice: 9000,
        rating: 4.75,
        reviewsCount: 890,
        stars: 4,
        type: 'boutique_stay',
        amenities: ['Outdoor Pool', '24/7 Fitness Center', 'Buffet Restaurant', 'Free Beach Shuttle'],
        coordinates: { lat: 15.5398, lng: 73.7621 },
        roomsAvailable: 12,
        description: 'Modern comfort located minutes from Calangute and Baga beaches with excellent family amenities.'
      }
    ],
    restaurants: [
      {
        id: 'rest-goa-fishermans',
        name: "The Fisherman's Wharf",
        cuisine: 'Goan Coastal & Fresh Seafood',
        rating: 4.9,
        reviewsCount: 2300,
        priceLevel: '₹₹',
        specialty: 'Kingfish Curry, Crab Xec Xec & Prawn Balchão',
        distance: '1.2 km from riverfront',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
        tags: ['Riverfront View', 'Live Goan Band', 'Seafood Specialist', 'Family Friendly'],
        address: 'Near Riverside, Panaji & Cavelossim, Goa',
        coordinates: { lat: 15.4982, lng: 73.8291 }
      },
      {
        id: 'rest-goa-brittos',
        name: "Britto's Beach Shack & Bakery",
        cuisine: 'Goan Continental, Seafood & Bakery',
        rating: 4.8,
        reviewsCount: 4500,
        priceLevel: '₹₹',
        specialty: 'Baked Crab, Jumbo Tiger Prawns & Goan Bebinca dessert',
        distance: 'On Baga Beach sands (0 m)',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
        tags: ['Beachfront Dining', 'Sunset Views', 'Live Music', 'Cocktail Bar'],
        address: 'Baga Beach End, North Goa',
        coordinates: { lat: 15.5562, lng: 73.7511 }
      },
      {
        id: 'rest-goa-gunpowder',
        name: 'Gunpowder Coastal Kitchen',
        cuisine: 'South Indian Coastal & Kerala Flavors',
        rating: 4.9,
        reviewsCount: 1850,
        priceLevel: '₹₹',
        specialty: 'Kerala Spiced Beef/Paneer, Egg Appams & Pandi Curry',
        distance: '2.5 km from Anjuna',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
        tags: ['Portuguese Courtyard', 'Boutique Dining', 'Craft Cocktails'],
        address: 'Saunto Vaddo, Assagao, Goa',
        coordinates: { lat: 15.5898, lng: 73.7745 }
      },
      {
        id: 'rest-goa-thalassa',
        name: 'Thalassa Greek Taverna',
        cuisine: 'Greek, Mediterranean & Coastal Grilled',
        rating: 4.85,
        reviewsCount: 3100,
        priceLevel: '₹₹₹',
        specialty: 'Grilled Calamari, Souvlaki skewers & Sunset Sangria',
        distance: '3.8 km from Vagator',
        image: 'https://images.unsplash.com/photo-1502301103665-0b95cc738daf?auto=format&fit=crop&w=600&q=80',
        tags: ['Sunset Cliff View', 'Fire Dance Shows', 'Celebrity Favorite'],
        address: 'Vaddy, Siolim, Goa',
        coordinates: { lat: 15.6231, lng: 73.7602 }
      },
      {
        id: 'rest-goa-vinayak',
        name: 'Vinayak Family Restaurant',
        cuisine: 'Authentic Goan Fish Thali & Local Curries',
        rating: 4.92,
        reviewsCount: 1980,
        priceLevel: '₹',
        specialty: 'Traditional Kingfish Thali with Sol Kadhi & Clam Masala',
        distance: '1.9 km from Vagator',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
        tags: ['Authentic Local', 'Pure Goan Taste', 'Budget Friendly', 'High Value'],
        address: 'Assagao, North Goa',
        coordinates: { lat: 15.5941, lng: 73.7684 }
      }
    ]
  },

  'dest-kashmir': {
    attractionPins: [
      { name: 'Dal Lake & Floating Market', category: 'nature', coordinates: { lat: 34.0837, lng: 74.8373 }, description: 'Shikara boats, floating gardens, and historic wooden houseboats.' },
      { name: 'Gulmarg Gondola & Ski Slopes', category: 'adventure', coordinates: { lat: 34.0484, lng: 74.3805 }, description: 'Asia’s highest cable car reaching 13,780 ft on Mount Affarwat.' },
      { name: 'Betaab Valley Pahalgam', category: 'nature', coordinates: { lat: 34.0163, lng: 75.3129 }, description: 'Pine-clad mountain slopes, Lidder river trails, and horse riding.' },
      { name: 'Mughal Gardens (Shalimar & Nishat)', category: 'monument', coordinates: { lat: 34.1481, lng: 74.8719 }, description: 'Terraced Mughal water cascades, chinar trees, and spring blossoms.' }
    ],
    hotels: [
      {
        id: 'hotel-khyber-gulmarg',
        name: 'The Khyber Himalayan Resort & Spa',
        location: 'Near Gondola, Gulmarg',
        city: 'Gulmarg',
        state: 'Jammu & Kashmir',
        country: 'India',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
        pricePerNight: 18900,
        originalPrice: 24000,
        rating: 4.95,
        reviewsCount: 740,
        stars: 5,
        type: 'resort',
        amenities: ['Heated Indoor Pool', 'Ski-in Access', 'L’Occitane Spa', 'Pine Valley Terrace', 'Heated Floors'],
        coordinates: { lat: 34.0484, lng: 74.3805 },
        roomsAvailable: 4,
        description: 'World-renowned alpine resort surrounded by 7 acres of coniferous forest with Affarwat views.'
      },
      {
        id: 'hotel-vivanta-dalview',
        name: 'Vivanta Dal View Srinagar',
        location: 'Kralsangri, Gopkar Road',
        city: 'Srinagar',
        state: 'Jammu & Kashmir',
        country: 'India',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        pricePerNight: 15500,
        originalPrice: 20000,
        rating: 4.88,
        reviewsCount: 920,
        stars: 5,
        type: 'luxury_hotel',
        amenities: ['Panoramic Dal Lake View', 'Infinity Edge Pool', 'Kashmiri Wazwan Kitchen', 'Tea Lounge'],
        coordinates: { lat: 34.0921, lng: 74.8612 },
        roomsAvailable: 7,
        description: 'Perched high on Kralsangri hill with 270-degree breathtaking vistas of Dal Lake and Zabarwan hills.'
      }
    ],
    restaurants: [
      {
        id: 'rest-kash-ahdoos',
        name: 'Ahdoos Restaurant (Since 1918)',
        cuisine: 'Authentic 36-Course Kashmiri Wazwan',
        rating: 4.9,
        reviewsCount: 2800,
        priceLevel: '₹₹',
        specialty: 'Rogan Josh, Gushtaba, Tabak Maaz & Kashmiri Pulao',
        distance: '0.4 km from Lal Chowk',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
        tags: ['Heritage Since 1918', 'Legendary Wazwan', 'Bakery', 'Warm Fireplace'],
        address: 'Residency Road, Srinagar, Kashmir',
        coordinates: { lat: 34.0721, lng: 74.8112 }
      },
      {
        id: 'rest-kash-highland',
        name: 'Highland Park Lounge & Fireside Cafe',
        cuisine: 'Himalayan Alpine, Continental & Trout',
        rating: 4.8,
        reviewsCount: 850,
        priceLevel: '₹₹₹',
        specialty: 'Fresh Pan-fried Himalayan Rainbow Trout & Hot Saffron Kahwa',
        distance: 'Near Gulmarg Golf Course',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
        tags: ['Snow View', 'Wood Fireplace', 'Vintage Bar', 'Warm Saffron Tea'],
        address: 'Church Road, Gulmarg, Kashmir',
        coordinates: { lat: 34.0512, lng: 74.3851 }
      }
    ]
  },

  'dest-kerala': {
    attractionPins: [
      { name: 'Alleppey Backwaters & Punnamada', category: 'nature', coordinates: { lat: 9.4981, lng: 76.3388 }, description: 'Vast canals, palm trees, and traditional kettuvallam houseboats.' },
      { name: 'Munnar Tea Estates & Top Station', category: 'nature', coordinates: { lat: 10.0889, lng: 77.0595 }, description: 'Rolling green tea gardens, mist valleys, and Eravikulam National Park.' },
      { name: 'Periyar Tiger Reserve (Thekkady)', category: 'adventure', coordinates: { lat: 9.6031, lng: 77.1615 }, description: 'Elephant watching boat safari and cardamom spice plantations.' },
      { name: 'Fort Kochi Chinese Fishing Nets', category: 'monument', coordinates: { lat: 9.9656, lng: 76.2421 }, description: 'Historic colonial port, Portuguese churches, and spice warehouses.' }
    ],
    hotels: [
      {
        id: 'hotel-kumarakom-resort',
        name: 'Kumarakom Lake Resort',
        location: 'Vembanad Lake, Kumarakom',
        city: 'Kottayam',
        state: 'Kerala',
        country: 'India',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
        pricePerNight: 14200,
        originalPrice: 19000,
        rating: 4.92,
        reviewsCount: 650,
        stars: 5,
        type: 'resort',
        amenities: ['250m Meandering Pool', 'Ayurmana Spa', 'Backwater Sunset Cruise', 'Seafood Bar'],
        coordinates: { lat: 9.6175, lng: 76.4300 },
        roomsAvailable: 6,
        description: 'Traditional 16th-century reconstructed Kerala heritage villas with private plunge pools.'
      }
    ],
    restaurants: [
      {
        id: 'rest-ker-grand',
        name: 'Grand Pavilion & Seafood Thali',
        cuisine: 'Traditional Kerala Sadhya & Seafood',
        rating: 4.9,
        reviewsCount: 3100,
        priceLevel: '₹₹',
        specialty: 'Karimeen Pollichathu (Pearl Spot Fish) & Banana Leaf Sadhya',
        distance: 'MG Road, Kochi (0.5 km)',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
        tags: ['Banana Leaf Sadhya', 'Pure Authentic', 'Karimeen Specialty', 'AC Family Dining'],
        address: 'MG Road, Ernakulam, Kerala',
        coordinates: { lat: 9.9723, lng: 76.2821 }
      },
      {
        id: 'rest-ker-paragon',
        name: 'Paragon Restaurant Kochi',
        cuisine: 'Malabar Coastal, Biryani & Appams',
        rating: 4.95,
        reviewsCount: 5400,
        priceLevel: '₹₹',
        specialty: 'World-famous Malabar Dum Biryani, Fish Mango Curry & Appam',
        distance: 'Lulu Mall / Marine Drive Kochi',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
        tags: ['Legendary Biryani', 'Fast Service', 'Family Crowd'],
        address: 'NH Bypass, Edappally, Kochi, Kerala',
        coordinates: { lat: 10.0261, lng: 76.3084 }
      }
    ]
  },

  'dest-rajasthan': {
    attractionPins: [
      { name: 'Amber Fort & Maota Lake', category: 'monument', coordinates: { lat: 26.9855, lng: 75.8513 }, description: 'Majestic hilltop fort with Sheesh Mahal (Mirror Palace) and elephant rides.' },
      { name: 'Hawa Mahal Palace of Winds', category: 'monument', coordinates: { lat: 26.9239, lng: 75.8267 }, description: 'Pink sandstone 5-tier honeycomb facade with 953 jharokhas.' },
      { name: 'City Palace & Lake Pichola Udaipur', category: 'monument', coordinates: { lat: 24.5764, lng: 73.6835 }, description: 'Splendid Rajput royal palace overlooking island palaces.' }
    ],
    hotels: [
      {
        id: 'hotel-taj-lake-palace',
        name: 'Taj Lake Palace',
        location: 'Lake Pichola, Udaipur',
        city: 'Udaipur',
        state: 'Rajasthan',
        country: 'India',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        pricePerNight: 24500,
        originalPrice: 32000,
        rating: 4.98,
        reviewsCount: 890,
        stars: 5,
        type: 'heritage_palace',
        amenities: ['Private Boat Arrival', 'Royal Jiva Spa', 'Palace Courtyard Dining', 'Lake View Pool'],
        coordinates: { lat: 24.5754, lng: 73.6800 },
        roomsAvailable: 5,
        description: '18th-century floating marble palace amidst the azure waters of Lake Pichola.'
      }
    ],
    restaurants: [
      {
        id: 'rest-raj-chokhi',
        name: 'Chokhi Dhani Ethnic Rajasthani Village',
        cuisine: 'Royal Rajasthani Thali & Street Delights',
        rating: 4.9,
        reviewsCount: 6500,
        priceLevel: '₹₹',
        specialty: 'Authentic Dal Baati Churma, Gatte ki Sabzi, Ker Sangri & Bajre ki Roti',
        distance: 'Tonk Road Jaipur (Village campus)',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
        tags: ['Pure Veg Thali', 'Folk Dance & Fire Acts', 'Camel Rides', 'Cultural Heritage'],
        address: '12 Miles Tonk Road, Jaipur, Rajasthan',
        coordinates: { lat: 26.7644, lng: 75.8362 }
      },
      {
        id: 'rest-raj-ambrai',
        name: 'Ambrai Restaurant Udaipur',
        cuisine: 'Royal Mewari, North Indian & Lake View Dining',
        rating: 4.88,
        reviewsCount: 3200,
        priceLevel: '₹₹₹',
        specialty: 'Mewari Laal Maas, Paneer Tikka & Saffron Rice overlooking illuminated palaces',
        distance: 'Opposite City Palace Ghats',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
        tags: ['Direct Lake Pichola View', 'Romantic Candlelight', 'Illuminated Palace Panorama'],
        address: 'Amet Haveli, Outside Chandpole, Udaipur, Rajasthan',
        coordinates: { lat: 24.5801, lng: 73.6791 }
      }
    ]
  },

  'dest-ladakh': {
    attractionPins: [
      { name: 'Pangong Tso High Altitude Lake', category: 'nature', coordinates: { lat: 33.7595, lng: 78.6674 }, description: 'Stunning 134 km long lake shifting from turquoise to deep cobalt.' },
      { name: 'Khardung La Pass (17,982 ft)', category: 'adventure', coordinates: { lat: 34.2787, lng: 77.6047 }, description: 'One of the world’s highest motorable mountain passes.' },
      { name: 'Nubra Valley & Hunder Sand Dunes', category: 'nature', coordinates: { lat: 34.5831, lng: 77.4721 }, description: 'Cold desert valley with double-humped Bactrian camel safaris.' },
      { name: 'Thiksey Monastery', category: 'temple', coordinates: { lat: 34.0567, lng: 77.6667 }, description: '12-story hilltop Gompa resembling the Potala Palace of Lhasa.' }
    ],
    hotels: [
      {
        id: 'hotel-grand-dragon',
        name: 'The Grand Dragon Ladakh',
        location: 'Old Road, Sheynam',
        city: 'Leh',
        state: 'Ladakh',
        country: 'India',
        image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
        pricePerNight: 12500,
        originalPrice: 16000,
        rating: 4.9,
        reviewsCount: 480,
        stars: 5,
        type: 'luxury_hotel',
        amenities: ['Oxygen-enriched Rooms', 'Solar Central Heating', 'Stok Kangri Mountain View', 'Multi-cuisine Bakery'],
        coordinates: { lat: 34.1561, lng: 77.5752 },
        roomsAvailable: 5,
        description: 'First luxury hotel in Ladakh equipped with round-the-clock oxygen delivery and solar heated facilities.'
      }
    ],
    restaurants: [
      {
        id: 'rest-lad-tibetan',
        name: 'The Tibetan Kitchen Leh',
        cuisine: 'Tibetan, Ladakhi & Himalayan Broths',
        rating: 4.9,
        reviewsCount: 2200,
        priceLevel: '₹₹',
        specialty: 'Handcrafted Steaming Momos, Thukpa soup, Tingmo Bread & Shaphaley',
        distance: 'Fort Road, Leh center (0.2 km)',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
        tags: ['Authentic Momos', 'Warm Cozy Ambiance', 'Apricot Juice', 'Traveler Favorite'],
        address: 'Fort Road, Behind Hotel Ladakh Residency, Leh',
        coordinates: { lat: 34.1611, lng: 77.5841 }
      },
      {
        id: 'rest-lad-gesmo',
        name: 'Gesmo Restaurant & German Bakery',
        cuisine: 'Himalayan Cafe, Pizzas & Yak Cheese',
        rating: 4.8,
        reviewsCount: 1650,
        priceLevel: '₹',
        specialty: 'Yak Cheese Woodfire Pizza, Fresh Apple Pie & Apricot Crumble',
        distance: 'Main Bazaar, Leh',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
        tags: ['Yak Cheese', 'Fresh Bakery', 'Budget Friendly', 'Great Coffee'],
        address: 'Fort Road, Leh, Ladakh',
        coordinates: { lat: 34.1632, lng: 77.5831 }
      }
    ]
  },

  'dest-andaman': {
    attractionPins: [
      { name: 'Radhanagar Beach (Havelock Island)', category: 'beach', coordinates: { lat: 11.9842, lng: 92.9512 }, description: 'Voted Asia’s best beach with turquoise water and soft white sand.' },
      { name: 'Elephant Beach Coral Reef', category: 'adventure', coordinates: { lat: 12.0121, lng: 92.9721 }, description: 'Premier scuba diving, sea walk, and vibrant live coral colonies.' },
      { name: 'Cellular Jail National Memorial', category: 'monument', coordinates: { lat: 11.6739, lng: 92.7478 }, description: 'Historic British colonial penitentiary in Port Blair with Light & Sound show.' }
    ],
    hotels: [
      {
        id: 'hotel-barefoot-havelock',
        name: 'Taj Exotica Resort & Spa, Andamans',
        location: 'Radhanagar Beach, Havelock',
        city: 'Havelock Island',
        state: 'Andaman & Nicobar',
        country: 'India',
        image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80',
        pricePerNight: 26000,
        originalPrice: 34000,
        rating: 4.96,
        reviewsCount: 510,
        stars: 5,
        type: 'resort',
        amenities: ['Olympic-sized Pool', 'Direct Private Beach Trail', 'PADI Dive Center', 'Jiva Spa'],
        coordinates: { lat: 11.9852, lng: 92.9525 },
        roomsAvailable: 4,
        description: 'Sustainable luxury villas nestled in a 46-acre coconut grove bordering world-famous Radhanagar beach.'
      }
    ],
    restaurants: [
      {
        id: 'rest-and-different',
        name: 'Something Different - A Beachside Cafe',
        cuisine: 'Seafood, Woodfire Pizzas & Tropical Mocktails',
        rating: 4.85,
        reviewsCount: 1900,
        priceLevel: '₹₹',
        specialty: 'Grilled Red Snapper, Crab Masala & Coconut Mojitos',
        distance: 'Beach No. 2, Havelock Island',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
        tags: ['Beachside Seating', 'Free Pick & Drop', 'Fresh Catch', 'Tropical Vibe'],
        address: 'Beach No. 2, Havelock Island, Andaman',
        coordinates: { lat: 12.0231, lng: 93.0112 }
      }
    ]
  },

  'dest-manali': {
    attractionPins: [
      { name: 'Solang Valley Adventure Arena', category: 'adventure', coordinates: { lat: 32.3167, lng: 77.1583 }, description: 'Tandem paragliding, zorbing, quad biking, and winter ski slopes.' },
      { name: 'Atal Tunnel & Rohtang Snow Point', category: 'adventure', coordinates: { lat: 32.3644, lng: 77.1408 }, description: 'Engineering marvel tunnel leading to snowbound Lahaul valley.' },
      { name: 'Hadimba Wooden Forest Temple', category: 'temple', coordinates: { lat: 32.2478, lng: 77.1812 }, description: '16th-century pagoda-style wooden temple inside cedar pine groves.' }
    ],
    hotels: [
      {
        id: 'hotel-span-resort',
        name: 'Span Resort & Spa Manali',
        location: 'Kullu Manali Highway, Baragran',
        city: 'Manali',
        state: 'Himachal Pradesh',
        country: 'India',
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
        pricePerNight: 11500,
        originalPrice: 15500,
        rating: 4.9,
        reviewsCount: 680,
        stars: 5,
        type: 'resort',
        amenities: ['Riverside Beas River Cottages', 'Heated Outdoor Pool', 'Helipad', 'Trout Fishing'],
        coordinates: { lat: 32.1482, lng: 77.1721 },
        roomsAvailable: 5,
        description: 'Iconic luxury riverside resort right along the rushing Beas River with private balconies.'
      }
    ],
    restaurants: [
      {
        id: 'rest-man-cafe1947',
        name: 'Cafe 1947 Old Manali',
        cuisine: 'Italian, Himalayan Trout & Craft Cafe',
        rating: 4.88,
        reviewsCount: 3400,
        priceLevel: '₹₹',
        specialty: 'Pan-fried River Trout, Firewood Pizza & Mountain Herbal Tea',
        distance: 'Old Manali Bridge (Riverside)',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
        tags: ['Overhanging River Deck', 'Live Acoustic Music', 'Best Trout in Town'],
        address: 'Near Nehru Kund, Old Manali, Himachal Pradesh',
        coordinates: { lat: 32.2589, lng: 77.1824 }
      }
    ]
  },

  'dest-varanasi': {
    attractionPins: [
      { name: 'Dashashwamedh Ghat Maha Aarti', category: 'temple', coordinates: { lat: 25.3069, lng: 83.0104 }, description: 'Spectacular brass lamp evening prayer ritual along the holy Ganges.' },
      { name: 'Kashi Vishwanath Jyotirlinga Temple', category: 'temple', coordinates: { lat: 25.3109, lng: 83.0107 }, description: 'Golden spired ancient corridor dedicated to Lord Shiva.' },
      { name: 'Sarnath Deer Park & Buddhist Stupa', category: 'monument', coordinates: { lat: 25.3811, lng: 83.0214 }, description: 'Sacred place where Buddha delivered his first sermon after enlightenment.' }
    ],
    hotels: [
      {
        id: 'hotel-brijrama-palace',
        name: 'BrijRama Palace Heritage Hotel',
        location: 'Darbhanga Ghat, Dashashwamedh',
        city: 'Varanasi',
        state: 'Uttar Pradesh',
        country: 'India',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
        pricePerNight: 21000,
        originalPrice: 28000,
        rating: 4.98,
        reviewsCount: 780,
        stars: 5,
        type: 'heritage_palace',
        amenities: ['Private Boat River Check-in', 'Historical Elevator (1918)', 'Pure Vegetarian Gourmet', 'Live Classical Sitar'],
        coordinates: { lat: 25.3031, lng: 83.0112 },
        roomsAvailable: 3,
        description: '210-year-old palace standing proudly on the banks of River Ganges with royal hospitality.'
      }
    ],
    restaurants: [
      {
        id: 'rest-var-keshari',
        name: 'Keshari Restaurant & Banarasi Sweets',
        cuisine: 'Pure Vegetarian Banarasi Thali & Street Delights',
        rating: 4.8,
        reviewsCount: 2900,
        priceLevel: '₹',
        specialty: 'Banarasi Dum Aloo Thali, Malaiyyo foam dessert & Crisp Kachori Sabzi',
        distance: '0.2 km from Dashashwamedh Ghat',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
        tags: ['Pure Veg', 'Legendary Banarasi Taste', 'Heritage Since 1968'],
        address: 'Godowlia Crossing, Varanasi, UP',
        coordinates: { lat: 25.3089, lng: 73.0078 }
      }
    ]
  },

  'dest-agra': {
    attractionPins: [
      { name: 'Taj Mahal (Wonder of the World)', category: 'monument', coordinates: { lat: 27.1751, lng: 78.0421 }, description: 'UNESCO World Heritage ivory-white marble mausoleum built by Shah Jahan.' },
      { name: 'Agra Red Fort', category: 'monument', coordinates: { lat: 27.1795, lng: 78.0211 }, description: 'Massive red sandstone imperial fortress of the Mughal dynasty.' },
      { name: 'Fatehpur Sikri Royal City', category: 'monument', coordinates: { lat: 27.0945, lng: 77.6677 }, description: 'Ancient fortified capital built by Emperor Akbar.' }
    ],
    hotels: [
      {
        id: 'hotel-oberoi-amarvilas',
        name: 'The Oberoi Amarvilas',
        location: 'Taj East Gate Road, Agra',
        city: 'Agra',
        state: 'Uttar Pradesh',
        country: 'India',
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
        pricePerNight: 28000,
        originalPrice: 38000,
        rating: 4.99,
        reviewsCount: 1250,
        stars: 5,
        type: 'luxury_hotel',
        amenities: ['Unobstructed Taj Mahal Views', 'Mughal Architecture Pools', 'Royal Spa', 'Private Golf Buggy to Taj'],
        coordinates: { lat: 27.1682, lng: 78.0483 },
        roomsAvailable: 3,
        description: 'Only 600 meters from the Taj Mahal, every guest room offers direct views of the monument.'
      }
    ],
    restaurants: [
      {
        id: 'rest-agra-pinch',
        name: 'Pinch of Spice Agra',
        cuisine: 'North Indian, Mughlai & Tandoor',
        rating: 4.85,
        reviewsCount: 4200,
        priceLevel: '₹₹',
        specialty: 'Murg Boti Masala, Dal Makhani, Paneer Lababdar & Agra Petha Kulfi',
        distance: 'Fatehabad Road (1.5 km from Taj)',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
        tags: ['Mughlai Specialist', 'Family Favorite', 'Cocktails'],
        address: 'Fatehabad Road, Tajganj, Agra',
        coordinates: { lat: 27.1611, lng: 78.0412 }
      }
    ]
  },

  'dest-amritsar': {
    attractionPins: [
      { name: 'Sri Harmandir Sahib (Golden Temple)', category: 'temple', coordinates: { lat: 31.6200, lng: 74.8765 }, description: 'Spiritual heart of Sikhism with sanctum surrounded by Amrit Sarovar holy pool.' },
      { name: 'Wagah Border Beating Retreat', category: 'monument', coordinates: { lat: 31.6042, lng: 74.5721 }, description: 'Electrifying sunset military parade ceremony at the India-Pakistan frontier.' },
      { name: 'Jallianwala Bagh Memorial', category: 'monument', coordinates: { lat: 31.6208, lng: 74.8801 }, description: 'Historic national memorial preserving the martyrs’ well and bullet marks.' }
    ],
    hotels: [
      {
        id: 'hotel-hyatt-amritsar',
        name: 'Hyatt Regency Amritsar',
        location: 'MBM Farms, GT Road',
        city: 'Amritsar',
        state: 'Punjab',
        country: 'India',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        pricePerNight: 7500,
        originalPrice: 10500,
        rating: 4.85,
        reviewsCount: 980,
        stars: 5,
        type: 'luxury_hotel',
        amenities: ['Complimentary Golden Temple Shuttle', 'Outdoor Pool', 'Shanti Spa', 'Punjabi Dhaba Restaurant'],
        coordinates: { lat: 31.6312, lng: 74.8984 },
        roomsAvailable: 8,
        description: 'Warm Punjabi hospitality with luxury rooms and frequent guided shuttle service to the Golden Temple.'
      }
    ],
    restaurants: [
      {
        id: 'rest-amr-kesar',
        name: "Kesar Da Dhaba (Since 1916)",
        cuisine: 'Authentic Pure Punjabi Dhaba in Desi Ghee',
        rating: 4.95,
        reviewsCount: 7800,
        priceLevel: '₹',
        specialty: '12-hour slow-cooked Dal Makhani, Laccha Paratha & Phirni in earthen pots',
        distance: 'Passian Chowk, near Golden Temple (0.6 km)',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
        tags: ['Pure Desi Ghee', 'Century-old Legend', 'Celebrity Favorite', 'Pure Vegetarian'],
        address: 'Chowk Passian, Near Golden Temple, Amritsar',
        coordinates: { lat: 31.6231, lng: 74.8712 }
      },
      {
        id: 'rest-amr-kulcha',
        name: 'Bhai Kulwant Singh Kulchian Wale',
        cuisine: 'Crispy Amritsari Stuffed Kulcha',
        rating: 4.9,
        reviewsCount: 3800,
        priceLevel: '₹',
        specialty: 'Amritsari Aloo Pithi Chur Chur Kulcha with spicy chole and tamarind chutney',
        distance: 'Heritage Street, Amritsar',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
        tags: ['Crispy Butter Kulcha', 'Breakfast Must-visit', 'Pure Veg'],
        address: 'Bazar Mai Sewan, Amritsar',
        coordinates: { lat: 31.6212, lng: 74.8745 }
      }
    ]
  },

  'dest-ooty': {
    attractionPins: [
      { name: 'Nilgiri Mountain Railway (Toy Train)', category: 'adventure', coordinates: { lat: 11.4064, lng: 76.7032 }, description: 'UNESCO World Heritage steam locomotive winding through pine tunnels.' },
      { name: 'Ooty Botanical Gardens & Doddabetta Peak', category: 'nature', coordinates: { lat: 11.4172, lng: 76.7112 }, description: 'Highest mountain peak in Tamil Nadu with sweeping Western Ghats views.' },
      { name: 'Coorg Coffee Estates & Abbey Falls', category: 'nature', coordinates: { lat: 12.4244, lng: 75.7382 }, description: 'Lush aroma of arabica coffee beans, black pepper vines, and gushing falls.' }
    ],
    hotels: [
      {
        id: 'hotel-savoy-ooty',
        name: 'Savoy - IHCL SeleQtions Ooty',
        location: 'Sylks Road, Ooty',
        city: 'Ooty',
        state: 'Tamil Nadu',
        country: 'India',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
        pricePerNight: 13500,
        originalPrice: 18000,
        rating: 4.9,
        reviewsCount: 720,
        stars: 5,
        type: 'heritage_palace',
        amenities: ['180-year-old Colonial Cottages', 'Fireplace Butler Service', 'High Tea English Garden', 'Spa'],
        coordinates: { lat: 11.4112, lng: 76.6954 },
        roomsAvailable: 5,
        description: 'Historic British colonial hill station sanctuary with rose gardens and burning log fireplaces.'
      }
    ],
    restaurants: [
      {
        id: 'rest-ooty-shinkows',
        name: "Shinkow's Chinese & Nilgiri Cafe",
        cuisine: 'Old-school Anglo-Chinese & Tibetan',
        rating: 4.8,
        reviewsCount: 1400,
        priceLevel: '₹₹',
        specialty: 'Cantonese noodles, chili beef/paneer, homemade plum wine & hot chocolate',
        distance: 'Commissioner Road, Ooty (0.4 km)',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
        tags: ['Vintage 1954 Decor', 'Comfort Dining', 'Cozy Ambiance'],
        address: 'Commissioner Road, Ooty, Nilgiris',
        coordinates: { lat: 11.4082, lng: 76.7021 }
      }
    ]
  },

  'dest-meghalaya': {
    attractionPins: [
      { name: 'Double Decker Living Root Bridge', category: 'nature', coordinates: { lat: 25.2758, lng: 91.6881 }, description: 'Nongriat bio-engineered rubber tree bridges grown by Khasi tribes.' },
      { name: 'Nohkalikai Waterfalls Cherrapunji', category: 'nature', coordinates: { lat: 25.2762, lng: 91.7042 }, description: 'India’s tallest plunge waterfall dropping 1,115 feet into turquoise pool.' },
      { name: 'Dawki Crystal Clear Umngot River', category: 'adventure', coordinates: { lat: 25.1852, lng: 92.0195 }, description: 'Boating where water is so transparent boats seem to float on thin air.' }
    ],
    hotels: [
      {
        id: 'hotel-ri-kynjai',
        name: 'Ri Kynjai Serenity By The Lake',
        location: 'Umiam Lake, Shillong',
        city: 'Shillong',
        state: 'Meghalaya',
        country: 'India',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        pricePerNight: 12000,
        originalPrice: 16500,
        rating: 4.92,
        reviewsCount: 450,
        stars: 5,
        type: 'resort',
        amenities: ['Umiam Lakefront Cottages', 'Khasi Traditional Architecture', 'Herbal Massage Spa', 'Pine View Deck'],
        coordinates: { lat: 25.6698, lng: 91.9021 },
        roomsAvailable: 4,
        description: 'Eco-luxury resort inspired by indigenous Khasi thatch architecture overlooking pristine Umiam Lake.'
      }
    ],
    restaurants: [
      {
        id: 'rest-meg-cafeshillong',
        name: 'Cafe Shillong & Rock Lounge',
        cuisine: 'Khasi Traditional, Asian & Rock Cafe',
        rating: 4.85,
        reviewsCount: 1600,
        priceLevel: '₹₹',
        specialty: 'Doh Neiiong (Khasi pork/paneer with black sesame), Steamed Fish & Roasted Coffee',
        distance: 'Laitumkhrah, Shillong',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
        tags: ['Rock Capital Vibe', 'Live Music Nights', 'Khasi Cuisine'],
        address: 'Laitumkhrah Main Road, Shillong, Meghalaya',
        coordinates: { lat: 25.5684, lng: 91.8951 }
      }
    ]
  },

  'dest-hampi': {
    attractionPins: [
      { name: 'Stone Chariot & Vijaya Vittala Temple', category: 'monument', coordinates: { lat: 15.3402, lng: 76.4795 }, description: 'World-famous monolithic granite chariot and musical pillar pavilions.' },
      { name: 'Virupaksha Sacred Temple', category: 'temple', coordinates: { lat: 15.3353, lng: 76.4601 }, description: '7th-century functioning Dravidian shrine beside the Tungabhadra River.' },
      { name: 'Gokarna Om Beach & Cliff Trails', category: 'beach', coordinates: { lat: 14.5172, lng: 74.3167 }, description: 'Naturally shaped like the auspicious OM symbol with bohemian ocean cafes.' }
    ],
    hotels: [
      {
        id: 'hotel-evolve-hampi',
        name: 'Evolve Back Kamalapura Palace Hampi',
        location: 'Kamalapura, Hampi',
        city: 'Hampi',
        state: 'Karnataka',
        country: 'India',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        pricePerNight: 24000,
        originalPrice: 32000,
        rating: 4.96,
        reviewsCount: 620,
        stars: 5,
        type: 'heritage_palace',
        amenities: ['Private Jacuzzi Suites', 'Vijayanagara Fortress Design', 'Olympic Sized Pool', 'Heritage Walks'],
        coordinates: { lat: 15.3012, lng: 76.4821 },
        roomsAvailable: 5,
        description: 'Imposing fortress design inspired by the 14th-century Vijayanagara Empire with royal amenities.'
      }
    ],
    restaurants: [
      {
        id: 'rest-ham-mango',
        name: 'Mango Tree Restaurant Hampi',
        cuisine: 'South Indian Thali, Continental & Fresh Juices',
        rating: 4.8,
        reviewsCount: 3100,
        priceLevel: '₹',
        specialty: 'Hampi Special Royal Thali, Nutella banana pancakes & Fresh pomegranate lassi',
        distance: 'Janata Plot, Hampi Bazaar',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
        tags: ['Floor Cushion Seating', 'River Breeze', 'Traveler Hub'],
        address: 'Near Old Police Station, Hampi, Karnataka',
        coordinates: { lat: 34.3371, lng: 76.4632 }
      }
    ]
  },

  'dest-dubai': {
    attractionPins: [
      { name: 'Burj Khalifa Observation Deck', category: 'monument', coordinates: { lat: 25.1972, lng: 55.2744 }, description: 'World’s tallest skyscraper soaring 828 meters into the desert clouds.' },
      { name: 'The Dubai Mall & Dancing Fountains', category: 'monument', coordinates: { lat: 25.1985, lng: 55.2796 }, description: 'Mega shopping destination with massive indoor aquarium and water fountains.' },
      { name: 'Palm Jumeirah & Atlantis', category: 'beach', coordinates: { lat: 25.1304, lng: 55.1171 }, description: 'World-famous tree-shaped artificial archipelago on the Persian Gulf.' }
    ],
    hotels: [
      {
        id: 'hotel-atlantis-dubai',
        name: 'Atlantis, The Palm',
        location: 'Crescent Road, Palm Jumeirah',
        city: 'Dubai',
        country: 'UAE',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        pricePerNight: 34000,
        originalPrice: 44000,
        rating: 4.9,
        reviewsCount: 4200,
        stars: 5,
        type: 'resort',
        amenities: ['Aquaventure Waterpark Included', 'Lost Chambers Aquarium', 'Private Beach', 'Celebrity Chef Restaurants'],
        coordinates: { lat: 25.1304, lng: 55.1171 },
        roomsAvailable: 7,
        description: 'World-famous oceanic resort located at the crown of Palm Jumeirah.'
      }
    ],
    restaurants: [
      {
        id: 'rest-dub-alhadheera',
        name: 'Al Hadheera Desert Dining',
        cuisine: 'Authentic Emirati & Middle Eastern Grills',
        rating: 4.9,
        reviewsCount: 2800,
        priceLevel: '₹₹₹',
        specialty: 'Whole roasted lamb ouzi, hot shawarma, baklava and live falconry displays',
        distance: 'Bab Al Shams Desert Resort',
        image: 'https://images.unsplash.com/photo-1502301103665-0b95cc738daf?auto=format&fit=crop&w=600&q=80',
        tags: ['Open Desert Dining', 'Live Arabic Music', 'Falconry & Horses'],
        address: 'Al Qudra Road, Dubai',
        coordinates: { lat: 24.9812, lng: 55.3341 }
      }
    ]
  },

  'dest-bali': {
    attractionPins: [
      { name: 'Tegallalang Emerald Rice Terraces', category: 'nature', coordinates: { lat: -8.4333, lng: 115.2811 }, description: 'Step-like paddy landscape carved along lush Ubud river gorge.' },
      { name: 'Uluwatu Cliff Temple & Sunset Kecak Dance', category: 'temple', coordinates: { lat: -8.8291, lng: 115.0847 }, description: 'Ancient cliff shrine perched 70 meters above crashing Indian Ocean waves.' },
      { name: 'Kelingking T-Rex Beach Nusa Penida', category: 'beach', coordinates: { lat: -8.7511, lng: 115.4744 }, description: 'Dramatic dinosaur-head shaped coastal cliff towering over turquoise waters.' }
    ],
    hotels: [
      {
        id: 'hotel-four-seasons-bali',
        name: 'Four Seasons Resort Bali at Sayan',
        location: 'Sayan, Ubud',
        city: 'Ubud',
        country: 'Indonesia',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
        pricePerNight: 39000,
        originalPrice: 49000,
        rating: 4.97,
        reviewsCount: 880,
        stars: 5,
        type: 'resort',
        amenities: ['Suspension Bridge Entry', 'Ayung River Villas', 'Sacred River Spa', 'Yoga Shala'],
        coordinates: { lat: -8.5021, lng: 115.2452 },
        roomsAvailable: 4,
        description: 'Nestled between two sacred rivers in the lush Ayung valley with world-class wellness.'
      }
    ],
    restaurants: [
      {
        id: 'rest-bali-bebek',
        name: 'Bebek Bengil (Dirty Duck Diner) Ubud',
        cuisine: 'Balinese Crispy Duck & Indonesian Satay',
        rating: 4.88,
        reviewsCount: 3900,
        priceLevel: '₹₹',
        specialty: 'Famous Balinese Crispy Duck with Sambal Matah and fragrant turmeric rice',
        distance: 'Hanoman Street, Ubud',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
        tags: ['Paddy Field Gazebos', 'Crispy Duck Legend', 'Tropical Garden'],
        address: 'Padang Tegal, Jalan Hanoman, Ubud, Bali',
        coordinates: { lat: -8.5142, lng: 115.2631 }
      }
    ]
  }
};

/**
 * Returns nearby info for a destination, falling back gracefully if not explicitly defined
 */
export function getNearbyInfoForDestination(dest: TouristDestination): DestinationNearbyInfo {
  if (DESTINATION_NEARBY_MAP[dest.id]) {
    return DESTINATION_NEARBY_MAP[dest.id];
  }

  // Fallback dynamic generation based on destination coordinates
  const lat = dest.coordinates.lat;
  const lng = dest.coordinates.lng;

  const defaultPins: DestinationAttractionPin[] = dest.popularAttractions.map((name, idx) => ({
    name,
    category: idx % 2 === 0 ? 'nature' : 'monument',
    coordinates: {
      lat: lat + (idx % 2 === 0 ? 0.02 * (idx + 1) : -0.015 * (idx + 1)),
      lng: lng + (idx % 2 === 0 ? -0.02 * (idx + 1) : 0.025 * (idx + 1))
    },
    description: `Iconic attraction located in ${dest.name}.`
  }));

  const defaultHotels: Hotel[] = [
    {
      id: `hotel-dyn-${dest.id}-1`,
      name: `${dest.name} Royal Grand Palace & Spa`,
      location: `Central ${dest.name}`,
      city: dest.name,
      state: dest.state,
      country: dest.country,
      image: dest.image,
      pricePerNight: Math.round(dest.startingPrice * 0.45),
      originalPrice: Math.round(dest.startingPrice * 0.6),
      rating: 4.9,
      reviewsCount: 420,
      stars: 5,
      type: 'luxury_hotel',
      amenities: ['Scenic Mountain / Coastal View', 'Buffet Breakfast Included', 'Luxury Spa', 'Airport Shuttle'],
      coordinates: { lat: lat + 0.008, lng: lng + 0.01 },
      roomsAvailable: 5,
      description: `Premier 5-star accommodation offering magnificent views of ${dest.name} and royal hospitality.`
    },
    {
      id: `hotel-dyn-${dest.id}-2`,
      name: `Heritage Boutique Inn ${dest.name}`,
      location: `Old Town ${dest.name}`,
      city: dest.name,
      state: dest.state,
      country: dest.country,
      image: dest.gallery?.[1] || dest.image,
      pricePerNight: Math.round(dest.startingPrice * 0.28),
      originalPrice: Math.round(dest.startingPrice * 0.38),
      rating: 4.8,
      reviewsCount: 290,
      stars: 4,
      type: 'boutique_stay',
      amenities: ['Central Location', 'Rooftop Cafe', 'High Speed WiFi', 'Tour Desk'],
      coordinates: { lat: lat - 0.012, lng: lng - 0.009 },
      roomsAvailable: 8,
      description: `Charming boutique retreat situated in the cultural heart of ${dest.name}.`
    }
  ];

  const defaultRestaurants: NearbyRestaurant[] = [
    {
      id: `rest-dyn-${dest.id}-1`,
      name: `${dest.name} Heritage Dining Room`,
      cuisine: `Authentic Regional & Local Specialties`,
      rating: 4.9,
      reviewsCount: 1100,
      priceLevel: '₹₹',
      specialty: `Chef's Signature Local Thali & Heritage Delicacies`,
      distance: '0.8 km from center',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      tags: ['Authentic Cuisine', 'Family Dining', 'Pure Fresh Flavors'],
      address: `Main Heritage Road, ${dest.name}`,
      coordinates: { lat: lat + 0.005, lng: lng - 0.004 }
    },
    {
      id: `rest-dyn-${dest.id}-2`,
      name: `The Viewpoint Rooftop Lounge`,
      cuisine: `North Indian, Continental & Grills`,
      rating: 4.8,
      reviewsCount: 850,
      priceLevel: '₹₹',
      specialty: `Tandoori Platters, Woodfire Breads & Sunset Drinks`,
      distance: '1.4 km from center',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
      tags: ['Panoramic Sunset View', 'Cocktails', 'Warm Hospitality'],
      address: `Hillside Viewpoint, ${dest.name}`,
      coordinates: { lat: lat - 0.006, lng: lng + 0.007 }
    }
  ];

  return {
    attractionPins: defaultPins,
    hotels: defaultHotels,
    restaurants: defaultRestaurants
  };
}
