import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateCampaignRequest {
  name: string;
  description?: string;
  type: string;
  subject_line: string;
  from_name?: string;
  from_email?: string;
  reply_to_email?: string;
  preheader?: string;
  contact_list_id?: string;
  segment_id?: string;
  scheduled_at?: string;
  content?: string;
}

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

    const campaignData: CreateCampaignRequest = await req.json();

    // Create campaign
    const { data: campaign, error } = await supabase
      .from("campaigns")
      .insert({
        ...campaignData,
        user_id: user.id,
        status: "draft",
      })
      .select()
      .single();

    if (error) throw error;

    // If content is provided, create the first email in the campaign
    if (campaignData.content) {
      await supabase.from("campaign_emails").insert({
        campaign_id: campaign.id,
        user_id: user.id,
        name: "Main Email",
        subject_line: campaignData.subject_line,
        content: campaignData.content,
        sequence_order: 1,
      });
    }

    return new Response(JSON.stringify({ campaign }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Create campaign error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});