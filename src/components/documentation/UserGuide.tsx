import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  Settings, 
  Mail, 
  Users, 
  BarChart3, 
  Zap, 
  HelpCircle,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Key,
  Database,
  Send,
  Eye,
  Palette,
  Target,
  TrendingUp,
  Shield,
  Clock
} from "lucide-react";

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
  details?: string[];
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

export function UserGuide() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const quickStartSteps: Step[] = [
    {
      title: "Create Your Account",
      description: "Sign up with your email and verify your account",
      icon: <CheckCircle className="w-5 h-5" />,
      details: [
        "Click 'Sign Up' and enter your email address",
        "Check your email for verification link",
        "Complete your profile setup",
        "Choose your plan (Free tier available)"
      ]
    },
    {
      title: "Configure Email Provider",
      description: "Set up your email sending provider (Required)",
      icon: <Settings className="w-5 h-5" />,
      details: [
        "Navigate to Infrastructure > Email Providers",
        "Choose from supported providers (Resend, SendGrid, Mailgun, etc.)",
        "Enter your API key from your email provider",
        "Test the connection to ensure it's working",
        "Set as default provider"
      ]
    },
    {
      title: "Import Your Contacts",
      description: "Add contacts to start sending emails",
      icon: <Users className="w-5 h-5" />,
      details: [
        "Go to Contacts page",
        "Click 'Import Contacts' or 'Add Contact'",
        "Upload CSV file or add manually",
        "Create contact lists for better organization",
        "Ensure GDPR compliance settings"
      ]
    },
    {
      title: "Create Your First Campaign",
      description: "Design and send your first email",
      icon: <Mail className="w-5 h-5" />,
      details: [
        "Navigate to Send Email page",
        "Configure sender details (From name, email)",
        "Write compelling subject line",
        "Select your audience (contacts, lists, or segments)",
        "Choose or design your email template",
        "Preview and test before sending"
      ]
    },
    {
      title: "Monitor Performance",
      description: "Track your email campaign analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      details: [
        "Visit Analytics page to see campaign performance",
        "Monitor open rates, click rates, and deliverability",
        "View detailed logs in Email Logs section",
        "Use insights to improve future campaigns",
        "Set up automated reporting"
      ]
    }
  ];

  const features = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Campaign Builder",
      description: "Visual drag-and-drop email builder with professional templates",
      capabilities: ["Visual Builder", "HTML Editor", "Template Library", "Mobile Responsive"]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Contact Management",
      description: "Organize and segment your audience effectively",
      capabilities: ["Contact Lists", "Advanced Segmentation", "GDPR Compliance", "Import/Export"]
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Automation & Drips",
      description: "Set up automated email sequences and triggers",
      capabilities: ["Drip Campaigns", "Behavioral Triggers", "A/B Testing", "Scheduling"]
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Advanced Analytics",
      description: "Track performance with detailed insights",
      capabilities: ["Real-time Metrics", "Custom Reports", "Conversion Tracking", "Heatmaps"]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "Enterprise-grade security and compliance",
      capabilities: ["SSO Integration", "Team Management", "Audit Logs", "Data Privacy"]
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Infrastructure",
      description: "Robust email delivery infrastructure",
      capabilities: ["Multiple Providers", "Domain Verification", "IP Warming", "Deliverability"]
    }
  ];

  const requirements = [
    {
      icon: <Key className="w-5 h-5" />,
      title: "Email Provider API Key",
      description: "Required to send emails",
      details: "You need an account with one of our supported providers (Resend, SendGrid, Mailgun, etc.) and their API key.",
      priority: "Critical"
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: "Contact List",
      description: "Recipients for your campaigns",
      details: "Import contacts via CSV or add manually. Ensure you have consent to email them.",
      priority: "Required"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Domain Verification",
      description: "Improve deliverability",
      details: "Verify your sending domain to improve email deliverability and sender reputation.",
      priority: "Recommended"
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: "Email Content",
      description: "Professional email design",
      details: "Use our templates or create custom designs with our visual builder.",
      priority: "Required"
    }
  ];

  const faqs: FAQ[] = [
    {
      question: "Do I need technical knowledge to use this platform?",
      answer: "No! Our platform is designed for non-technical users. The visual email builder, drag-and-drop interface, and pre-built templates make it easy for anyone to create professional emails.",
      category: "Getting Started"
    },
    {
      question: "Which email providers do you support?",
      answer: "We support major email providers including Resend, SendGrid, Mailgun, Amazon SES, and more. You'll need an account with one of these providers to send emails.",
      category: "Setup"
    },
    {
      question: "How do I improve my email deliverability?",
      answer: "Follow these best practices: verify your domain, maintain good sender reputation, use double opt-in for contacts, avoid spam trigger words, and monitor your analytics regularly.",
      category: "Deliverability"
    },
    {
      question: "Can I import my existing contact list?",
      answer: "Yes! You can import contacts via CSV file. Make sure your file includes email addresses and any additional fields you want to import. Ensure you have proper consent to email these contacts.",
      category: "Contacts"
    },
    {
      question: "What's the difference between lists and segments?",
      answer: "Lists are static groups of contacts you manually create. Segments are dynamic groups based on criteria (like location, engagement, etc.) that automatically update as contacts meet or don't meet the criteria.",
      category: "Contacts"
    },
    {
      question: "How do I track email performance?",
      answer: "Visit the Analytics page to see real-time metrics including open rates, click rates, bounces, and unsubscribes. You can also view detailed logs for each email sent.",
      category: "Analytics"
    },
    {
      question: "Can I schedule emails for later?",
      answer: "Yes! When creating a campaign, you can schedule it to send at a specific date and time. You can also set up automated drip campaigns.",
      category: "Campaigns"
    },
    {
      question: "Is my data secure and GDPR compliant?",
      answer: "Yes! We take data security seriously. The platform includes GDPR compliance tools, secure data storage, and features to help you manage consent and data requests.",
      category: "Security"
    },
    {
      question: "What happens if my email provider fails?",
      answer: "You can configure multiple email providers as backup. If your primary provider fails, the system can automatically use your backup provider to ensure delivery.",
      category: "Reliability"
    },
    {
      question: "How much does it cost to send emails?",
      answer: "Sending costs depend on your email provider's pricing. Our platform doesn't charge extra for sending - you only pay your email provider's rates plus our platform subscription.",
      category: "Pricing"
    }
  ];

  const faqCategories = [...new Set(faqs.map(faq => faq.category))];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <BookOpen className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">LocalMail User Guide</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Complete guide to using LocalMail for professional email marketing campaigns
        </p>
        <Badge variant="secondary" className="text-sm">
          Version 1.0 - Updated January 2024
        </Badge>
      </div>

      {/* Platform Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Platform Overview</span>
          </CardTitle>
          <CardDescription>
            LocalMail is a comprehensive email marketing platform that helps you create, send, and track professional email campaigns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {feature.description}
                </p>
                <div className="space-y-1">
                  {feature.capabilities.map((capability, capIndex) => (
                    <div key={capIndex} className="flex items-center space-x-2 text-xs">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>{capability}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Start Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Quick Start Guide</span>
          </CardTitle>
          <CardDescription>
            Follow these steps to get started with LocalMail in minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quickStartSteps.map((step, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex items-center space-x-2">
                      {step.icon}
                      <h3 className="font-semibold">{step.title}</h3>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveStep(activeStep === index ? null : index)}
                  >
                    <ChevronRight className={`w-4 h-4 transition-transform ${activeStep === index ? 'rotate-90' : ''}`} />
                  </Button>
                </div>
                <p className="text-muted-foreground mt-2 ml-11">
                  {step.description}
                </p>
                {activeStep === index && step.details && (
                  <div className="mt-4 ml-11 space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-start space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>Requirements & Setup</span>
          </CardTitle>
          <CardDescription>
            What you need before sending your first email campaign
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requirements.map((req, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {req.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold">{req.title}</h3>
                      <Badge 
                        variant={req.priority === 'Critical' ? 'destructive' : req.priority === 'Required' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {req.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {req.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {req.details}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5" />
            <span>Frequently Asked Questions</span>
          </CardTitle>
          <CardDescription>
            Common questions and answers about using LocalMail
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={faqCategories[0]} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
              {faqCategories.map((category) => (
                <TabsTrigger key={category} value={category} className="text-xs">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {faqCategories.map((category) => (
              <TabsContent key={category} value={category} className="mt-6">
                <div className="space-y-4">
                  {faqs.filter(faq => faq.category === category).map((faq, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">{faq.question}</h3>
                      <p className="text-sm text-muted-foreground">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Support Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Need More Help?</span>
          </CardTitle>
          <CardDescription>
            Additional resources and support options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border rounded-lg">
              <BookOpen className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Documentation</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Detailed guides and API documentation
              </p>
              <Button variant="outline" size="sm">
                View Docs
              </Button>
            </div>
            
            <div className="text-center p-6 border rounded-lg">
              <HelpCircle className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Live Chat Support</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get help from our support team
              </p>
              <Button variant="outline" size="sm">
                Start Chat
              </Button>
            </div>
            
            <div className="text-center p-6 border rounded-lg">
              <Users className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Community</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Join our community forum
              </p>
              <Button variant="outline" size="sm">
                Join Forum
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}