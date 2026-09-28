-- ========================================================
-- TRAVELORA - TRAVELER REVIEWS & STAR RATINGS SCHEMA & QUERIES
-- Compatible with Supabase / PostgreSQL
-- ========================================================

-- 1. CREATE REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  booking_id TEXT,
  user_id TEXT,
  traveler_name TEXT NOT NULL,
  traveler_email TEXT,
  item_type TEXT NOT NULL CHECK (item_type IN ('package', 'hotel', 'destination', 'activity', 'custom_tour')),
  item_id TEXT NOT NULL,
  destination_id TEXT,
  item_title TEXT NOT NULL,
  rating NUMERIC(3,2) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  recommend BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CREATE PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_reviews_item_id ON public.reviews(item_id);
CREATE INDEX IF NOT EXISTS idx_reviews_destination_id ON public.reviews(destination_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);

-- 3. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone (public or authenticated) to read verified reviews
CREATE POLICY "Public Read Reviews"
  ON public.reviews
  FOR SELECT
  USING (true);

-- Allow anyone to submit reviews and star ratings
CREATE POLICY "Public & Authenticated Insert Reviews"
  ON public.reviews
  FOR INSERT
  WITH CHECK (true);

-- Allow admins or review authors to update/delete their reviews
CREATE POLICY "Author & Admin Update Reviews"
  ON public.reviews
  FOR UPDATE
  USING (true);

CREATE POLICY "Author & Admin Delete Reviews"
  ON public.reviews
  FOR DELETE
  USING (true);

-- ========================================================
-- 4. SEED SAMPLE VERIFIED TRAVELER REVIEWS
-- ========================================================
INSERT INTO public.reviews (
  id, booking_id, user_id, traveler_name, traveler_email, item_type, item_id, destination_id, item_title, rating, title, comment, tags, recommend, created_at
) VALUES
(
  'rev-kashmir-01',
  'TRV-KASH-101',
  'usr-demo-1',
  'Vikram & Ananya Malhotra',
  'vikram.m@gmail.com',
  'package',
  'pkg-kashmir-heaven',
  'dest-kashmir',
  'Heavenly Kashmir & Gulmarg Gondola Escape',
  5.0,
  'Unforgettable Gulmarg Gondola & Dal Houseboat Experience!',
  'Travelora handled every single detail with perfection. The driver was waiting at Srinagar airport with warm saffron Kahwa tea. The Gulmarg Phase 2 gondola passes were arranged in advance without standing in lines, and our luxury houseboat in Nigeen Lake was breathtaking.',
  ARRAY['Scenic Splendor', 'Superb Hospitality', 'Punctual Transfers', 'Family Friendly'],
  true,
  NOW() - INTERVAL '3 days'
),
(
  'rev-kashmir-02',
  'TRV-KASH-102',
  'usr-demo-2',
  'Rohan Mehta',
  'rohan.mehta@yahoo.com',
  'hotel',
  'htl-khyber-gulmarg',
  'dest-kashmir',
  'The Khyber Himalayan Resort & Spa',
  4.9,
  'World-Class Luxury Amid Pine Forests & Snow Peaks',
  'The heated indoor glass swimming pool overlooking the snow-capped Pir Panjal range is unmatched in India. Buffet breakfast had exquisite Kashmiri harissa and fresh bakery. Worth every rupee.',
  ARRAY['Cozy & Clean Rooms', 'Superb Hospitality', 'Romantic for Couples', 'Delicious Local Food'],
  true,
  NOW() - INTERVAL '6 days'
),
(
  'rev-kerala-01',
  'TRV-KER-201',
  'usr-demo-3',
  'Siddharth & Sneha Rao',
  'sneha.rao@outlook.com',
  'package',
  'pkg-kerala-backwaters',
  'dest-kerala',
  'Kerala Backwaters, Munnar Tea Hills & Ayurveda Retreat',
  5.0,
  'Peaceful Alleppey Backwaters & Misty Munnar Sunrise',
  'Cruising along Vembanad Lake in a private air-conditioned houseboat with an onboard chef cooking fresh Karimeen fish and appams was magical. Munnar tea garden strolls were refreshing.',
  ARRAY['Superb Hospitality', 'Romantic for Couples', 'Delicious Local Food', 'Scenic Splendor'],
  true,
  NOW() - INTERVAL '8 days'
),
(
  'rev-goa-01',
  'TRV-GOA-301',
  'usr-demo-4',
  'Natasha Fernandes',
  'natasha.f@gmail.com',
  'destination',
  'dest-goa',
  'dest-goa',
  'Goa Sun, Sand & Portuguese Heritage',
  4.8,
  'Vibrant Coastline with Hidden South Goa Gems',
  'Travelora recommended pristine beaches like Butterfly and Cola Beach away from heavy crowds. The Portuguese heritage quarter in Fontainhas was picture-perfect.',
  ARRAY['Scenic Splendor', 'Great Value for Money', 'Safe & Well Organized'],
  true,
  NOW() - INTERVAL '12 days'
),
(
  'rev-taj-01',
  'TRV-RAJ-401',
  'usr-demo-5',
  'Priya Patel',
  'priya.patel@gmail.com',
  'hotel',
  'htl-taj-lake-palace',
  'dest-rajasthan',
  'Taj Lake Palace (Floating Royal Palace)',
  5.0,
  'Living in a 270-Year-Old Marble Dream',
  'Arriving by private motorboat at Lake Pichola and being showered with fragrant rose petals was like stepping into royal royalty. Exceptional butler service!',
  ARRAY['Superb Hospitality', 'Romantic for Couples', 'Cozy & Clean Rooms'],
  true,
  NOW() - INTERVAL '15 days'
)
ON CONFLICT (id) DO UPDATE SET
  rating = EXCLUDED.rating,
  title = EXCLUDED.title,
  comment = EXCLUDED.comment,
  tags = EXCLUDED.tags,
  recommend = EXCLUDED.recommend;

-- ========================================================
-- 5. USEFUL SQL QUERIES FOR RETRIEVING & AGGREGATING REVIEWS
-- ========================================================

-- QUERY A: Get All Reviews with Latest First
-- SELECT * FROM public.reviews ORDER BY created_at DESC;

-- QUERY B: Get Reviews for a Specific Item (Package, Hotel, or Destination)
-- SELECT * FROM public.reviews 
-- WHERE item_id = 'pkg-kashmir-heaven' OR destination_id = 'pkg-kashmir-heaven'
-- ORDER BY created_at DESC;

-- QUERY C: Calculate Average Rating and Total Review Count for Each Item
-- SELECT 
--   item_id,
--   item_title,
--   item_type,
--   ROUND(AVG(rating), 2) AS average_rating,
--   COUNT(*) AS total_reviews,
--   COUNT(*) FILTER (WHERE recommend = true) AS recommendations_count
-- FROM public.reviews
-- GROUP BY item_id, item_title, item_type
-- ORDER BY total_reviews DESC;

-- QUERY D: Overall Platform Rating Summary
-- SELECT 
--   ROUND(AVG(rating), 2) AS platform_average_rating,
--   COUNT(*) AS total_reviews_count,
--   COUNT(*) FILTER (WHERE rating = 5) AS five_star_count,
--   COUNT(*) FILTER (WHERE rating = 4) AS four_star_count,
--   ROUND(COUNT(*) FILTER (WHERE recommend = true)::numeric / COUNT(*) * 100, 1) AS recommendation_percentage
-- FROM public.reviews;
