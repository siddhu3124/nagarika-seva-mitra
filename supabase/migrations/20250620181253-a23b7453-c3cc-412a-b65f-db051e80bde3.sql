
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own feedback" ON public.citizen_feedback;
DROP POLICY IF EXISTS "Public can view feedback" ON public.citizen_feedback;
DROP POLICY IF EXISTS "Anyone can insert feedback" ON public.citizen_feedback;
DROP POLICY IF EXISTS "Users can update their own feedback" ON public.citizen_feedback;

-- Enable RLS on citizen_feedback table (this might already be enabled)
ALTER TABLE public.citizen_feedback ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to insert feedback (for anonymous feedback submission)
CREATE POLICY "Anyone can insert feedback" 
ON public.citizen_feedback 
FOR INSERT 
WITH CHECK (true);

-- Policy to allow users to view their own feedback if they're logged in
CREATE POLICY "Users can view their own feedback" 
ON public.citizen_feedback 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  user_id IS NOT NULL AND 
  user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);

-- Policy to allow anonymous users to view feedback (for public viewing)
CREATE POLICY "Public can view feedback" 
ON public.citizen_feedback 
FOR SELECT 
USING (true);

-- Policy to allow users to update their own feedback
CREATE POLICY "Users can update their own feedback" 
ON public.citizen_feedback 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND 
  user_id IS NOT NULL AND 
  user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);
