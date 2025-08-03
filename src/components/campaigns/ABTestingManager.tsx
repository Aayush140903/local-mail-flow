import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Trophy, BarChart3, Target, Split } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  status: string;
}

interface CampaignVariant {
  id: string;
  campaign_id: string;
  name: string;
  subject_line: string | null;
  content: string | null;
  from_name: string | null;
  variant_type: string;
  traffic_percentage: number;
  is_winner: boolean;
  created_at: string;
}

interface VariantAnalytics {
  variant_id: string;
  total_sent: number;
  total_opened: number;
  total_clicked: number;
  open_rate: number;
  click_rate: number;
}

export function ABTestingManager() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [variants, setVariants] = useState<CampaignVariant[]>([]);
  const [analytics, setAnalytics] = useState<VariantAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<CampaignVariant | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    campaign_id: "",
    name: "",
    subject_line: "",
    content: "",
    from_name: "",
    variant_type: "subject",
    traffic_percentage: 50
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (selectedCampaignId) {
      fetchVariants(selectedCampaignId);
      fetchAnalytics(selectedCampaignId);
    }
  }, [selectedCampaignId]);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, name, status')
        .eq('type', 'one_time')
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

  const fetchVariants = async (campaignId: string) => {
    try {
      const { data, error } = await supabase
        .from('campaign_variants')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('created_at');

      if (error) throw error;
      setVariants(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch variants",
        variant: "destructive",
      });
    }
  };

  const fetchAnalytics = async (campaignId: string) => {
    try {
      const { data, error } = await supabase
        .from('campaign_analytics')
        .select('variant_id, total_sent, total_opened, total_clicked, open_rate, click_rate')
        .eq('campaign_id', campaignId);

      if (error) throw error;
      setAnalytics(data || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Validate traffic percentage doesn't exceed 100%
      const existingVariants = variants.filter(v => v.id !== editingVariant?.id);
      const totalTraffic = existingVariants.reduce((sum, v) => sum + v.traffic_percentage, 0);
      
      if (totalTraffic + formData.traffic_percentage > 100) {
        toast({
          title: "Error",
          description: "Total traffic percentage cannot exceed 100%",
          variant: "destructive",
        });
        return;
      }

      const variantData = {
        campaign_id: formData.campaign_id,
        user_id: user.id,
        name: formData.name,
        subject_line: formData.subject_line || null,
        content: formData.content || null,
        from_name: formData.from_name || null,
        variant_type: formData.variant_type,
        traffic_percentage: formData.traffic_percentage
      };

      if (editingVariant) {
        const { error } = await supabase
          .from('campaign_variants')
          .update(variantData)
          .eq('id', editingVariant.id);

        if (error) throw error;
        toast({ title: "Success", description: "Variant updated successfully" });
      } else {
        const { error } = await supabase
          .from('campaign_variants')
          .insert(variantData);

        if (error) throw error;
        toast({ title: "Success", description: "Variant created successfully" });
      }

      resetForm();
      fetchVariants(selectedCampaignId);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (variant: CampaignVariant) => {
    setEditingVariant(variant);
    setFormData({
      campaign_id: variant.campaign_id,
      name: variant.name,
      subject_line: variant.subject_line || "",
      content: variant.content || "",
      from_name: variant.from_name || "",
      variant_type: variant.variant_type,
      traffic_percentage: variant.traffic_percentage
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (variantId: string) => {
    try {
      const { error } = await supabase
        .from('campaign_variants')
        .delete()
        .eq('id', variantId);

      if (error) throw error;
      toast({ title: "Success", description: "Variant deleted successfully" });
      fetchVariants(selectedCampaignId);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const markAsWinner = async (variantId: string) => {
    try {
      // First, unmark all other variants as winners
      await supabase
        .from('campaign_variants')
        .update({ is_winner: false })
        .eq('campaign_id', selectedCampaignId);

      // Then mark the selected variant as winner
      const { error } = await supabase
        .from('campaign_variants')
        .update({ is_winner: true })
        .eq('id', variantId);

      if (error) throw error;
      toast({ title: "Success", description: "Variant marked as winner" });
      fetchVariants(selectedCampaignId);
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
      campaign_id: selectedCampaignId,
      name: "",
      subject_line: "",
      content: "",
      from_name: "",
      variant_type: "subject",
      traffic_percentage: 50
    });
    setEditingVariant(null);
    setIsDialogOpen(false);
  };

  const getVariantAnalytics = (variantId: string) => {
    return analytics.find(a => a.variant_id === variantId);
  };

  const getTotalTrafficUsed = () => {
    return variants.reduce((sum, variant) => sum + variant.traffic_percentage, 0);
  };

  if (loading) {
    return <div>Loading A/B testing data...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Split className="h-5 w-5" />
                A/B Testing Manager
              </CardTitle>
              <CardDescription>
                Test different versions of your campaigns to optimize performance
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Campaign Selection */}
            <div className="space-y-2">
              <Label>Select Campaign to Test</Label>
              <Select
                value={selectedCampaignId}
                onValueChange={setSelectedCampaignId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a campaign" />
                </SelectTrigger>
                <SelectContent>
                  {campaigns.map((campaign) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name} - {campaign.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCampaignId && (
              <>
                {/* Traffic Allocation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Traffic Allocation</CardTitle>
                    <CardDescription>
                      {getTotalTrafficUsed()}% of traffic allocated
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Progress value={getTotalTrafficUsed()} className="mb-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {100 - getTotalTrafficUsed()}% available
                      </span>
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            onClick={() => {
                              setFormData({ ...formData, campaign_id: selectedCampaignId });
                              resetForm();
                            }}
                            disabled={getTotalTrafficUsed() >= 100}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Variant
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {editingVariant ? "Edit Variant" : "Create New Variant"}
                            </DialogTitle>
                            <DialogDescription>
                              Configure your A/B test variant
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                              <Label htmlFor="name">Variant Name *</Label>
                              <Input
                                id="name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Version A, Control Group"
                              />
                            </div>

                            <div>
                              <Label htmlFor="variant_type">Test Type</Label>
                              <Select
                                value={formData.variant_type}
                                onValueChange={(value) => setFormData({ ...formData, variant_type: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="subject">Subject Line</SelectItem>
                                  <SelectItem value="content">Email Content</SelectItem>
                                  <SelectItem value="from_name">From Name</SelectItem>
                                  <SelectItem value="send_time">Send Time</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor="traffic_percentage">Traffic Percentage</Label>
                              <Input
                                id="traffic_percentage"
                                type="number"
                                min="1"
                                max={100 - getTotalTrafficUsed() + (editingVariant?.traffic_percentage || 0)}
                                value={formData.traffic_percentage}
                                onChange={(e) => setFormData({ ...formData, traffic_percentage: parseInt(e.target.value) || 0 })}
                              />
                              <p className="text-sm text-muted-foreground mt-1">
                                Available: {100 - getTotalTrafficUsed() + (editingVariant?.traffic_percentage || 0)}%
                              </p>
                            </div>

                            {formData.variant_type === 'subject' && (
                              <div>
                                <Label htmlFor="subject_line">Subject Line</Label>
                                <Input
                                  id="subject_line"
                                  value={formData.subject_line}
                                  onChange={(e) => setFormData({ ...formData, subject_line: e.target.value })}
                                  placeholder="Alternative subject line"
                                />
                              </div>
                            )}

                            {formData.variant_type === 'content' && (
                              <div>
                                <Label htmlFor="content">Email Content</Label>
                                <Textarea
                                  id="content"
                                  value={formData.content}
                                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                  placeholder="Alternative email content"
                                  rows={4}
                                />
                              </div>
                            )}

                            {formData.variant_type === 'from_name' && (
                              <div>
                                <Label htmlFor="from_name">From Name</Label>
                                <Input
                                  id="from_name"
                                  value={formData.from_name}
                                  onChange={(e) => setFormData({ ...formData, from_name: e.target.value })}
                                  placeholder="Alternative sender name"
                                />
                              </div>
                            )}

                            <div className="flex justify-end gap-2">
                              <Button type="button" variant="outline" onClick={resetForm}>
                                Cancel
                              </Button>
                              <Button type="submit">
                                {editingVariant ? "Update" : "Create"} Variant
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>

                {/* Variants List */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Test Variants</h3>
                  {variants.map((variant) => {
                    const variantAnalytics = getVariantAnalytics(variant.id);
                    return (
                      <Card key={variant.id} className={variant.is_winner ? "border-green-500" : ""}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <CardTitle className="text-lg">{variant.name}</CardTitle>
                                {variant.is_winner && (
                                  <Badge variant="default" className="bg-green-500">
                                    <Trophy className="h-3 w-3 mr-1" />
                                    Winner
                                  </Badge>
                                )}
                                <Badge variant="outline">
                                  {variant.traffic_percentage}% traffic
                                </Badge>
                                <Badge variant="secondary">
                                  {variant.variant_type.replace('_', ' ')}
                                </Badge>
                              </div>
                              <CardDescription>
                                Testing: {variant.variant_type.replace('_', ' ')}
                              </CardDescription>
                            </div>
                            <div className="flex gap-1">
                              {!variant.is_winner && variantAnalytics && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsWinner(variant.id)}
                                  title="Mark as winner"
                                >
                                  <Trophy className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(variant)}
                                title="Edit variant"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(variant.id)}
                                title="Delete variant"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {/* Variant Details */}
                            <div className="space-y-1">
                              {variant.subject_line && (
                                <p className="text-sm">
                                  <span className="font-medium">Subject:</span> {variant.subject_line}
                                </p>
                              )}
                              {variant.from_name && (
                                <p className="text-sm">
                                  <span className="font-medium">From:</span> {variant.from_name}
                                </p>
                              )}
                              {variant.content && (
                                <p className="text-sm">
                                  <span className="font-medium">Content:</span> {variant.content.substring(0, 100)}...
                                </p>
                              )}
                            </div>

                            {/* Analytics */}
                            {variantAnalytics && (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-primary">
                                    {variantAnalytics.total_sent}
                                  </div>
                                  <div className="text-xs text-muted-foreground">Sent</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-blue-600">
                                    {variantAnalytics.open_rate.toFixed(1)}%
                                  </div>
                                  <div className="text-xs text-muted-foreground">Open Rate</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-green-600">
                                    {variantAnalytics.click_rate.toFixed(1)}%
                                  </div>
                                  <div className="text-xs text-muted-foreground">Click Rate</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold">
                                    {variantAnalytics.total_clicked}
                                  </div>
                                  <div className="text-xs text-muted-foreground">Clicks</div>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}