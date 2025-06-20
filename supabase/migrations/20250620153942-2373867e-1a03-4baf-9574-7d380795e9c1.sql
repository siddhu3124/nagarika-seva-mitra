
-- Create feedback/complaints table
CREATE TABLE public.feedbacks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  citizen_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL CHECK (service_type IN ('roads', 'water', 'ration', 'phc', 'education', 'electricity', 'grievances')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  location_details TEXT,
  district TEXT,
  mandal TEXT,
  village TEXT,
  assigned_official_id UUID REFERENCES public.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audit logs table
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_values JSONB,
  new_values JSONB,
  user_id UUID REFERENCES auth.users(id),
  user_role TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create expanded location hierarchy
CREATE TABLE public.states (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.districts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  state_id UUID REFERENCES public.states(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(state_id, name)
);

CREATE TABLE public.mandals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  district_id UUID REFERENCES public.districts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(district_id, name)
);

CREATE TABLE public.villages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mandal_id UUID REFERENCES public.mandals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  population INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(mandal_id, name)
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'success', 'error')),
  category TEXT CHECK (category IN ('feedback_update', 'message', 'system', 'announcement')),
  read_at TIMESTAMP WITH TIME ZONE,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create file uploads table
CREATE TABLE public.file_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  feedback_id UUID REFERENCES public.feedbacks(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  bucket_name TEXT NOT NULL DEFAULT 'feedback-attachments',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('feedback-attachments', 'feedback-attachments', true);

-- Enable Row Level Security
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mandals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.villages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for feedbacks
CREATE POLICY "Citizens can view their own feedbacks" ON public.feedbacks
  FOR SELECT USING (citizen_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Citizens can create their own feedbacks" ON public.feedbacks
  FOR INSERT WITH CHECK (citizen_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Citizens can update their own feedbacks" ON public.feedbacks
  FOR UPDATE USING (citizen_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Officials can view feedbacks in their jurisdiction" ON public.feedbacks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role = 'official'
      AND users.district = feedbacks.district
      AND users.mandal = feedbacks.mandal
    )
  );

CREATE POLICY "Officials can update feedbacks in their jurisdiction" ON public.feedbacks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role = 'official'
      AND users.district = feedbacks.district
      AND users.mandal = feedbacks.mandal
    )
  );

-- RLS Policies for audit logs (read-only for admins)
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role = 'official'
    )
  );

-- RLS Policies for location tables (readable by all authenticated users)
CREATE POLICY "Location tables readable by authenticated users" ON public.states
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Location tables readable by authenticated users" ON public.districts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Location tables readable by authenticated users" ON public.mandals
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Location tables readable by authenticated users" ON public.villages
  FOR SELECT TO authenticated USING (true);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Officials can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() 
      AND role = 'official'
    )
  );

-- RLS Policies for file uploads
CREATE POLICY "Users can view their own files" ON public.file_uploads
  FOR SELECT USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can upload their own files" ON public.file_uploads
  FOR INSERT WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Officials can view files in their jurisdiction" ON public.file_uploads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users u, public.feedbacks f
      WHERE u.auth_user_id = auth.uid() 
      AND u.role = 'official'
      AND f.id = file_uploads.feedback_id
      AND u.district = f.district
      AND u.mandal = f.mandal
    )
  );

-- Storage policies for feedback-attachments bucket
CREATE POLICY "Users can upload their own files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'feedback-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own files" ON storage.objects
  FOR SELECT USING (bucket_id = 'feedback-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Officials can view files in their jurisdiction" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'feedback-attachments' AND
    EXISTS (
      SELECT 1 FROM public.users u, public.file_uploads fu, public.feedbacks f
      WHERE u.auth_user_id = auth.uid() 
      AND u.role = 'official'
      AND fu.storage_path = name
      AND f.id = fu.feedback_id
      AND u.district = f.district
      AND u.mandal = f.mandal
    )
  );

-- Insert sample location data
INSERT INTO public.states (name, code) VALUES 
('Andhra Pradesh', 'AP'),
('Telangana', 'TS');

INSERT INTO public.districts (state_id, name, code) 
SELECT s.id, d.name, d.code FROM public.states s, (VALUES 
  ('Krishna', 'KRS'),
  ('Guntur', 'GTR'),
  ('Hyderabad', 'HYD'),
  ('Rangareddy', 'RNG')
) AS d(name, code) WHERE s.code IN ('AP', 'TS');

INSERT INTO public.mandals (district_id, name, code)
SELECT d.id, m.name, m.code FROM public.districts d, (VALUES
  ('Vijayawada Rural', 'VJR'),
  ('Machilipatnam', 'MCH'),
  ('Guntur Urban', 'GTU'),
  ('Kukatpally', 'KKP')
) AS m(name, code) WHERE d.code IN ('KRS', 'GTR', 'HYD');

INSERT INTO public.villages (mandal_id, name, code, population)
SELECT m.id, v.name, v.code, v.population FROM public.mandals m, (VALUES
  ('Gannavaram', 'GNV', 50000),
  ('Machilipatnam', 'MCH', 180000),
  ('Guntur', 'GTR', 650000),
  ('Kukatpally', 'KKP', 200000)
) AS v(name, code, population) WHERE m.code IN ('VJR', 'MCH', 'GTU', 'KKP');

-- Create function to automatically create audit log entries
CREATE OR REPLACE FUNCTION public.create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (table_name, record_id, action, old_values, user_id, user_role)
    VALUES (TG_TABLE_NAME, OLD.id, TG_OP, to_jsonb(OLD), auth.uid(), 
            (SELECT role FROM public.users WHERE auth_user_id = auth.uid()));
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (table_name, record_id, action, old_values, new_values, user_id, user_role)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(OLD), to_jsonb(NEW), auth.uid(),
            (SELECT role FROM public.users WHERE auth_user_id = auth.uid()));
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (table_name, record_id, action, new_values, user_id, user_role)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(NEW), auth.uid(),
            (SELECT role FROM public.users WHERE auth_user_id = auth.uid()));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for audit logging on important tables
CREATE TRIGGER audit_users_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();

CREATE TRIGGER audit_feedbacks_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.feedbacks
  FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();

CREATE TRIGGER audit_messages_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();

-- Create function to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_feedbacks_updated_at
  BEFORE UPDATE ON public.feedbacks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for important tables
ALTER TABLE public.feedbacks REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.feedbacks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
