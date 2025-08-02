import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Download, Trash2, Plus, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";

interface GDPRRequest {
  id: string;
  contact_email: string;
  request_type: string;
  status: string;
  requested_at: string;
  completed_at: string | null;
  data_export_url: string | null;
}

interface ConsentStats {
  opted_in: number;
  opted_out: number;
  pending: number;
  total: number;
}

export function GDPRCompliance() {
  const [requests, setRequests] = useState<GDPRRequest[]>([]);
  const [consentStats, setConsentStats] = useState<ConsentStats>({
    opted_in: 0,
    opted_out: 0,
    pending: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    contact_email: "",
    request_type: "export" as const
  });

  useEffect(() => {
    fetchRequests();
    fetchConsentStats();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('gdpr_requests')
        .select('*')
        .order('requested_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch GDPR requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchConsentStats = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('consent_status');

      if (error) throw error;

      const stats = data?.reduce((acc, contact) => {
        acc[contact.consent_status as keyof ConsentStats]++;
        acc.total++;
        return acc;
      }, {
        opted_in: 0,
        opted_out: 0,
        pending: 0,
        total: 0
      }) || { opted_in: 0, opted_out: 0, pending: 0, total: 0 };

      setConsentStats(stats);
    } catch (error) {
      console.error('Error fetching consent stats:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Verify the contact exists and belongs to the user
      const { data: contact, error: contactError } = await supabase
        .from('contacts')
        .select('id')
        .eq('email', formData.contact_email)
        .eq('user_id', user.id)
        .single();

      if (contactError || !contact) {
        throw new Error('Contact not found or does not belong to your account');
      }

      const { error } = await supabase
        .from('gdpr_requests')
        .insert({
          user_id: user.id,
          contact_email: formData.contact_email,
          request_type: formData.request_type
        });

      if (error) throw error;

      toast({ 
        title: "Success", 
        description: `GDPR ${formData.request_type} request created successfully` 
      });

      resetForm();
      fetchRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const processRequest = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      const request = requests.find(r => r.id === requestId);
      if (!request) return;

      if (action === 'approve') {
        if (request.request_type === 'delete') {
          // Delete the contact
          const { error: deleteError } = await supabase
            .from('contacts')
            .delete()
            .eq('email', request.contact_email);

          if (deleteError) throw deleteError;
        } else if (request.request_type === 'export') {
          // In a real implementation, you would generate a data export file
          // For now, we'll just mark it as completed
        }

        // Update request status
        const { error } = await supabase
          .from('gdpr_requests')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('id', requestId);

        if (error) throw error;

        toast({ 
          title: "Success", 
          description: `GDPR request ${action}d successfully` 
        });
      } else {
        // Mark as failed
        const { error } = await supabase
          .from('gdpr_requests')
          .update({ status: 'failed' })
          .eq('id', requestId);

        if (error) throw error;

        toast({ 
          title: "Success", 
          description: "GDPR request rejected" 
        });
      }

      fetchRequests();
      fetchConsentStats();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const exportAllData = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*');

      if (error) throw error;

      // Create CSV content
      const csvContent = [
        Object.keys(data[0] || {}).join(','),
        ...data.map(row => Object.values(row).map(val => 
          typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
        ).join(','))
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contacts_export_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({ 
        title: "Success", 
        description: "Contact data exported successfully" 
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      contact_email: "",
      request_type: "export"
    });
    setIsDialogOpen(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      processing: "default",
      completed: "outline",
      failed: "destructive"
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status}
      </Badge>
    );
  };

  if (loading) {
    return <div>Loading GDPR compliance data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Consent Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consentStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opted In</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{consentStats.opted_in}</div>
            <p className="text-xs text-muted-foreground">
              {consentStats.total > 0 ? Math.round((consentStats.opted_in / consentStats.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{consentStats.pending}</div>
            <p className="text-xs text-muted-foreground">
              {consentStats.total > 0 ? Math.round((consentStats.pending / consentStats.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opted Out</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{consentStats.opted_out}</div>
            <p className="text-xs text-muted-foreground">
              {consentStats.total > 0 ? Math.round((consentStats.opted_out / consentStats.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* GDPR Requests */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>GDPR Requests</CardTitle>
              <CardDescription>
                Manage data export and deletion requests
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportAllData}>
                <Download className="h-4 w-4 mr-2" />
                Export All Data
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => resetForm()}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Request
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create GDPR Request</DialogTitle>
                    <DialogDescription>
                      Create a new data export or deletion request
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="contact_email">Contact Email *</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        required
                        value={formData.contact_email}
                        onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                        placeholder="contact@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="request_type">Request Type</Label>
                      <Select
                        value={formData.request_type}
                        onValueChange={(value) => setFormData({ ...formData, request_type: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="export">Data Export</SelectItem>
                          <SelectItem value="delete">Data Deletion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                      <Button type="submit">Create Request</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact Email</TableHead>
                  <TableHead>Request Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.contact_email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {request.request_type === 'export' ? 'Data Export' : 'Data Deletion'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(request.status)}
                        {getStatusBadge(request.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(request.requested_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      {request.completed_at 
                        ? format(new Date(request.completed_at), 'MMM d, yyyy')
                        : '—'
                      }
                    </TableCell>
                    <TableCell>
                      {request.status === 'pending' && (
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => processRequest(request.id, 'approve')}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => processRequest(request.id, 'reject')}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}