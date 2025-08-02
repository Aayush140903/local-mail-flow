-- Create contact lists table
CREATE TABLE public.contact_lists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contacts table
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  company TEXT,
  tags TEXT[],
  custom_fields JSONB DEFAULT '{}',
  consent_status TEXT DEFAULT 'pending' CHECK (consent_status IN ('pending', 'opted_in', 'opted_out')),
  consent_date TIMESTAMP WITH TIME ZONE,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, email)
);

-- Create contact list memberships table
CREATE TABLE public.contact_list_memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  list_id UUID NOT NULL REFERENCES public.contact_lists(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(contact_id, list_id)
);

-- Create segments table for advanced segmentation
CREATE TABLE public.segments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  criteria JSONB NOT NULL,
  contact_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create GDPR data requests table
CREATE TABLE public.gdpr_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  contact_email TEXT NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('export', 'delete')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  data_export_url TEXT
);

-- Enable RLS on all tables
ALTER TABLE public.contact_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_list_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gdpr_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for contact_lists
CREATE POLICY "Users can view their own contact lists" 
ON public.contact_lists 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own contact lists" 
ON public.contact_lists 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contact lists" 
ON public.contact_lists 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contact lists" 
ON public.contact_lists 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for contacts
CREATE POLICY "Users can view their own contacts" 
ON public.contacts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own contacts" 
ON public.contacts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contacts" 
ON public.contacts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contacts" 
ON public.contacts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for contact_list_memberships
CREATE POLICY "Users can view contact list memberships for their contacts" 
ON public.contact_list_memberships 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.contacts 
    WHERE contacts.id = contact_list_memberships.contact_id 
    AND contacts.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create contact list memberships for their contacts" 
ON public.contact_list_memberships 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.contacts 
    WHERE contacts.id = contact_list_memberships.contact_id 
    AND contacts.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete contact list memberships for their contacts" 
ON public.contact_list_memberships 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.contacts 
    WHERE contacts.id = contact_list_memberships.contact_id 
    AND contacts.user_id = auth.uid()
  )
);

-- Create RLS policies for segments
CREATE POLICY "Users can view their own segments" 
ON public.segments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own segments" 
ON public.segments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own segments" 
ON public.segments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own segments" 
ON public.segments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for gdpr_requests
CREATE POLICY "Users can view their own GDPR requests" 
ON public.gdpr_requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own GDPR requests" 
ON public.gdpr_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own GDPR requests" 
ON public.gdpr_requests 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_contact_lists_updated_at
BEFORE UPDATE ON public.contact_lists
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
BEFORE UPDATE ON public.contacts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_segments_updated_at
BEFORE UPDATE ON public.segments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_contacts_user_id ON public.contacts(user_id);
CREATE INDEX idx_contacts_email ON public.contacts(email);
CREATE INDEX idx_contacts_consent_status ON public.contacts(consent_status);
CREATE INDEX idx_contact_lists_user_id ON public.contact_lists(user_id);
CREATE INDEX idx_contact_list_memberships_contact_id ON public.contact_list_memberships(contact_id);
CREATE INDEX idx_contact_list_memberships_list_id ON public.contact_list_memberships(list_id);
CREATE INDEX idx_segments_user_id ON public.segments(user_id);
CREATE INDEX idx_gdpr_requests_user_id ON public.gdpr_requests(user_id);
CREATE INDEX idx_gdpr_requests_status ON public.gdpr_requests(status);