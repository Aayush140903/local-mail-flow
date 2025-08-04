import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendEmailRequest {
  campaignId: string;
  to: string[];
  subject: string;
  content: string;
  fromName?: string;
  fromEmail?: string;
  replyTo?: string;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

    const { campaignId, to, subject, content, fromName, fromEmail, replyTo }: SendEmailRequest = await req.json();

    // Verify campaign ownership
    const { data: campaign } = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", campaignId)
      .eq("user_id", user.id)
      .single();

    if (!campaign) {
      throw new Error("Campaign not found or unauthorized");
    }

    // Send emails in batches
    const batchSize = 50;
    const results = [];
    
    for (let i = 0; i < to.length; i += batchSize) {
      const batch = to.slice(i, i + batchSize);
      
      const emailResult = await resend.emails.send({
        from: fromEmail || "noreply@yourdomain.com",
        to: batch,
        subject,
        html: content,
        reply_to: replyTo,
      });

      results.push(emailResult);

      // Log email sends
      for (const email of batch) {
        await supabase.from("email_logs").insert({
          campaign_id: campaignId,
          user_id: user.id,
          recipient_email: email,
          subject,
          status: "sent",
          sent_at: new Date().toISOString(),
        });
      }
    }

    // Update campaign status
    await supabase
      .from("campaigns")
      .update({ 
        status: "sent",
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      })
      .eq("id", campaignId);

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Send email error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});