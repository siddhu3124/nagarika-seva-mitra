
-- Create citizen_feedback table with the required fields
CREATE TABLE public.citizen_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT NOT NULL,
  service_type TEXT,
  title TEXT,
  location TEXT,
  district TEXT,
  mandal TEXT,
  village TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.citizen_feedback ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to insert feedback
CREATE POLICY "Allow insert for feedback" 
ON public.citizen_feedback 
FOR INSERT 
WITH CHECK (true); -- Allow both authenticated and anonymous submissions

-- Create policy to allow users to view their own feedback
CREATE POLICY "Users can view their own feedback" 
ON public.citizen_feedback 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Create policy to allow users to update their own feedback
CREATE POLICY "Users can update their own feedback" 
ON public.citizen_feedback 
FOR UPDATE 
USING (auth.uid() = user_id);
