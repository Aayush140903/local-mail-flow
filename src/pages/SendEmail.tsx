import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { 
  Send, 
  Eye, 
  Code, 
  Save, 
  RefreshCw,
  Plus,
  X
} from "lucide-react"

export default function SendEmail() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [recipients, setRecipients] = useState<string[]>([])
  const [currentRecipient, setCurrentRecipient] = useState("")
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
    
    // Simulate sending email
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Email queued successfully!",
        description: `Email sent to ${recipients.length} recipient(s)`,
      })
      
      // Reset form
      setRecipients([])
      setFormData({
        ...formData,
        subject: "",
      })
    }, 2000)
  }

  const handlePreview = () => {
    const previewWindow = window.open("", "_blank")
    if (previewWindow) {
      previewWindow.document.write(formData.html)
      previewWindow.document.close()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Send Email</h1>
          <p className="text-muted-foreground">Create and send beautiful emails to your recipients</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Email Details</CardTitle>
              <CardDescription>Configure your email settings and recipients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* From Field */}
              <div className="space-y-2">
                <Label htmlFor="from">From</Label>
                <Input
                  id="from"
                  value={formData.from}
                  onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  placeholder="noreply@yourcompany.com"
                />
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

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Your email subject line"
                />
              </div>
            </CardContent>
          </Card>

          {/* Email Content */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="w-5 h-5" />
                <span>Email Content</span>
              </CardTitle>
              <CardDescription>Write your email in HTML format</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.html}
                onChange={(e) => setFormData({ ...formData, html: e.target.value })}
                className="min-h-[400px] font-mono text-sm"
                placeholder="Enter your HTML email content here..."
              />
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Email Preview</CardTitle>
              <CardDescription>See how your email will look</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-muted/50 max-h-96 overflow-y-auto">
                <div 
                  dangerouslySetInnerHTML={{ __html: formData.html }}
                  className="prose prose-sm max-w-none"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Sending Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Recipients:</span>
                <span className="font-medium">{recipients.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">From:</span>
                <span className="font-medium truncate">{formData.from}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subject:</span>
                <span className="font-medium truncate">{formData.subject || "No subject"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}