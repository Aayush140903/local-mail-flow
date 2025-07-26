import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Download, 
  RefreshCw,
  Lock,
  Users,
  Globe,
  Server
} from "lucide-react";

interface SecurityEvent {
  id: string;
  type: "login" | "permission_change" | "data_access" | "failed_login" | "api_call";
  user: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  location: string;
  severity: "low" | "medium" | "high" | "critical";
}

interface SecurityMetric {
  name: string;
  score: number;
  status: "good" | "warning" | "critical";
  description: string;
  recommendations?: string[];
}

export function SecurityAudit() {
  const [selectedTab, setSelectedTab] = useState("overview");
  
  const [securityEvents] = useState<SecurityEvent[]>([
    {
      id: "1",
      type: "login",
      user: "john@company.com",
      action: "Successful login",
      timestamp: "2024-01-26T10:30:00Z",
      ipAddress: "192.168.1.1",
      location: "New York, US",
      severity: "low"
    },
    {
      id: "2",
      type: "failed_login",
      user: "unknown@domain.com",
      action: "Failed login attempt",
      timestamp: "2024-01-26T09:15:00Z",
      ipAddress: "45.33.22.11",
      location: "Unknown",
      severity: "medium"
    },
    {
      id: "3",
      type: "permission_change",
      user: "admin@company.com",
      action: "Changed user role from viewer to editor",
      timestamp: "2024-01-26T08:45:00Z",
      ipAddress: "192.168.1.5",
      location: "California, US",
      severity: "high"
    },
    {
      id: "4",
      type: "data_access",
      user: "jane@company.com",
      action: "Exported contact list",
      timestamp: "2024-01-26T07:20:00Z",
      ipAddress: "192.168.1.3",
      location: "Texas, US",
      severity: "medium"
    }
  ]);

  const [securityMetrics] = useState<SecurityMetric[]>([
    {
      name: "Password Security",
      score: 85,
      status: "good",
      description: "Most users have strong passwords and 2FA enabled"
    },
    {
      name: "Access Control",
      score: 92,
      status: "good",
      description: "Proper role-based access control implemented"
    },
    {
      name: "API Security",
      score: 78,
      status: "warning",
      description: "Some API keys haven't been rotated recently",
      recommendations: ["Rotate API keys older than 90 days", "Enable API rate limiting"]
    },
    {
      name: "Data Encryption",
      score: 95,
      status: "good",
      description: "All data encrypted in transit and at rest"
    },
    {
      name: "Audit Logging",
      score: 88,
      status: "good",
      description: "Comprehensive logging enabled for all actions"
    },
    {
      name: "Network Security",
      score: 65,
      status: "warning",
      description: "Some connections from unusual locations detected",
      recommendations: ["Enable IP whitelisting", "Review VPN access policies"]
    }
  ]);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical": return <Badge variant="destructive">Critical</Badge>;
      case "high": return <Badge className="bg-orange-500 text-white">High</Badge>;
      case "medium": return <Badge className="bg-yellow-500 text-white">Medium</Badge>;
      case "low": return <Badge variant="secondary">Low</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning": return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "critical": return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  const overallSecurityScore = Math.round(
    securityMetrics.reduce((acc, metric) => acc + metric.score, 0) / securityMetrics.length
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Security & Audit</h2>
          <p className="text-muted-foreground">Monitor security events and audit trails</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Score
                </CardTitle>
                <CardDescription>Overall security health of your organization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{overallSecurityScore}%</span>
                    {getStatusIcon(overallSecurityScore >= 80 ? "good" : "warning")}
                  </div>
                  <Progress value={overallSecurityScore} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {overallSecurityScore >= 90 ? "Excellent security posture" :
                     overallSecurityScore >= 80 ? "Good security with room for improvement" :
                     "Security needs attention"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Last 24 hours security events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Successful logins</span>
                    <Badge variant="secondary">24</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Failed attempts</span>
                    <Badge className="bg-yellow-500 text-white">3</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Permission changes</span>
                    <Badge className="bg-orange-500 text-white">2</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data exports</span>
                    <Badge variant="secondary">7</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Security Metrics</CardTitle>
              <CardDescription>Detailed breakdown of security components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {securityMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(metric.status)}
                        <span className="font-medium">{metric.name}</span>
                      </div>
                      <span className="text-sm font-medium">{metric.score}%</span>
                    </div>
                    <Progress value={metric.score} className="h-2" />
                    <p className="text-sm text-muted-foreground">{metric.description}</p>
                    {metric.recommendations && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {metric.recommendations.map((rec, i) => (
                              <li key={i}>{rec}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Security Events
              </CardTitle>
              <CardDescription>
                Chronological log of all security-related events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {securityEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{event.user}</div>
                          <div className="text-sm text-muted-foreground">{event.ipAddress}</div>
                        </div>
                      </TableCell>
                      <TableCell>{event.action}</TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(event.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>{getSeverityBadge(event.severity)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  GDPR Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data processing consent</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Right to be forgotten</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data portability</span>
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Breach notification</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  SOC 2 Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Security controls</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Availability monitoring</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Processing integrity</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Confidentiality measures</span>
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  Security Policies
                </CardTitle>
                <CardDescription>Configure and manage security policies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Password Policy</h4>
                      <p className="text-sm text-muted-foreground">Minimum 8 characters, special characters required</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Required for all admin users</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Session Timeout</h4>
                      <p className="text-sm text-muted-foreground">Auto-logout after 4 hours of inactivity</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">IP Restrictions</h4>
                      <p className="text-sm text-muted-foreground">Allow access only from approved IP ranges</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}