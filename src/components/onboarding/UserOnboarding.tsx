import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { ArrowRight, ArrowLeft, CheckCircle, User, Building2, Rocket } from "lucide-react"

interface OnboardingStep {
  id: number
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const steps: OnboardingStep[] = [
  {
    id: 1,
    title: "Welcome to LocalMail",
    description: "Let's get you started with your email platform",
    icon: Rocket
  },
  {
    id: 2,
    title: "Personal Information",
    description: "Tell us a bit about yourself",
    icon: User
  },
  {
    id: 3,
    title: "Company Details",
    description: "Help us understand your business",
    icon: Building2
  },
  {
    id: 4,
    title: "Setup Complete",
    description: "You're all set to start using LocalMail",
    icon: CheckCircle
  }
]

export function UserOnboarding() {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    display_name: "",
    company_name: "",
    avatar_url: ""
  })

  useEffect(() => {
    // Check if user already has a profile (not first time)
    if (user) {
      checkExistingProfile()
    }
  }, [user])

  const checkExistingProfile = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('display_name, company_name')
        .eq('user_id', user?.id)
        .maybeSingle()

      // If user has already filled profile info, skip onboarding
      if (data && (data.display_name || data.company_name)) {
        navigate('/')
      }
    } catch (error) {
      console.error('Error checking profile:', error)
    }
  }

  const handleNext = async () => {
    if (currentStep === 2 && !formData.display_name.trim()) {
      toast({
        title: "Display name required",
        description: "Please enter your display name to continue",
        variant: "destructive"
      })
      return
    }

    if (currentStep === 3) {
      await saveProfile()
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    navigate('/')
  }

  const saveProfile = async () => {
    if (!user) return

    setLoading(true)
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

      setCurrentStep(4)
      toast({
        title: "Profile created!",
        description: "Welcome to LocalMail"
      })
    } catch (error) {
      console.error('Error saving profile:', error)
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
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

  const progress = (currentStep / steps.length) * 100

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                <Rocket className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Welcome to LocalMail!</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're excited to help you manage your email campaigns. Let's set up your profile in just a few steps.
              </p>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Personal Information</h2>
              <p className="text-muted-foreground">
                Tell us about yourself to personalize your experience
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-center">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={formData.avatar_url} />
                  <AvatarFallback className="text-lg">
                    {formData.display_name 
                      ? getInitials(formData.display_name) 
                      : user?.email ? getInitials(user.email) : 'U'
                    }
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name *</Label>
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
                <Label htmlFor="avatar_url">Avatar URL (Optional)</Label>
                <Input
                  id="avatar_url"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({
                    ...formData,
                    avatar_url: e.target.value
                  })}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Company Details</h2>
              <p className="text-muted-foreground">
                Help us understand your business needs
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name (Optional)</Label>
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
          </div>
        )

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Setup Complete!</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Welcome to LocalMail, {formData.display_name}! You're all set to start managing your email campaigns.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-soft">
          <CardHeader className="text-center pb-4">
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Step {currentStep} of {steps.length}
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {renderStepContent()}

            <div className="flex justify-between">
              {currentStep === 1 ? (
                <Button variant="ghost" onClick={handleSkip}>
                  Skip Setup
                </Button>
              ) : (
                <Button variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}

              {currentStep === 4 ? (
                <Button onClick={() => navigate('/')}>
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleNext} disabled={loading}>
                  {loading ? "Saving..." : "Next"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}