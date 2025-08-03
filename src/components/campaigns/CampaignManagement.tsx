import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Send, Calendar as CalendarIcon, Edit, Trash2, Play, Pause, Copy, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  type: string;
  status: string;
  subject_line: string | null;
  from_name: string | null;
  from_email: string | null;
  reply_to_email: string | null;
  preheader: string | null;
  scheduled_at: string | null;
  created_at: string;
  segment_id: string | null;
  contact_list_id: string | null;
}

interface ContactList {
  id: string;
  name: string;
}

interface Segment {
  id: string;
  name: string;
}

export function CampaignManagement() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [contactLists, setContactLists] = useState<ContactList[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "one_time",
    subject_line: "",
    from_name: "",
    from_email: "",
    reply_to_email: "",
    preheader: "",
    audience_type: "list",
    contact_list_id: "",
    segment_id: ""
  });

  useEffect(() => {
    fetchCampaigns();
    fetchContactLists();
    fetchSegments();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch campaigns",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchContactLists = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_lists')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setContactLists(data || []);
    } catch (error) {
      console.error('Error fetching contact lists:', error);
    }
  };

  const fetchSegments = async () => {
    try {
      const { data, error } = await supabase
        .from('segments')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setSegments(data || []);
    } catch (error) {
      console.error('Error fetching segments:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const campaignData = {
        user_id: user.id,
        name: formData.name,
        description: formData.description || null,
        type: formData.type,
        subject_line: formData.subject_line || null,
        from_name: formData.from_name || null,
        from_email: formData.from_email || null,
        reply_to_email: formData.reply_to_email || null,
        preheader: formData.preheader || null,
        scheduled_at: scheduledDate?.toISOString() || null,
        contact_list_id: formData.audience_type === 'list' ? formData.contact_list_id || null : null,
        segment_id: formData.audience_type === 'segment' ? formData.segment_id || null : null,
        status: scheduledDate ? 'scheduled' : 'draft'
      };

      if (editingCampaign) {
        const { error } = await supabase
          .from('campaigns')
          .update(campaignData)
          .eq('id', editingCampaign.id);

        if (error) throw error;
        toast({ title: "Success", description: "Campaign updated successfully" });
      } else {
        const { error } = await supabase
          .from('campaigns')
          .insert(campaignData);

        if (error) throw error;
        toast({ title: "Success", description: "Campaign created successfully" });
      }

      resetForm();
      fetchCampaigns();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      description: campaign.description || "",
      type: campaign.type,
      subject_line: campaign.subject_line || "",
      from_name: campaign.from_name || "",
      from_email: campaign.from_email || "",
      reply_to_email: campaign.reply_to_email || "",
      preheader: campaign.preheader || "",
      audience_type: campaign.contact_list_id ? 'list' : 'segment',
      contact_list_id: campaign.contact_list_id || "",
      segment_id: campaign.segment_id || ""
    });
    if (campaign.scheduled_at) {
      setScheduledDate(new Date(campaign.scheduled_at));
    }
    setIsDialogOpen(true);
  };

  const handleDelete = async (campaignId: string) => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId);

      if (error) throw error;
      toast({ title: "Success", description: "Campaign deleted successfully" });
      fetchCampaigns();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (campaignId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };
      
      if (newStatus === 'running') {
        updateData.started_at = new Date().toISOString();
      } else if (newStatus === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('campaigns')
        .update(updateData)
        .eq('id', campaignId);

      if (error) throw error;
      toast({ 
        title: "Success", 
        description: `Campaign ${newStatus === 'running' ? 'started' : newStatus} successfully` 
      });
      fetchCampaigns();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const duplicateCampaign = async (campaign: Campaign) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('campaigns')
        .insert({
          user_id: user.id,
          name: `${campaign.name} (Copy)`,
          description: campaign.description,
          type: campaign.type,
          subject_line: campaign.subject_line,
          from_name: campaign.from_name,
          from_email: campaign.from_email,
          reply_to_email: campaign.reply_to_email,
          preheader: campaign.preheader,
          contact_list_id: campaign.contact_list_id,
          segment_id: campaign.segment_id,
          status: 'draft'
        });

      if (error) throw error;
      toast({ title: "Success", description: "Campaign duplicated successfully" });
      fetchCampaigns();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "one_time",
      subject_line: "",
      from_name: "",
      from_email: "",
      reply_to_email: "",
      preheader: "",
      audience_type: "list",
      contact_list_id: "",
      segment_id: ""
    });
    setScheduledDate(undefined);
    setEditingCampaign(null);
    setIsDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'scheduled': return 'default';
      case 'running': return 'default';
      case 'paused': return 'outline';
      case 'completed': return 'default';
      default: return 'secondary';
    }
  };

  if (loading) {
    return <div>Loading campaigns...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Email Campaigns</CardTitle>
              <CardDescription>
                Create and manage your email marketing campaigns
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingCampaign ? "Edit Campaign" : "Create New Campaign"}
                  </DialogTitle>
                  <DialogDescription>
                    Set up your email campaign details and audience
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Campaign Name *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Black Friday Sale"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Campaign Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData({ ...formData, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="one_time">One-time Send</SelectItem>
                          <SelectItem value="drip">Drip Campaign</SelectItem>
                          <SelectItem value="trigger">Triggered Campaign</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Campaign description..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="subject_line">Subject Line</Label>
                      <Input
                        id="subject_line"
                        value={formData.subject_line}
                        onChange={(e) => setFormData({ ...formData, subject_line: e.target.value })}
                        placeholder="Your email subject line"
                      />
                    </div>
                    <div>
                      <Label htmlFor="preheader">Preheader Text</Label>
                      <Input
                        id="preheader"
                        value={formData.preheader}
                        onChange={(e) => setFormData({ ...formData, preheader: e.target.value })}
                        placeholder="Preview text..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="from_name">From Name</Label>
                      <Input
                        id="from_name"
                        value={formData.from_name}
                        onChange={(e) => setFormData({ ...formData, from_name: e.target.value })}
                        placeholder="Your Company"
                      />
                    </div>
                    <div>
                      <Label htmlFor="from_email">From Email</Label>
                      <Input
                        id="from_email"
                        type="email"
                        value={formData.from_email}
                        onChange={(e) => setFormData({ ...formData, from_email: e.target.value })}
                        placeholder="noreply@yourcompany.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="reply_to_email">Reply-To Email</Label>
                    <Input
                      id="reply_to_email"
                      type="email"
                      value={formData.reply_to_email}
                      onChange={(e) => setFormData({ ...formData, reply_to_email: e.target.value })}
                      placeholder="support@yourcompany.com"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Audience</Label>
                    <Select
                      value={formData.audience_type}
                      onValueChange={(value) => setFormData({ ...formData, audience_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="list">Contact List</SelectItem>
                        <SelectItem value="segment">Segment</SelectItem>
                      </SelectContent>
                    </Select>

                    {formData.audience_type === 'list' && (
                      <Select
                        value={formData.contact_list_id}
                        onValueChange={(value) => setFormData({ ...formData, contact_list_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a contact list" />
                        </SelectTrigger>
                        <SelectContent>
                          {contactLists.map((list) => (
                            <SelectItem key={list.id} value={list.id}>
                              {list.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {formData.audience_type === 'segment' && (
                      <Select
                        value={formData.segment_id}
                        onValueChange={(value) => setFormData({ ...formData, segment_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a segment" />
                        </SelectTrigger>
                        <SelectContent>
                          {segments.map((segment) => (
                            <SelectItem key={segment.id} value={segment.id}>
                              {segment.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div>
                    <Label>Schedule (Optional)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !scheduledDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {scheduledDate ? format(scheduledDate, "PPP") : "Send immediately"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={scheduledDate}
                          onSelect={setScheduledDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={resetForm}>
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
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{campaign.name}</CardTitle>
                        <Badge variant={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        {campaign.description || "No description"}
                      </CardDescription>
                      {campaign.subject_line && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Subject: {campaign.subject_line}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {campaign.status === 'draft' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(campaign.id, 'running')}
                          title="Start campaign"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      {campaign.status === 'running' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(campaign.id, 'paused')}
                          title="Pause campaign"
                        >
                          <Pause className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => duplicateCampaign(campaign)}
                        title="Duplicate campaign"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(campaign)}
                        title="Edit campaign"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(campaign.id)}
                        title="Delete campaign"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="capitalize">{campaign.type.replace('_', ' ')}</span>
                    </div>
                    {campaign.scheduled_at && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Scheduled:</span>
                        <span>{format(new Date(campaign.scheduled_at), "PPP")}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Created:</span>
                      <span>{format(new Date(campaign.created_at), "PPP")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}