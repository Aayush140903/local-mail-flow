import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Mail, 
  ShoppingBag, 
  Calendar, 
  Users, 
  Newspaper, 
  Heart, 
  Briefcase,
  GraduationCap,
  Camera,
  Plane
} from 'lucide-react'

interface EmailTemplate {
  id: string
  name: string
  description: string
  category: string
  icon: React.ElementType
  preview: string
  components: any[]
  html: string
}

const emailTemplates: EmailTemplate[] = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    description: 'Perfect for onboarding new users',
    category: 'Onboarding',
    icon: Mail,
    preview: '/api/placeholder/300/200',
    html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8b5cf6; font-size: 28px; margin: 0;">Welcome to Our Platform!</h1>
        </div>
        <div style="margin-bottom: 30px;">
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
                Hi there! We're thrilled to have you join our community. Get ready to explore amazing features 
                that will help you achieve your goals.
            </p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background-color: #8b5cf6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Get Started
            </a>
        </div>
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="color: #374151; margin-top: 0;">What's Next?</h3>
            <ul style="color: #6b7280; line-height: 1.8;">
                <li>Complete your profile setup</li>
                <li>Explore our tutorial series</li>
                <li>Connect with other users</li>
            </ul>
        </div>
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 14px;">
                Need help? Reply to this email or visit our support center.
            </p>
        </div>
    </div>
</body>
</html>`,
    components: []
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    description: 'Weekly updates and news',
    category: 'Marketing',
    icon: Newspaper,
    preview: '/api/placeholder/300/200',
    html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Newsletter</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #8b5cf6, #a78bfa); padding: 30px; text-align: center;">
            <h1 style="color: white; font-size: 24px; margin: 0;">Weekly Newsletter</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Issue #42 - December 2024</p>
        </div>
        <div style="padding: 30px;">
            <h2 style="color: #374151; font-size: 20px; margin-bottom: 15px;">This Week's Highlights</h2>
            
            <div style="border-left: 4px solid #8b5cf6; padding-left: 20px; margin: 25px 0;">
                <h3 style="color: #4b5563; margin: 0 0 10px 0;">New Feature Launch</h3>
                <p style="color: #6b7280; line-height: 1.6; margin: 0;">
                    We've released an exciting new feature that will revolutionize how you work with emails.
                </p>
            </div>
            
            <div style="border-left: 4px solid #8b5cf6; padding-left: 20px; margin: 25px 0;">
                <h3 style="color: #4b5563; margin: 0 0 10px 0;">Community Spotlight</h3>
                <p style="color: #6b7280; line-height: 1.6; margin: 0;">
                    Meet Sarah, who used our platform to increase her email engagement by 300%.
                </p>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="#" style="background-color: #8b5cf6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Read Full Newsletter
                </a>
            </div>
        </div>
        <div style="background-color: #f9fafb; padding: 20px; text-align: center;">
            <p style="color: #9ca3af; font-size: 14px; margin: 0;">
                © 2024 LocalMail. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>`,
    components: []
  },
  {
    id: 'ecommerce',
    name: 'Product Launch',
    description: 'Announce new products',
    category: 'E-commerce',
    icon: ShoppingBag,
    preview: '/api/placeholder/300/200',
    html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Launch</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="padding: 30px; text-align: center;">
            <h1 style="color: #374151; font-size: 28px; margin: 0 0 10px 0;">New Product Alert!</h1>
            <p style="color: #6b7280; font-size: 16px;">The item you've been waiting for is finally here</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #f3f4f6; height: 200px; display: flex; align-items: center; justify-content: center; border-radius: 8px; margin: 0 30px;">
                <p style="color: #9ca3af; font-size: 14px;">Product Image Placeholder</p>
            </div>
        </div>
        
        <div style="padding: 0 30px;">
            <h2 style="color: #374151; font-size: 22px; text-align: center;">Premium Wireless Headphones</h2>
            <p style="color: #6b7280; line-height: 1.6; text-align: center;">
                Experience crystal-clear sound quality with our latest wireless headphones. 
                Featuring noise cancellation and 30-hour battery life.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <div style="font-size: 24px; color: #dc2626; font-weight: bold; margin-bottom: 10px;">
                    $199 <span style="font-size: 18px; color: #9ca3af; text-decoration: line-through;">$299</span>
                </div>
                <p style="color: #059669; font-size: 14px; margin: 0;">Limited time offer - 33% off!</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="background-color: #dc2626; color: white; padding: 15px 40px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px;">
                    Shop Now
                </a>
            </div>
        </div>
        
        <div style="background-color: #f9fafb; padding: 20px; margin-top: 30px;">
            <div style="text-align: center;">
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 15px 0;">Follow us for more updates:</p>
                <div style="display: inline-block;">
                    <a href="#" style="color: #8b5cf6; text-decoration: none; margin: 0 10px;">Facebook</a>
                    <a href="#" style="color: #8b5cf6; text-decoration: none; margin: 0 10px;">Twitter</a>
                    <a href="#" style="color: #8b5cf6; text-decoration: none; margin: 0 10px;">Instagram</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`,
    components: []
  },
  {
    id: 'event',
    name: 'Event Invitation',
    description: 'Invite users to events',
    category: 'Events',
    icon: Calendar,
    preview: '/api/placeholder/300/200',
    html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Invitation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 40px; text-align: center; color: white;">
            <h1 style="font-size: 28px; margin: 0 0 10px 0;">You're Invited!</h1>
            <p style="font-size: 18px; margin: 0; opacity: 0.9;">Join us for an exclusive event</p>
        </div>
        
        <div style="padding: 40px 30px;">
            <h2 style="color: #374151; font-size: 24px; text-align: center; margin: 0 0 20px 0;">
                Tech Innovation Summit 2024
            </h2>
            
            <div style="background-color: #f0fdf4; border-left: 4px solid #059669; padding: 20px; margin: 25px 0;">
                <div style="display: flex; margin-bottom: 15px;">
                    <strong style="color: #065f46; width: 80px;">Date:</strong>
                    <span style="color: #374151;">December 15, 2024</span>
                </div>
                <div style="display: flex; margin-bottom: 15px;">
                    <strong style="color: #065f46; width: 80px;">Time:</strong>
                    <span style="color: #374151;">9:00 AM - 5:00 PM PST</span>
                </div>
                <div style="display: flex; margin-bottom: 15px;">
                    <strong style="color: #065f46; width: 80px;">Venue:</strong>
                    <span style="color: #374151;">San Francisco Convention Center</span>
                </div>
                <div style="display: flex;">
                    <strong style="color: #065f46; width: 80px;">Dress:</strong>
                    <span style="color: #374151;">Business Casual</span>
                </div>
            </div>
            
            <p style="color: #6b7280; line-height: 1.6; text-align: center; margin: 30px 0;">
                Join industry leaders and innovators for a day of insights, networking, and discovering 
                the latest trends in technology. Don't miss this opportunity to connect and learn!
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="#" style="background-color: #059669; color: white; padding: 15px 35px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin-right: 15px;">
                    Accept Invitation
                </a>
                <a href="#" style="border: 2px solid #059669; color: #059669; padding: 13px 35px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                    View Details
                </a>
            </div>
        </div>
        
        <div style="background-color: #f9fafb; padding: 20px; text-align: center;">
            <p style="color: #9ca3af; font-size: 14px; margin: 0;">
                Can't attend? Let us know by replying to this email.
            </p>
        </div>
    </div>
</body>
</html>`,
    components: []
  }
]

interface EmailTemplatesProps {
  onSelectTemplate: (template: EmailTemplate) => void
}

export const EmailTemplates: React.FC<EmailTemplatesProps> = ({ onSelectTemplate }) => {
  const categories = [...new Set(emailTemplates.map(t => t.category))]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Email Templates</h2>
        <p className="text-sm text-muted-foreground">
          Choose from our professionally designed templates to get started quickly
        </p>
      </div>

      {categories.map(category => (
        <div key={category} className="space-y-3">
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{category}</Badge>
            <span className="text-sm text-muted-foreground">
              {emailTemplates.filter(t => t.category === category).length} templates
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {emailTemplates
              .filter(template => template.category === category)
              .map(template => (
                <Card 
                  key={template.id} 
                  className="cursor-pointer hover:shadow-md transition-all hover:scale-105"
                  onClick={() => onSelectTemplate(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <template.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-sm">{template.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* Template Preview */}
                    <div className="bg-muted rounded-lg p-4 mb-3 h-32 flex items-center justify-center text-xs text-muted-foreground">
                      <div className="text-center space-y-1">
                        <template.icon className="w-6 h-6 mx-auto opacity-50" />
                        <div>Email Preview</div>
                      </div>
                    </div>
                    
                    <CardDescription className="text-xs">
                      {template.description}
                    </CardDescription>
                    
                    <Button 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectTemplate(template)
                      }}
                    >
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}

      {/* Custom Template Card */}
      <div className="space-y-3">
        <Badge variant="outline">Custom</Badge>
        
        <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
          <CardContent className="p-6 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-muted rounded-lg mx-auto flex items-center justify-center">
                <Mail className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium">Start from Scratch</h3>
                <p className="text-sm text-muted-foreground">
                  Create a completely custom email using our drag-and-drop builder
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={() => onSelectTemplate({
                  id: 'blank',
                  name: 'Blank Template',
                  description: 'Start with a blank canvas',
                  category: 'Custom',
                  icon: Mail,
                  preview: '',
                  html: '',
                  components: []
                })}
              >
                Start Building
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export { emailTemplates }
export type { EmailTemplate }