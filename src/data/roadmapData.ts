/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DestinationRoadmapSpot, PackageRoadmapDay, TouristDestination, TourPackage } from '../types';

/**
 * Sequential exploration roadmaps for ALL tourist destinations
 * Details Step by Step: Phase, Spot Name, Category, Duration, What & How to explore, Eatery, and Insider Tips
 */
export const DESTINATION_EXPLORATION_ROADMAPS: Record<string, DestinationRoadmapSpot[]> = {
  'dest-goa': [
    {
      step: 1,
      phase: 'Morning',
      spotName: 'Aguada Fort & Sinquerim Lighthouse',
      spotCategory: 'monument',
      duration: '2.5 Hours',
      whatToExplore: '17th-century Portuguese fortress overlooking the Arabian Sea, freshwater spring reservoir, and historic lighthouse.',
      howToExplore: 'Drive 20 mins from Calangute. Walk along the preserved ramparts with panoramic sea views. Hire an audio guide at the gate.',
      nearbyEatery: {
        name: 'Sinquerim Beach Shack',
        cuisine: 'Goan Coastal & Fresh Juices',
        specialty: 'King Coconut Water, Goan Poee & Fish Fingers'
      },
      insiderTip: 'Arrive by 08:30 AM before tourist coaches arrive to get uncrowded ocean bastion photography.'
    },
    {
      step: 2,
      phase: 'Mid-Day',
      spotName: 'Fontainhas Latin Quarter (Panaji)',
      spotCategory: 'monument',
      duration: '2 Hours',
      whatToExplore: 'UNESCO recognized heritage quarter with vibrant pastel yellow, mint, and ochre Portuguese colonial bungalows with terracotta tiles.',
      howToExplore: 'Park at Panaji riverfront. Explore on foot through narrow cobblestone lanes, art galleries, and Azulejo ceramic tile workshops.',
      nearbyEatery: {
        name: 'Viva Panjim Heritage Restaurant',
        cuisine: 'Authentic Goan Portuguese',
        specialty: 'Prawn Caldine with Warm Poee Bread & Bebinca'
      },
      insiderTip: 'Look out for original Portuguese family nameplates still adorning traditional wrought-iron balconies.'
    },
    {
      step: 3,
      phase: 'Afternoon',
      spotName: 'Anjuna Beach & Flea Market Cliffs',
      spotCategory: 'beach',
      duration: '2.5 Hours',
      whatToExplore: 'Red laterite cliff formations, artisan flea market stalls, handmade jewelry, bohemian beach vibes, and parasailing.',
      howToExplore: 'Ride a scooter or cab along coastal roads. Stroll along the rock-studded shoreline and enjoy chilled coconut water.',
      nearbyEatery: {
        name: 'Curlies Beach Shack & Lounge',
        cuisine: 'Goan Continental & Seafood',
        specialty: 'Butter Garlic Prawns & Chilled Feni Cocktails'
      },
      insiderTip: 'Sit at the cliff edge terrace for the coolest afternoon breeze as the tide washes over the laterite rocks.'
    },
    {
      step: 4,
      phase: 'Sunset / Night',
      spotName: 'Mandovi River Sunset Luxury Cruise',
      spotCategory: 'nature',
      duration: '2 Hours',
      whatToExplore: 'Evening boat cruise along the tranquil Mandovi River with live Goan Dekhni folk dances, DJ music, and illuminated bridge vistas.',
      howToExplore: 'Board at Santa Monica Jetty in Panaji. Pre-book the upper deck open-air lounge tickets for the best sunset skyline view.',
      nearbyEatery: {
        name: "The Fisherman's Wharf Panaji",
        cuisine: 'Premium Goan Coastal Seafood',
        specialty: 'Goan Kingfish Curry, Crab Xec Xec & Steamed Rice'
      },
      insiderTip: 'Book the 05:45 PM twilight departure to catch both the sunset over the Arabian Sea and the city lights lit up at dusk.'
    }
  ],

  'dest-kashmir': [
    {
      step: 1,
      phase: 'Morning',
      spotName: 'Dal Lake Sunrise Shikara & Floating Market',
      spotCategory: 'nature',
      duration: '2.5 Hours',
      whatToExplore: 'Centuries-old floating vegetable and flower market, tranquil lotus channels, Char Chinar island, and wood-carved houseboats.',
      howToExplore: 'Board a traditional wooden Shikara at Ghat No. 7 by 06:30 AM. Sip hot steaming saffron Kahwa with almond slivers on board.',
      nearbyEatery: {
        name: 'Shikara Floating Tea Stall',
        cuisine: 'Traditional Kashmiri Tea & Bakery',
        specialty: 'Original Saffron & Cardamom Kahwa with Lavasa Bread'
      },
      insiderTip: 'The sunrise mist lifting over the Zabarwan mountain range reflects pure gold onto the lake surface.'
    },
    {
      step: 2,
      phase: 'Mid-Day',
      spotName: 'Mughal Gardens: Nishat Bagh & Shalimar Bagh',
      spotCategory: 'monument',
      duration: '2.5 Hours',
      whatToExplore: 'Terraced Persian garden pavilions constructed by Emperor Jahangir and Asif Khan, ancient Chinar canopies, and cascading water fountains.',
      howToExplore: 'Private cab drive along Dal Lake Boulevard. Walk up the 12 distinct terraces representing signs of the zodiac.',
      nearbyEatery: {
        name: 'Ahdoos Restaurant Residency Road',
        cuisine: 'Royal Kashmiri Wazwan',
        specialty: 'Mutton Rogan Josh, Gushtaba & Kashmiri Pulao'
      },
      insiderTip: 'Carry a lightweight shawl even in summer as shade under ancient Chinars is delightfully crisp.'
    },
    {
      step: 3,
      phase: 'Afternoon',
      spotName: 'Gulmarg Gondola (Phase 1 & Phase 2)',
      spotCategory: 'nature',
      duration: '3.5 Hours',
      whatToExplore: 'Asia’s highest operating cable car reaching 14,000 ft at Apharwat Peak, panoramic snow peaks, pine forests, and ski meadows.',
      howToExplore: 'Take Phase 1 from Gulmarg base to Kongdoori, then switch to Phase 2 cable car to the snow-bound summit. Book tickets online in advance.',
      nearbyEatery: {
        name: 'Cloves at The Khyber',
        cuisine: 'Kashmiri Alpine & Global Comfort',
        specialty: 'Slow-Cooked Kashmiri Harissa & Walnut Halwa'
      },
      insiderTip: 'Wear sunglasses at Phase 2 as the pristine snow reflects intense alpine sunlight.'
    },
    {
      step: 4,
      phase: 'Sunset / Night',
      spotName: 'Pari Mahal (Palace of Fairies) & Boulevard Stroll',
      spotCategory: 'viewpoint',
      duration: '2 Hours',
      whatToExplore: 'Six-terraced historical observatory atop Zabarwan hills overlooking the entire illuminated bowl of Dal Lake and Srinagar city.',
      howToExplore: 'Cab up the scenic hairpin road before 05:30 PM. Afterwards, stroll down Boulevard Road for pashmina and saffron shopping.',
      nearbyEatery: {
        name: 'Mughal Darbar Srinagar',
        cuisine: 'Authentic Kashmiri Cuisine',
        specialty: 'Tabakh Maaz (Crispy Ribs) & Phirni'
      },
      insiderTip: 'Pari Mahal sunset vantage point offers the best elevated panorama of houseboats lighting up their evening lanterns.'
    }
  ],

  'dest-kerala': [
    {
      step: 1,
      phase: 'Morning',
      spotName: 'Eravikulam National Park (Munnar)',
      spotCategory: 'nature',
      duration: '3 Hours',
      whatToExplore: 'Home to the world’s largest population of endangered Nilgiri Tahr mountain goats, rolling tea valleys, and Anamudi peak.',
      howToExplore: 'Board the Kerala Forest Department eco-safari bus from the ticket counter. Walk the paved 1.5 km cliffside trail amidst morning mist.',
      nearbyEatery: {
        name: 'Tea Valley View Cafe',
        cuisine: 'South Indian & Nilgiri Tea',
        specialty: 'Hot Steamed Idlis with Coconut Chutney & Fresh Munnar Cardamom Tea'
      },
      insiderTip: 'Pre-book the 08:00 AM first slot to spot herds of Nilgiri Tahr grazing right along the fence without crowds.'
    },
    {
      step: 2,
      phase: 'Mid-Day',
      spotName: 'Tata Tea Museum & Lockhart Plantation',
      spotCategory: 'monument',
      duration: '2 Hours',
      whatToExplore: 'Historic 1880s roller machinery, live tea leaf plucking and CTC manufacturing demonstration, plus private tea tasting room.',
      howToExplore: 'Guided factory tour explaining Orthodox vs CTC tea production. Sample single-origin green, white, and black teas.',
      nearbyEatery: {
        name: 'Rapsy Restaurant Munnar Town',
        cuisine: 'Kerala Coastal & Arabic',
        specialty: 'Malabar Chicken Biryani, Flaky Parottas & Fresh Lime Soda'
      },
      insiderTip: 'Purchase fresh handmade chocolates and first-flush tea dust directly at the cooperative counter inside.'
    },
    {
      step: 3,
      phase: 'Afternoon',
      spotName: 'Mattupetty Dam & Echo Point Lake',
      spotCategory: 'nature',
      duration: '2 Hours',
      whatToExplore: 'Concrete gravity dam nestled among pine forests, speedboating on reservoir waters, and natural echo reflection cove.',
      howToExplore: 'Cab ride along the Gap Road. Rent a 5-seater speed boat for high-speed thrills across the placid reservoir.',
      nearbyEatery: {
        name: 'Lakeside Spices & Corn Kiosk',
        cuisine: 'Local Street Snacks',
        specialty: 'Charcoal Roasted Sweet Corn with Lemon Masala & Raw Mango'
      },
      insiderTip: 'Call out across Echo Point towards the green hill opposite to hear your voice rebound 3 clear times.'
    },
    {
      step: 4,
      phase: 'Sunset / Night',
      spotName: 'Alleppey Backwaters Luxury Houseboat Check-in',
      spotCategory: 'nature',
      duration: 'Overnight / Evening',
      whatToExplore: 'Private traditional Kettuvallam wooden houseboat cruise through narrow Vembanad Lake canals, lush paddy fields, and duck farms.',
      howToExplore: 'Board your private houseboat at Punnamada Jetty by 04:30 PM. Relax on the sundeck as the captain navigates twilight waters.',
      nearbyEatery: {
        name: 'Houseboat Private Chef Live Kitchen',
        cuisine: 'Authentic Kerala Backwater Feast',
        specialty: 'Pan-fried Karimeen Pollichathu in Banana Leaf, Prawn Roast & Red Rice'
      },
      insiderTip: 'The boat anchors at dusk near tranquil village banks; enjoy star-gazing away from city light pollution.'
    }
  ],

  'dest-jaipur': [
    {
      step: 1,
      phase: 'Morning',
      spotName: 'Amber Fort & Sheesh Mahal (Mirror Palace)',
      spotCategory: 'monument',
      duration: '3 Hours',
      whatToExplore: 'Majestic 16th-century hilltop palace fort, ornate elephant/jeep ascent, Maota Lake reflections, and the world-famous Hall of Mirrors.',
      howToExplore: 'Arrive at 08:30 AM. Take a 4x4 open gypsy or royal elephant ride up to Suraj Pol gateway. Hire a certified ASI guide for secret tunnel stories.',
      nearbyEatery: {
        name: '1135 AD Amber Fort Fine Dining',
        cuisine: 'Royal Rajputana Court Cuisine',
        specialty: 'Thaal-e-Jodhpur, Laal Maas & Saffron Kesari Kheer'
      },
      insiderTip: 'Ask your guide to shine a small flashlight in Sheesh Mahal to witness the ceiling illuminate like a thousand stars.'
    },
    {
      step: 2,
      phase: 'Mid-Day',
      spotName: 'Hawa Mahal (Palace of Winds) & City Palace',
      spotCategory: 'monument',
      duration: '2.5 Hours',
      whatToExplore: 'Iconic 5-story pink honeycomb facade with 953 jharokha lattice windows, followed by royal courtyards, Peacock Gate, and weapons armory.',
      howToExplore: 'Walk through Sireh Deori Bazaar. Cross into City Palace courtyards (Pritam Niwas Chowk).',
      nearbyEatery: {
        name: 'The Tattoo Cafe & Lounge (Opp. Hawa Mahal)',
        cuisine: 'Rooftop Cafe & Rajasthani Bites',
        specialty: 'Pyaaz Kachori, Cold Brew Coffee & Direct Facade Photo Vantage'
      },
      insiderTip: 'The rooftop cafes directly opposite Hawa Mahal offer the perfect angle for portrait shots without traffic in frame.'
    },
    {
      step: 3,
      phase: 'Afternoon',
      spotName: 'Jantar Mantar UNESCO Astronomical Observatory',
      spotCategory: 'monument',
      duration: '1.5 Hours',
      whatToExplore: 'World’s largest stone sundial (Vrihat Samrat Yantra) capable of measuring solar time with accuracy within 2 seconds.',
      howToExplore: 'Located right next to City Palace gate. Use an audio guide to see the solar shadow move in real-time.',
      nearbyEatery: {
        name: 'Laxmi Mishtan Bhandar (LMB) Johari Bazaar',
        cuisine: 'Legendary Jaipur Sweets & Chaat',
        specialty: 'Paneer Ghewar, Raj Kachori & Dal Baati'
      },
      insiderTip: 'Visit between 12:00 PM and 01:30 PM when the sun is overhead to see geometric shadow alignments at their peak.'
    },
    {
      step: 4,
      phase: 'Sunset / Night',
      spotName: 'Nahargarh Fort Sunset Point & Chokhi Dhani',
      spotCategory: 'viewpoint',
      duration: '3.5 Hours',
      whatToExplore: 'Perched on the Aravalli ridge overlooking the entire Pink City golden hour, followed by immersive cultural village celebrations.',
      howToExplore: 'Cab up the winding Aravalli mountain road to Padao restaurant at Nahargarh, then head to Chokhi Dhani for cultural folk dances.',
      nearbyEatery: {
        name: 'Chokhi Dhani Ethnic Resort Dining',
        cuisine: 'Grand Rajasthani Manuhaar Feast',
        specialty: 'Pure Ghee Dal Baati Churma, Gatte Ki Sabzi, Bajra Roti & Jaggery'
      },
      insiderTip: 'The city lights twinkle below like a carpet of diamonds from the Nahargarh fort ramparts.'
    }
  ],

  'dest-ladakh': [
    {
      step: 1,
      phase: 'Morning',
      spotName: 'Thiksey Monastery Sunrise Morning Prayers',
      spotCategory: 'temple',
      duration: '2.5 Hours',
      whatToExplore: '12-story whitewashed gompa resembling Lhasa’s Potala Palace, 49-ft golden Maitreya Buddha statue, and morning horn chanting.',
      howToExplore: 'Drive 19 km from Leh by 06:00 AM. Enter the assembly hall quietly as monks chant with Tibetan brass horns and cymbals.',
      nearbyEatery: {
        name: 'Thiksey Gompa Rooftop Cafe',
        cuisine: 'Ladakhi & Tibetan',
        specialty: 'Warm Tsampa Porridge, Steamed Veg Momos & Salted Butter Tea'
      },
      insiderTip: 'Climb to the top terrace for a breathtaking morning view over the Indus Valley and snowy Stok range.'
    },
    {
      step: 2,
      phase: 'Mid-Day',
      spotName: 'Shey Palace & Hall of Fame Museum',
      spotCategory: 'monument',
      duration: '2 Hours',
      whatToExplore: 'Ancient royal summer palace of Ladakh kings with giant copper-gold Shakyamuni statue and Indian Army high-altitude battle history.',
      howToExplore: 'Cab on Leh-Manali road. Walk up the stone staircase to the shrine, then visit the Hall of Fame aviation and glacier wing.',
      nearbyEatery: {
        name: 'Chopsticks Noodle Bar Leh Town',
        cuisine: 'Pan-Asian & Ladakhi',
        specialty: 'Spicy Thukpa Noodle Soup, Tingmo Steamed Buns & Crispy Honey Wontons'
      },
      insiderTip: 'Read the Siachen glacier survival stories at Hall of Fame for an inspiring look at soldier resilience at -50°C.'
    },
    {
      step: 3,
      phase: 'Afternoon',
      spotName: 'Khardung La Pass (17,982 ft)',
      spotCategory: 'adventure',
      duration: '3 Hours',
      whatToExplore: 'One of the world’s highest motorable mountain passes with multicolored prayer flags fluttering against glaciated Himalayan peaks.',
      howToExplore: 'Ascend in a 4x4 SUV with experienced mountain chauffeur. Carry warm down jackets and personal oxygen inhaler.',
      nearbyEatery: {
        name: 'Rinchen Cafeteria at Pass Top',
        cuisine: 'High Altitude Hot Beverages',
        specialty: 'Steaming Hot Maggi & Black Tea at 18,000 ft'
      },
      insiderTip: 'Do not stay more than 20 minutes at the pass summit to prevent acute mountain sickness symptoms.'
    },
    {
      step: 4,
      phase: 'Sunset / Night',
      spotName: 'Shanti Stupa Sunset & Leh Main Bazaar Stroll',
      spotCategory: 'viewpoint',
      duration: '2.5 Hours',
      whatToExplore: 'White-domed Buddhist stupa built by Japanese monks, panoramic sunset over Namgyal Tsemo fort, and cobblestone bazaar shopping.',
      howToExplore: 'Drive up Changspa road to the upper parking. Walk the parikrama circle around the stupa during golden hour.',
      nearbyEatery: {
        name: 'Bon Appetit Leh',
        cuisine: 'Continental & Organic Himalayan',
        specialty: 'Woodfired Thin Crust Pizza, Apricot Crumble & Walnut Tart'
      },
      insiderTip: 'Pick up authentic certified organic dried apricots, sea buckthorn juice, and yak wool stoles in the Tibetan refugee market.'
    }
  ],

  'dest-varanasi': [
    {
      step: 1,
      phase: 'Morning',
      spotName: 'Subah-e-Banaras Sunrise Boat Ride on the Ganges',
      spotCategory: 'spiritual',
      duration: '2.5 Hours',
      whatToExplore: 'Rowing past 84 historic ghats (Assi, Dashashwamedh, Manikarnika) as pilgrims perform holy dips and Vedic sun chants at dawn.',
      howToExplore: 'Hire a private wooden hand-rowed boat at Assi Ghat at 05:30 AM. Float silently towards Manikarnika Ghat.',
      nearbyEatery: {
        name: 'Pappu Chai Stall Assi Ghat',
        cuisine: 'Banarasi Breakfast',
        specialty: 'Kulhad Ginger Chai with Malai Toasted Bun & Samosa'
      },
      insiderTip: 'Buy small floating clay diyas with marigold petals to light and gently release onto the sacred river for blessings.'
    },
    {
      step: 2,
      phase: 'Mid-Day',
      spotName: 'Kashi Vishwanath Corridor & Temple Shrine',
      spotCategory: 'spiritual',
      duration: '2.5 Hours',
      whatToExplore: 'One of the 12 sacred Jyotirlingas of Lord Shiva, gold-plated spire, and the newly renovated grand riverfront walkway.',
      howToExplore: 'Access from Ghat Gate No. 4. Pre-book Sugam Darshan online to bypass the general queue. Lock electronics in official lockers.',
      nearbyEatery: {
        name: 'Kashi Chaat Bhandar (Godowlia)',
        cuisine: 'Legendary Banarasi Street Food',
        specialty: 'Tamatar Chaat, Palak Patta Chaat & Kulfi Falooda'
      },
      insiderTip: 'Dress traditionally (Kurta or Dhoti/Saree) for quick access to the inner sanctum sparsh darshan.'
    },
    {
      step: 3,
      phase: 'Afternoon',
      spotName: 'Sarnath Deer Park & Dhamek Stupa',
      spotCategory: 'monument',
      duration: '2.5 Hours',
      whatToExplore: 'Where Lord Buddha gave his first sermon after enlightenment. Massive 500 AD cylindrical stone stupa and Ashoka Pillar Lion capital.',
      howToExplore: '10 km cab drive from city center. Stroll the peaceful lawns and visit the archaeological museum (Lion Capital of India).',
      nearbyEatery: {
        name: 'Aroma Garden Restaurant Sarnath',
        cuisine: 'Pure Vegetarian Indian & Asian',
        specialty: 'Dal Tadka, Stuffed Kulcha & Fresh Mango Lassi'
      },
      insiderTip: 'The museum is closed on Fridays; plan your visit Saturday to Thursday.'
    },
    {
      step: 4,
      phase: 'Sunset / Night',
      spotName: 'Maha Ganga Aarti at Dashashwamedh Ghat',
      spotCategory: 'spiritual',
      duration: '2.5 Hours',
      whatToExplore: 'Hypnotic synchronized ritual performed by 7 young Brahmin priests wielding multi-tiered brass oil lamps, conch shells, and incense.',
      howToExplore: 'Book a river-facing boat by 05:30 PM to anchor right in front of the illuminated prayer stages.',
      nearbyEatery: {
        name: 'BrijRama Palace Chinar Dining Room',
        cuisine: 'Royal Sattvic Indian Gourmet',
        specialty: 'Benaras Thali, Paneer Khas & Royal Malaiyo'
      },
      insiderTip: 'The boat viewpoint provides the cleanest unblocked angle to photograph the towering flame brass lamps.'
    }
  ],

  'dest-agra': [
    {
      step: 1,
      phase: 'Morning',
      spotName: 'Sunrise at the Taj Mahal (Wonder of the World)',
      spotCategory: 'monument',
      duration: '3 Hours',
      whatToExplore: 'Pristine white Makrana marble mausoleum shifting hues from misty pink at dawn to pearl white as the sun rises over Yamuna.',
      howToExplore: 'Enter via the East Gate at 05:45 AM. Walk through the grand Darwaza-i Rauza archway to catch the first uncrowded reflection pools.',
      nearbyEatery: {
        name: 'The Oberoi Amarvilas Lounge',
        cuisine: 'Luxury Breakfast with Direct Taj View',
        specialty: 'Artisan Eggs Benedict, Fresh Pastries & Darjeeling Tea'
      },
      insiderTip: 'Friday is closed for prayers! Go on Wednesday or Thursday morning for minimum crowds and serene stillness.'
    },
    {
      step: 2,
      phase: 'Mid-Day',
      spotName: 'Agra Fort (Red Sandstone Citadel)',
      spotCategory: 'monument',
      duration: '2 Hours',
      whatToExplore: '16th-century Mughal fortress with Jahangiri Mahal, Diwan-i-Aam, and Musamman Burj tower where Shah Jahan gazed at Taj Mahal in exile.',
      howToExplore: 'Short 10-min cab drive from Taj Mahal. Walk through the colossal Amar Singh Gate into the royal palaces.',
      nearbyEatery: {
        name: 'Pinch of Spice (Fatehabad Road)',
        cuisine: 'Mughlai & North Indian Tandoori',
        specialty: 'Murgh Boti Masala, Dal Makhani & Garlic Naan'
      },
      insiderTip: 'Stand on the octagonal balcony of Musamman Burj to photograph the Taj Mahal framed between arched marble pillars.'
    },
    {
      step: 3,
      phase: 'Afternoon',
      spotName: 'Fatehpur Sikri UNESCO Ghost Capital',
      spotCategory: 'monument',
      duration: '2.5 Hours',
      whatToExplore: 'Akbar’s abandoned red sandstone imperial capital, soaring Buland Darwaza (54m high), and white marble tomb of Sufi saint Salim Chishti.',
      howToExplore: 'Drive 36 km west of Agra on Jaipur highway. Take the eco-bus from the parking lot to the monument gate.',
      nearbyEatery: {
        name: 'Gannet Restaurant & Cafe',
        cuisine: 'North Indian Highway Cuisine',
        specialty: 'Peda sweets, Masala Chai & Tandoori Parottas'
      },
      insiderTip: 'Tie a red thread on the marble lattice screens of Salim Chishti’s dargah as is customary for travel wishes.'
    },
    {
      step: 4,
      phase: 'Sunset / Night',
      spotName: 'Mehtab Bagh (Moonlight Garden) Sunset View',
      spotCategory: 'viewpoint',
      duration: '2 Hours',
      whatToExplore: 'Charbagh garden complex on the opposite northern bank of River Yamuna, perfectly aligned with the Taj Mahal.',
      howToExplore: 'Cab across Ambedkar Bridge to the riverbank entrance. Stroll along the rear lawn right on the water’s edge.',
      nearbyEatery: {
        name: 'Peshawri at ITC Mughal',
        cuisine: 'North-West Frontier Gourmet',
        specialty: 'Dal Bukhara (slow-cooked 18 hours), Sikandari Raan & Pudina Parotta'
      },
      insiderTip: 'This is the most relaxed spot in Agra for golden-hour silhouette photography without any security gates or queues.'
    }
  ],

  'dest-amritsar': [
    {
      step: 1,
      phase: 'Morning',
      spotName: 'Golden Temple (Sri Harmandir Sahib) & Amrit Sarovar',
      spotCategory: 'spiritual',
      duration: '3 Hours',
      whatToExplore: 'Pure 24-karat gold-gilded sanctum standing in the holy nectar pool, non-stop Gurbani kirtan, and peaceful marble circumambulation path.',
      howToExplore: 'Cover your head with a scarf, wash feet at the entrance pool, and walk clockwise around the Sarovar to the central Darbar Sahib.',
      nearbyEatery: {
        name: 'Guru Ka Langar (World’s Largest Community Kitchen)',
        cuisine: 'Blessed Free Community Meal',
        specialty: 'Hot Dal, Mixed Vegetable Sabzi, Fresh Roti & Sweet Kheer'
      },
      insiderTip: 'Join the volunteers (seva) rolling rotis or washing plates for a deeply humbling, uplifting spiritual experience.'
    },
    {
      step: 2,
      phase: 'Mid-Day',
      spotName: 'Jallianwala Bagh Historic Memorial & Partition Museum',
      spotCategory: 'monument',
      duration: '2 Hours',
      whatToExplore: 'National martyrs memorial, preserved bullet marks on brick walls, the historic Martyr’s Well, and Partition Museum exhibits.',
      howToExplore: 'Walk 3 minutes from the Golden Temple plaza through the newly paved Heritage Street pedestrian corridor.',
      nearbyEatery: {
        name: 'Kesar Da Dhaba (Since 1916)',
        cuisine: 'Authentic Punjabi Heritage Dhaba',
        specialty: 'Lachha Paratha, Chana Dal fried in desi ghee & Gulab Jamun'
      },
      insiderTip: 'Visit the Partition Museum inside the historic Town Hall to hear emotional first-hand audio recordings of freedom fighters.'
    },
    {
      step: 3,
      phase: 'Afternoon',
      spotName: 'Attari-Wagah Border Beating Retreat Ceremony',
      spotCategory: 'monument',
      duration: '3.5 Hours',
      whatToExplore: 'High-energy military ceremonial drill by Indian BSF and Pakistan Rangers, coordinated foot stomping, and synchronized flag lowering.',
      howToExplore: 'Drive 30 km towards the Pakistan border by 03:00 PM. Enter the stadium grandstand by 04:15 PM for prime seating.',
      nearbyEatery: {
        name: 'Sarhad Restaurant Wagah Road',
        cuisine: 'Border Heritage Cuisine',
        specialty: 'Lahori Chicken Karahi, Peshawari Naan & Kulhad Buttermilk'
      },
      insiderTip: 'Do not carry handbags or backpacks; only wallets, phones, and water bottles are permitted past military security checkpoints.'
    },
    {
      step: 4,
      phase: 'Sunset / Night',
      spotName: 'Night Illuminated Golden Temple & Heritage Walk',
      spotCategory: 'viewpoint',
      duration: '2 Hours',
      whatToExplore: 'The Golden Temple illuminated by nighttime floodlights reflecting on the ink-black water, and the Palki Sahib night procession.',
      howToExplore: 'Return to the temple around 08:30 PM. Watch the sacred Guru Granth Sahib carried in a golden palanquin for night rest.',
      nearbyEatery: {
        name: 'Brothers Dhaba Town Hall',
        cuisine: 'Punjabi Vegetarian Treats',
        specialty: 'Crisp Amritsari Stuffed Aloo Kulcha with Chole & Sweet Lassi'
      },
      insiderTip: 'The nighttime serenity after 09:00 PM is profoundly quiet and one of the most peaceful experiences in India.'
    }
  ],

  'dest-ooty': [
    {
      step: 1,
      phase: 'Morning',
      spotName: 'Nilgiri Mountain Railway (Heritage Toy Train)',
      spotCategory: 'monument',
      duration: '2.5 Hours',
      whatToExplore: 'UNESCO World Heritage blue steam locomotive chugging through pine-clad ravines, 16 tunnels, and 250 wooden bridges.',
      howToExplore: 'Board at Coonoor or Ooty station. Reserve first-class window seats months in advance or get general tokens early at 07:00 AM.',
      nearbyEatery: {
        name: 'Railway Heritage Canteen',
        cuisine: 'South Indian Mountain Fare',
        specialty: 'Hot Medu Vada, Filter Coffee & Homemade Carrot Halwa'
      },
      insiderTip: 'Sit on the right side when traveling from Mettupalayam to Ooty for the most dramatic waterfall gorge views.'
    },
    {
      step: 2,
      phase: 'Mid-Day',
      spotName: 'Doddabetta Peak (8,652 ft) & Tea Factory',
      spotCategory: 'viewpoint',
      duration: '2.5 Hours',
      whatToExplore: 'Highest vantage point in the Nilgiri Mountains with telescope observatory, followed by live highland tea processing.',
      howToExplore: 'Cab ride 9 km through eucalyptus groves. Climb to the two-story telescope dome for views stretching to Chamundi Hills on clear days.',
      nearbyEatery: {
        name: 'Highland Factory Tea Cafe',
        cuisine: 'Artisan Teas & Cookies',
        specialty: 'Cardamom & Ginger Spiced Tea with Fresh Baked Biscuits'
      },
      insiderTip: 'The mountain fog rolls in quickly around 01:00 PM; get your telescope viewing done before noon.'
    },
    {
      step: 3,
      phase: 'Afternoon',
      spotName: 'Government Botanical Gardens & Rose Garden',
      spotCategory: 'nature',
      duration: '2 Hours',
      whatToExplore: '55-acre landscaped terraced gardens laid out in 1848, a 20-million-year-old fossilized tree trunk, and over 20,000 rose varieties.',
      howToExplore: 'Stroll along the Italian floral section and glass conservatory. Relax on the lush sprawling front lawns.',
      nearbyEatery: {
        name: 'Shinkow’s Chinese Restaurant Ooty',
        cuisine: 'Heritage Indo-Chinese',
        specialty: 'Cantonese Chili Chicken, Steamed Dumplings & Sweet Corn Soup'
      },
      insiderTip: 'Look for the cork tree and paperbark tree imported from Australia over 150 years ago.'
    },
    {
      step: 4,
      phase: 'Sunset / Night',
      spotName: 'Ooty Lake Boating & Commercial Road Chocolates',
      spotCategory: 'beach',
      duration: '2.5 Hours',
      whatToExplore: '65-acre artificial lake framed by groves of eucalyptus, paddle boating at dusk, and shopping for authentic handmade Nilgiri chocolates.',
      howToExplore: 'Rent a motor or pedal boat at the boathouse. Afterwards, walk Commercial Road sampling artisan dark chocolate.',
      nearbyEatery: {
        name: 'King Star Handcrafted Confectionery',
        cuisine: 'Fudge & Artisan Chocolates',
        specialty: 'Roasted Almond Fudge, Rum & Raisin Dark Truffles & Eucalyptus Oil'
      },
      insiderTip: 'Buy authentic Toddy embroidery shawls woven by indigenous Toda artisans at the tribal cooperative store.'
    }
  ],

  'dest-meghalaya': [
    {
      step: 1,
      phase: 'Morning',
      spotName: 'Double Decker Living Root Bridge (Nongriat)',
      spotCategory: 'nature',
      duration: '4 Hours',
      whatToExplore: 'Centuries-old bio-engineering marvel where indigenous Khasi tribes intertwined aerial roots of rubber trees across roaring rivers.',
      howToExplore: 'Begin trek early at Tyrna village. Descend 3,500 stone steps through lush tropical rainforest with a local bamboo walking stick.',
      nearbyEatery: {
        name: 'Nongriat Village Homestay Cafe',
        cuisine: 'Local Khasi Forest Cuisine',
        specialty: 'Fresh Boiled Eggs, Steamed Rice, Dal & Wild Herbal Honey Tea'
      },
      insiderTip: 'Take a dip in the natural turquoise freshwater pool directly underneath the lower root bridge.'
    },
    {
      step: 2,
      phase: 'Mid-Day',
      spotName: 'Nohkalikai Falls Cherrapunji (1,115 ft)',
      spotCategory: 'nature',
      duration: '2 Hours',
      whatToExplore: 'India’s tallest plunge waterfall cascading off a red sandstone tableland into a mystic emerald green waterhole.',
      howToExplore: 'Cab up to the cliffside viewing platform. Walk along the perimeter path for dramatic misty canyon views.',
      nearbyEatery: {
        name: 'Orange Roots Cherrapunji',
        cuisine: 'Pure Vegetarian Khasi & South Indian',
        specialty: 'Executive Veg Thali with Bamboo Shoot Pickle & Hot Ginger Tea'
      },
      insiderTip: 'Clouds often rise from Bangladesh plains at mid-day; check the sky before heading to the platform.'
    },
    {
      step: 3,
      phase: 'Afternoon',
      spotName: 'Mawsmai Limestone Caves Expedition',
      spotCategory: 'adventure',
      duration: '1.5 Hours',
      whatToExplore: '150-meter lit limestone cave formation with ancient stalactites, stalagmites, narrow passages, and calcite fossils.',
      howToExplore: 'Enter through the wooden boardwalk. Wear sturdy grip shoes as the limestone cave floor is naturally damp and slick.',
      nearbyEatery: {
        name: 'Sohra Pine View Stall',
        cuisine: 'Warm Hillside Snacks',
        specialty: 'Roasted Corn on the Cob with Local Chili Salt & Pine Honey'
      },
      insiderTip: 'Check out the natural fossil imprints embedded in the cave roof near the narrow squeeze section.'
    },
    {
      step: 4,
      phase: 'Sunset / Night',
      spotName: 'Dawki Umngot River Glass-Clear Boating',
      spotCategory: 'nature',
      duration: '2.5 Hours',
      whatToExplore: 'One of the world’s clearest rivers where the water is so transparent that wooden boats look like they are floating in mid-air.',
      howToExplore: 'Hire a slender wooden country boat at Dawki bridge. Glide across smooth emerald pools to the Indo-Bangladesh border boundary.',
      nearbyEatery: {
        name: 'Dawki Riverside Bamboo Dhaba',
        cuisine: 'Khasi River Fish & Local Rice',
        specialty: 'Fried River Fish with Mustard Gravy & Steamed Red Rice'
      },
      insiderTip: 'Peak transparency is between October and April when rains cease and the limestone-filtered mountain river settles crystal clear.'
    }
  ],

  'dest-hampi': [
    {
      step: 1,
      phase: 'Morning',
      spotName: 'Matanga Hill Sunrise & Virupaksha Temple',
      spotCategory: 'spiritual',
      duration: '3 Hours',
      whatToExplore: 'Panoramic 360-degree sunrise view over giant granite boulder mountains, the Tungabhadra River, and the 7th-century active temple tower.',
      howToExplore: 'Start climbing Matanga Hill steps by 05:45 AM. After sunrise, descend to the 160-ft gopuram of Virupaksha Temple and seek Lakshmi the temple elephant’s blessing.',
      nearbyEatery: {
        name: 'Mango Tree Restaurant (Near River)',
        cuisine: 'Continental & South Indian Thali',
        specialty: 'Special Hampi Thali with Ghee Dosa, Pomegranate Lassi & Falafel'
      },
      insiderTip: 'Matanga Hill is the highest elevation in Hampi and offers the most surreal golden glow across the ruins.'
    },
    {
      step: 2,
      phase: 'Mid-Day',
      spotName: 'Vijayanagara Vittala Temple & Stone Chariot',
      spotCategory: 'monument',
      duration: '2.5 Hours',
      whatToExplore: 'Iconic UNESCO symbol of Karnataka (featured on ₹50 note), monolithic Stone Chariot of Garuda, and 56 musical granite pillars.',
      howToExplore: 'Take the eco-battery vehicle from the geedee parking. Tap your ears close to the musical pillars as your guide explains the resonance.',
      nearbyEatery: {
        name: 'Hampi Heritage Village Kitchen',
        cuisine: 'Karnataka Bili Rice & Sambar',
        specialty: 'Jolada Rotti (Sorghum Bread), Yennegai Brinjal & Butter Milk'
      },
      insiderTip: 'Examine the stone wheels of the chariot; they were originally engineered to rotate freely on stone axles.'
    },
    {
      step: 3,
      phase: 'Afternoon',
      spotName: 'Royal Enclosure, Lotus Mahal & Elephant Stables',
      spotCategory: 'monument',
      duration: '2 Hours',
      whatToExplore: 'Indo-Islamic architectural synthesis with symmetric domed stables for 22 royal war elephants, Queen’s Zenana, and stepped water tank.',
      howToExplore: 'Drive between monuments on a rented bicycle or auto rickshaw. Walk the pristine lawns surrounding the Lotus Mahal.',
      nearbyEatery: {
        name: 'Gopi Island Cafe (Across River)',
        cuisine: 'Woodfire Pizzas & Herbal Teas',
        specialty: 'Nutella Banana Pancakes & Fresh Coconut Shakes'
      },
      insiderTip: 'The geometric symmetry of the Pushkarani stepped tank is a masterpiece of hydraulic and aesthetic design.'
    },
    {
      step: 4,
      phase: 'Sunset / Night',
      spotName: 'Tungabhadra Coracle Ride & Sunset Boulder Watch',
      spotCategory: 'nature',
      duration: '2 Hours',
      whatToExplore: 'Spinning across the rocky Tungabhadra River in an ancient circular wicker coracle boat, ending with sunset over Sanapur Lake.',
      howToExplore: 'Board a coracle at Kodandarama Ghat. Watch the boatman playfully spin the round boat in the river eddies.',
      nearbyEatery: {
        name: 'Laughing Buddha Cafe (Hippie Island)',
        cuisine: 'Bohemian Chill & Comfort Foods',
        specialty: 'Hummus Plate, Lemon Nana & Woodfired Thin Crust Pizza'
      },
      insiderTip: 'Watching the sunset tint the giant granite boulders purple and orange is an unforgettable experience.'
    }
  ],

  'dest-dubai': [
    {
      step: 1,
      phase: 'Morning',
      spotName: 'Burj Khalifa Level 148 At The Top & Sky Lounge',
      spotCategory: 'monument',
      duration: '2.5 Hours',
      whatToExplore: 'Ascend to 555 meters on the world’s tallest skyscraper in high-speed double-deck elevators with 360-degree views of the Persian Gulf.',
      howToExplore: 'Access from Lower Ground of Dubai Mall. Pre-book the 09:30 AM morning priority pass to avoid lines.',
      nearbyEatery: {
        name: 'At.mosphere Restaurant Level 122',
        cuisine: 'Haute French & High Tea',
        specialty: 'Gold Leaf Cappuccino & Fine Caviar Tartlets'
      },
      insiderTip: 'On clear mornings, you can see past the Dubai coastline all the way to the neighboring emirate of Sharjah.'
    },
    {
      step: 2,
      phase: 'Mid-Day',
      spotName: 'Dubai Mall & Underwater Zoo Tunnel',
      spotCategory: 'nature',
      duration: '3 Hours',
      whatToExplore: '10-million liter suspended acrylic aquarium with tiger sharks, giant rays, indoor waterfall, and 1,200 luxury retail boutiques.',
      howToExplore: 'Walk through the 270-degree glass ocean tunnel. Meet the 5-meter Australian King Croc on the upper level.',
      nearbyEatery: {
        name: 'Al Hallab Restaurant & Sweets (Dubai Mall)',
        cuisine: 'Authentic Lebanese Gourmet',
        specialty: 'Shish Taouk, Fresh Hummus Beiruti, Mixed Grill & Baklava'
      },
      insiderTip: 'Stand next to the indoor Human Waterfall sculpture for a stunning interior architectural photo.'
    },
    {
      step: 3,
      phase: 'Afternoon',
      spotName: 'Red Dunes 4x4 Desert Safari & Camel Trekking',
      spotCategory: 'adventure',
      duration: '4 Hours',
      whatToExplore: 'High-adrenaline dune bashing across sweeping red Lahbab dunes in a Toyota Land Cruiser, sandboarding, and camel caravan rides.',
      howToExplore: 'Chauffeur pickup from hotel lobby in a private 4x4. The driver deflates tires before embarking on thrill-packed dune rolls.',
      nearbyEatery: {
        name: 'Bedouin Oasis Camp Banquet',
        cuisine: 'Arabian Barbecue & Shawarma',
        specialty: 'Charcoal Grilled Lamb Chops, Fresh Falafel, Hummus & Arabic Coffee'
      },
      insiderTip: 'Strap on a sandboard to slide down the face of Big Red dune during the sunset photography stop.'
    },
    {
      step: 4,
      phase: 'Sunset / Night',
      spotName: 'Dubai Marina Luxury Yacht & Palm Jumeirah Cruise',
      spotCategory: 'beach',
      duration: '2.5 Hours',
      whatToExplore: 'Gliding through Dubai Marina canals flanked by twisting skyscrapers (Cayan Tower, Ain Dubai) out around Atlantis The Palm.',
      howToExplore: 'Board at Marina Yacht Club Pier 7 at 08:00 PM. Enjoy the open-air flybridge lounge with live saxophone music.',
      nearbyEatery: {
        name: 'Pier 7 Marina Dining Room',
        cuisine: 'International Coastal Seafood',
        specialty: 'Grilled Atlantic Salmon, Tiger Prawns & Chilled Mocktails'
      },
      insiderTip: 'The marina skyscrapers lit in neon purples and blues reflect in the glass-still water for world-class skyline shots.'
    }
  ],

  'dest-bali': [
    {
      step: 1,
      phase: 'Morning',
      spotName: 'Tegallalang Emerald Rice Terraces & Jungle Swing',
      spotCategory: 'nature',
      duration: '2.5 Hours',
      whatToExplore: 'Cascading UNESCO Subak stepped green rice paddies, soaring 30-meter jungle swings over palm valleys, and bird nest photo booths.',
      howToExplore: 'Arrive by 07:30 AM before tour buses. Walk down into the terrace valleys and chat with local farmers irrigating the plots.',
      nearbyEatery: {
        name: 'Terrace River Pool Bar Cafe',
        cuisine: 'Balinese Fusion & Fresh Smoothies',
        specialty: 'Dragon Fruit Smoothie Bowl & Organic Luwak Coffee'
      },
      insiderTip: 'Wear a flowy bright-colored dress (red or yellow) for the most striking contrast against the lush emerald rice steps on the swing.'
    },
    {
      step: 2,
      phase: 'Mid-Day',
      spotName: 'Ubud Sacred Monkey Forest & Royal Art Market',
      spotCategory: 'nature',
      duration: '2.5 Hours',
      whatToExplore: '10-hectare moss-covered nutmeg forest sanctuary housing 1,000 Balinese long-tailed macaques and 14th-century bathing temples.',
      howToExplore: 'Walk along the paved canopy boardwalk. After the forest, stroll to Ubud Palace and the artisan market across the road.',
      nearbyEatery: {
        name: 'Bebek Bengil (The Original Dirty Duck Diner)',
        cuisine: 'Traditional Balinese Crispy Duck',
        specialty: 'Crispy Fried Half Duck with Sambal Matah, Lawar & Rice'
      },
      insiderTip: 'Secure loose items like sunglasses, shiny earrings, and water bottles inside zipped backpacks; monkeys love trinkets.'
    },
    {
      step: 3,
      phase: 'Afternoon',
      spotName: 'Tanah Lot Ocean Rock Temple',
      spotCategory: 'spiritual',
      duration: '2 Hours',
      whatToExplore: 'Ancient sea temple perched dramatically atop an offshore rock formation carved by centuries of crashing Indian Ocean waves.',
      howToExplore: 'Cab to the west coast. Walk across the black sand beach at low tide to receive a holy water blessing from the temple priests.',
      nearbyEatery: {
        name: 'Cliffside Coconut Terraces',
        cuisine: 'Tropical Refreshments',
        specialty: 'Whole Tender Chilled Coconut & Grilled Sweet Corn with Chili Butter'
      },
      insiderTip: 'You cannot enter the inner shrine if you are non-Balinese, but the blessing at the natural freshwater cave beneath the rock is open to all.'
    },
    {
      step: 4,
      phase: 'Sunset / Night',
      spotName: 'Uluwatu Cliff Temple & Sunset Kecak Fire Dance',
      spotCategory: 'spiritual',
      duration: '3 Hours',
      whatToExplore: 'Dramatic temple poised 70 meters high on a sheer limestone cliff overlooking crashing surf, followed by a hypnotic 70-man vocal fire chant.',
      howToExplore: 'Arrive at Uluwatu by 05:00 PM to buy amphitheater tickets. Take a seat overlooking the sunset horizon by 05:45 PM.',
      nearbyEatery: {
        name: 'Jimbaran Bay Candlelight Seafood Shack',
        cuisine: 'Beachfront Charcoal Grilled Seafood',
        specialty: 'Jumbo Butter Lobster, Red Snapper with Balinese Sambal & Bintang'
      },
      insiderTip: 'The climax of the Kecak dance occurs right as the sun dips below the ocean horizon, creating a spectacular silhouette of the fire.'
    }
  ],

  'dest-switzerland': [
    {
      step: 1,
      phase: 'Morning',
      spotName: 'Jungfraujoch "Top of Europe" (11,333 ft)',
      spotCategory: 'adventure',
      duration: '4 Hours',
      whatToExplore: 'Europe’s highest railway station, year-round perpetual snow realm, hand-carved blue Ice Palace, and Sphinx Alpine Observatory.',
      howToExplore: 'Board the ultra-modern Eiger Express tricable gondola from Grindelwald Terminal, then transfer to the cogwheel train through Eiger rock.',
      nearbyEatery: {
        name: 'Restaurant Crystal at Jungfraujoch',
        cuisine: 'Alpine Swiss Gourmet',
        specialty: 'Authentic Gruyère Cheese Fondue, Veal Zurich-Style & Rosti'
      },
      insiderTip: 'Step out onto the Glacier Plateau to touch perpetual snow and view the 23-km Aletsch Glacier stretching toward Italy.'
    },
    {
      step: 2,
      phase: 'Mid-Day',
      spotName: 'Interlaken Lake Brienz Steamboat Cruise',
      spotCategory: 'nature',
      duration: '2 Hours',
      whatToExplore: 'Glacial turquoise waters of Lake Brienz framed by cascading Giessbach waterfalls, timber Swiss chalets, and sheer mountain walls.',
      howToExplore: 'Board the historic paddle steamboat from Interlaken Ost quay. Sit on the upper deck with a cup of hot Swiss hot chocolate.',
      nearbyEatery: {
        name: 'Grandhotel Giessbach Terrace Restaurant',
        cuisine: 'Classic Swiss Alpine Cuisine',
        specialty: 'Brienz Lake Trout Fillet with Herb Butter & Steamed Potatoes'
      },
      insiderTip: 'Disembark briefly at Giessbach Falls stop to take the Europe’s oldest operating funicular up to the waterfall footbridge.'
    },
    {
      step: 3,
      phase: 'Afternoon',
      spotName: 'Lauterbrunnen Valley of 72 Waterfalls & Staubbach',
      spotCategory: 'nature',
      duration: '2 Hours',
      whatToExplore: 'Picturesque glacial U-shaped valley with towering 300-meter cliffs and the roaring Staubbach Falls that inspired Goethe’s poems.',
      howToExplore: 'Take the scenic 20-min train from Interlaken. Walk the village trail directly behind the spray of Staubbach cascade.',
      nearbyEatery: {
        name: 'Flavours Cafe Lauterbrunnen',
        cuisine: 'Swiss Bakery & Organic Coffee',
        specialty: 'Warm Apfelstrudel with Vanilla Custard & Swiss Hot Chocolate'
      },
      insiderTip: 'The walk behind the waterfall via the carved rock gallery offers a fairytale view over the traditional wooden church spire.'
    },
    {
      step: 4,
      phase: 'Sunset / Night',
      spotName: 'Zermatt Village & Matterhorn Sunset Glow',
      spotCategory: 'viewpoint',
      duration: '3 Hours',
      whatToExplore: 'Car-free mountain resort village with historic larch-wood barns and unobstructed views of the iconic pyramidal Matterhorn peak.',
      howToExplore: 'Take the electric shuttle into Zermatt. Walk to the Kirchbrücke (church bridge) to watch the sunset turn the Matterhorn golden-pink.',
      nearbyEatery: {
        name: 'Restaurant Whymper-Stube Zermatt',
        cuisine: 'Traditional Valais Raclette & Fondue',
        specialty: 'Melted Raclette Cheese scraped fresh over Baby Potatoes & Air-dried Beef'
      },
      insiderTip: 'Stop by the Läderach chocolate boutique in the village to taste freshly broken slabs of hazelnut FrischSchoggi.'
    }
  ]
};

/**
 * Fallback generator for destinations that don't have hardcoded records
 */
export function getExplorationRoadmapForDestination(destination: TouristDestination): DestinationRoadmapSpot[] {
  if (DESTINATION_EXPLORATION_ROADMAPS[destination.id]) {
    return DESTINATION_EXPLORATION_ROADMAPS[destination.id];
  }

  // Generate dynamic 4-step roadmap using destination properties
  const attractions = destination.popularAttractions.length >= 4 
    ? destination.popularAttractions 
    : [...destination.popularAttractions, 'Panoramic Viewpoint', 'Local Handicraft Market', 'Sunset Waterfront Stroll'];

  const phases: ('Morning' | 'Mid-Day' | 'Afternoon' | 'Sunset / Evening')[] = [
    'Morning',
    'Mid-Day',
    'Afternoon',
    'Sunset / Evening'
  ];

  return phases.map((phase, idx) => {
    const spot = attractions[idx % attractions.length];
    return {
      step: idx + 1,
      phase,
      spotName: spot,
      spotCategory: idx % 2 === 0 ? 'monument' : 'nature',
      duration: '2 - 3 Hours',
      whatToExplore: `Iconic highlight of ${destination.name}. Explore architectural heritage, panoramic vistas, and photo opportunities.`,
      howToExplore: `Private chauffeur transfer from your stay. Walk the designated scenic routes with dedicated local guidance.`,
      nearbyEatery: {
        name: `${destination.name} Traditional Dining`,
        cuisine: 'Regional Speciality & Local Flavors',
        specialty: `Chef’s Signature ${destination.name} Thali & Delicacies`
      },
      insiderTip: `Arrive early during the ${phase.toLowerCase()} window for ideal lighting and relaxed sightseeing.`
    };
  });
}

/**
 * Curated package journey roadmaps showing Day-by-Day:
 * - What destination & spots are covered
 * - Which Hotel/Stay is arranged (room type & meal plan)
 * - Which Restaurant / Dining is covered (cuisine, specialty)
 * - How travel is covered (transport mode, guide, passes)
 */
export const PACKAGE_JOURNEY_ROADMAPS: Record<string, PackageRoadmapDay[]> = {
  'pkg-kashmir': [
    {
      day: 1,
      phaseTitle: 'Srinagar Arrival, Kahwa Welcome & Sunset Shikara on Dal Lake',
      destinationCovered: 'Srinagar & Dal Lake',
      spotsCovered: [
        {
          name: 'Dal Lake & Floating Boulevard',
          description: 'Tranquil glacial lake ringed by snow-crested Zabarwan mountains.',
          activityHighlight: '2-Hour Private Shikara Ride with Saffron Kahwa'
        },
        {
          name: 'Char Chinar Island',
          description: 'Iconic island with 4 ancient chinar trees planted by Mughal royals.',
          activityHighlight: 'Lake photography in traditional Kashmiri attire'
        }
      ],
      howCovered: 'Private AC Innova Crysta Airport Pickup + Handcrafted Wooden Shikara Boat Transfer',
      stayHotel: {
        name: 'Wangnoo Heritage Luxury Houseboat',
        location: 'Dal Lake Waterfront, Srinagar',
        roomCategory: 'Deluxe Lake View Heritage Suite (Cedar Wood Carved)',
        mealPlan: 'Welcome Saffron Kahwa + Multi-Cuisine Buffet Dinner Included',
        starRating: 5
      },
      diningExperience: {
        restaurantName: 'Floating Houseboat Dining Room',
        cuisine: 'Authentic Kashmiri Royal Wazwan',
        specialtyDish: 'Mutton Rogan Josh with Saffron Pulao & Kashmiri Phirni',
        mealType: 'Dinner'
      },
      highlights: 'Relaxing on the houseboats carved cedar wood deck while watching the pink sunset reflection on Dal Lake.'
    },
    {
      day: 2,
      phaseTitle: 'Mughal Architectural Gardens & Shankaracharya Hilltop Shrine',
      destinationCovered: 'Srinagar Heritage Circuit',
      spotsCovered: [
        {
          name: 'Nishat Bagh (Garden of Bliss)',
          description: '12-terraced garden with cascading waterfalls and 400-year-old Chinars.',
          activityHighlight: 'Walk through cascading fountains with Dal Lake backdrop'
        },
        {
          name: 'Shalimar Bagh (Abode of Love)',
          description: 'Built by Jahangir for Queen Nur Jahan with black marble pavilion.',
          activityHighlight: 'Royal water canal architecture inspection'
        },
        {
          name: 'Shankaracharya Temple',
          description: 'Ancient 9th-century Shiva temple 1,000 ft above city floor.',
          activityHighlight: '360° panoramic valley views after climbing 243 stone steps'
        }
      ],
      howCovered: 'Private Chauffeur Innova Crysta Sightseeing + Fast-Track Entry Tickets',
      stayHotel: {
        name: 'The Lalit Grand Palace Srinagar',
        location: 'Gupkar Road, Srinagar',
        roomCategory: 'Palace Deluxe Room with Himalayan Mountain Views',
        mealPlan: 'Grand Buffet Breakfast & Gourmet Multi-Cuisine Dinner',
        starRating: 5
      },
      diningExperience: {
        restaurantName: 'Ahdoos Restaurant (Since 1918, Residency Road)',
        cuisine: 'Authentic Kashmiri Wazwan',
        specialtyDish: 'Gushtaba (velvety meatballs in yogurt gravy) & Crisp Tabakh Maaz',
        mealType: 'Lunch'
      },
      highlights: 'Strolling through blooming rose parterres while listening to classical Santoor music.'
    },
    {
      day: 3,
      phaseTitle: 'Gulmarg Meadow of Flowers & Asia’s Highest Cable Car (Gondola)',
      destinationCovered: 'Gulmarg (8,825 ft to 14,000 ft)',
      spotsCovered: [
        {
          name: 'Gulmarg Gondola Phase 1 (Kongdoori)',
          description: 'Pine-fringed mountain bowl at 10,000 ft with pony and sledge tracks.',
          activityHighlight: 'Alpine meadow walks & pine forest photography'
        },
        {
          name: 'Gulmarg Gondola Phase 2 (Apharwat Peak)',
          description: 'Snow peak summit at 13,780 ft with ski slopes and Line of Control views.',
          activityHighlight: 'Snow playing, sledging, and viewing Nanga Parbat peak'
        },
        {
          name: 'St. Mary’s Church & Golf Course',
          description: '100-year-old Victorian stone chapel standing in high altitude meadow.',
          activityHighlight: 'Heritage photo stop in the golf meadow'
        }
      ],
      howCovered: 'Heated 4x4 Mountain Scorpio/Innova + Pre-Booked Phase 1 & 2 VIP Cable Car Passes',
      stayHotel: {
        name: 'The Khyber Himalayan Resort & Spa',
        location: 'Near Gondola Station, Gulmarg',
        roomCategory: 'Premier Pine Valley Room with Heated Oak Floors',
        mealPlan: 'Daily Buffet Breakfast & 4-Course Alpine Dinner',
        starRating: 5
      },
      diningExperience: {
        restaurantName: 'Cloves at The Khyber',
        cuisine: 'Kashmiri & Contemporary Global',
        specialtyDish: 'Slow-simmered Kashmiri Harissa, Walnut Kebabs & Kehwa Fondue',
        mealType: 'Special Traditional Feast'
      },
      highlights: 'Standing in fresh powdery snow at 14,000 feet surrounded by the towering Pir Panjal ranges.'
    },
    {
      day: 4,
      phaseTitle: 'Saffron Fields of Pampore to Scenic Pahalgam Valley of Shepherds',
      destinationCovered: 'Pampore & Pahalgam',
      spotsCovered: [
        {
          name: 'Pampore Saffron Fields & Apple Orchards',
          description: 'Purple saffron crocus fields where world’s finest saffron is grown.',
          activityHighlight: 'Tasting authentic saffron strands and fresh apple plucking'
        },
        {
          name: 'Betaab Valley (Hajan)',
          description: 'Lush valley rimmed by dense deodar forests and crystal River Lidder.',
          activityHighlight: 'Picnic stroll along the rushing turquoise riverbank'
        },
        {
          name: 'Aru Valley & Overa Wildlife Sanctuary',
          description: 'Scenic village gateway to high altitude Kolahoi glacier treks.',
          activityHighlight: 'Village walk amidst traditional cedar wood log houses'
        }
      ],
      howCovered: 'Dedicated AC Innova Crysta for Interstate Scenic Drive + Certified Local Guide',
      stayHotel: {
        name: 'Pine N Peak Resort (Pahalgam)',
        location: 'Aru Road, Pahalgam',
        roomCategory: 'Luxury Riverside Chalet with River Lidder Balcony',
        mealPlan: 'Buffet Breakfast & Traditional Dinner Included',
        starRating: 5
      },
      diningExperience: {
        restaurantName: 'Trout Beat Riverside Pahalgam',
        cuisine: 'Fresh Catch Himalayan Trout & Kashmiri',
        specialtyDish: 'Pan-fried River Lidder Brown Trout in Lemon Garlic Butter',
        mealType: 'Dinner'
      },
      highlights: 'Listening to the rushing music of the Lidder river from your private wooden chalet balcony.'
    },
    {
      day: 5,
      phaseTitle: 'Baisaran "Mini Switzerland" Meadow & River Lidder Exploration',
      destinationCovered: 'Baisaran Valley & Pahalgam',
      spotsCovered: [
        {
          name: 'Baisaran Valley Pine Meadow',
          description: 'Huge emerald hilltop meadow surrounded by snow peaks, dubbed Mini Switzerland.',
          activityHighlight: 'Scenic pony trek through pine trails & zorbing'
        },
        {
          name: 'Pahalgam Club & Craft Market',
          description: 'Vibrant local bazaar for hand-woven tweed, pashminas, and dry fruits.',
          activityHighlight: 'Authentic Kashmiri Walnut Wood and Pashmina shopping'
        }
      ],
      howCovered: 'Pony Trekking with Certified Handler + Chauffeur Sightseeing Transfer',
      stayHotel: {
        name: 'Pine N Peak Resort (Pahalgam)',
        location: 'Aru Road, Pahalgam',
        roomCategory: 'Luxury Riverside Chalet',
        mealPlan: 'Buffet Breakfast & Dinner Included',
        starRating: 5
      },
      diningExperience: {
        restaurantName: 'Dana Pani Pure Vegetarian Pahalgam',
        cuisine: 'North Indian & Kashmiri Pandit Specialties',
        specialtyDish: 'Kashmiri Dum Aloo, Nadru Yakhni (Lotus Stem) & Hot Phulkas',
        mealType: 'Lunch'
      },
      highlights: 'The pine scent in the crisp mountain air as you ride through Baisaran meadow.'
    },
    {
      day: 6,
      phaseTitle: 'Residency Road Souvenir Walk & Srinagar Airport Departure',
      destinationCovered: 'Srinagar to Airport',
      spotsCovered: [
        {
          name: 'Lal Chowk & Polo View Pedestrian Street',
          description: 'Beautifully paved heritage shopping strip with government arts emporium.',
          activityHighlight: 'Certified GI-tagged Pashmina and Kashmiri Saffron shopping'
        }
      ],
      howCovered: 'Private Chauffeur Airport Drop with Baggage Assistance',
      stayHotel: {
        name: 'Departure Day',
        location: 'Srinagar International Airport',
        roomCategory: 'N/A (Check-out after Breakfast)',
        mealPlan: 'Grand Buffet Breakfast Included',
        starRating: 5
      },
      diningExperience: {
        restaurantName: 'Chai Jaai Tea Room (The Bund, Srinagar)',
        cuisine: 'Kashmiri Artisanal Bakery & Tea',
        specialtyDish: 'Sheermal bread, Girda with Makai butter & Pink Noon Chai',
        mealType: 'Breakfast & Dinner'
      },
      highlights: 'Boarding your flight with bags packed with authentic saffron, walnuts, and royal Kashmiri memories.'
    }
  ],

  'pkg-kerala': [
    {
      day: 1,
      phaseTitle: 'Cochin Arrival & Scenic Mountain Ascent to Munnar Tea Country',
      destinationCovered: 'Cochin to Munnar',
      spotsCovered: [
        {
          name: 'Cheeyappara & Valara Waterfalls',
          description: 'Cascading seven-tiered road waterfall amidst spice slopes.',
          activityHighlight: 'Refreshing photo stop & hot cardamom spiced tea'
        },
        {
          name: 'Neriamangalam Bridge & Periyar Banks',
          description: 'Gateway to high range Western Ghats across emerald river.',
          activityHighlight: 'Sightseeing drive through rubber plantations'
        }
      ],
      howCovered: 'Private AC Chauffeur Sedan Pickup from Cochin Airport + Tolls & Parking Covered',
      stayHotel: {
        name: 'Amber Dale Luxury Resort & Spa',
        location: 'Pallivasal, Munnar',
        roomCategory: 'Premium Valley View Suite with Private Jacuzzi',
        mealPlan: 'Welcome Coconut Drink + Multi-Cuisine Buffet Dinner',
        starRating: 5
      },
      diningExperience: {
        restaurantName: 'Silver Spoon Hillside Dining',
        cuisine: 'Kerala Syrian Christian & Coastal',
        specialtyDish: 'Appam with Vegetable Stew & Kerala Chicken Roast',
        mealType: 'Dinner'
      },
      highlights: 'Watching mist roll through your hotel balcony over miles of manicured green tea bushes.'
    },
    {
      day: 2,
      phaseTitle: 'Eravikulam Nilgiri Tahr Sanctuary & Mattupetty Tea Circuit',
      destinationCovered: 'Munnar High Ranges',
      spotsCovered: [
        {
          name: 'Eravikulam National Park (Rajamalai)',
          description: 'Sanctuary for rare mountain goat Nilgiri Tahr and Neelakurinji blooms.',
          activityHighlight: 'Forest department safari bus & cliffside walks'
        },
        {
          name: 'Tata Tea Museum & Factory',
          description: 'Original 1880s machinery and sensory tea tasting experience.',
          activityHighlight: 'Live tea leaf processing and fresh brew sampling'
        },
        {
          name: 'Mattupetty Dam & Echo Point',
          description: 'Speedboating reservoir surrounded by eucalyptus and pine woods.',
          activityHighlight: 'High-speed reservoir boat ride & natural echo shout'
        }
      ],
      howCovered: 'Private AC Sedan Guided Sightseeing + Park Entry Passes Included',
      stayHotel: {
        name: 'Amber Dale Luxury Resort & Spa',
        location: 'Pallivasal, Munnar',
        roomCategory: 'Premium Valley View Suite',
        mealPlan: 'Buffet Breakfast & Dinner Included',
        starRating: 5
      },
      diningExperience: {
        restaurantName: 'Rapsy Restaurant Munnar Town',
        cuisine: 'Authentic Malabar & Kerala Fare',
        specialtyDish: 'Malabar Parotta with Egg Roast & Munnar Spiced Chai',
        mealType: 'Lunch'
      },
      highlights: 'Spotting mother and kid Nilgiri Tahr grazing fearlessly along the morning mist trail.'
    },
    {
      day: 3,
      phaseTitle: 'Spice Plantation Walk & Periyar Lake Boat Safari in Thekkady',
      destinationCovered: 'Thekkady (Periyar)',
      spotsCovered: [
        {
          name: 'Abraham’s Spice Garden',
          description: 'Guided natural estate for cardamom, cinnamon, vanilla, and clove.',
          activityHighlight: 'Sniffing fresh wild spices right off the tree bark'
        },
        {
          name: 'Periyar Tiger Reserve Lake',
          description: 'Submerged tree trunks in wildlife sanctuary with elephant herds.',
          activityHighlight: '2-Hour KTDC boat safari for wild elephant spotting'
        },
        {
          name: 'Kadathanadan Kalari Centre',
          description: 'Ancient martial art (Kalaripayattu) and Kathakali drama demonstration.',
          activityHighlight: 'Witnessing athletic swordsmanship and fire jumping'
        }
      ],
      howCovered: 'Private Chauffeur Sedan + Spice Garden Naturalist & Evening Show Tickets',
      stayHotel: {
        name: 'The Elephant Court Thekkady',
        location: 'Kumily, Thekkady',
        roomCategory: 'Patio Pool Villa with Teak Wood Four-Poster Bed',
        mealPlan: 'Buffet Breakfast & Traditional Dinner Included',
        starRating: 5
      },
      diningExperience: {
        restaurantName: 'Bamboo Cafe Thekkady',
        cuisine: 'Traditional Kerala Sadhya (Banana Leaf)',
        specialtyDish: '24-item Kerala Sadhya with Avial, Sambar, Payasam & Crispy Pappadam',
        mealType: 'Lunch'
      },
      highlights: 'Watching elephants and wild boars drink at the lakeshore during the sunset boat cruise.'
    },
    {
      day: 4,
      phaseTitle: 'Boarding Private Alleppey Backwaters Houseboat (Kettuvallam)',
      destinationCovered: 'Alleppey (Alappuzha) & Vembanad Lake',
      spotsCovered: [
        {
          name: 'Vembanad Lake Backwater Canals',
          description: 'Quiet labyrinth of palm-fringed waterways, Chinese fishing nets, and paddy fields.',
          activityHighlight: 'Cruising through narrow village canals as village life unfolds'
        },
        {
          name: 'Kuttanad Below-Sea-Level Rice Bowls',
          description: 'Farming conducted 4 to 10 feet below sea level.',
          activityHighlight: 'Visiting local coir-making cottage workshops'
        }
      ],
      howCovered: 'Private Luxury 1-Bedroom Kettuvallam Houseboat with Dedicated Captain, Engine Driver & Private Chef',
      stayHotel: {
        name: 'Kumarakom Luxury Kettuvallam Houseboat',
        location: 'Vembanad Backwaters, Alleppey',
        roomCategory: 'Private Deluxe Air-Conditioned Bedroom with Sundeck Lounge',
        mealPlan: 'All Meals Included: Welcome Drink, Traditional Lunch, Evening Tea & Snacks, Dinner & Breakfast',
        starRating: 5
      },
      diningExperience: {
        restaurantName: 'Houseboat Onboard Private Live Kitchen',
        cuisine: 'Coastal Kerala Backwater Delicacies',
        specialtyDish: 'Fresh Pearl Spot (Karimeen Pollichathu) marinated in Kerala spices & wrapped in banana leaf',
        mealType: 'Special Traditional Feast'
      },
      highlights: 'Dining on hot spicy Karimeen fish on the open sundeck while the houseboat glides through sunset waters.'
    },
    {
      day: 5,
      phaseTitle: 'Fort Kochi Heritage Stroll, Chinese Nets & Airport Transfer',
      destinationCovered: 'Fort Kochi to Cochin Airport',
      spotsCovered: [
        {
          name: 'Chinese Fishing Nets (Cheena Vala)',
          description: 'Giant cantilevered shore-operated fishing rigs introduced in 14th century.',
          activityHighlight: 'Helping local fishermen lower and haul the giant nets'
        },
        {
          name: 'St. Francis Church & Jew Town',
          description: 'Oldest European church in India and centuries-old spice and antique stores.',
          activityHighlight: 'Souvenir antique shopping and cinnamon sticks'
        }
      ],
      howCovered: 'Private AC Chauffeur Cab for Sightseeing and Airport Drop',
      stayHotel: {
        name: 'Departure Day',
        location: 'Cochin International Airport',
        roomCategory: 'N/A (Check-out after Morning Houseboat Cruise)',
        mealPlan: 'Fresh Kerala Breakfast Onboard Houseboat (Appam & Egg Roast)',
        starRating: 5
      },
      diningExperience: {
        restaurantName: 'Kashi Art Cafe Fort Kochi',
        cuisine: 'Artisan Cafe & Continental',
        specialtyDish: 'Fresh Baked Chocolate Cake, Artisan Roast Coffee & Grilled Sandwiches',
        mealType: 'Lunch'
      },
      highlights: 'Capturing the sunset silhouette of the Chinese fishing nets against the Arabian Sea.'
    }
  ],

  'pkg-goa': [
    {
      day: 1,
      phaseTitle: 'Goa Coastal Arrival, Vagator Red Cliffs & Beach Sunset',
      destinationCovered: 'North Goa (Vagator & Anjuna)',
      spotsCovered: [
        {
          name: 'Vagator Beach & Red Laterite Cliffs',
          description: 'Dramatic cliffs overlooking the Arabian Sea with chilled open-air lounges.',
          activityHighlight: 'Sunset cocktail & ocean breeze relaxation'
        }
      ],
      howCovered: 'Private AC Airport Chauffeur Transfer (Dabolim / Mopa) + Welcome Drink',
      stayHotel: {
        name: 'W Goa Luxury Coastal Resort',
        location: 'Vagator Beach, North Goa',
        roomCategory: 'Wonderful Garden View Room with Private Patio',
        mealPlan: 'Buffet Breakfast Included',
        starRating: 5
      },
      diningExperience: {
        restaurantName: 'Rock Pool at W Goa',
        cuisine: 'Goan Coastal Tapas & Grills',
        specialtyDish: 'Peri-Peri Grilled Prawns, Tawa Calamari & Passionfruit Martinis',
        mealType: 'Dinner'
      },
      highlights: 'Unwinding by the cliffside Rock Pool as the DJ plays chill ambient beats during the sunset.'
    },
    {
      day: 2,
      phaseTitle: 'Historic Aguada Fort, Sinquerim Lighthouse & Baga Beach Watersports',
      destinationCovered: 'Candolim, Calangute & Baga',
      spotsCovered: [
        {
          name: 'Fort Aguada & 17th-Century Lighthouse',
          description: 'Colossal Portuguese fort guarding the mouth of Mandovi river.',
          activityHighlight: 'Walking the ramparts overlooking Sinquerim beach'
        },
        {
          name: 'Baga Beach Watersports Arena',
          description: 'Goa’s action hub for ocean parasailing, jet skiing, and banana boat rides.',
          activityHighlight: 'Parasailing over golden waters with parachute dip'
        }
      ],
      howCovered: 'Dedicated AC Cab for Full-Day Sightseeing + Water Sports Desk Passes',
      stayHotel: {
        name: 'W Goa Luxury Coastal Resort',
        location: 'Vagator Beach, North Goa',
        roomCategory: 'Wonderful Garden View Room',
        mealPlan: 'Buffet Breakfast Included',
        starRating: 5
      },
      diningExperience: {
        restaurantName: "Britto’s Beach Shack & Bakery (Baga)",
        cuisine: 'Goan Continental & Seafood',
        specialtyDish: 'Baked Stuffed Crab, Jumbo Tiger Prawns & Goan Bebinca Dessert',
        mealType: 'Lunch'
      },
      highlights: 'Soaring high above the Arabian Sea on a tandem parasail with panoramic coastline views.'
    },
    {
      day: 3,
      phaseTitle: 'Grande Island Speedboat Cruise, Dolphin Watching & Scuba Snorkeling',
      destinationCovered: 'Grande Island & Arabian Sea',
      spotsCovered: [
        {
          name: 'Grande Island Coral Reefs',
          description: 'Volcanic island offshore with clear waters and diverse coral marine life.',
          activityHighlight: 'Guided PADI Scuba Dive & Snorkeling with instructors'
        },
        {
          name: 'Dolphin Spotting Channel',
          description: 'Calm waters where playful Indo-Pacific humpback dolphins surface.',
          activityHighlight: 'Spotting dolphin pods swimming alongside speedboats'
        }
      ],
      howCovered: 'Jetty Transfers + High-Speed Catamaran/Speedboat + Full Diving Gear & Instructor',
      stayHotel: {
        name: 'W Goa Luxury Coastal Resort',
        location: 'Vagator Beach, North Goa',
        roomCategory: 'Wonderful Garden View Room',
        mealPlan: 'Buffet Breakfast & Island Barbecue Lunch Included',
        starRating: 5
      },
      diningExperience: {
        restaurantName: "The Fisherman’s Wharf Panaji",
        cuisine: 'Signature Goan Seafood',
        specialtyDish: 'Kingfish Balchão, Crab Xec Xec & Sannas (Steamed Rice Cakes)',
        mealType: 'Dinner'
      },
      highlights: 'Breathing underwater for the first time among schools of sergeant majors and clownfish.'
    },
    {
      day: 4,
      phaseTitle: 'Fontainhas Latin Quarter Heritage Walk & Panaji Departure',
      destinationCovered: 'Panaji Latin Quarter & Airport',
      spotsCovered: [
        {
          name: 'Fontainhas Portuguese Heritage Quarter',
          description: 'Quaint lanes with 18th-century yellow and indigo colonial homes.',
          activityHighlight: 'Photography stroll & Azulejo ceramic souvenir shopping'
        },
        {
          name: 'Our Lady of the Immaculate Conception Church',
          description: 'Iconic zigzagging baroque white stone stairway in central Panaji.',
          activityHighlight: 'Historic architecture appreciation & cafe hopping'
        }
      ],
      howCovered: 'Private AC Chauffeur Cab with Airport Drop (Baggage Safe in Vehicle)',
      stayHotel: {
        name: 'Departure Day',
        location: 'Goa International Airport',
        roomCategory: 'N/A (Check-out after Breakfast)',
        mealPlan: 'Buffet Breakfast Included',
        starRating: 5
      },
      diningExperience: {
        restaurantName: 'Viva Panjim Heritage Restaurant',
        cuisine: 'Authentic Home-Style Goan Portuguese',
        specialtyDish: 'Pork / Chicken Vindaloo, Prawn Caldine & Fresh Baked Poee',
        mealType: 'Lunch'
      },
      highlights: 'Soaking in the vibrant pastel architecture and picking up homemade Goan cashew feni before departure.'
    }
  ],

  'pkg-golden-triangle': [
    {
      day: 1,
      phaseTitle: 'Capital Delhi - India Gate, Qutub Minar & Chandni Chowk Rikshaw',
      destinationCovered: 'New Delhi & Old Delhi',
      spotsCovered: [
        {
          name: 'Qutub Minar Complex',
          description: '73-meter brick minaret built in 1192 with iron pillar that never rusts.',
          activityHighlight: 'Exploring Indo-Islamic carved stone screens'
        },
        {
          name: 'India Gate & Kartavya Path',
          description: 'War memorial arch standing grandly in the heart of New Delhi.',
          activityHighlight: 'Evening boulevard stroll with ice cream'
        },
        {
          name: 'Chandni Chowk & Jama Masjid',
          description: '17th-century bustling walled city bazaars and India’s grandest mosque.',
          activityHighlight: 'Cycle-rickshaw safari through Khari Baoli spice market'
        }
      ],
      howCovered: 'Dedicated AC Toyota Innova Crysta for Entire 6-Day Tour + English Speaking Escort',
      stayHotel: {
        name: 'The Imperial New Delhi',
        location: 'Janpath, Connaught Place, New Delhi',
        roomCategory: 'Heritage Grand Room with British Colonial Antiques',
        mealPlan: 'Buffet Breakfast Included',
        starRating: 5
      },
      diningExperience: {
        restaurantName: 'Karim’s Old Delhi (Since 1913)',
        cuisine: 'Authentic Royal Mughlai',
        specialtyDish: 'Mutton Burra Kebab, Butter Naan & Shahi Tukda',
        mealType: 'Dinner'
      },
      highlights: 'The vibrant sights, sounds, and aromas of the Khari Baoli spice bazaar from a cycle rickshaw.'
    },
    {
      day: 2,
      phaseTitle: 'Yamuna Expressway to Agra, Agra Fort & Mehtab Bagh Sunset',
      destinationCovered: 'Delhi to Agra (210 km)',
      spotsCovered: [
        {
          name: 'Agra Fort (Red Sandstone Citadel)',
          description: 'Colossal red fort with Jahangiri Mahal, Diwan-i-Khas, and marble pavilions.',
          activityHighlight: 'Gazing at Taj Mahal from Shah Jahan’s marble prison balcony'
        },
        {
          name: 'Mehtab Bagh (Moonlight Garden)',
          description: 'Quiet riverside park directly across River Yamuna from Taj Mahal.',
          activityHighlight: 'Sunset reflection of the Taj Mahal without crowds'
        }
      ],
      howCovered: 'Private AC Innova Crysta via Yamuna 6-Lane Expressway (3.5 Hours) + Fast Tolls',
      stayHotel: {
        name: 'The Oberoi Amarvilas',
        location: 'Taj East Gate Road, Agra',
        roomCategory: 'Premier Room with Unobstructed Taj Mahal View from Bed',
        mealPlan: 'Buffet Breakfast Included',
        starRating: 5
      },
      diningExperience: {
        restaurantName: 'Pinch of Spice (Fatehabad Road)',
        cuisine: 'Mughlai & Tandoori',
        specialtyDish: 'Murgh Boti Masala, Dal Makhani & Garlic Butter Naan',
        mealType: 'Dinner'
      },
      highlights: 'Opening your hotel room curtains to see the Taj Mahal glowing in evening twilight.'
    },
    {
      day: 3,
      phaseTitle: 'Sunrise Taj Mahal, Ghost City Fatehpur Sikri & Drive to Jaipur',
      destinationCovered: 'Agra to Jaipur via Fatehpur Sikri',
      spotsCovered: [
        {
          name: 'Taj Mahal (Sunrise Entry)',
          description: 'Unmatched masterpiece of Mughal architecture in pure white Makrana marble.',
          activityHighlight: 'Sunrise photography by Diana bench reflection pool'
        },
        {
          name: 'Fatehpur Sikri UNESCO Capital',
          description: 'Emperor Akbar’s abandoned red sandstone imperial capital and Buland Darwaza.',
          activityHighlight: 'Walking through the grand Jama Masjid and Salim Chishti tomb'
        }
      ],
      howCovered: 'Private Chauffeur Innova Crysta + Fast-Track Monument Entries & Licensed Guide',
      stayHotel: {
        name: 'Rambagh Palace Jaipur (Former Residence of Maharaja)',
        location: 'Bhawani Singh Road, Jaipur',
        roomCategory: 'Palace Room with Royal Arched Windows & Butler Service',
        mealPlan: 'Royal Welcome Garland & Buffet Breakfast Included',
        starRating: 5
      },
      diningExperience: {
        restaurantName: 'Peshawri at ITC Rajputana Jaipur',
        cuisine: 'North-West Frontier',
        specialtyDish: 'Slow-simmered Dal Bukhara, Sikandari Raan & Tandoori Jhinga',
        mealType: 'Dinner'
      },
      highlights: 'Witnessing the Taj Mahal’s marble turn from soft lilac dawn to brilliant incandescent white.'
    },
    {
      day: 4,
      phaseTitle: 'Amber Fort Elephant Ascent, Hawa Mahal & Royal City Palace',
      destinationCovered: 'Jaipur (The Pink City)',
      spotsCovered: [
        {
          name: 'Amber Fort & Sheesh Mahal',
          description: 'Hilltop fort palace with thousand-mirror mosaic hall and royal courtyards.',
          activityHighlight: 'Royal jeep / elephant ascent through Sun Gate'
        },
        {
          name: 'Hawa Mahal (Palace of Winds)',
          description: 'Five-story pink sandstone facade with 953 filigreed lattice windows.',
          activityHighlight: 'Rooftop cafe photography & architecture tour'
        },
        {
          name: 'City Palace of Jaipur',
          description: 'Active royal palace complex with Mubarak Mahal and Peacock Courtyard.',
          activityHighlight: 'Viewing ceremonial royal garments and silver water urns'
        }
      ],
      howCovered: 'Dedicated AC Innova with Royal Hill Fort Access + VIP Fast-Track Entry',
      stayHotel: {
        name: 'Rambagh Palace Jaipur',
        location: 'Bhawani Singh Road, Jaipur',
        roomCategory: 'Palace Room',
        mealPlan: 'Grand Buffet Breakfast Included',
        starRating: 5
      },
      diningExperience: {
        restaurantName: '1135 AD Amber Fort Fine Dining',
        cuisine: 'Royal Rajputana Court Cuisine',
        specialtyDish: 'Thaal-e-Amber with Laal Maas, Ker Sangri & Saffron Pulao',
        mealType: 'Lunch'
      },
      highlights: 'Having royal lunch inside a 400-year-old fort dining room decorated with pure gold leaf.'
    },
    {
      day: 5,
      phaseTitle: 'Jantar Mantar Observatory, Nahargarh Sunset & Chokhi Dhani',
      destinationCovered: 'Jaipur Heritage & Cultural Hub',
      spotsCovered: [
        {
          name: 'Jantar Mantar UNESCO Observatory',
          description: '19 architectural astronomical instruments including world’s largest sundial.',
          activityHighlight: 'Reading local solar time accurate to within 2 seconds'
        },
        {
          name: 'Nahargarh Fort Aravalli Ridge',
          description: 'Hilltop ramparts with panoramic birds-eye view over Jaipur Pink City.',
          activityHighlight: 'Sunset viewing over the city rooftops'
        },
        {
          name: 'Chokhi Dhani Village Fair',
          description: 'Immersive Rajasthani cultural resort with puppet shows, camels, and folk dances.',
          activityHighlight: 'Ghoomar folk dancing & traditional turban tying'
        }
      ],
      howCovered: 'Private Guided Innova Crysta Sightseeing + Chokhi Dhani All-Inclusive Passes',
      stayHotel: {
        name: 'Rambagh Palace Jaipur',
        location: 'Bhawani Singh Road, Jaipur',
        roomCategory: 'Palace Room',
        mealPlan: 'Buffet Breakfast & Royal Rajasthani Dinner Included',
        starRating: 5
      },
      diningExperience: {
        restaurantName: 'Chokhi Dhani Village Dining Hall',
        cuisine: 'Traditional Rajasthani Manuhaar Feast',
        specialtyDish: 'Dal Baati Churma cooked in pure desi ghee, Gatte Ki Sabzi & Buttermilk',
        mealType: 'Special Traditional Feast'
      },
      highlights: 'Sitting on the ramparts of Nahargarh Fort watching the golden sun set across the entire Pink City.'
    },
    {
      day: 6,
      phaseTitle: 'Johari Bazaar Handicrafts & Scenic Return Highway Drive to Delhi',
      destinationCovered: 'Jaipur to Delhi Airport (260 km)',
      spotsCovered: [
        {
          name: 'Johari & Bapu Bazaars',
          description: 'Famous bazaars for block-printed quilts, blue pottery, and silver jewelry.',
          activityHighlight: 'Souvenir shopping and tasting famous Pyaaz Kachori'
        }
      ],
      howCovered: 'Private AC Innova Crysta via Delhi-Jaipur Expressway with Airport Departure Drop',
      stayHotel: {
        name: 'Departure Day',
        location: 'Indira Gandhi International Airport (DEL)',
        roomCategory: 'N/A (Check-out after Breakfast)',
        mealPlan: 'Buffet Breakfast Included',
        starRating: 5
      },
      diningExperience: {
        restaurantName: 'Rawat Mishtan Bhandar (Station Road, Jaipur)',
        cuisine: 'Iconic Rajasthani Snack House',
        specialtyDish: 'World-famous Piping Hot Pyaaz Kachori, Mawa Kachori & Masala Chai',
        mealType: 'Lunch'
      },
      highlights: 'Comfortable expressway ride back to Delhi reflecting on India’s royal Golden Triangle.'
    }
  ],

  'pkg-ladakh': [
    {
      day: 1,
      phaseTitle: 'Leh Arrival & Mandatory High Altitude Acclimatization',
      destinationCovered: 'Leh (11,562 ft)',
      spotsCovered: [
        {
          name: 'Leh Town & Shanti Stupa Valley View',
          description: 'High altitude Himalayan desert valley framed by Stok Kangri snow range.',
          activityHighlight: 'Gentle acclimatization walk and drinking herbal butter tea'
        }
      ],
      howCovered: 'Oxygen-Equipped Private 4x4 Scorpio / Innova Airport Pickup with Medical Oximeter Check',
      stayHotel: {
        name: 'The Grand Dragon Ladakh',
        location: 'Old Road, Sheynam, Leh',
        roomCategory: 'Deluxe Heritage Room with Oxygen Concentrator & Central Solar Heating',
        mealPlan: 'Warm Kahwa Welcome + Buffet Dinner Included',
        starRating: 5
      },
      diningExperience: {
        restaurantName: 'The Grand Dragon Dining Hall',
        cuisine: 'Ladakhi & Healthy High-Altitude Menu',
        specialtyDish: 'Warm Tibetan Thukpa, Steamed Vegetable Momos & Mint Tea',
        mealType: 'Dinner'
      },
      highlights: 'Watching the dramatic snow-capped peaks of Stok Kangri from your heated luxury room.'
    },
    {
      day: 2,
      phaseTitle: 'Indus Valley Monasteries: Shey Palace, Thiksey & Hall of Fame',
      destinationCovered: 'Shey, Thiksey & Leh',
      spotsCovered: [
        {
          name: 'Thiksey Monastery (Mini Potala)',
          description: 'Majestic 12-story hilltop monastery with 49-ft golden Maitreya Buddha.',
          activityHighlight: 'Attending morning prayer hall chanting & rooftop valley view'
        },
        {
          name: 'Shey Palace & Monastery',
          description: 'Former summer retreat of Ladakh royalty with copper-gold Shakyamuni shrine.',
          activityHighlight: 'Exploring 17th-century royal rock inscriptions'
        },
        {
          name: 'Hall of Fame Museum',
          description: 'Inspiring memorial built by the Indian Army commemorating high-altitude heroes.',
          activityHighlight: 'Viewing Siachen glacier gear and captured enemy military artifacts'
        }
      ],
      howCovered: 'Dedicated Mountain SUV with Experienced Ladakhi Mountain Chauffeur',
      stayHotel: {
        name: 'The Grand Dragon Ladakh',
        location: 'Sheynam, Leh',
        roomCategory: 'Deluxe Heritage Room',
        mealPlan: 'Buffet Breakfast & Dinner Included',
        starRating: 5
      },
      diningExperience: {
        restaurantName: 'Chopsticks Noodle Bar Leh Town',
        cuisine: 'Pan-Asian & Tibetan',
        specialtyDish: 'Chili Garlic Noodles, Tingmo (Steamed Bread) & Yak Cheese Platter',
        mealType: 'Lunch'
      },
      highlights: 'The resonant boom of the monastic long-horns echoing across the peaceful Indus Valley.'
    },
    {
      day: 3,
      phaseTitle: 'Crossing Khardung La Pass (17,982 ft) to Desert Dunes of Nubra Valley',
      destinationCovered: 'Khardung La to Nubra Valley (Diskit & Hunder)',
      spotsCovered: [
        {
          name: 'Khardung La Pass Summit',
          description: 'One of the highest motorable mountain roads on earth with fluttering prayer flags.',
          activityHighlight: 'Stepping onto the historic pass sign at 18,000 ft for photos'
        },
        {
          name: 'Hunder White Sand Dunes',
          description: 'High-altitude cold desert dunes framed by jagged snow mountains.',
          activityHighlight: 'Riding rare double-humped Bactrian camels along the dunes'
        }
      ],
      howCovered: 'Dedicated 4x4 Mountain Cruiser with Medical Emergency Oxygen Cylinder',
      stayHotel: {
        name: 'Desert Himalayan Luxury Glamping Resort',
        location: 'Diskit, Nubra Valley',
        roomCategory: 'Luxury Swiss Alpine Tent with Attached Heated Bathroom & Veranda',
        mealPlan: 'Buffet Breakfast & Campfire Multi-Cuisine Dinner Included',
        starRating: 5
      },
      diningExperience: {
        restaurantName: 'Campfire Dining Pavilion Nubra',
        cuisine: 'Indian & Ladakhi Organic',
        specialtyDish: 'Hot Ladakhi Skyu (pasta stew), Dal Tadka & Apricot Pie',
        mealType: 'Dinner'
      },
      highlights: 'Riding a double-humped Bactrian camel across white sand dunes with snow peaks in the background.'
    },
    {
      day: 4,
      phaseTitle: 'Diskit 106-ft Maitreya Buddha & Shyok River Route to Pangong Lake',
      destinationCovered: 'Diskit to Pangong Tso (14,270 ft)',
      spotsCovered: [
        {
          name: 'Diskit Monastery & Giant Buddha',
          description: '106-ft tall brightly painted Buddha statue overlooking the Shyok river basin.',
          activityHighlight: 'Standing beneath the colossal statue for panoramic valley shots'
        },
        {
          name: 'Shyok River Wild Canyon Route',
          description: 'Scenic off-road drive along turquoise river rapids and riverbed crossings.',
          activityHighlight: 'Dramatic geological canyon photography'
        }
      ],
      howCovered: 'Dedicated 4x4 Scorpio / Safari Mountain Vehicle + Inner Line Permits Included',
      stayHotel: {
        name: 'Pangong Sarai Luxury Lakefront Glamping',
        location: 'Spangmik, Pangong Tso',
        roomCategory: 'Lakefront Royal Swiss Tent with Direct View of Turquoise Waters',
        mealPlan: 'Buffet Breakfast & Hot Dinner Included',
        starRating: 5
      },
      diningExperience: {
        restaurantName: 'Pangong Lakefront Dining Tent',
        cuisine: 'Warm Comfort Indian & Tibetan',
        specialtyDish: 'Piping Hot Khichdi with Ghee, Masala Omelet, Dal & Kashmiri Kahwa',
        mealType: 'Dinner'
      },
      highlights: 'Watching the water of Pangong Lake shift between cobalt blue, turquoise, and violet in real time.'
    },
    {
      day: 5,
      phaseTitle: 'Sunrise Over Pangong Tso & Crossing Chang La Pass Back to Leh',
      destinationCovered: 'Pangong Tso to Leh via Chang La (17,590 ft)',
      spotsCovered: [
        {
          name: 'Pangong Tso Sunrise & 3 Idiots Point',
          description: 'Famous movie filming spot with vibrant yellow scooter against brilliant blue lake.',
          activityHighlight: 'Sunrise photography across crystal calm waters'
        },
        {
          name: 'Chang La High Mountain Pass',
          description: 'Third highest motorable pass with Changla Baba temple.',
          activityHighlight: 'Hot cup of Indian Army complimentary tea at the pass'
        },
        {
          name: 'Shanti Stupa Sunset',
          description: 'White-domed peace pagoda overlooking Leh town at golden hour.',
          activityHighlight: 'Viewing evening lights illuminate the Leh valley'
        }
      ],
      howCovered: 'Dedicated 4x4 Vehicle + Professional Mountain Driver',
      stayHotel: {
        name: 'The Grand Dragon Ladakh',
        location: 'Sheynam, Leh',
        roomCategory: 'Deluxe Heritage Room',
        mealPlan: 'Buffet Breakfast & Dinner Included',
        starRating: 5
      },
      diningExperience: {
        restaurantName: 'Bon Appetit Leh Town',
        cuisine: 'Italian, Continental & Local Organic',
        specialtyDish: 'Woodfired Mushroom & Olive Pizza, Walnut Tart & Herb Roast Chicken',
        mealType: 'Dinner'
      },
      highlights: 'The silent beauty of Pangong Lake at 06:00 AM before any tourist day-trippers arrive.'
    },
    {
      day: 6,
      phaseTitle: 'Leh Main Bazaar Dry Fruits Shopping & Cultural Day',
      destinationCovered: 'Leh Town & Old Quarter',
      spotsCovered: [
        {
          name: 'Leh Main Bazaar & Tibetan Refugee Market',
          description: 'Cobblestone pedestrian avenue with Ladakhi women selling organic vegetables and dry fruits.',
          activityHighlight: 'Buying premium wild dried apricots, walnuts, and prayer wheels'
        },
        {
          name: 'Leh Palace (Lhachen Palkhar)',
          description: '9-story 17th-century former royal palace overlooking the old mud-brick town.',
          activityHighlight: 'Climbing to the palace rooftop for historic architectural views'
        }
      ],
      howCovered: 'Private Cab for City Sightseeing + Walking Tour',
      stayHotel: {
        name: 'The Grand Dragon Ladakh',
        location: 'Sheynam, Leh',
        roomCategory: 'Deluxe Heritage Room',
        mealPlan: 'Buffet Breakfast & Farewell Gala Dinner Included',
        starRating: 5
      },
      diningExperience: {
        restaurantName: 'Gesmo Restaurant (Since 1989, Fort Road)',
        cuisine: 'Oldest Bakery & European Comfort',
        specialtyDish: 'Fresh Baked Apple Crumble, Yak Cheese Sandwich & Cinnamon Roll',
        mealType: 'Lunch'
      },
      highlights: 'Tasting sweet golden Ladakhi dried apricots and sharing laughter with local shopkeepers.'
    },
    {
      day: 7,
      phaseTitle: 'Scenic Mountain Flight Departure from Leh Airport',
      destinationCovered: 'Leh Airport to Home',
      spotsCovered: [
        {
          name: 'Kushok Bakula Rimpochee Airport',
          description: 'One of the world’s highest commercial airports with Himalayan mountain runways.',
          activityHighlight: 'Aerial window views of snow-covered Greater Himalayas'
        }
      ],
      howCovered: 'Private Chauffeur Airport Drop with Luggage Support',
      stayHotel: {
        name: 'Departure Day',
        location: 'Leh Airport',
        roomCategory: 'N/A (Check-out after Breakfast)',
        mealPlan: 'Buffet Breakfast Included',
        starRating: 5
      },
      diningExperience: {
        restaurantName: 'Cafe Cloud at Leh Airport',
        cuisine: 'Light Beverages & Snacks',
        specialtyDish: 'Hot Masala Chai & Freshly Baked Cookies',
        mealType: 'Breakfast'
      },
      highlights: 'Gazing out of the airplane window at endless jagged snow peaks stretching as far as the eye can see.'
    }
  ]
};

/**
 * Fallback journey roadmap generator for packages without hardcoded roadmaps
 */
export function getJourneyRoadmapForPackage(pkg: TourPackage): PackageRoadmapDay[] {
  if (PACKAGE_JOURNEY_ROADMAPS[pkg.id]) {
    return PACKAGE_JOURNEY_ROADMAPS[pkg.id];
  }

  const days = pkg.daysCount || 5;
  const itinerary = pkg.itinerary || [];

  return Array.from({ length: days }, (_, i) => {
    const dayNum = i + 1;
    const itItem = itinerary[i] || {
      title: `Exploration & Leisure in ${pkg.destination}`,
      description: `Guided sightseeing of iconic spots in ${pkg.destination} with comfortable transfers and curated meals.`
    };

    return {
      day: dayNum,
      phaseTitle: itItem.title,
      destinationCovered: pkg.destination,
      spotsCovered: [
        {
          name: `Iconic Landmark ${dayNum} of ${pkg.destination}`,
          description: itItem.description,
          activityHighlight: 'Guided sightseeing & leisure photography'
        }
      ],
      howCovered: 'Private AC Chauffeur Vehicle & Pre-Booked Monument Entry Tickets',
      stayHotel: {
        name: `4★ Handpicked Boutique Resort & Heritage Stay`,
        location: `${pkg.destination}, ${pkg.country}`,
        roomCategory: 'Superior Deluxe Room with Scenic View',
        mealPlan: 'Daily Buffet Breakfast & Multi-Cuisine Dinner Included',
        starRating: 4
      },
      diningExperience: {
        restaurantName: `Signature Heritage Dining Room`,
        cuisine: 'Authentic Regional & Global Specialties',
        specialtyDish: 'Chef’s Daily Special Platter & Fresh Desserts',
        mealType: 'Dinner'
      },
      highlights: itItem.description
    };
  });
}
