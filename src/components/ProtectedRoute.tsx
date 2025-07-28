import { ReactNode, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useOnboarding } from '@/hooks/useOnboarding'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth()
  const { isComplete: onboardingComplete, isLoading: onboardingLoading } = useOnboarding()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth')
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    // Only redirect to onboarding if:
    // 1. User is authenticated
    // 2. Onboarding is not complete
    // 3. Not already on onboarding page
    // 4. Not on settings page (where they can update profile)
    if (
      user && 
      !authLoading && 
      !onboardingLoading && 
      !onboardingComplete && 
      location.pathname !== '/onboarding' &&
      location.pathname !== '/settings'
    ) {
      navigate('/onboarding')
    }
  }, [user, authLoading, onboardingLoading, onboardingComplete, location.pathname, navigate])

  if (authLoading || onboardingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}