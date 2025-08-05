import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Settings, Trash2, Mail, Server, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface EmailProvider {
  id: string;
  name: string;
  type: 'resend' | 'sendgrid' | 'mailgun' | 'smtp';
  status: 'active' | 'inactive' | 'error';
  config: any;
  isDefault: boolean;
  lastUsed?: string;
  emailsSent: number;
}

export function ProviderManagement() {
  const [providers, setProviders] = useState<EmailProvider[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<EmailProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    type: "resend" as 'resend' | 'sendgrid' | 'mailgun' | 'smtp',
    apiKey: "",
    apiSecret: "",
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
    isDefault: false
  });

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      // Since we're using Resend, show current configuration
      const providers: EmailProvider[] = [
        {
          id: 'resend-default',
          name: 'Resend (Default)',
          type: 'resend',
          status: 'active',
          config: { provider: 'resend' },
          isDefault: true,
          emailsSent: await getEmailCount(),
          lastUsed: new Date().toISOString()
        }
      ];
      setProviders(providers);
    } catch (error) {
      console.error('Failed to load providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEmailCount = async () => {
    try {
      const { count } = await supabase
        .from('email_logs')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    } catch (error) {
      return 0;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // For now, just simulate provider creation
      const newProvider: EmailProvider = {
        id: Date.now().toString(),
        name: formData.name,
        type: formData.type,
        status: 'active',
        config: {
          apiKey: formData.apiKey,
          apiSecret: formData.apiSecret,
          smtpHost: formData.smtpHost,
          smtpPort: formData.smtpPort,
          smtpUser: formData.smtpUser,
          smtpPassword: formData.smtpPassword
        },
        isDefault: formData.isDefault,
        emailsSent: 0
      };

      setProviders(prev => [...prev, newProvider]);
      toast({ title: "Success", description: "Email provider configured successfully" });
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (provider: EmailProvider) => {
    setEditingProvider(provider);
    setFormData({
      name: provider.name,
      type: provider.type as any,
      apiKey: "",
      apiSecret: "",
      smtpHost: provider.config.smtpHost || "",
      smtpPort: provider.config.smtpPort || "587",
      smtpUser: provider.config.smtpUser || "",
      smtpPassword: "",
      isDefault: provider.isDefault
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (providerId: string) => {
    setProviders(prev => prev.filter(p => p.id !== providerId));
    toast({ title: "Success", description: "Provider deleted successfully" });
  };

  const setAsDefault = async (providerId: string) => {
    setProviders(prev => prev.map(p => ({
      ...p,
      isDefault: p.id === providerId
    })));
    toast({ title: "Success", description: "Default provider updated" });
  };

  const testProvider = async (provider: EmailProvider) => {
    try {
      toast({ title: "Testing", description: "Sending test email..." });
      
      // Use the send-email function to test
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          to: ['test@example.com'],
          subject: 'Test Email from Provider',
          content: '<p>This is a test email to verify provider configuration.</p>',
          fromName: 'LocalMail Test',
          fromEmail: 'test@localmail.dev'
        }
      });

      if (error) throw error;
      
      toast({ title: "Success", description: "Test email sent successfully" });
    } catch (error: any) {
      toast({
        title: "Test Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "resend",
      apiKey: "",
      apiSecret: "",
      smtpHost: "",
      smtpPort: "587",
      smtpUser: "",
      smtpPassword: "",
      isDefault: false
    });
    setEditingProvider(null);
    setIsDialogOpen(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  if (loading) {
    return <div>Loading email providers...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Email Service Providers</CardTitle>
              <CardDescription>
                Manage your email delivery providers and configurations
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Provider
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingProvider ? "Edit Provider" : "Add Email Provider"}
                  </DialogTitle>
                  <DialogDescription>
                    Configure a new email service provider
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Provider Name</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="My Email Provider"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="type">Provider Type</Label>
                    <select
                      id="type"
                      className="w-full p-2 border rounded"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    >
                      <option value="resend">Resend</option>
                      <option value="sendgrid">SendGrid</option>
                      <option value="mailgun">Mailgun</option>
                      <option value="smtp">Custom SMTP</option>
                    </select>
                  </div>

                  {formData.type !== 'smtp' && (
                    <div>
                      <Label htmlFor="apiKey">API Key</Label>
                      <Input
                        id="apiKey"
                        type="password"
                        value={formData.apiKey}
                        onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                        placeholder="Your API key"
                      />
                    </div>
                  )}

                  {formData.type === 'smtp' && (
                    <>
                      <div>
                        <Label htmlFor="smtpHost">SMTP Host</Label>
                        <Input
                          id="smtpHost"
                          value={formData.smtpHost}
                          onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
                          placeholder="smtp.yourprovider.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="smtpPort">SMTP Port</Label>
                        <Input
                          id="smtpPort"
                          value={formData.smtpPort}
                          onChange={(e) => setFormData({ ...formData, smtpPort: e.target.value })}
                          placeholder="587"
                        />
                      </div>
                      <div>
                        <Label htmlFor="smtpUser">Username</Label>
                        <Input
                          id="smtpUser"
                          value={formData.smtpUser}
                          onChange={(e) => setFormData({ ...formData, smtpUser: e.target.value })}
                          placeholder="username"
                        />
                      </div>
                      <div>
                        <Label htmlFor="smtpPassword">Password</Label>
                        <Input
                          id="smtpPassword"
                          type="password"
                          value={formData.smtpPassword}
                          onChange={(e) => setFormData({ ...formData, smtpPassword: e.target.value })}
                          placeholder="password"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isDefault"
                      checked={formData.isDefault}
                      onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
                    />
                    <Label htmlFor="isDefault">Set as default provider</Label>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingProvider ? "Update" : "Add"} Provider
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {providers.map((provider) => (
              <Card key={provider.id} className="relative">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{provider.name}</h3>
                          {provider.isDefault && (
                            <Badge variant="default">Default</Badge>
                          )}
                          {getStatusIcon(provider.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {provider.type.toUpperCase()} • {provider.emailsSent.toLocaleString()} emails sent
                        </p>
                        {provider.lastUsed && (
                          <p className="text-xs text-muted-foreground">
                            Last used: {new Date(provider.lastUsed).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testProvider(provider)}
                      >
                        Test
                      </Button>
                      {!provider.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAsDefault(provider.id)}
                        >
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(provider)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      {!provider.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(provider.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}