import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { UserProfile } from "@/components/profile/UserProfile"
import { PageTooltip } from "@/components/shared/PageTooltip"
import { supabase } from "@/integrations/supabase/client"
import { 
  Settings as SettingsIcon, 
  Save, 
  Mail, 
  Server, 
  Shield, 
  Bell,
  Palette,
  Database,
  User
} from "lucide-react"

import React from "react";

export default function Settings() {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  // Settings state
  const [emailSettings, setEmailSettings] = useState({
    defaultFromEmail: "noreply@localmail.dev",
    defaultFromName: "LocalMail Platform",
    replyToEmail: "support@localmail.dev",
    bounceEmail: "bounce@localmail.dev"
  })

  // Load settings on component mount
  React.useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: settings } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (settings) {
        setEmailSettings({
          defaultFromEmail: settings.default_from_email || "noreply@localmail.dev",
          defaultFromName: settings.default_from_name || "LocalMail Platform",
          replyToEmail: settings.default_reply_to || "support@localmail.dev",
          bounceEmail: "bounce@localmail.dev"
        });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const [serverSettings, setServerSettings] = useState({
    smtpHost: "localhost",
    smtpPort: "1025",
    smtpUser: "",
    smtpPassword: "",
    useEthereal: true,
    maxEmailsPerHour: "1000",
    queueRetries: "3"
  })

  const [securitySettings, setSecuritySettings] = useState({
    apiRateLimit: "100",
    requireApiKeyAuth: true,
    enableCors: true,
    allowedOrigins: "http://localhost:3000",
    sessionTimeout: "24"
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailDeliveryFailures: true,
    queueHealth: true,
    apiErrors: true,
    dailyReports: false,
    webhookUrl: ""
  })

  const handleSave = async (section: string) => {
    setIsSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in');

      if (section === 'Email') {
        const { error } = await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            default_from_name: emailSettings.defaultFromName,
            default_from_email: emailSettings.defaultFromEmail,
            default_reply_to: emailSettings.replyToEmail,
          });

        if (error) throw error;
      }

      toast({
        title: "Settings saved",
        description: `${section} settings have been updated successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Configure your LocalMail platform settings</p>
          </div>
          <PageTooltip 
            title="Settings Guide"
            description="Configure your platform settings for optimal performance"
            features={[
              {
                title: "Profile Settings",
                description: "Manage your personal profile information",
                steps: ["Update display name", "Change avatar", "Set company info", "Update contact details"]
              },
              {
                title: "Email Settings",
                description: "Configure default email settings",
                steps: ["Set default from email", "Set default from name", "Configure reply-to address", "Set email signature"]
              },
              {
                title: "Server Settings",
                description: "Configure SMTP and server options",
                steps: ["Set SMTP credentials", "Configure sending limits", "Set retry policies", "Test connection"]
              }
            ]}
          />
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center space-x-2">
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">Email</span>
          </TabsTrigger>
          <TabsTrigger value="server" className="flex items-center space-x-2">
            <Server className="w-4 h-4" />
            <span className="hidden sm:inline">Server</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center space-x-2">
            <Database className="w-4 h-4" />
            <span className="hidden sm:inline">Database</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <UserProfile />
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Email Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure default email settings and sender information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="defaultFromEmail">Default From Email</Label>
                  <Input
                    id="defaultFromEmail"
                    value={emailSettings.defaultFromEmail}
                    onChange={(e) => setEmailSettings({
                      ...emailSettings,
                      defaultFromEmail: e.target.value
                    })}
                    placeholder="noreply@yourcompany.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultFromName">Default From Name</Label>
                  <Input
                    id="defaultFromName"
                    value={emailSettings.defaultFromName}
                    onChange={(e) => setEmailSettings({
                      ...emailSettings,
                      defaultFromName: e.target.value
                    })}
                    placeholder="Your Company Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="replyToEmail">Reply-To Email</Label>
                  <Input
                    id="replyToEmail"
                    value={emailSettings.replyToEmail}
                    onChange={(e) => setEmailSettings({
                      ...emailSettings,
                      replyToEmail: e.target.value
                    })}
                    placeholder="support@yourcompany.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bounceEmail">Bounce Email</Label>
                  <Input
                    id="bounceEmail"
                    value={emailSettings.bounceEmail}
                    onChange={(e) => setEmailSettings({
                      ...emailSettings,
                      bounceEmail: e.target.value
                    })}
                    placeholder="bounce@yourcompany.com"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("Email")} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Server Settings */}
        <TabsContent value="server">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="w-5 h-5" />
                <span>Server Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure SMTP settings and email processing options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Ethereal Email Toggle */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label>Use Ethereal Email (Development)</Label>
                  <p className="text-sm text-muted-foreground">
                    Use Ethereal for email previews instead of real SMTP
                  </p>
                </div>
                <Switch
                  checked={serverSettings.useEthereal}
                  onCheckedChange={(checked) => setServerSettings({
                    ...serverSettings,
                    useEthereal: checked
                  })}
                />
              </div>

              {!serverSettings.useEthereal && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={serverSettings.smtpHost}
                      onChange={(e) => setServerSettings({
                        ...serverSettings,
                        smtpHost: e.target.value
                      })}
                      placeholder="smtp.yourprovider.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      value={serverSettings.smtpPort}
                      onChange={(e) => setServerSettings({
                        ...serverSettings,
                        smtpPort: e.target.value
                      })}
                      placeholder="587"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpUser">SMTP Username</Label>
                    <Input
                      id="smtpUser"
                      value={serverSettings.smtpUser}
                      onChange={(e) => setServerSettings({
                        ...serverSettings,
                        smtpUser: e.target.value
                      })}
                      placeholder="your-username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={serverSettings.smtpPassword}
                      onChange={(e) => setServerSettings({
                        ...serverSettings,
                        smtpPassword: e.target.value
                      })}
                      placeholder="your-password"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxEmailsPerHour">Max Emails Per Hour</Label>
                  <Input
                    id="maxEmailsPerHour"
                    value={serverSettings.maxEmailsPerHour}
                    onChange={(e) => setServerSettings({
                      ...serverSettings,
                      maxEmailsPerHour: e.target.value
                    })}
                    placeholder="1000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="queueRetries">Queue Retry Attempts</Label>
                  <Input
                    id="queueRetries"
                    value={serverSettings.queueRetries}
                    onChange={(e) => setServerSettings({
                      ...serverSettings,
                      queueRetries: e.target.value
                    })}
                    placeholder="3"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("Server")} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Security Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure API security and access control settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="apiRateLimit">API Rate Limit (per minute)</Label>
                  <Input
                    id="apiRateLimit"
                    value={securitySettings.apiRateLimit}
                    onChange={(e) => setSecuritySettings({
                      ...securitySettings,
                      apiRateLimit: e.target.value
                    })}
                    placeholder="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                  <Input
                    id="sessionTimeout"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({
                      ...securitySettings,
                      sessionTimeout: e.target.value
                    })}
                    placeholder="24"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label>Require API Key Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      All API requests must include a valid API key
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.requireApiKeyAuth}
                    onCheckedChange={(checked) => setSecuritySettings({
                      ...securitySettings,
                      requireApiKeyAuth: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label>Enable CORS</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow cross-origin requests from specified domains
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.enableCors}
                    onCheckedChange={(checked) => setSecuritySettings({
                      ...securitySettings,
                      enableCors: checked
                    })}
                  />
                </div>
              </div>

              {securitySettings.enableCors && (
                <div className="space-y-2">
                  <Label htmlFor="allowedOrigins">Allowed Origins</Label>
                  <Textarea
                    id="allowedOrigins"
                    value={securitySettings.allowedOrigins}
                    onChange={(e) => setSecuritySettings({
                      ...securitySettings,
                      allowedOrigins: e.target.value
                    })}
                    placeholder="http://localhost:3000, https://yourapp.com"
                    rows={3}
                  />
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={() => handleSave("Security")} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notification Settings</span>
              </CardTitle>
              <CardDescription>
                Configure alerts and monitoring notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label>Email Delivery Failures</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when emails fail to deliver
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailDeliveryFailures}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      emailDeliveryFailures: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label>Queue Health Monitoring</Label>
                    <p className="text-sm text-muted-foreground">
                      Alerts for queue processing issues
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.queueHealth}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      queueHealth: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label>API Errors</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications for API errors and rate limit hits
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.apiErrors}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      apiErrors: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label>Daily Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive daily summary reports via email
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.dailyReports}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      dailyReports: checked
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL (Optional)</Label>
                <Input
                  id="webhookUrl"
                  value={notificationSettings.webhookUrl}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    webhookUrl: e.target.value
                  })}
                  placeholder="https://your-app.com/webhooks/localmail"
                />
                <p className="text-sm text-muted-foreground">
                  Receive notifications via webhook instead of email
                </p>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("Notifications")} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Settings */}
        <TabsContent value="database">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>Database Configuration</span>
              </CardTitle>
              <CardDescription>
                Database connection and maintenance settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Current Database</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  You're currently using SQLite for local development
                </p>
                <div className="text-sm space-y-1">
                  <p><strong>Type:</strong> SQLite</p>
                  <p><strong>File:</strong> ./packages/db/prisma/dev.db</p>
                  <p><strong>Status:</strong> <span className="text-success">Connected</span></p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Database Actions</h4>
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      Backup Database
                    </Button>
                    <Button variant="outline">
                      Run Migrations
                    </Button>
                    <Button variant="outline">
                      Reset Database
                    </Button>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 text-yellow-800 dark:text-yellow-200">
                    Production Setup
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    For production use, migrate to PostgreSQL by updating your DATABASE_URL 
                    and running prisma migrations.
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("Database")} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}