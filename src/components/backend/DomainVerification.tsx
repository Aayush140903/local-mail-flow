import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Plus, 
  Check, 
  X, 
  AlertTriangle, 
  Copy, 
  RefreshCw,
  Shield,
  Mail,
  Globe,
  Info
} from "lucide-react";

interface Domain {
  id: string;
  domain: string;
  status: 'verified' | 'pending' | 'failed';
  spfRecord: string;
  dkimRecord: string;
  dmarcRecord: string;
  verified: boolean;
  createdAt: string;
  lastChecked?: string;
}

export function DomainVerification() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    domain: ""
  });

  useEffect(() => {
    loadDomains();
  }, []);

  const loadDomains = async () => {
    try {
      // Simulate loading domain data
      const mockDomains: Domain[] = [
        {
          id: '1',
          domain: 'example.com',
          status: 'verified',
          spfRecord: 'v=spf1 include:_spf.resend.com ~all',
          dkimRecord: 'resend._domainkey.example.com',
          dmarcRecord: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com',
          verified: true,
          createdAt: new Date().toISOString(),
          lastChecked: new Date().toISOString()
        }
      ];
      setDomains(mockDomains);
    } catch (error) {
      console.error('Failed to load domains:', error);
    } finally {
      setLoading(false);
    }
  };

  const addDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newDomain: Domain = {
        id: Date.now().toString(),
        domain: formData.domain,
        status: 'pending',
        spfRecord: `v=spf1 include:_spf.resend.com ~all`,
        dkimRecord: `resend._domainkey.${formData.domain}`,
        dmarcRecord: `v=DMARC1; p=quarantine; rua=mailto:dmarc@${formData.domain}`,
        verified: false,
        createdAt: new Date().toISOString()
      };

      setDomains(prev => [...prev, newDomain]);
      toast({ title: "Success", description: "Domain added for verification" });
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const verifyDomain = async (domainId: string) => {
    setVerifying(domainId);
    try {
      // Simulate verification check
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setDomains(prev => prev.map(d => 
        d.id === domainId 
          ? { ...d, status: 'verified', verified: true, lastChecked: new Date().toISOString() }
          : d
      ));
      
      toast({ title: "Success", description: "Domain verified successfully" });
    } catch (error: any) {
      setDomains(prev => prev.map(d => 
        d.id === domainId 
          ? { ...d, status: 'failed', lastChecked: new Date().toISOString() }
          : d
      ));
      
      toast({
        title: "Verification Failed",
        description: "DNS records not found or invalid",
        variant: "destructive",
      });
    } finally {
      setVerifying(null);
    }
  };

  const deleteDomain = async (domainId: string) => {
    setDomains(prev => prev.filter(d => d.id !== domainId));
    toast({ title: "Success", description: "Domain removed" });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Record copied to clipboard" });
  };

  const resetForm = () => {
    setFormData({ domain: "" });
    setIsDialogOpen(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      verified: "default",
      pending: "secondary",
      failed: "destructive"
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status}
      </Badge>
    );
  };

  if (loading) {
    return <div>Loading domain verification...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Domain Verification</CardTitle>
              <CardDescription>
                Verify your domains for email authentication and deliverability
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Domain
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Domain for Verification</DialogTitle>
                  <DialogDescription>
                    Enter your domain to set up email authentication
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={addDomain} className="space-y-4">
                  <div>
                    <Label htmlFor="domain">Domain Name</Label>
                    <Input
                      id="domain"
                      required
                      value={formData.domain}
                      onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                      placeholder="example.com"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Domain</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {domains.map((domain) => (
              <Card key={domain.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-semibold">{domain.domain}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          {getStatusIcon(domain.status)}
                          {getStatusBadge(domain.status)}
                          {domain.lastChecked && (
                            <span className="text-xs text-muted-foreground">
                              Last checked: {new Date(domain.lastChecked).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => verifyDomain(domain.id)}
                        disabled={verifying === domain.id}
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${verifying === domain.id ? 'animate-spin' : ''}`} />
                        {verifying === domain.id ? 'Verifying...' : 'Verify'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteDomain(domain.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {domain.status === 'pending' && (
                    <Alert className="mb-4">
                      <Info className="h-4 w-4" />
                      <AlertTitle>DNS Configuration Required</AlertTitle>
                      <AlertDescription>
                        Add the following DNS records to your domain to complete verification.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Tabs defaultValue="spf" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="spf">SPF Record</TabsTrigger>
                      <TabsTrigger value="dkim">DKIM Record</TabsTrigger>
                      <TabsTrigger value="dmarc">DMARC Record</TabsTrigger>
                    </TabsList>

                    <TabsContent value="spf" className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <Label className="text-sm font-medium">Record Type: TXT</Label>
                          <p className="text-sm text-muted-foreground">Host: @ (root domain)</p>
                        </div>
                        <Shield className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          readOnly
                          value={domain.spfRecord}
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(domain.spfRecord)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        SPF (Sender Policy Framework) helps prevent email spoofing by specifying which mail servers are authorized to send email from your domain.
                      </p>
                    </TabsContent>

                    <TabsContent value="dkim" className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <Label className="text-sm font-medium">Record Type: CNAME</Label>
                          <p className="text-sm text-muted-foreground">Host: resend._domainkey</p>
                        </div>
                        <Mail className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          readOnly
                          value={domain.dkimRecord}
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(domain.dkimRecord)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        DKIM (DomainKeys Identified Mail) adds a digital signature to your emails to verify they haven't been tampered with.
                      </p>
                    </TabsContent>

                    <TabsContent value="dmarc" className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <Label className="text-sm font-medium">Record Type: TXT</Label>
                          <p className="text-sm text-muted-foreground">Host: _dmarc</p>
                        </div>
                        <Shield className="h-5 w-5 text-purple-500" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          readOnly
                          value={domain.dmarcRecord}
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(domain.dmarcRecord)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        DMARC (Domain-based Message Authentication, Reporting & Conformance) tells receiving mail servers what to do if an email fails SPF or DKIM checks.
                      </p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ))}

            {domains.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No domains configured. Add a domain to get started with email authentication.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}