import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { 
  Search, 
  Filter, 
  ExternalLink, 
  RefreshCw,
  Download,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react"
import { format } from "date-fns"

interface EmailLog {
  id: string;
  recipient_email: string;
  subject: string | null;
  status: string;
  sent_at: string | null;
  delivered_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  bounced_at: string | null;
  error_message: string | null;
  created_at: string;
  campaign_id: string | null;
}

export default function EmailLogs() {
  const [logs, setLogs] = useState<EmailLog[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchEmailLogs()
  }, [])

  const fetchEmailLogs = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('email_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) throw error
      setLogs(data || [])
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch email logs',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredEmails = logs.filter((log) => {
    const matchesSearch = 
      log.recipient_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || log.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (log: EmailLog) => {
    if (log.bounced_at || log.status === 'failed') {
      return <XCircle className="w-4 h-4 text-destructive" />
    }
    if (log.clicked_at) {
      return <CheckCircle className="w-4 h-4 text-success" />
    }
    if (log.opened_at) {
      return <Eye className="w-4 h-4 text-primary" />
    }
    if (log.delivered_at || log.status === 'sent') {
      return <CheckCircle className="w-4 h-4 text-success" />
    }
    if (log.status === 'pending') {
      return <Clock className="w-4 h-4 text-warning" />
    }
    return <AlertTriangle className="w-4 h-4 text-muted-foreground" />
  }

  const getStatusBadge = (log: EmailLog) => {
    if (log.bounced_at) {
      return <Badge variant="destructive">Bounced</Badge>
    }
    if (log.clicked_at) {
      return <Badge className="bg-success text-success-foreground">Clicked</Badge>
    }
    if (log.opened_at) {
      return <Badge className="bg-primary text-primary-foreground">Opened</Badge>
    }
    if (log.delivered_at || log.status === 'sent') {
      return <Badge className="bg-success text-success-foreground">Delivered</Badge>
    }
    if (log.status === 'failed') {
      return <Badge variant="destructive">Failed</Badge>
    }
    return <Badge variant="secondary">Pending</Badge>
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const handleRefresh = () => {
    fetchEmailLogs()
  }

  const statusCounts = {
    all: logs.length,
    delivered: logs.filter(e => e.status === "sent" || e.delivered_at).length,
    opened: logs.filter(e => e.opened_at).length,
    pending: logs.filter(e => e.status === "pending").length,
    failed: logs.filter(e => e.status === "failed" || e.bounced_at).length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Logs</h1>
          <p className="text-muted-foreground">Track and monitor all your email activity</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
              <span className="text-sm font-medium">All</span>
            </div>
            <p className="text-2xl font-bold mt-2">{statusCounts.all}</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm font-medium">Delivered</span>
            </div>
            <p className="text-2xl font-bold mt-2">{statusCounts.delivered}</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm font-medium">Opened</span>
            </div>
            <p className="text-2xl font-bold mt-2">{statusCounts.opened}</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span className="text-sm font-medium">Pending</span>
            </div>
            <p className="text-2xl font-bold mt-2">{statusCounts.pending}</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-destructive rounded-full"></div>
              <span className="text-sm font-medium">Failed</span>
            </div>
            <p className="text-2xl font-bold mt-2">{statusCounts.failed}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Email Activity</CardTitle>
          <CardDescription>View and search through your email history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search emails by recipient, subject, or sender..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="opened">Opened</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Sent Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmails.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No emails found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmails.map((email) => (
                    <TableRow key={email.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(email)}
                          {getStatusBadge(email)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{email.recipient_email}</p>
                          <p className="text-sm text-muted-foreground">Campaign Email</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{email.subject || 'No subject'}</p>
                        {email.error_message && (
                          <p className="text-sm text-destructive">{email.error_message}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{formatDateTime(email.created_at)}</p>
                        {email.delivered_at && (
                          <p className="text-xs text-muted-foreground">
                            Delivered: {formatDateTime(email.delivered_at)}
                          </p>
                        )}
                        {email.opened_at && (
                          <p className="text-xs text-muted-foreground">
                            Opened: {formatDateTime(email.opened_at)}
                          </p>
                        )}
                        {email.clicked_at && (
                          <p className="text-xs text-success">
                            Clicked: {formatDateTime(email.clicked_at)}
                          </p>
                        )}
                        {email.bounced_at && (
                          <p className="text-xs text-destructive">
                            Bounced: {formatDateTime(email.bounced_at)}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        {email.campaign_id && (
                          <Badge variant="outline" className="text-xs">
                            Campaign ID: {email.campaign_id.slice(0, 8)}...
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}