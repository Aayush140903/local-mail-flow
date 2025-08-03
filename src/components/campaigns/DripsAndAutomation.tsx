import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Play, Pause, Mail, Clock, Zap, Settings } from "lucide-react";

interface DripCampaign {
  id: string;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
}

interface CampaignEmail {
  id: string;
  campaign_id: string;
  name: string;
  subject_line: string;
  content: string;
  delay_days: number;
  delay_hours: number;
  sequence_order: number;
  is_active: boolean;
}

interface AutomationTrigger {
  id: string;
  campaign_id: string;
  trigger_type: string;
  trigger_conditions: any;
  is_active: boolean;
}

export function DripsAndAutomation() {
  const [dripCampaigns, setDripCampaigns] = useState<DripCampaign[]>([]);
  const [campaignEmails, setCampaignEmails] = useState<CampaignEmail[]>([]);
  const [automationTriggers, setAutomationTriggers] = useState<AutomationTrigger[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<DripCampaign | null>(null);
  const [editingEmail, setEditingEmail] = useState<CampaignEmail | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const { toast } = useToast();

  const [campaignFormData, setCampaignFormData] = useState({
    name: "",
    description: "",
    trigger_type: "contact_added",
    trigger_conditions: {}
  });

  const [emailFormData, setEmailFormData] = useState({
    name: "",
    subject_line: "",
    content: "",
    delay_days: 0,
    delay_hours: 0,
    sequence_order: 1
  });

  useEffect(() => {
    fetchDripCampaigns();
  }, []);

  const fetchDripCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('type', 'drip')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDripCampaigns(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch drip campaigns",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaignEmails = async (campaignId: string) => {
    try {
      const { data, error } = await supabase
        .from('campaign_emails')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('sequence_order');

      if (error) throw error;
      setCampaignEmails(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch campaign emails",
        variant: "destructive",
      });
    }
  };

  const fetchAutomationTriggers = async (campaignId: string) => {
    try {
      const { data, error } = await supabase
        .from('automation_triggers')
        .select('*')
        .eq('campaign_id', campaignId);

      if (error) throw error;
      setAutomationTriggers(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch automation triggers",
        variant: "destructive",
      });
    }
  };

  const handleCampaignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const campaignData = {
        user_id: user.id,
        name: campaignFormData.name,
        description: campaignFormData.description || null,
        type: 'drip',
        status: 'draft'
      };

      if (editingCampaign) {
        const { error } = await supabase
          .from('campaigns')
          .update(campaignData)
          .eq('id', editingCampaign.id);

        if (error) throw error;
        toast({ title: "Success", description: "Drip campaign updated successfully" });
      } else {
        const { data: newCampaign, error } = await supabase
          .from('campaigns')
          .insert(campaignData)
          .select()
          .single();

        if (error) throw error;

        // Create automation trigger
        if (newCampaign) {
          await supabase
            .from('automation_triggers')
            .insert({
              campaign_id: newCampaign.id,
              user_id: user.id,
              trigger_type: campaignFormData.trigger_type,
              trigger_conditions: campaignFormData.trigger_conditions
            });
        }

        toast({ title: "Success", description: "Drip campaign created successfully" });
      }

      resetCampaignForm();
      fetchDripCampaigns();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const emailData = {
        campaign_id: selectedCampaignId,
        user_id: user.id,
        name: emailFormData.name,
        subject_line: emailFormData.subject_line,
        content: emailFormData.content,
        delay_days: emailFormData.delay_days,
        delay_hours: emailFormData.delay_hours,
        sequence_order: emailFormData.sequence_order
      };

      if (editingEmail) {
        const { error } = await supabase
          .from('campaign_emails')
          .update(emailData)
          .eq('id', editingEmail.id);

        if (error) throw error;
        toast({ title: "Success", description: "Email updated successfully" });
      } else {
        const { error } = await supabase
          .from('campaign_emails')
          .insert(emailData);

        if (error) throw error;
        toast({ title: "Success", description: "Email added to drip sequence" });
      }

      resetEmailForm();
      fetchCampaignEmails(selectedCampaignId);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId);

      if (error) throw error;
      toast({ title: "Success", description: "Drip campaign deleted successfully" });
      fetchDripCampaigns();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteEmail = async (emailId: string) => {
    try {
      const { error } = await supabase
        .from('campaign_emails')
        .delete()
        .eq('id', emailId);

      if (error) throw error;
      toast({ title: "Success", description: "Email deleted successfully" });
      fetchCampaignEmails(selectedCampaignId);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditCampaign = (campaign: DripCampaign) => {
    setEditingCampaign(campaign);
    setCampaignFormData({
      name: campaign.name,
      description: campaign.description || "",
      trigger_type: "contact_added",
      trigger_conditions: {}
    });
    setIsDialogOpen(true);
  };

  const handleEditEmail = (email: CampaignEmail) => {
    setEditingEmail(email);
    setEmailFormData({
      name: email.name,
      subject_line: email.subject_line,
      content: email.content,
      delay_days: email.delay_days,
      delay_hours: email.delay_hours,
      sequence_order: email.sequence_order
    });
    setIsEmailDialogOpen(true);
  };

  const resetCampaignForm = () => {
    setCampaignFormData({
      name: "",
      description: "",
      trigger_type: "contact_added",
      trigger_conditions: {}
    });
    setEditingCampaign(null);
    setIsDialogOpen(false);
  };

  const resetEmailForm = () => {
    setEmailFormData({
      name: "",
      subject_line: "",
      content: "",
      delay_days: 0,
      delay_hours: 0,
      sequence_order: 1
    });
    setEditingEmail(null);
    setIsEmailDialogOpen(false);
  };

  const selectCampaign = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    fetchCampaignEmails(campaignId);
    fetchAutomationTriggers(campaignId);
  };

  if (loading) {
    return <div>Loading drip campaigns...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Drip Campaigns & Automation
              </CardTitle>
              <CardDescription>
                Create automated email sequences triggered by user actions
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetCampaignForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Drip Campaign
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingCampaign ? "Edit Drip Campaign" : "Create New Drip Campaign"}
                  </DialogTitle>
                  <DialogDescription>
                    Set up an automated email sequence
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCampaignSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Campaign Name *</Label>
                    <Input
                      id="name"
                      required
                      value={campaignFormData.name}
                      onChange={(e) => setCampaignFormData({ ...campaignFormData, name: e.target.value })}
                      placeholder="e.g., Welcome Series"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={campaignFormData.description}
                      onChange={(e) => setCampaignFormData({ ...campaignFormData, description: e.target.value })}
                      placeholder="Describe this drip campaign..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="trigger_type">Trigger Type</Label>
                    <Select
                      value={campaignFormData.trigger_type}
                      onValueChange={(value) => setCampaignFormData({ ...campaignFormData, trigger_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contact_added">Contact Added to List</SelectItem>
                        <SelectItem value="tag_added">Tag Added to Contact</SelectItem>
                        <SelectItem value="date_based">Date-based Trigger</SelectItem>
                        <SelectItem value="behavior">Behavior-based Trigger</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={resetCampaignForm}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingCampaign ? "Update" : "Create"} Campaign
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="campaigns" className="space-y-4">
            <TabsList>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="emails" disabled={!selectedCampaignId}>
                Email Sequence
              </TabsTrigger>
            </TabsList>

            <TabsContent value="campaigns" className="space-y-4">
              <div className="grid gap-4">
                {dripCampaigns.map((campaign) => (
                  <Card key={campaign.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader onClick={() => selectCampaign(campaign.id)}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-lg">{campaign.name}</CardTitle>
                            <Badge variant="secondary">
                              {campaign.status}
                            </Badge>
                          </div>
                          <CardDescription>
                            {campaign.description || "No description"}
                          </CardDescription>
                        </div>
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCampaign(campaign)}
                            title="Edit campaign"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCampaign(campaign.id)}
                            title="Delete campaign"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="emails" className="space-y-4">
              {selectedCampaignId && (
                <>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Email Sequence</h3>
                    <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={() => resetEmailForm()}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Email
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>
                            {editingEmail ? "Edit Email" : "Add Email to Sequence"}
                          </DialogTitle>
                          <DialogDescription>
                            Configure the email content and timing
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                          <div>
                            <Label htmlFor="email_name">Email Name *</Label>
                            <Input
                              id="email_name"
                              required
                              value={emailFormData.name}
                              onChange={(e) => setEmailFormData({ ...emailFormData, name: e.target.value })}
                              placeholder="e.g., Welcome Email"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email_subject">Subject Line *</Label>
                            <Input
                              id="email_subject"
                              required
                              value={emailFormData.subject_line}
                              onChange={(e) => setEmailFormData({ ...emailFormData, subject_line: e.target.value })}
                              placeholder="Email subject line"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email_content">Email Content *</Label>
                            <Textarea
                              id="email_content"
                              required
                              value={emailFormData.content}
                              onChange={(e) => setEmailFormData({ ...emailFormData, content: e.target.value })}
                              placeholder="Email content..."
                              rows={6}
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="delay_days">Delay (Days)</Label>
                              <Input
                                id="delay_days"
                                type="number"
                                min="0"
                                value={emailFormData.delay_days}
                                onChange={(e) => setEmailFormData({ ...emailFormData, delay_days: parseInt(e.target.value) || 0 })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="delay_hours">Delay (Hours)</Label>
                              <Input
                                id="delay_hours"
                                type="number"
                                min="0"
                                max="23"
                                value={emailFormData.delay_hours}
                                onChange={(e) => setEmailFormData({ ...emailFormData, delay_hours: parseInt(e.target.value) || 0 })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="sequence_order">Order</Label>
                              <Input
                                id="sequence_order"
                                type="number"
                                min="1"
                                value={emailFormData.sequence_order}
                                onChange={(e) => setEmailFormData({ ...emailFormData, sequence_order: parseInt(e.target.value) || 1 })}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={resetEmailForm}>
                              Cancel
                            </Button>
                            <Button type="submit">
                              {editingEmail ? "Update" : "Add"} Email
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-4">
                    {campaignEmails.map((email, index) => (
                      <Card key={email.id}>
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline">#{email.sequence_order}</Badge>
                                <CardTitle className="text-lg">{email.name}</CardTitle>
                                {!email.is_active && (
                                  <Badge variant="secondary">Inactive</Badge>
                                )}
                              </div>
                              <CardDescription>
                                Subject: {email.subject_line}
                              </CardDescription>
                              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                Send after {email.delay_days} days, {email.delay_hours} hours
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditEmail(email)}
                                title="Edit email"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteEmail(email.id)}
                                title="Delete email"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-muted-foreground">
                            {email.content.substring(0, 100)}...
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}