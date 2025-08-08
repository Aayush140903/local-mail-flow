import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, Eye, Star, Copy, Trash2, Edit } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EmailTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  content: string;
  thumbnail_url?: string;
  is_default: boolean;
  created_at: string;
}

interface EmailTemplatesProps {
  onSelectTemplate: (template: EmailTemplate) => void;
  onEditTemplate?: (template: EmailTemplate) => void;
}

export function EmailTemplates({ onSelectTemplate, onEditTemplate }: EmailTemplatesProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [deleteTemplate, setDeleteTemplate] = useState<EmailTemplate | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load email templates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (template: EmailTemplate) => {
    onSelectTemplate(template);
    toast({
      title: "Template loaded",
      description: `${template.name} has been loaded into the builder`,
    });
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    if (onEditTemplate) {
      onEditTemplate(template);
      toast({
        title: "Template opened in editor",
        description: `${template.name} is now open in the visual builder`,
      });
    }
  };

  const handleDeleteTemplate = async (template: EmailTemplate) => {
    try {
      const { error } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', template.id);

      if (error) throw error;

      setTemplates(templates.filter(t => t.id !== template.id));
      setDeleteTemplate(null);
      
      toast({
        title: "Template deleted",
        description: `${template.name} has been deleted successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const categories = [
    { value: "all", label: "All Templates" },
    { value: "onboarding", label: "Onboarding" },
    { value: "marketing", label: "Marketing" },
    { value: "transactional", label: "Transactional" },
    { value: "custom", label: "Custom" }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="text-center py-8">Loading templates...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email Templates</h2>
          <p className="text-muted-foreground">
            Choose from our professional templates or create your own
          </p>
        </div>
        <Badge variant="secondary">{templates.length} templates</Badge>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList>
            {categories.map((category) => (
              <TabsTrigger key={category.value} value={category.value}>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant={template.is_default ? "default" : "secondary"}>
                  {template.category}
                </Badge>
                {template.is_default && (
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                {template.description && (
                  <CardDescription className="mt-1">
                    {template.description}
                  </CardDescription>
                )}
              </div>

              {/* Template Preview */}
              <div 
                className="bg-muted rounded-lg p-4 h-32 overflow-hidden cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => setPreviewTemplate(template)}
              >
                <div 
                  className="text-xs scale-[0.3] origin-top-left transform w-[300%] h-[300%] bg-white rounded border shadow-sm"
                  dangerouslySetInnerHTML={{ __html: template.content }}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Button 
                  onClick={() => handleSelectTemplate(template)}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
                
                {onEditTemplate && (
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleEditTemplate(template)}
                    title="Edit Template"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setPreviewTemplate(template)}
                  title="Preview Template"
                >
                  <Eye className="h-4 w-4" />
                </Button>

                {!template.is_default && (
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setDeleteTemplate(template)}
                    title="Delete Template"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No templates found</h3>
          <p className="text-muted-foreground">
            {searchTerm || selectedCategory !== "all" 
              ? "Try adjusting your search or filter criteria"
              : "Create your first template to get started"
            }
          </p>
        </div>
      )}

      {/* Preview Modal */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{previewTemplate?.name}</DialogTitle>
            <DialogDescription>
              {previewTemplate?.description}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[70vh]">
            <div className="border rounded-lg overflow-hidden">
              <div 
                className="bg-white min-h-[400px]"
                dangerouslySetInnerHTML={{ __html: previewTemplate?.content || '' }}
              />
            </div>
          </ScrollArea>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
              Close
            </Button>
            {previewTemplate && onEditTemplate && (
              <Button variant="outline" onClick={() => {
                handleEditTemplate(previewTemplate);
                setPreviewTemplate(null);
              }}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Template
              </Button>
            )}
            {previewTemplate && (
              <Button onClick={() => {
                handleSelectTemplate(previewTemplate);
                setPreviewTemplate(null);
              }}>
                <Copy className="h-4 w-4 mr-2" />
                Use Template
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTemplate} onOpenChange={() => setDeleteTemplate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTemplate?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTemplate && handleDeleteTemplate(deleteTemplate)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Template
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export type { EmailTemplate };