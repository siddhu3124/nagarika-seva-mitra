
-- Create users table to store citizen and official profiles
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('citizen', 'official')),
  age INTEGER,
  gender TEXT,
  locality TEXT,
  district TEXT,
  mandal TEXT,
  village TEXT,
  department TEXT,
  employee_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create officials table for validating government official credentials
CREATE TABLE public.officials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  employee_id TEXT NOT NULL UNIQUE,
  phone_number TEXT NOT NULL,
  district TEXT,
  mandal TEXT,
  village TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table for official-to-citizen communication
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  target_roles TEXT[] NOT NULL,
  district TEXT,
  mandal TEXT,
  village TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = auth_user_id);

-- Create RLS policies for officials table (read-only for validation)
CREATE POLICY "Officials table is readable by authenticated users" ON public.officials
  FOR SELECT TO authenticated USING (true);

-- Create RLS policies for messages table
CREATE POLICY "Citizens can view messages targeting them" ON public.messages
  FOR SELECT TO authenticated USING (
    'citizen' = ANY(target_roles) AND 
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role = 'citizen'
      AND users.district = messages.district
      AND users.mandal = messages.mandal  
      AND users.village = messages.village
    )
  );

CREATE POLICY "Officials can view and create messages" ON public.messages
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role = 'official'
    )
  );

-- Insert some sample officials for testing
INSERT INTO public.officials (name, department, employee_id, phone_number, district, mandal, village) VALUES
('राज कुमार', 'Public Works Department', 'PWD001', '+919876543210', 'Krishna', 'Vijayawada Rural', 'Gannavaram'),
('सुनीता शर्मा', 'Health Department', 'HD002', '+919876543211', 'Guntur', 'Guntur Urban', 'Guntur'),
('अमित पटेल', 'Education Department', 'ED003', '+919876543212', 'Krishna', 'Machilipatnam', 'Machilipatnam');
