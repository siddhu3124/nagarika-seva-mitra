
-- Ensure the messages table has the correct structure for official broadcasts
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS urgency text DEFAULT 'medium';

-- Add indexes for better performance on location-based queries
CREATE INDEX IF NOT EXISTS idx_messages_location ON public.messages(district, mandal, village);
CREATE INDEX IF NOT EXISTS idx_citizen_feedback_location ON public.citizen_feedback(district, mandal, village);
CREATE INDEX IF NOT EXISTS idx_users_location ON public.users(district, mandal, village);

-- Add RLS policies for messages table
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policy for officials to insert messages
CREATE POLICY "Officials can create messages" ON public.messages
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE auth_user_id = auth.uid() 
    AND role = 'official'
  )
);

-- Policy for citizens to read messages targeted to their location
CREATE POLICY "Citizens can read targeted messages" ON public.messages
FOR SELECT TO authenticated
USING (
  'citizen' = ANY(target_roles) AND
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.auth_user_id = auth.uid()
    AND u.role = 'citizen'
    AND (
      messages.district IS NULL OR u.district = messages.district
    ) AND (
      messages.mandal IS NULL OR u.mandal = messages.mandal  
    ) AND (
      messages.village IS NULL OR u.village = messages.village
    )
  )
);

-- Policy for officials to read all messages
CREATE POLICY "Officials can read all messages" ON public.messages
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE auth_user_id = auth.uid() 
    AND role = 'official'
  )
);

-- Add RLS policies for citizen_feedback table
ALTER TABLE public.citizen_feedback ENABLE ROW LEVEL SECURITY;

-- Policy for citizens to insert their own feedback
CREATE POLICY "Citizens can create feedback" ON public.citizen_feedback
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE auth_user_id = auth.uid() 
    AND role = 'citizen'
  )
);

-- Policy for citizens to read their own feedback
CREATE POLICY "Citizens can read own feedback" ON public.citizen_feedback
FOR SELECT TO authenticated
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE auth_user_id = auth.uid() 
    AND role = 'citizen'
    AND id::text = citizen_feedback.user_id::text
  )
);

-- Policy for officials to read feedback from their assigned location
CREATE POLICY "Officials can read location feedback" ON public.citizen_feedback
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.auth_user_id = auth.uid()
    AND u.role = 'official'
    AND (
      u.district = citizen_feedback.district OR u.district IS NULL
    ) AND (
      u.mandal = citizen_feedback.mandal OR u.mandal IS NULL
    ) AND (
      u.village = citizen_feedback.village OR u.village IS NULL
    )
  )
);
