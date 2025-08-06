import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DraftData {
  formData: {
    from: string;
    subject: string;
    html: string;
  };
  recipients: string[];
  selectedAudience?: any;
  [key: string]: any;
}

export function useDraftAutoSave(draftData: DraftData, enabled: boolean = true) {
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef<string>('');

  useEffect(() => {
    if (!enabled) return;

    const currentData = JSON.stringify(draftData);
    
    // Only save if data has changed
    if (currentData === lastSavedRef.current) return;

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(async () => {
      try {
        const user = await supabase.auth.getUser();
        if (!user.data.user) return;

        const { error } = await supabase
          .from('campaign_drafts')
          .upsert({
            user_id: user.data.user.id,
            draft_data: draftData as any,
            last_saved_at: new Date().toISOString()
          });

        if (error) throw error;

        lastSavedRef.current = currentData;
        
        // Show subtle success indication
        toast({
          title: "Draft saved",
          description: "Your work has been automatically saved",
          duration: 2000,
        });
      } catch (error: any) {
        console.error('Auto-save failed:', error);
        toast({
          title: "Auto-save failed",
          description: "Failed to save draft automatically",
          variant: "destructive",
          duration: 3000,
        });
      }
    }, 3000); // Save after 3 seconds of inactivity

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [draftData, enabled, toast]);

  // Save immediately when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const saveDraftNow = async () => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('campaign_drafts')
        .upsert({
          user_id: user.data.user.id,
          draft_data: draftData as any,
          last_saved_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Draft saved",
        description: "Your work has been saved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return { saveDraftNow };
}

export async function loadDraft() {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return null;

    const { data, error } = await supabase
      .from('campaign_drafts')
      .select('*')
      .eq('user_id', user.user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return data?.draft_data || null;
  } catch (error) {
    console.error('Failed to load draft:', error);
    return null;
  }
}