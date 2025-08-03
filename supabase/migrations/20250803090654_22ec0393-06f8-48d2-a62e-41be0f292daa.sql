-- Create campaigns table
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'one_time', -- 'one_time', 'drip', 'trigger'
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'scheduled', 'running', 'paused', 'completed'
  subject_line TEXT,
  from_name TEXT,
  from_email TEXT,
  reply_to_email TEXT,
  preheader TEXT,
  template_id UUID,
  segment_id UUID,
  contact_list_id UUID,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaign emails table (for drip campaigns)
CREATE TABLE public.campaign_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  subject_line TEXT NOT NULL,
  content TEXT NOT NULL,
  delay_days INTEGER NOT NULL DEFAULT 0,
  delay_hours INTEGER NOT NULL DEFAULT 0,
  sequence_order INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaign variants table (for A/B testing)
CREATE TABLE public.campaign_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  subject_line TEXT,
  content TEXT,
  from_name TEXT,
  variant_type TEXT NOT NULL DEFAULT 'subject', -- 'subject', 'content', 'from_name', 'send_time'
  traffic_percentage INTEGER NOT NULL DEFAULT 50,
  is_winner BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaign analytics table
CREATE TABLE public.campaign_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL,
  variant_id UUID,
  user_id UUID NOT NULL,
  total_sent INTEGER DEFAULT 0,
  total_delivered INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0,
  total_bounced INTEGER DEFAULT 0,
  total_unsubscribed INTEGER DEFAULT 0,
  open_rate DECIMAL(5,2) DEFAULT 0,
  click_rate DECIMAL(5,2) DEFAULT 0,
  bounce_rate DECIMAL(5,2) DEFAULT 0,
  unsubscribe_rate DECIMAL(5,2) DEFAULT 0,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create automation triggers table
CREATE TABLE public.automation_triggers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL,
  user_id UUID NOT NULL,
  trigger_type TEXT NOT NULL, -- 'contact_added', 'tag_added', 'date_based', 'behavior'
  trigger_conditions JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_triggers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for campaigns
CREATE POLICY "Users can view their own campaigns" 
  ON public.campaigns FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own campaigns" 
  ON public.campaigns FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns" 
  ON public.campaigns FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaigns" 
  ON public.campaigns FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for campaign emails
CREATE POLICY "Users can view their own campaign emails" 
  ON public.campaign_emails FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own campaign emails" 
  ON public.campaign_emails FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaign emails" 
  ON public.campaign_emails FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaign emails" 
  ON public.campaign_emails FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for campaign variants
CREATE POLICY "Users can view their own campaign variants" 
  ON public.campaign_variants FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own campaign variants" 
  ON public.campaign_variants FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaign variants" 
  ON public.campaign_variants FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaign variants" 
  ON public.campaign_variants FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for campaign analytics
CREATE POLICY "Users can view their own campaign analytics" 
  ON public.campaign_analytics FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own campaign analytics" 
  ON public.campaign_analytics FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaign analytics" 
  ON public.campaign_analytics FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for automation triggers
CREATE POLICY "Users can view their own automation triggers" 
  ON public.automation_triggers FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own automation triggers" 
  ON public.automation_triggers FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own automation triggers" 
  ON public.automation_triggers FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own automation triggers" 
  ON public.automation_triggers FOR DELETE 
  USING (auth.uid() = user_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaign_emails_updated_at
  BEFORE UPDATE ON public.campaign_emails
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaign_variants_updated_at
  BEFORE UPDATE ON public.campaign_variants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaign_analytics_updated_at
  BEFORE UPDATE ON public.campaign_analytics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_automation_triggers_updated_at
  BEFORE UPDATE ON public.automation_triggers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_campaigns_type ON public.campaigns(type);
CREATE INDEX idx_campaigns_scheduled_at ON public.campaigns(scheduled_at);

CREATE INDEX idx_campaign_emails_campaign_id ON public.campaign_emails(campaign_id);
CREATE INDEX idx_campaign_emails_user_id ON public.campaign_emails(user_id);
CREATE INDEX idx_campaign_emails_sequence_order ON public.campaign_emails(sequence_order);

CREATE INDEX idx_campaign_variants_campaign_id ON public.campaign_variants(campaign_id);
CREATE INDEX idx_campaign_variants_user_id ON public.campaign_variants(user_id);

CREATE INDEX idx_campaign_analytics_campaign_id ON public.campaign_analytics(campaign_id);
CREATE INDEX idx_campaign_analytics_user_id ON public.campaign_analytics(user_id);

CREATE INDEX idx_automation_triggers_campaign_id ON public.automation_triggers(campaign_id);
CREATE INDEX idx_automation_triggers_user_id ON public.automation_triggers(user_id);