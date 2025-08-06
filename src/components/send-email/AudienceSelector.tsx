import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Users, Filter, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContactList {
  id: string;
  name: string;
  description?: string;
  contact_count: number;
}

interface Segment {
  id: string;
  name: string;
  description?: string;
  contact_count: number;
  criteria: any;
}

interface Contact {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company?: string;
}

interface AudienceSelection {
  type: 'list' | 'segment' | 'contacts';
  id: string;
  name: string;
  count: number;
  emails?: string[];
}

interface AudienceSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (selection: AudienceSelection) => void;
  currentSelection?: AudienceSelection;
}

export function AudienceSelector({ open, onOpenChange, onSelect, currentSelection }: AudienceSelectorProps) {
  const [lists, setLists] = useState<ContactList[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load contact lists with counts
      const { data: listsData } = await supabase
        .from('contact_lists')
        .select(`
          id,
          name,
          description,
          contact_list_memberships(count)
        `);

      // Load segments with counts  
      const { data: segmentsData } = await supabase
        .from('segments')
        .select('*');

      // Load contacts
      const { data: contactsData } = await supabase
        .from('contacts')
        .select('id, email, first_name, last_name, company')
        .limit(100);

      setLists(listsData?.map(list => ({
        ...list,
        contact_count: list.contact_list_memberships?.length || 0
      })) || []);

      setSegments(segmentsData || []);
      setContacts(contactsData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load audience data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectList = async (list: ContactList) => {
    try {
      // Get actual emails from the list
      const { data: membershipData } = await supabase
        .from('contact_list_memberships')
        .select(`
          contacts(email)
        `)
        .eq('list_id', list.id);

      const emails = membershipData?.map(m => m.contacts?.email).filter(Boolean) || [];

      onSelect({
        type: 'list',
        id: list.id,
        name: list.name,
        count: emails.length,
        emails
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load list contacts",
        variant: "destructive"
      });
    }
  };

  const handleSelectSegment = (segment: Segment) => {
    onSelect({
      type: 'segment',
      id: segment.id,
      name: segment.name,
      count: segment.contact_count,
      emails: [] // Will be calculated when sending
    });
    onOpenChange(false);
  };

  const handleSelectContacts = () => {
    const emails = selectedContacts.map(c => c.email);
    onSelect({
      type: 'contacts',
      id: 'selected-contacts',
      name: `${selectedContacts.length} Selected Contacts`,
      count: selectedContacts.length,
      emails
    });
    onOpenChange(false);
  };

  const toggleContact = (contact: Contact) => {
    setSelectedContacts(prev => {
      const exists = prev.find(c => c.id === contact.id);
      if (exists) {
        return prev.filter(c => c.id !== contact.id);
      } else {
        return [...prev, contact];
      }
    });
  };

  const filteredContacts = contacts.filter(contact =>
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select Your Audience</DialogTitle>
          <DialogDescription>
            Choose who should receive your email campaign
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="lists" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="lists">Contact Lists</TabsTrigger>
            <TabsTrigger value="segments">Segments</TabsTrigger>
            <TabsTrigger value="contacts">Individual Contacts</TabsTrigger>
          </TabsList>

          <TabsContent value="lists" className="space-y-4">
            <ScrollArea className="h-[400px]">
              <div className="grid gap-3">
                {lists.map((list) => (
                  <Card 
                    key={list.id} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSelectList(list)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{list.name}</h3>
                            {list.description && (
                              <p className="text-sm text-muted-foreground">{list.description}</p>
                            )}
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {list.contact_count} contacts
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {lists.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No contact lists found. Create one in the Contacts section.
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="segments" className="space-y-4">
            <ScrollArea className="h-[400px]">
              <div className="grid gap-3">
                {segments.map((segment) => (
                  <Card 
                    key={segment.id} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSelectSegment(segment)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Filter className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{segment.name}</h3>
                            {segment.description && (
                              <p className="text-sm text-muted-foreground">{segment.description}</p>
                            )}
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {segment.contact_count} contacts
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {segments.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No segments found. Create one in the Contacts section.
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              {selectedContacts.length > 0 && (
                <Button onClick={handleSelectContacts}>
                  Select {selectedContacts.length} Contacts
                </Button>
              )}
            </div>

            <ScrollArea className="h-[350px]">
              <div className="space-y-2">
                {filteredContacts.map((contact) => (
                  <div 
                    key={contact.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                    onClick={() => toggleContact(contact)}
                  >
                    <Checkbox 
                      checked={selectedContacts.some(c => c.id === contact.id)}
                      onChange={() => toggleContact(contact)}
                    />
                    <div className="flex items-center space-x-2 flex-1">
                      <div className="p-1 bg-primary/10 rounded">
                        <Mail className="h-3 w-3 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">
                          {contact.first_name || contact.last_name 
                            ? `${contact.first_name || ''} ${contact.last_name || ''}`.trim()
                            : contact.email
                          }
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {contact.email}
                          {contact.company && ` • ${contact.company}`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredContacts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchTerm ? 'No contacts match your search' : 'No contacts found'}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}