import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserPlus, MoreVertical, Shield, Mail, Calendar, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  avatar?: string;
  joinedAt: string;
  lastActive: string;
  permissions: string[];
}

interface Workspace {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdAt: string;
}

export function TeamManagement() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("members");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "editor" | "viewer">("viewer");

  const [teamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@company.com",
      role: "admin",
      joinedAt: "2024-01-15",
      lastActive: "2024-01-26",
      permissions: ["read", "write", "delete", "manage_users"]
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@company.com",
      role: "editor",
      joinedAt: "2024-01-20",
      lastActive: "2024-01-25",
      permissions: ["read", "write"]
    },
    {
      id: "3",
      name: "Bob Wilson",
      email: "bob@company.com",
      role: "viewer",
      joinedAt: "2024-01-22",
      lastActive: "2024-01-24",
      permissions: ["read"]
    }
  ]);

  const [workspaces] = useState<Workspace[]>([
    {
      id: "1",
      name: "Marketing Team",
      description: "Primary marketing workspace",
      memberCount: 8,
      createdAt: "2024-01-01"
    },
    {
      id: "2",
      name: "Sales Team",
      description: "Sales team communications",
      memberCount: 5,
      createdAt: "2024-01-05"
    }
  ]);

  const handleInviteUser = () => {
    if (!inviteEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Invitation Sent",
      description: `Invited ${inviteEmail} as ${inviteRole}`,
    });

    setInviteEmail("");
    setIsInviteOpen(false);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin": return "destructive";
      case "editor": return "default";
      case "viewer": return "secondary";
      default: return "outline";
    }
  };

  const getPermissionDescription = (role: string) => {
    switch (role) {
      case "admin": return "Full access to all features and settings";
      case "editor": return "Can create and edit campaigns, view analytics";
      case "viewer": return "Can view campaigns and basic analytics";
      default: return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Team Management</h2>
          <p className="text-muted-foreground">Manage team members, roles, and workspaces</p>
        </div>
        
        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your team workspace
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={inviteRole} onValueChange={(value: any) => setInviteRole(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  {getPermissionDescription(inviteRole)}
                </p>
              </div>
              <Button onClick={handleInviteUser} className="w-full">
                Send Invitation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Members ({teamMembers.length})
              </CardTitle>
              <CardDescription>
                Manage your team members and their access levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">{member.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(member.role)}>
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(member.lastActive).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(member.joinedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit Role</DropdownMenuItem>
                            <DropdownMenuItem>View Permissions</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Remove Member
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

        <TabsContent value="roles" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-destructive" />
                  Admin
                </CardTitle>
                <CardDescription>Full system access</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Manage team members</li>
                  <li>• Configure settings</li>
                  <li>• View all analytics</li>
                  <li>• Manage billing</li>
                  <li>• Delete campaigns</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Editor
                </CardTitle>
                <CardDescription>Content management</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Create campaigns</li>
                  <li>• Edit templates</li>
                  <li>• View analytics</li>
                  <li>• Manage contacts</li>
                  <li>• Send emails</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-secondary" />
                  Viewer
                </CardTitle>
                <CardDescription>Read-only access</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• View campaigns</li>
                  <li>• View basic analytics</li>
                  <li>• Export reports</li>
                  <li>• View contacts</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workspaces" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workspaces</CardTitle>
              <CardDescription>
                Organize your team into different workspaces for better collaboration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {workspaces.map((workspace) => (
                  <Card key={workspace.id} className="border-muted">
                    <CardHeader>
                      <CardTitle className="text-base">{workspace.name}</CardTitle>
                      <CardDescription>{workspace.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {workspace.memberCount} members
                        </div>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button variant="outline" className="mt-4">
                <UserPlus className="w-4 h-4 mr-2" />
                Create Workspace
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}