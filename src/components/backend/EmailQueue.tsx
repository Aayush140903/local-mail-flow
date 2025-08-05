import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  RefreshCw, 
  Play, 
  Pause, 
  Trash2, 
  Search, 
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send
} from "lucide-react";

interface QueueItem {
  id: string;
  recipient_email: string;
  subject: string;
  status: string;
  created_at: string;
  sent_at?: string;
  error_message?: string;
  campaign_id?: string;
}

export function EmailQueue() {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchQueueItems();
    // Set up real-time updates
    const interval = setInterval(fetchQueueItems, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchQueueItems = async () => {
    try {
      const { data, error } = await supabase
        .from('email_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setQueueItems(data || []);
    } catch (error) {
      console.error('Failed to fetch queue items:', error);
    } finally {
      setLoading(false);
    }
  };

  const retryFailedEmails = async () => {
    setIsProcessing(true);
    try {
      const failedEmails = queueItems.filter(item => item.status === 'failed');
      
      for (const email of failedEmails) {
        // Retry sending through edge function
        const { error } = await supabase.functions.invoke('send-email', {
          body: {
            to: [email.recipient_email],
            subject: email.subject,
            content: '<p>Retry email content</p>',
            fromName: 'LocalMail',
            fromEmail: 'noreply@localmail.dev'
          }
        });

        if (!error) {
          await supabase
            .from('email_logs')
            .update({ status: 'sent', sent_at: new Date().toISOString() })
            .eq('id', email.id);
        }
      }

      fetchQueueItems();
      toast({ title: "Success", description: `Retried ${failedEmails.length} failed emails` });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to retry emails",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('email_logs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchQueueItems();
      toast({ title: "Success", description: "Queue item deleted" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const clearCompleted = async () => {
    try {
      const { error } = await supabase
        .from('email_logs')
        .delete()
        .eq('status', 'sent');

      if (error) throw error;
      fetchQueueItems();
      toast({ title: "Success", description: "Completed items cleared" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
      case 'bounced':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "default",
      sent: "default", 
      failed: "destructive",
      bounced: "destructive"
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status}
      </Badge>
    );
  };

  const filteredItems = queueItems.filter(item => {
    const matchesSearch = item.recipient_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    pending: queueItems.filter(i => i.status === 'pending').length,
    sent: queueItems.filter(i => i.status === 'sent').length,
    failed: queueItems.filter(i => i.status === 'failed').length,
    bounced: queueItems.filter(i => i.status === 'bounced').length
  };

  if (loading) {
    return <div>Loading email queue...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sent</p>
                <p className="text-2xl font-bold">{stats.sent}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold">{stats.failed}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bounced</p>
                <p className="text-2xl font-bold">{stats.bounced}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Email Queue</CardTitle>
              <CardDescription>
                Monitor and manage email delivery queue
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={retryFailedEmails}
                disabled={isProcessing || stats.failed === 0}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
                Retry Failed
              </Button>
              <Button
                variant="outline"
                onClick={clearCompleted}
                disabled={stats.sent === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Sent
              </Button>
              <Button variant="outline" onClick={fetchQueueItems}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="bounced">Bounced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(item.status)}
                        {getStatusBadge(item.status)}
                      </div>
                    </TableCell>
                    <TableCell>{item.recipient_email}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {item.subject || '—'}
                    </TableCell>
                    <TableCell>
                      {new Date(item.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {item.sent_at ? new Date(item.sent_at).toLocaleString() : '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {item.status === 'failed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => retryFailedEmails()}
                            title="Retry"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteItem(item.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No queue items found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}