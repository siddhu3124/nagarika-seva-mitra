
-- Create employees table for employee login validation
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  employee_id TEXT NOT NULL UNIQUE,
  phone_number TEXT,
  district TEXT,
  mandal TEXT,
  village TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Create policy to allow employee login validation (read access for all)
CREATE POLICY "Allow employee login validation" 
ON public.employees 
FOR SELECT 
USING (true);

-- Insert some sample employee data for testing
INSERT INTO public.employees (name, department, employee_id, phone_number, district, mandal, village) VALUES
('Rajesh Kumar', 'Revenue', 'REV001', '9876543210', 'Krishna', 'Vijayawada Rural', 'Gannavaram'),
('Priya Sharma', 'Health', 'HLT001', '9876543211', 'Guntur', 'Guntur Urban', 'Guntur'),
('Venkat Reddy', 'Roads & Buildings', 'RNB001', '9876543212', 'Krishna', 'Machilipatnam', 'Machilipatnam'),
('Lakshmi Devi', 'Education', 'EDU001', '9876543213', 'Hyderabad', 'Kukatpally', 'Kukatpally'),
('Suresh Babu', 'Water Resources', 'WTR001', '9876543214', 'Rangareddy', 'Kukatpally', 'Kukatpally');
