
-- Check if there's a foreign key constraint on citizen_feedback.user_id that needs to be updated
-- First, let's see the current foreign key constraints
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name='citizen_feedback'
  AND kcu.column_name='user_id';

-- If there's a constraint pointing to the wrong table, we'll fix it
-- Drop the existing foreign key constraint if it exists
ALTER TABLE public.citizen_feedback 
DROP CONSTRAINT IF EXISTS citizen_feedback_user_id_fkey;

-- Add the correct foreign key constraint pointing to the users table
ALTER TABLE public.citizen_feedback 
ADD CONSTRAINT citizen_feedback_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.users(id) 
ON DELETE SET NULL;

-- Also ensure the citizen_feedback table has all required columns
ALTER TABLE public.citizen_feedback 
ADD COLUMN IF NOT EXISTS location_details TEXT,
ADD COLUMN IF NOT EXISTS sentiment TEXT;
