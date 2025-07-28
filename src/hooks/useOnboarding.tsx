import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'

interface OnboardingStatus {
  isComplete: boolean
  isLoading: boolean
  checkOnboarding: () => Promise<void>
}

export function useOnboarding(): OnboardingStatus {
  const { user } = useAuth()
  const [isComplete, setIsComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const checkOnboarding = async () => {
    if (!user) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, company_name')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) {
        console.error('Error checking onboarding status:', error)
        setIsComplete(false)
        return
      }

      // Consider onboarding complete if user has at least filled their display name
      const hasBasicInfo = data && data.display_name && data.display_name.trim() !== ''
      setIsComplete(!!hasBasicInfo)
    } catch (error) {
      console.error('Error in onboarding check:', error)
      setIsComplete(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkOnboarding()
  }, [user])

  return {
    isComplete,
    isLoading,
    checkOnboarding
  }
}