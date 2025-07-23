import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Send, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Mail,
  Users,
  Activity
} from "lucide-react"

export default function Dashboard() {
  // Mock data - replace with real data from your backend
  const stats = {
    totalSent: 12534,
    deliveryRate: 98.5,
    openRate: 24.3,
    clickRate: 6.7,
    recentEmails: [
      { id: 1, to: "user@example.com", subject: "Welcome to our platform", status: "delivered", time: "2 minutes ago" },
      { id: 2, to: "admin@company.com", subject: "Monthly report", status: "opened", time: "5 minutes ago" },
      { id: 3, to: "support@service.com", subject: "System notification", status: "pending", time: "10 minutes ago" },
      { id: 4, to: "team@startup.com", subject: "Product update", status: "failed", time: "15 minutes ago" },
    ]
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge variant="default" className="bg-success text-success-foreground">Delivered</Badge>
      case "opened":
        return <Badge variant="default" className="bg-primary text-primary-foreground">Opened</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-primary rounded-xl p-8 text-white shadow-glow">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to LocalMail</h1>
            <p className="text-white/90 text-lg">Your local-first email platform is ready to send beautiful emails</p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <Mail className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emails Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.deliveryRate}%</div>
            <div className="mt-2">
              <Progress value={stats.deliveryRate} className="w-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+2.1%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clickRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+0.5%</span> from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Recent Emails</span>
            </CardTitle>
            <CardDescription>Latest email activity from your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentEmails.map((email) => (
                <div key={email.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <p className="font-medium text-sm truncate">{email.subject}</p>
                    <p className="text-xs text-muted-foreground">{email.to}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(email.status)}
                    <span className="text-xs text-muted-foreground">{email.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" size="lg">
              <Send className="w-4 h-4 mr-2" />
              Send New Email
            </Button>
            <Button variant="outline" className="w-full justify-start" size="lg">
              <Activity className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
            <Button variant="outline" className="w-full justify-start" size="lg">
              <Users className="w-4 h-4 mr-2" />
              Manage Contacts
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}