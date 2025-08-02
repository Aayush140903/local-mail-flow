import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Filter, Users, Trash2, Edit, Play } from "lucide-react";

interface Segment {
  id: string;
  name: string;
  description: string | null;
  criteria: any;
  contact_count: number;
  created_at: string;
}

interface SegmentCriteria {
  field: string;
  operator: string;
  value: string;
}

export function SegmentBuilder() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);
  const [criteria, setCriteria] = useState<SegmentCriteria[]>([
    { field: 'email', operator: 'contains', value: '' }
  ]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const fieldOptions = [
    { value: 'email', label: 'Email' },
    { value: 'first_name', label: 'First Name' },
    { value: 'last_name', label: 'Last Name' },
    { value: 'company', label: 'Company' },
    { value: 'consent_status', label: 'Consent Status' },
    { value: 'tags', label: 'Tags' },
    { value: 'created_at', label: 'Created Date' }
  ];

  const operatorOptions = [
    { value: 'contains', label: 'Contains' },
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'starts_with', label: 'Starts With' },
    { value: 'ends_with', label: 'Ends With' },
    { value: 'is_empty', label: 'Is Empty' },
    { value: 'is_not_empty', label: 'Is Not Empty' }
  ];

  useEffect(() => {
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    try {
      const { data, error } = await supabase
        .from('segments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSegments(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch segments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateSegmentCount = async (segmentCriteria: SegmentCriteria[]) => {
    try {
      let query = supabase.from('contacts').select('id', { count: 'exact', head: true });

      // Apply filters based on criteria
      segmentCriteria.forEach((criterion) => {
        const { field, operator, value } = criterion;
        
        if (!value && operator !== 'is_empty' && operator !== 'is_not_empty') return;

        switch (operator) {
          case 'contains':
            query = query.ilike(field, `%${value}%`);
            break;
          case 'equals':
            query = query.eq(field, value);
            break;
          case 'not_equals':
            query = query.neq(field, value);
            break;
          case 'starts_with':
            query = query.ilike(field, `${value}%`);
            break;
          case 'ends_with':
            query = query.ilike(field, `%${value}`);
            break;
          case 'is_empty':
            query = query.is(field, null);
            break;
          case 'is_not_empty':
            query = query.not(field, 'is', null);
            break;
        }
      });

      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error calculating segment count:', error);
      return 0;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const contactCount = await calculateSegmentCount(criteria);

      const segmentData = {
        user_id: user.id,
        name: formData.name,
        description: formData.description || null,
        criteria: criteria as any,
        contact_count: contactCount
      };

      if (editingSegment) {
        const { error } = await supabase
          .from('segments')
          .update(segmentData)
          .eq('id', editingSegment.id);

        if (error) throw error;
        toast({ title: "Success", description: "Segment updated successfully" });
      } else {
        const { error } = await supabase
          .from('segments')
          .insert(segmentData);

        if (error) throw error;
        toast({ title: "Success", description: "Segment created successfully" });
      }

      resetForm();
      fetchSegments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (segment: Segment) => {
    setEditingSegment(segment);
    setFormData({
      name: segment.name,
      description: segment.description || ""
    });
    setCriteria(segment.criteria || [{ field: 'email', operator: 'contains', value: '' }]);
    setIsDialogOpen(true);
  };

  const handleDelete = async (segmentId: string) => {
    try {
      const { error } = await supabase
        .from('segments')
        .delete()
        .eq('id', segmentId);

      if (error) throw error;
      toast({ title: "Success", description: "Segment deleted successfully" });
      fetchSegments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addCriterion = () => {
    setCriteria([...criteria, { field: 'email', operator: 'contains', value: '' }]);
  };

  const removeCriterion = (index: number) => {
    setCriteria(criteria.filter((_, i) => i !== index));
  };

  const updateCriterion = (index: number, field: keyof SegmentCriteria, value: string) => {
    const newCriteria = [...criteria];
    newCriteria[index] = { ...newCriteria[index], [field]: value };
    setCriteria(newCriteria);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: ""
    });
    setCriteria([{ field: 'email', operator: 'contains', value: '' }]);
    setEditingSegment(null);
    setIsDialogOpen(false);
  };

  const refreshSegmentCount = async (segment: Segment) => {
    const newCount = await calculateSegmentCount(segment.criteria as any || []);
    
    try {
      const { error } = await supabase
        .from('segments')
        .update({ contact_count: newCount })
        .eq('id', segment.id);

      if (error) throw error;
      fetchSegments();
      toast({ title: "Success", description: "Segment count updated" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading segments...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Segment Builder</CardTitle>
              <CardDescription>
                Create dynamic segments based on contact criteria
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Segment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingSegment ? "Edit Segment" : "Create New Segment"}
                  </DialogTitle>
                  <DialogDescription>
                    Define criteria to automatically group contacts
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Segment Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Active VIP Customers"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe this segment..."
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Criteria</Label>
                    {criteria.map((criterion, index) => (
                      <div key={index} className="flex gap-2 items-end">
                        <div className="flex-1">
                          <Select
                            value={criterion.field}
                            onValueChange={(value) => updateCriterion(index, 'field', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {fieldOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex-1">
                          <Select
                            value={criterion.operator}
                            onValueChange={(value) => updateCriterion(index, 'operator', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {operatorOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex-1">
                          <Input
                            value={criterion.value}
                            onChange={(e) => updateCriterion(index, 'value', e.target.value)}
                            placeholder="Value"
                            disabled={criterion.operator === 'is_empty' || criterion.operator === 'is_not_empty'}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeCriterion(index)}
                          disabled={criteria.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addCriterion}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Criterion
                    </Button>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingSegment ? "Update" : "Create"} Segment
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {segments.map((segment) => (
              <Card key={segment.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{segment.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {segment.description || "No description"}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => refreshSegmentCount(segment)}
                        title="Refresh count"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(segment)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(segment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                      <Users className="h-3 w-3" />
                      {segment.contact_count} contacts
                    </Badge>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Criteria:</Label>
                      {segment.criteria?.map((criterion: SegmentCriteria, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs mr-1">
                          {fieldOptions.find(f => f.value === criterion.field)?.label} {' '}
                          {operatorOptions.find(o => o.value === criterion.operator)?.label} {' '}
                          {criterion.value}
                        </Badge>
                      ))}
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