import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { EmailBuilder } from "@/components/email-builder/EmailBuilder"
import { EmailTemplates, EmailTemplate } from "@/components/email-builder/EmailTemplates"
import { 
  Send, 
  Eye, 
  Code, 
  Save, 
  RefreshCw,
  Plus,
  X,
  Palette,
  FileText,
  Wand2
} from "lucide-react"

export default function SendEmail() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [recipients, setRecipients] = useState<string[]>([])
  const [currentRecipient, setCurrentRecipient] = useState("")
  const [activeTab, setActiveTab] = useState<'builder' | 'templates' | 'code'>('templates')
  const [emailComponents, setEmailComponents] = useState<any[]>([])
  const [formData, setFormData] = useState({
    from: "noreply@localmail.dev",
    subject: "",
    html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
        <h1 style="color: #333; text-align: center;">Welcome to LocalMail</h1>
        <p style="color: #666; line-height: 1.6;">
            This is a test email sent from your LocalMail platform. You can customize this template
            to create beautiful, responsive emails for your campaigns.
        </p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background-color: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Get Started
            </a>
        </div>
        <p style="color: #999; font-size: 12px; text-align: center;">
            © 2024 LocalMail. All rights reserved.
        </p>
    </div>
</body>
</html>`
  })

  const addRecipient = () => {
    if (currentRecipient && !recipients.includes(currentRecipient)) {
      setRecipients([...recipients, currentRecipient])
      setCurrentRecipient("")
    }
  }

  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter(r => r !== email))
  }

  const handleSend = async () => {
    if (recipients.length === 0) {
      toast({
        title: "No recipients",
        description: "Please add at least one recipient",
        variant: "destructive"
      })
      return
    }

    if (!formData.subject.trim()) {
      toast({
        title: "Missing subject",
        description: "Please add a subject line",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    
    try {
      // First create a campaign for this send
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to send emails');
      }

      const { data: campaign, error: campaignError } = await supabase.functions.invoke('create-campaign', {
        body: {
          name: `Quick Send - ${formData.subject}`,
          description: 'Quick send email campaign',
          type: 'one_time',
          subject_line: formData.subject,
          from_name: 'LocalMail',
          from_email: formData.from,
          content: formData.html
        }
      });

      if (campaignError) throw campaignError;

      // Now send the email using the campaign
      const { data: sendResult, error: sendError } = await supabase.functions.invoke('send-email', {
        body: {
          campaignId: campaign.campaign.id,
          to: recipients,
          subject: formData.subject,
          content: formData.html,
          fromName: 'LocalMail',
          fromEmail: formData.from
        }
      });

      if (sendError) throw sendError;

      toast({
        title: "Email sent successfully!",
        description: `Email sent to ${recipients.length} recipient(s)`,
      });
      
      // Reset form
      setRecipients([]);
      setFormData({
        ...formData,
        subject: "",
      });

    } catch (error: any) {
      console.error('Send email error:', error);
      toast({
        title: "Failed to send email",
        description: error.message || "An error occurred while sending the email",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handlePreview = () => {
    const previewWindow = window.open("", "_blank")
    if (previewWindow) {
      previewWindow.document.write(formData.html)
      previewWindow.document.close()
    }
  }

  const handleEmailBuilderChange = (html: string, components: any[]) => {
    setFormData(prev => ({ ...prev, html }))
    setEmailComponents(components)
  }

  const handleTemplateSelect = (template: EmailTemplate) => {
    setFormData(prev => ({ ...prev, html: template.content }))
    setEmailComponents([])
    setActiveTab('builder')
    toast({
      title: "Template Applied",
      description: `${template.name} template has been loaded`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Campaign Builder</h1>
          <p className="text-muted-foreground">Create beautiful, professional emails with our advanced builder</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSend} disabled={isLoading}>
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Send Email
          </Button>
        </div>
      </div>

      {/* Email Configuration */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Email Configuration</CardTitle>
          <CardDescription>Configure your email settings and recipients</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* From Field */}
            <div className="space-y-2">
              <Label htmlFor="from">From Email</Label>
              <Input
                id="from"
                value={formData.from}
                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                placeholder="noreply@yourcompany.com"
              />
            </div>

            {/* Subject */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="subject">Subject Line</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Your compelling email subject line"
              />
            </div>
          </div>

          {/* Recipients */}
          <div className="space-y-2">
            <Label>Recipients</Label>
            <div className="flex space-x-2">
              <Input
                value={currentRecipient}
                onChange={(e) => setCurrentRecipient(e.target.value)}
                placeholder="recipient@example.com"
                onKeyPress={(e) => e.key === "Enter" && addRecipient()}
              />
              <Button type="button" onClick={addRecipient} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {recipients.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {recipients.map((email) => (
                  <Badge key={email} variant="secondary" className="flex items-center space-x-1">
                    <span>{email}</span>
                    <button
                      onClick={() => removeRecipient(email)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Email Builder Tabs */}
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Email Content Builder</CardTitle>
              <CardDescription>Design your email using our advanced tools</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {emailComponents.length} components
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
            <div className="px-6 pb-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="templates" className="flex items-center space-x-2">
                  <Palette className="w-4 h-4" />
                  <span>Templates</span>
                </TabsTrigger>
                <TabsTrigger value="builder" className="flex items-center space-x-2">
                  <Wand2 className="w-4 h-4" />
                  <span>Visual Builder</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="flex items-center space-x-2">
                  <Code className="w-4 h-4" />
                  <span>HTML Code</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="templates" className="px-6 pb-6">
              <EmailTemplates onSelectTemplate={handleTemplateSelect} />
            </TabsContent>
            
            <TabsContent value="builder" className="p-0">
              <div className="h-[800px]">
                <EmailBuilder 
                  onContentChange={handleEmailBuilderChange}
                  initialComponents={emailComponents}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="code" className="px-6 pb-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="html-editor">HTML Code Editor</Label>
                  <Badge variant="outline" className="text-xs">Direct HTML editing</Badge>
                </div>
                <Textarea
                  id="html-editor"
                  value={formData.html}
                  onChange={(e) => setFormData({ ...formData, html: e.target.value })}
                  className="min-h-[500px] font-mono text-sm"
                  placeholder="Enter your HTML email content here..."
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email Statistics */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Campaign Insights</CardTitle>
              <CardDescription>Expected performance and recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-success">98%</div>
                  <div className="text-sm text-muted-foreground">Est. Delivery Rate</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">24%</div>
                  <div className="text-sm text-muted-foreground">Est. Open Rate</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-accent">6%</div>
                  <div className="text-sm text-muted-foreground">Est. Click Rate</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Optimization Tips:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Keep subject line under 50 characters for better mobile visibility</li>
                  <li>• Include a clear call-to-action button above the fold</li>
                  <li>• Test your email across different devices and email clients</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview & Summary Section */}
        <div className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>Real-time preview of your email</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-background max-h-96 overflow-y-auto">
                <div 
                  dangerouslySetInnerHTML={{ __html: formData.html }}
                  className="prose prose-sm max-w-none [&>*]:my-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Campaign Summary</CardTitle>
              <CardDescription>Review before sending</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Recipients:</span>
                  <span className="font-medium">{recipients.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">From:</span>
                  <span className="font-medium truncate max-w-40">{formData.from}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subject:</span>
                  <span className="font-medium truncate max-w-40">{formData.subject || "No subject"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Components:</span>
                  <span className="font-medium">{emailComponents.length}</span>
                </div>
              </div>
              
              <div className="pt-3 border-t">
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>✓ Mobile responsive design</p>
                  <p>✓ Cross-client compatibility</p>
                  <p>✓ Optimized for deliverability</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full" onClick={handlePreview}>
                <Eye className="w-4 h-4 mr-2" />
                Preview in New Tab
              </Button>
              <Button variant="outline" className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save as Template
              </Button>
              <Button variant="outline" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Export HTML
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}