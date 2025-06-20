
-- First, let's create a proper locations table for Telangana administrative divisions
CREATE TABLE IF NOT EXISTS public.telangana_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  district TEXT NOT NULL,
  mandal TEXT NOT NULL,
  village TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_telangana_locations_district ON public.telangana_locations(district);
CREATE INDEX IF NOT EXISTS idx_telangana_locations_mandal ON public.telangana_locations(district, mandal);

-- Insert sample Telangana data (major districts, mandals, and villages)
INSERT INTO public.telangana_locations (district, mandal, village) VALUES
-- Hyderabad District
('Hyderabad', 'Secunderabad Cantonment', 'Secunderabad'),
('Hyderabad', 'Secunderabad Cantonment', 'Trimulgherry'),
('Hyderabad', 'Secunderabad Cantonment', 'Bolaram'),
('Hyderabad', 'Tirumalagiri', 'Tirumalagiri'),
('Hyderabad', 'Tirumalagiri', 'Nacharam'),
('Hyderabad', 'Malkajgiri', 'Malkajgiri'),
('Hyderabad', 'Malkajgiri', 'Neredmet'),
('Hyderabad', 'Uppal', 'Uppal'),
('Hyderabad', 'Uppal', 'Boduppal'),

-- Rangareddy District
('Rangareddy', 'Rajendranagar', 'Rajendranagar'),
('Rangareddy', 'Rajendranagar', 'Attapur'),
('Rangareddy', 'Rajendranagar', 'Budvel'),
('Rangareddy', 'Shamshabad', 'Shamshabad'),
('Rangareddy', 'Shamshabad', 'Kothur'),
('Rangareddy', 'Chevella', 'Chevella'),
('Rangareddy', 'Chevella', 'Moinabad'),
('Rangareddy', 'Maheshwaram', 'Maheshwaram'),
('Rangareddy', 'Maheshwaram', 'Kandukur'),

-- Medchal-Malkajgiri District
('Medchal-Malkajgiri', 'Medchal', 'Medchal'),
('Medchal-Malkajgiri', 'Medchal', 'Dundigal'),
('Medchal-Malkajgiri', 'Keesara', 'Keesara'),
('Medchal-Malkajgiri', 'Keesara', 'Ghatkesar'),
('Medchal-Malkajgiri', 'Shamirpet', 'Shamirpet'),
('Medchal-Malkajgiri', 'Shamirpet', 'Kompally'),

-- Warangal Urban District
('Warangal Urban', 'Warangal', 'Warangal'),
('Warangal Urban', 'Warangal', 'Kazipet'),
('Warangal Urban', 'Hanamkonda', 'Hanamkonda'),
('Warangal Urban', 'Hanamkonda', 'Subedari'),

-- Warangal Rural District
('Warangal Rural', 'Parkal', 'Parkal'),
('Warangal Rural', 'Parkal', 'Shayampet'),
('Warangal Rural', 'Geesugonda', 'Geesugonda'),
('Warangal Rural', 'Geesugonda', 'Atmakur'),
('Warangal Rural', 'Nallabelly', 'Nallabelly'),
('Warangal Rural', 'Nallabelly', 'Raiparthy'),

-- Karimnagar District
('Karimnagar', 'Karimnagar', 'Karimnagar'),
('Karimnagar', 'Karimnagar', 'Mukarampura'),
('Karimnagar', 'Choppadandi', 'Choppadandi'),
('Karimnagar', 'Choppadandi', 'Konaraopeta'),
('Karimnagar', 'Gangadhara', 'Gangadhara'),
('Karimnagar', 'Gangadhara', 'Kataram'),

-- Nizamabad District
('Nizamabad', 'Nizamabad', 'Nizamabad'),
('Nizamabad', 'Nizamabad', 'Dichpally'),
('Nizamabad', 'Bodhan', 'Bodhan'),
('Nizamabad', 'Bodhan', 'Kotgiri'),
('Nizamabad', 'Balkonda', 'Balkonda'),
('Nizamabad', 'Balkonda', 'Varni'),

-- Adilabad District
('Adilabad', 'Adilabad', 'Adilabad'),
('Adilabad', 'Adilabad', 'Kuntala'),
('Adilabad', 'Boath', 'Boath'),
('Adilabad', 'Boath', 'Wankidi'),
('Adilabad', 'Tamsi', 'Tamsi'),
('Adilabad', 'Tamsi', 'Bhimini'),

-- Khammam District
('Khammam', 'Khammam', 'Khammam'),
('Khammam', 'Khammam', 'Nelakondapally'),
('Khammam', 'Kothagudem', 'Kothagudem'),
('Khammam', 'Kothagudem', 'Tekulapally'),
('Khammam', 'Yellandu', 'Yellandu'),
('Khammam', 'Yellandu', 'Bhadrachalam'),

-- Nalgonda District
('Nalgonda', 'Nalgonda', 'Nalgonda'),
('Nalgonda', 'Nalgonda', 'Penpahad'),
('Nalgonda', 'Miryalaguda', 'Miryalaguda'),
('Nalgonda', 'Miryalaguda', 'Kodad'),
('Nalgonda', 'Devaruppula', 'Devaruppula'),
('Nalgonda', 'Devaruppula', 'Mattampally'),

-- Mahabubnagar District
('Mahabubnagar', 'Mahabubnagar', 'Mahabubnagar'),
('Mahabubnagar', 'Mahabubnagar', 'Jadcherla'),
('Mahabubnagar', 'Narayanpet', 'Narayanpet'),
('Mahabubnagar', 'Narayanpet', 'Makthal'),
('Mahabubnagar', 'Kalwakurthy', 'Kalwakurthy'),
('Mahabubnagar', 'Kalwakurthy', 'Amangal');

-- Enable RLS on citizen_feedback table if not already enabled
ALTER TABLE public.citizen_feedback ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for citizen_feedback table
-- Allow everyone to insert feedback (for anonymous submissions)
DROP POLICY IF EXISTS "Anyone can submit feedback" ON public.citizen_feedback;
CREATE POLICY "Anyone can submit feedback" 
  ON public.citizen_feedback 
  FOR INSERT 
  WITH CHECK (true);

-- Allow everyone to view feedback (officials need to see all feedback in their area)
DROP POLICY IF EXISTS "Everyone can view feedback" ON public.citizen_feedback;
CREATE POLICY "Everyone can view feedback" 
  ON public.citizen_feedback 
  FOR SELECT 
  USING (true);

-- Make telangana_locations table publicly readable
ALTER TABLE public.telangana_locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view locations" ON public.telangana_locations;
CREATE POLICY "Everyone can view locations" 
  ON public.telangana_locations 
  FOR SELECT 
  USING (true);
