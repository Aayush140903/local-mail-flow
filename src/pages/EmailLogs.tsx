import { useState } from "react"
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

// Mock data - replace with real data from your backend
const mockEmails = [
  {
    id: "1",
    to: "user@example.com",
    from: "noreply@localmail.dev", 
    subject: "Welcome to LocalMail Platform",
    status: "delivered",
    createdAt: "2024-01-15T10:30:00Z",
    deliveredAt: "2024-01-15T10:30:15Z",
    previewUrl: "https://ethereal.email/message/preview/abc123"
  },
  {
    id: "2", 
    to: "admin@company.com",
    from: "noreply@localmail.dev",
    subject: "Monthly Analytics Report", 
    status: "opened",
    createdAt: "2024-01-15T09:15:00Z",
    deliveredAt: "2024-01-15T09:15:12Z",
    openedAt: "2024-01-15T09:45:30Z",
    previewUrl: "https://ethereal.email/message/preview/def456"
  },
  {
    id: "3",
    to: "support@service.com", 
    from: "noreply@localmail.dev",
    subject: "System Maintenance Notification",
    status: "pending",
    createdAt: "2024-01-15T08:00:00Z",
    previewUrl: null
  },
  {
    id: "4",
    to: "team@startup.com",
    from: "noreply@localmail.dev", 
    subject: "Product Update v2.1.0",
    status: "failed",
    createdAt: "2024-01-15T07:30:00Z",
    error: "Invalid recipient domain",
    previewUrl: "https://ethereal.email/message/preview/ghi789"
  },
  {
    id: "5",
    to: "newsletter@blog.com",
    from: "noreply@localmail.dev",
    subject: "Weekly Newsletter - Tech Updates", 
    status: "delivered",
    createdAt: "2024-01-14T16:20:00Z",
    deliveredAt: "2024-01-14T16:20:08Z",
    previewUrl: "https://ethereal.email/message/preview/jkl012"
  }
]

export default function EmailLogs() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  const filteredEmails = mockEmails.filter((email) => {
    const matchesSearch = 
      email.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.from.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || email.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-success" />
      case "opened": 
        return <Eye className="w-4 h-4 text-primary" />
      case "pending":
        return <Clock className="w-4 h-4 text-warning" />
      case "failed":
        return <XCircle className="w-4 h-4 text-destructive" />
      default:
        return <AlertTriangle className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-success text-success-foreground">Delivered</Badge>
      case "opened":
        return <Badge className="bg-primary text-primary-foreground">Opened</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const statusCounts = {
    all: mockEmails.length,
    delivered: mockEmails.filter(e => e.status === "delivered").length,
    opened: mockEmails.filter(e => e.status === "opened").length,
    pending: mockEmails.filter(e => e.status === "pending").length,
    failed: mockEmails.filter(e => e.status === "failed").length,
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
                          {getStatusIcon(email.status)}
                          {getStatusBadge(email.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{email.to}</p>
                          <p className="text-sm text-muted-foreground">from {email.from}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{email.subject}</p>
                        {email.error && (
                          <p className="text-sm text-destructive">{email.error}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{formatDateTime(email.createdAt)}</p>
                        {email.deliveredAt && (
                          <p className="text-xs text-muted-foreground">
                            Delivered: {formatDateTime(email.deliveredAt)}
                          </p>
                        )}
                        {email.openedAt && (
                          <p className="text-xs text-muted-foreground">
                            Opened: {formatDateTime(email.openedAt)}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        {email.previewUrl && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(email.previewUrl, "_blank")}
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Preview
                          </Button>
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