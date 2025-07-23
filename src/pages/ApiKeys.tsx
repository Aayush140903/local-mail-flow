import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { 
  Key, 
  Plus, 
  Copy, 
  Trash2, 
  Eye, 
  EyeOff,
  Calendar,
  Activity
} from "lucide-react"

// Mock data - replace with real data from your backend
const mockApiKeys = [
  {
    id: "1",
    name: "Production API",
    key: "lm_1234567890abcdef1234567890abcdef",
    createdAt: "2024-01-10T10:00:00Z",
    lastUsed: "2024-01-15T09:30:00Z",
    status: "active",
    emailsSent: 1250
  },
  {
    id: "2", 
    name: "Development Testing",
    key: "lm_abcdef1234567890abcdef1234567890",
    createdAt: "2024-01-05T14:30:00Z",
    lastUsed: "2024-01-14T16:15:00Z", 
    status: "active",
    emailsSent: 45
  },
  {
    id: "3",
    name: "Marketing Campaigns",
    key: "lm_9876543210fedcba9876543210fedcba",
    createdAt: "2023-12-20T11:45:00Z",
    lastUsed: null,
    status: "inactive",
    emailsSent: 0
  }
]

export default function ApiKeys() {
  const { toast } = useToast()
  const [apiKeys, setApiKeys] = useState(mockApiKeys)
  const [newKeyName, setNewKeyName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({})
  const [dialogOpen, setDialogOpen] = useState(false)

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }))
  }

  const maskApiKey = (key: string, visible: boolean) => {
    if (visible) return key
    return key.slice(0, 8) + "..." + key.slice(-8)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "API key has been copied to your clipboard",
    })
  }

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your API key",
        variant: "destructive"
      })
      return
    }

    setIsCreating(true)
    
    // Simulate API call
    setTimeout(() => {
      const newKey = {
        id: Date.now().toString(),
        name: newKeyName,
        key: `lm_${Math.random().toString(36).substr(2, 32)}`,
        createdAt: new Date().toISOString(),
        lastUsed: null,
        status: "active" as const,
        emailsSent: 0
      }
      
      setApiKeys([newKey, ...apiKeys])
      setNewKeyName("")
      setIsCreating(false)
      setDialogOpen(false)
      
      toast({
        title: "API key created",
        description: "Your new API key has been generated successfully",
      })
    }, 1000)
  }

  const deleteApiKey = (keyId: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== keyId))
    toast({
      title: "API key deleted",
      description: "The API key has been permanently deleted",
    })
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-success text-success-foreground">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Keys</h1>
          <p className="text-muted-foreground">Manage your API keys for programmatic access</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Generate a new API key for your application. Make sure to copy it somewhere safe.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="keyName">API Key Name</Label>
                <Input
                  id="keyName"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Production API, Development Testing"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createApiKey} disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Key"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Usage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total API Keys</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiKeys.length}</div>
            <p className="text-xs text-muted-foreground">
              {apiKeys.filter(k => k.status === "active").length} active
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emails Sent</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {apiKeys.reduce((sum, key) => sum + key.emailsSent, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Via API keys
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.max(...apiKeys.map(k => k.lastUsed ? new Date(k.lastUsed).getTime() : 0)) > 0 
                ? formatDate(apiKeys.reduce((latest, key) => 
                    key.lastUsed && (!latest || new Date(key.lastUsed) > new Date(latest)) 
                      ? key.lastUsed 
                      : latest
                  , null as string | null))
                : "Never"
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Most recent usage
            </p>
          </CardContent>
        </Card>
      </div>

      {/* API Keys Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>
            Use these keys to authenticate your requests to the LocalMail API
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <div className="text-center py-12">
              <Key className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No API keys yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first API key to start sending emails programmatically
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create API Key
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>API Key</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Emails Sent</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((apiKey) => (
                    <TableRow key={apiKey.id}>
                      <TableCell>
                        <p className="font-medium">{apiKey.name}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                            {maskApiKey(apiKey.key, visibleKeys[apiKey.id])}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                          >
                            {visibleKeys[apiKey.id] ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(apiKey.key)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(apiKey.status)}</TableCell>
                      <TableCell>{formatDate(apiKey.createdAt)}</TableCell>
                      <TableCell>{formatDate(apiKey.lastUsed)}</TableCell>
                      <TableCell>{apiKey.emailsSent.toLocaleString()}</TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{apiKey.name}"? 
                                This action cannot be undone and will immediately revoke access.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => deleteApiKey(apiKey.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Documentation */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>API Usage Example</CardTitle>
          <CardDescription>
            Here's how to use your API key to send emails programmatically
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`curl -X POST http://localhost:3001/api/v1/emails \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "to": "recipient@example.com",
    "from": "sender@yourcompany.com", 
    "subject": "Hello from LocalMail",
    "html": "<h1>Hello World!</h1><p>This is a test email.</p>"
  }'`}</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}