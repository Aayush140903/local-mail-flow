-- Create email templates table
CREATE TABLE public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'custom',
  content TEXT NOT NULL,
  thumbnail_url TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view email templates" 
ON public.email_templates 
FOR SELECT 
USING (auth.uid() = user_id OR is_default = true);

CREATE POLICY "Users can create their own templates" 
ON public.email_templates 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates" 
ON public.email_templates 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates" 
ON public.email_templates 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create user settings table
CREATE TABLE public.user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  default_from_name TEXT,
  default_from_email TEXT,
  default_reply_to TEXT,
  email_signature TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own settings" 
ON public.user_settings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own settings" 
ON public.user_settings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" 
ON public.user_settings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create campaign drafts table
CREATE TABLE public.campaign_drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  draft_data JSONB NOT NULL DEFAULT '{}',
  last_saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.campaign_drafts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own drafts" 
ON public.campaign_drafts 
FOR ALL 
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_email_templates_updated_at
BEFORE UPDATE ON public.email_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
BEFORE UPDATE ON public.user_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default email templates
INSERT INTO public.email_templates (id, user_id, name, description, category, content, is_default) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'Welcome Newsletter', 'Clean welcome email template', 'onboarding', 
'<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Welcome!</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 0;">
                <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Welcome to Our Community!</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px;">Hello {{firstName}},</h2>
                            <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                                We''re thrilled to have you join our community! You''re now part of something special.
                            </p>
                            <p style="margin: 0 0 30px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                                Here''s what you can expect from us:
                            </p>
                            <ul style="margin: 0 0 30px 0; padding-left: 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                                <li>Weekly updates and insights</li>
                                <li>Exclusive content and offers</li>
                                <li>Community support and resources</li>
                            </ul>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="{{ctaLink}}" style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">Get Started</a>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px 30px; background-color: #f8f9fa; text-align: center;">
                            <p style="margin: 0; color: #999999; font-size: 14px;">
                                If you have any questions, reply to this email or contact us at support@company.com
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>', true),

(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'Product Launch', 'Announce new products and features', 'marketing', 
'<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>New Product Launch</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 0;">
                <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff;">
                    <tr>
                        <td style="padding: 0;">
                            <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=200&fit=crop" alt="Product Launch" style="width: 100%; height: 200px; object-fit: cover; display: block;">
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h1 style="margin: 0 0 20px 0; color: #333333; font-size: 32px; font-weight: bold;">🚀 Introducing Our Latest Innovation</h1>
                            <p style="margin: 0 0 20px 0; color: #666666; font-size: 18px; line-height: 1.6;">
                                We''re excited to share something we''ve been working on for months. Our new {{productName}} is here!
                            </p>
                            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <h3 style="margin: 0 0 15px 0; color: #333333; font-size: 20px;">Key Features:</h3>
                                <ul style="margin: 0; padding-left: 20px; color: #666666; font-size: 16px; line-height: 1.8;">
                                    <li>Feature 1: Enhanced performance</li>
                                    <li>Feature 2: Better user experience</li>
                                    <li>Feature 3: Advanced integrations</li>
                                </ul>
                            </div>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="{{ctaLink}}" style="display: inline-block; padding: 15px 30px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 18px; font-weight: bold;">Learn More</a>
                            </div>
                            <p style="margin: 20px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                Limited time offer: Get 20% off with code LAUNCH20
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>', true),

(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'Order Confirmation', 'Transaction confirmation template', 'transactional', 
'<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 0;">
                <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff;">
                    <tr>
                        <td style="padding: 30px; border-bottom: 2px solid #28a745;">
                            <h1 style="margin: 0; color: #333333; font-size: 24px;">Order Confirmation</h1>
                            <p style="margin: 10px 0 0 0; color: #28a745; font-size: 16px; font-weight: bold;">✓ Your order has been confirmed</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px;">
                            <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px;">
                                Hi {{customerName}}, thank you for your order! Here are the details:
                            </p>
                            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <h3 style="margin: 0 0 15px 0; color: #333333; font-size: 18px;">Order Details</h3>
                                <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;"><strong>Order Number:</strong> {{orderNumber}}</p>
                                <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;"><strong>Order Date:</strong> {{orderDate}}</p>
                                <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;"><strong>Total Amount:</strong> {{totalAmount}}</p>
                                <p style="margin: 0; color: #666666; font-size: 14px;"><strong>Estimated Delivery:</strong> {{deliveryDate}}</p>
                            </div>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="{{trackingLink}}" style="display: inline-block; padding: 12px 25px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">Track Your Order</a>
                            </div>
                            <p style="margin: 20px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                We''ll send you shipping updates as soon as your order is on its way.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>', true);