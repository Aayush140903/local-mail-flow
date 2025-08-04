import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabase.auth.getUser(token);
    const user = userData.user;

    if (!user) {
      throw new Error("Unauthorized");
    }

    // Get campaigns with analytics
    const { data: campaigns, error } = await supabase
      .from("campaigns")
      .select(`
        *,
        campaign_analytics(
          total_sent,
          total_delivered,
          total_opened,
          total_clicked,
          total_bounced,
          total_unsubscribed,
          open_rate,
          click_rate,
          bounce_rate
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Transform data to match frontend expectations
    const transformedCampaigns = campaigns.map(campaign => ({
      id: campaign.id,
      name: campaign.name,
      subject: campaign.subject_line,
      status: campaign.status,
      scheduledAt: campaign.scheduled_at ? new Date(campaign.scheduled_at) : undefined,
      sentAt: campaign.completed_at ? new Date(campaign.completed_at) : undefined,
      recipients: campaign.campaign_analytics?.[0]?.total_sent || 0,
      delivered: campaign.campaign_analytics?.[0]?.total_delivered || 0,
      opened: campaign.campaign_analytics?.[0]?.total_opened || 0,
      clicked: campaign.campaign_analytics?.[0]?.total_clicked || 0,
      bounced: campaign.campaign_analytics?.[0]?.total_bounced || 0,
      unsubscribed: campaign.campaign_analytics?.[0]?.total_unsubscribed || 0,
      content: campaign.description || '',
      template: campaign.template_id,
    }));

    return new Response(JSON.stringify({ campaigns: transformedCampaigns }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Get campaigns error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});