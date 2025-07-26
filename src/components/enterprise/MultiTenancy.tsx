import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { 
  Building2, 
  Plus, 
  MoreVertical, 
  Users, 
  Database, 
  Settings, 
  Globe,
  Shield,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Tenant {
  id: string;
  name: string;
  domain: string;
  plan: "starter" | "professional" | "enterprise";
  status: "active" | "suspended" | "trial";
  createdAt: string;
  userCount: number;
  emailsSent: number;
  customBranding: boolean;
  apiAccess: boolean;
  ssoEnabled: boolean;
}

interface ResourceQuota {
  name: string;
  used: number;
  limit: number;
  unit: string;
}

export function MultiTenancy() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("tenants");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTenantName, setNewTenantName] = useState("");
  const [newTenantDomain, setNewTenantDomain] = useState("");
  const [newTenantPlan, setNewTenantPlan] = useState<"starter" | "professional" | "enterprise">("starter");

  const [tenants] = useState<Tenant[]>([
    {
      id: "1",
      name: "Acme Corp",
      domain: "acme.myapp.com",
      plan: "enterprise",
      status: "active",
      createdAt: "2024-01-01",
      userCount: 25,
      emailsSent: 15420,
      customBranding: true,
      apiAccess: true,
      ssoEnabled: true
    },
    {
      id: "2",
      name: "StartupXYZ",
      domain: "startup.myapp.com",
      plan: "professional",
      status: "active",
      createdAt: "2024-01-15",
      userCount: 8,
      emailsSent: 3250,
      customBranding: true,
      apiAccess: true,
      ssoEnabled: false
    },
    {
      id: "3",
      name: "Beta Tester Inc",
      domain: "beta.myapp.com",
      plan: "starter",
      status: "trial",
      createdAt: "2024-01-20",
      userCount: 3,
      emailsSent: 150,
      customBranding: false,
      apiAccess: false,
      ssoEnabled: false
    }
  ]);

  const [resourceQuotas] = useState<ResourceQuota[]>([
    { name: "Total Users", used: 36, limit: 100, unit: "users" },
    { name: "Email Volume", used: 18820, limit: 50000, unit: "emails/month" },
    { name: "Storage", used: 2.4, limit: 10, unit: "GB" },
    { name: "API Calls", used: 12500, limit: 25000, unit: "calls/month" },
    { name: "Custom Domains", used: 3, limit: 10, unit: "domains" }
  ]);

  const handleCreateTenant = () => {
    if (!newTenantName || !newTenantDomain) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Tenant Created",
      description: `Successfully created tenant: ${newTenantName}`,
    });

    setNewTenantName("");
    setNewTenantDomain("");
    setIsCreateOpen(false);
  };

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case "enterprise": return "destructive";
      case "professional": return "default";
      case "starter": return "secondary";
      default: return "outline";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "trial": return "secondary";
      case "suspended": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Multi-Tenant Management</h2>
          <p className="text-muted-foreground">Manage tenants, quotas, and resource allocation</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Tenant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Tenant</DialogTitle>
              <DialogDescription>
                Set up a new tenant organization with their own isolated environment
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Organization Name</Label>
                <Input
                  id="name"
                  placeholder="Acme Corporation"
                  value={newTenantName}
                  onChange={(e) => setNewTenantName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="domain">Subdomain</Label>
                <div className="flex">
                  <Input
                    id="domain"
                    placeholder="acme"
                    value={newTenantDomain}
                    onChange={(e) => setNewTenantDomain(e.target.value)}
                    className="rounded-r-none"
                  />
                  <div className="flex items-center px-3 border border-l-0 rounded-r-md bg-muted text-muted-foreground">
                    .myapp.com
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="plan">Plan</Label>
                <Select value={newTenantPlan} onValueChange={(value: any) => setNewTenantPlan(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateTenant} className="w-full">
                Create Tenant
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="quotas">Resource Quotas</TabsTrigger>
          <TabsTrigger value="isolation">Data Isolation</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="tenants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Tenant Organizations ({tenants.length})
              </CardTitle>
              <CardDescription>
                Manage all tenant organizations and their configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Email Volume</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenants.map((tenant) => (
                    <TableRow key={tenant.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{tenant.name}</div>
                          <div className="text-sm text-muted-foreground">{tenant.domain}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPlanBadgeVariant(tenant.plan)}>
                          {tenant.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(tenant.status)}>
                          {tenant.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          {tenant.userCount}
                        </div>
                      </TableCell>
                      <TableCell>{tenant.emailsSent.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {tenant.customBranding && (
                            <Badge variant="outline" className="text-xs">Branding</Badge>
                          )}
                          {tenant.apiAccess && (
                            <Badge variant="outline" className="text-xs">API</Badge>
                          )}
                          {tenant.ssoEnabled && (
                            <Badge variant="outline" className="text-xs">SSO</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Configuration</DropdownMenuItem>
                            <DropdownMenuItem>Manage Users</DropdownMenuItem>
                            <DropdownMenuItem>View Analytics</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Suspend Tenant
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quotas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Resource Quotas
              </CardTitle>
              <CardDescription>
                Monitor and manage resource usage across all tenants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {resourceQuotas.map((quota, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{quota.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {quota.used.toLocaleString()} / {quota.limit.toLocaleString()} {quota.unit}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2 transition-all duration-300"
                        style={{ width: `${Math.min((quota.used / quota.limit) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{((quota.used / quota.limit) * 100).toFixed(1)}% used</span>
                      <span>{quota.limit - quota.used} remaining</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quota Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Alert at 80%</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Alert at 90%</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Block at 100%</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Auto-scaling</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-increase limits</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Notify on scaling</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Scale down unused</span>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Custom Limits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Set per-tenant limits
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    Bulk adjust quotas
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    Export usage report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="isolation" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Data Isolation
                </CardTitle>
                <CardDescription>Database and storage separation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Shared Database</h4>
                      <p className="text-sm text-muted-foreground">Row-level tenant isolation</p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Schema Separation</h4>
                      <p className="text-sm text-muted-foreground">Per-tenant database schemas</p>
                    </div>
                    <Badge variant="secondary">Available</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Database per Tenant</h4>
                      <p className="text-sm text-muted-foreground">Complete database isolation</p>
                    </div>
                    <Badge variant="outline">Enterprise</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Isolation
                </CardTitle>
                <CardDescription>Authentication and authorization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">API Key Isolation</h4>
                      <p className="text-sm text-muted-foreground">Tenant-specific API keys</p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">SSO Integration</h4>
                      <p className="text-sm text-muted-foreground">Custom identity providers</p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Custom Domains</h4>
                      <p className="text-sm text-muted-foreground">Branded subdomains</p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tenant Configuration</CardTitle>
              <CardDescription>Manage per-tenant settings and customizations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-medium">Branding</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Custom logos</li>
                    <li>• Color themes</li>
                    <li>• Custom domains</li>
                    <li>• White-label options</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Features</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• API access levels</li>
                    <li>• Feature toggles</li>
                    <li>• Integration limits</li>
                    <li>• Storage quotas</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Compliance</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Data residency</li>
                    <li>• Retention policies</li>
                    <li>• Audit logging</li>
                    <li>• Backup schedules</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,450</div>
                <p className="text-sm text-muted-foreground">+15% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tenants.filter(t => t.status === 'active').length}</div>
                <p className="text-sm text-muted-foreground">2 trial conversions this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Revenue per Tenant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$4,150</div>
                <p className="text-sm text-muted-foreground">Based on active tenants</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Billing Configuration</CardTitle>
              <CardDescription>Manage billing settings and pricing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium">Payment Processing</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>• Stripe integration active</div>
                      <div>• Automatic invoicing enabled</div>
                      <div>• Failed payment retry (3 attempts)</div>
                      <div>• Dunning management active</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Pricing Models</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>• Per-user pricing</div>
                      <div>• Usage-based billing</div>
                      <div>• Volume discounts</div>
                      <div>• Custom enterprise rates</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Configure Pricing</Button>
                  <Button variant="outline">View Invoices</Button>
                  <Button variant="outline">Payment Reports</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}