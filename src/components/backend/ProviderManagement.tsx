import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Activity, AlertTriangle, CheckCircle, Mail, Server } from 'lucide-react';
import { emailService, EmailProvider } from '@/services/emailService';

export function ProviderManagement() {
  const [providers, setProviders] = useState<EmailProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<EmailProvider | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const data = await emailService.getProviders();
      setProviders(data);
    } catch (error) {
      console.error('Failed to load providers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      error: 'destructive'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>{status}</Badge>;
  };

  if (isLoading) {
    return <div>Loading providers...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Email Providers</h2>
          <p className="text-muted-foreground">Manage your email service providers and delivery settings</p>
        </div>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Add Provider
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {providers.map((provider) => (
          <Card key={provider.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">{provider.name}</CardTitle>
              <div className="flex items-center gap-2">
                {getStatusIcon(provider.status)}
                {getStatusBadge(provider.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Delivery Rate</span>
                  <span className="font-medium">{provider.deliveryRate}%</span>
                </div>
                <Progress value={provider.deliveryRate} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Monthly Usage</span>
                  <span className="font-medium">
                    {provider.used.toLocaleString()} / {provider.monthlyQuota.toLocaleString()}
                  </span>
                </div>
                <Progress 
                  value={(provider.used / provider.monthlyQuota) * 100} 
                  className="h-2"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={provider.status === 'active'} 
                    id={`provider-${provider.id}`}
                  />
                  <Label htmlFor={`provider-${provider.id}`} className="text-sm">
                    Active
                  </Label>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedProvider(provider)}
                    >
                      Configure
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Configure {provider.name}</DialogTitle>
                    </DialogHeader>
                    <ProviderConfiguration provider={provider} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Provider Card */}
      <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center space-y-2">
            <Mail className="h-8 w-8 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-medium">Add New Provider</h3>
            <p className="text-muted-foreground">Connect additional email service providers</p>
            <Button variant="outline" className="mt-4">
              <Server className="mr-2 h-4 w-4" />
              Add Provider
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProviderConfiguration({ provider }: { provider: EmailProvider }) {
  const [config, setConfig] = useState({
    apiKey: '',
    webhookUrl: '',
    defaultFromEmail: '',
    replyToEmail: '',
    trackingDomain: '',
    suppressionList: true,
    dedicatedIP: false
  });

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="authentication">Auth</TabsTrigger>
        <TabsTrigger value="tracking">Tracking</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your API key"
              value={config.apiKey}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="defaultFrom">Default From Email</Label>
            <Input
              id="defaultFrom"
              type="email"
              placeholder="noreply@yourdomain.com"
              value={config.defaultFromEmail}
              onChange={(e) => setConfig({ ...config, defaultFromEmail: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="replyTo">Reply-To Email</Label>
            <Input
              id="replyTo"
              type="email"
              placeholder="support@yourdomain.com"
              value={config.replyToEmail}
              onChange={(e) => setConfig({ ...config, replyToEmail: e.target.value })}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="authentication" className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input
              id="webhookUrl"
              placeholder="https://yourapp.com/webhooks/email"
              value={config.webhookUrl}
              onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trackingDomain">Tracking Domain</Label>
            <Input
              id="trackingDomain"
              placeholder="track.yourdomain.com"
              value={config.trackingDomain}
              onChange={(e) => setConfig({ ...config, trackingDomain: e.target.value })}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="tracking" className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="suppressionList" 
              checked={config.suppressionList}
              onCheckedChange={(checked) => setConfig({ ...config, suppressionList: checked })}
            />
            <Label htmlFor="suppressionList">Enable Suppression List</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              id="dedicatedIP" 
              checked={config.dedicatedIP}
              onCheckedChange={(checked) => setConfig({ ...config, dedicatedIP: checked })}
            />
            <Label htmlFor="dedicatedIP">Use Dedicated IP</Label>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="advanced" className="space-y-4">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Advanced configuration options for {provider.name}
          </p>
          
          <div className="rounded-lg border p-4 space-y-2">
            <h4 className="font-medium">Rate Limiting</h4>
            <p className="text-sm text-muted-foreground">
              Configure sending limits and throttling for this provider
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hourlyLimit">Hourly Limit</Label>
                <Input id="hourlyLimit" placeholder="10000" />
              </div>
              <div>
                <Label htmlFor="dailyLimit">Daily Limit</Label>
                <Input id="dailyLimit" placeholder="100000" />
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline">Test Connection</Button>
        <Button>Save Configuration</Button>
      </div>
    </Tabs>
  );
}