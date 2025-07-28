import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { User, Building2, Save, Upload } from "lucide-react"

interface Profile {
  id: string
  user_id: string
  display_name: string | null
  company_name: string | null
  avatar_url: string | null
  role: string | null
  created_at: string
  updated_at: string
}

export function UserProfile() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    display_name: "",
    company_name: "",
    avatar_url: ""
  })

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle()

      if (error) throw error

      if (data) {
        setProfile(data)
        setFormData({
          display_name: data.display_name || "",
          company_name: data.company_name || "",
          avatar_url: data.avatar_url || ""
        })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      toast({
        title: "Error",
        description: "Failed to load profile information",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          display_name: formData.display_name || null,
          company_name: formData.company_name || null,
          avatar_url: formData.avatar_url || null,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Profile updated successfully"
      })

      // Reload profile data
      await loadProfile()
    } catch (error) {
      console.error('Error saving profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Profile Information</span>
          </CardTitle>
          <CardDescription>
            Manage your personal and company information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={formData.avatar_url} />
              <AvatarFallback className="text-lg">
                {formData.display_name 
                  ? getInitials(formData.display_name) 
                  : user?.email ? getInitials(user.email) : 'U'
                }
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div>
                <Label htmlFor="avatar_url">Avatar URL</Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    id="avatar_url"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({
                      ...formData,
                      avatar_url: e.target.value
                    })}
                    placeholder="https://example.com/avatar.jpg"
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => setFormData({
                  ...formData,
                  display_name: e.target.value
                })}
                placeholder="Your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                value={user?.email || ""}
                disabled
                className="bg-muted"
              />
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4" />
              <Label className="text-base font-medium">Company Information</Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData({
                  ...formData,
                  company_name: e.target.value
                })}
                placeholder="Your company name"
              />
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Account Information</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Account Role</Label>
                <Input
                  value={profile?.role || "user"}
                  disabled
                  className="bg-muted capitalize"
                />
              </div>
              <div className="space-y-2">
                <Label>Member Since</Label>
                <Input
                  value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}