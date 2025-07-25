import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, AlertTriangle, Copy, RefreshCw, Globe, Shield, Mail } from 'lucide-react';
import { emailService } from '@/services/emailService';
import { toast } from '@/hooks/use-toast';

interface DomainRecord {
  type: string;
  name: string;
  value: string;
  status: 'verified' | 'pending' | 'failed';
  ttl?: number;
}

export function DomainVerification() {
  const [domain, setDomain] = useState('');
  const [verification, setVerification] = useState<any>(null);
  const [reputation, setReputation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState<DomainRecord[]>([]);

  useEffect(() => {
    // Generate DNS records for the domain
    if (domain) {
      generateDNSRecords(domain);
    }
  }, [domain]);

  const generateDNSRecords = (domainName: string) => {
    const dnsRecords: DomainRecord[] = [
      {
        type: 'SPF',
        name: domainName,
        value: 'v=spf1 include:_spf.mailgun.org include:sendgrid.net ~all',
        status: 'pending',
        ttl: 3600
      },
      {
        type: 'DKIM',
        name: `mail._domainkey.${domainName}`,
        value: 'v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDrExx...',
        status: 'pending',
        ttl: 3600
      },
      {
        type: 'DMARC',
        name: `_dmarc.${domainName}`,
        value: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com',
        status: 'pending',
        ttl: 3600
      },
      {
        type: 'MX',
        name: domainName,
        value: '10 mail.yourdomain.com',
        status: 'pending',
        ttl: 3600
      },
      {
        type: 'CNAME',
        name: `mail.${domainName}`,
        value: 'mailgun.org',
        status: 'pending',
        ttl: 3600
      }
    ];
    setRecords(dnsRecords);
  };

  const verifyDomain = async () => {
    if (!domain) return;
    
    setIsLoading(true);
    try {
      const [verificationResult, reputationResult] = await Promise.all([
        emailService.verifyDomain(domain),
        emailService.getDomainReputation(domain)
      ]);
      
      setVerification(verificationResult);
      setReputation(reputationResult);

      // Update record statuses based on verification
      setRecords(prev => prev.map(record => ({
        ...record,
        status: getRecordStatus(record.type.toLowerCase(), verificationResult)
      })));

    } catch (error) {
      console.error('Verification failed:', error);
      toast({
        title: "Verification Failed",
        description: "Failed to verify domain. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRecordStatus = (type: string, verification: any): 'verified' | 'pending' | 'failed' => {
    switch (type) {
      case 'spf':
        return verification.spf ? 'verified' : 'failed';
      case 'dkim':
        return verification.dkim ? 'verified' : 'failed';
      case 'dmarc':
        return verification.dmarc ? 'verified' : 'failed';
      case 'mx':
        return verification.mxRecord ? 'verified' : 'failed';
      default:
        return 'pending';
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: "DNS record copied to clipboard",
      });
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      verified: 'default',
      failed: 'destructive',
      pending: 'secondary'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Domain Verification</h2>
        <p className="text-muted-foreground">
          Verify your domain for email authentication and improve deliverability
        </p>
      </div>

      {/* Domain Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Domain Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="domain">Domain Name</Label>
              <Input
                id="domain"
                placeholder="yourdomain.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={verifyDomain} 
                disabled={!domain || isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Shield className="h-4 w-4" />
                )}
                Verify Domain
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="dns-records" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dns-records">DNS Records</TabsTrigger>
          <TabsTrigger value="verification">Verification Status</TabsTrigger>
          <TabsTrigger value="reputation">Domain Reputation</TabsTrigger>
        </TabsList>

        <TabsContent value="dns-records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>DNS Configuration</CardTitle>
              <p className="text-sm text-muted-foreground">
                Add these DNS records to your domain provider to enable email authentication
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>TTL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Badge variant="outline">{record.type}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {record.name}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate font-mono text-sm">
                          {record.value}
                        </div>
                      </TableCell>
                      <TableCell>{record.ttl}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.status)}
                          {getStatusBadge(record.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(record.value)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-4">
          {verification ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">SPF Record</CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    {verification.spf ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className={verification.spf ? 'text-green-600' : 'text-red-600'}>
                      {verification.spf ? 'Verified' : 'Not Found'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">DKIM Record</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    {verification.dkim ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className={verification.dkim ? 'text-green-600' : 'text-red-600'}>
                      {verification.dkim ? 'Verified' : 'Not Found'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">DMARC Record</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    {verification.dmarc ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className={verification.dmarc ? 'text-green-600' : 'text-red-600'}>
                      {verification.dmarc ? 'Verified' : 'Not Found'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">MX Record</CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    {verification.mxRecord ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className={verification.mxRecord ? 'text-green-600' : 'text-red-600'}>
                      {verification.mxRecord ? 'Verified' : 'Not Found'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center space-y-2">
                  <Shield className="h-8 w-8 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-medium">Domain Not Verified</h3>
                  <p className="text-muted-foreground">Enter a domain and click verify to check DNS records</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reputation" className="space-y-4">
          {reputation ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Domain Reputation Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl font-bold text-primary">{reputation.score}</div>
                      <div className="flex-1">
                        <div className="text-lg font-medium">{reputation.status} Reputation</div>
                        <div className="text-sm text-muted-foreground">
                          Score range: 0-100 (higher is better)
                        </div>
                      </div>
                    </div>
                    
                    {reputation.blacklisted.length > 0 && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Your domain is blacklisted on: {reputation.blacklisted.join(', ')}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {reputation.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center space-y-2">
                  <Shield className="h-8 w-8 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-medium">No Reputation Data</h3>
                  <p className="text-muted-foreground">Verify a domain to see reputation information</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}