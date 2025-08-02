import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Users, Edit, Trash2, UserPlus } from "lucide-react";

interface ContactList {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  contact_count?: number;
}

interface Contact {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
}

export function ContactLists() {
  const [lists, setLists] = useState<ContactList[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isManageContactsOpen, setIsManageContactsOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<ContactList | null>(null);
  const [listContacts, setListContacts] = useState<Contact[]>([]);
  const [editingList, setEditingList] = useState<ContactList | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  useEffect(() => {
    fetchLists();
    fetchContacts();
  }, []);

  const fetchLists = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_lists')
        .select(`
          *,
          contact_list_memberships(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Process the data to include contact count
      const listsWithCount = data?.map(list => ({
        ...list,
        contact_count: list.contact_list_memberships?.[0]?.count || 0
      })) || [];
      
      setLists(listsWithCount);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch contact lists",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('id, email, first_name, last_name')
        .order('first_name');

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const fetchListContacts = async (listId: string) => {
    try {
      const { data, error } = await supabase
        .from('contact_list_memberships')
        .select(`
          contacts (
            id,
            email,
            first_name,
            last_name
          )
        `)
        .eq('list_id', listId);

      if (error) throw error;
      setListContacts(data?.map(item => item.contacts).filter(Boolean) || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch list contacts",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const listData = {
        user_id: user.id,
        name: formData.name,
        description: formData.description || null
      };

      if (editingList) {
        const { error } = await supabase
          .from('contact_lists')
          .update(listData)
          .eq('id', editingList.id);

        if (error) throw error;
        toast({ title: "Success", description: "Contact list updated successfully" });
      } else {
        const { error } = await supabase
          .from('contact_lists')
          .insert(listData);

        if (error) throw error;
        toast({ title: "Success", description: "Contact list created successfully" });
      }

      resetForm();
      fetchLists();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (list: ContactList) => {
    setEditingList(list);
    setFormData({
      name: list.name,
      description: list.description || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (listId: string) => {
    try {
      const { error } = await supabase
        .from('contact_lists')
        .delete()
        .eq('id', listId);

      if (error) throw error;
      toast({ title: "Success", description: "Contact list deleted successfully" });
      fetchLists();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleManageContacts = (list: ContactList) => {
    setSelectedList(list);
    fetchListContacts(list.id);
    setIsManageContactsOpen(true);
  };

  const addContactToList = async (contactId: string) => {
    if (!selectedList) return;

    try {
      const { error } = await supabase
        .from('contact_list_memberships')
        .insert({
          contact_id: contactId,
          list_id: selectedList.id
        });

      if (error) throw error;
      toast({ title: "Success", description: "Contact added to list" });
      fetchListContacts(selectedList.id);
      fetchLists(); // Refresh counts
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const removeContactFromList = async (contactId: string) => {
    if (!selectedList) return;

    try {
      const { error } = await supabase
        .from('contact_list_memberships')
        .delete()
        .eq('contact_id', contactId)
        .eq('list_id', selectedList.id);

      if (error) throw error;
      toast({ title: "Success", description: "Contact removed from list" });
      fetchListContacts(selectedList.id);
      fetchLists(); // Refresh counts
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
      description: ""
    });
    setEditingList(null);
    setIsDialogOpen(false);
  };

  const availableContacts = contacts.filter(contact => 
    !listContacts.some(listContact => listContact.id === contact.id)
  );

  if (loading) {
    return <div>Loading contact lists...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Contact Lists</CardTitle>
              <CardDescription>
                Organize your contacts into targeted lists for campaigns
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create List
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingList ? "Edit Contact List" : "Create New Contact List"}
                  </DialogTitle>
                  <DialogDescription>
                    Enter the list details below
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">List Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Newsletter Subscribers"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the purpose of this list..."
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingList ? "Update" : "Create"} List
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lists.map((list) => (
              <Card key={list.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{list.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {list.description || "No description"}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(list)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(list.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {list.contact_count || 0} contacts
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleManageContacts(list)}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isManageContactsOpen} onOpenChange={setIsManageContactsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Manage Contacts - {selectedList?.name}</DialogTitle>
            <DialogDescription>
              Add or remove contacts from this list
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Available Contacts</h3>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {availableContacts.map((contact) => (
                  <div key={contact.id} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <div className="font-medium">
                        {contact.first_name || contact.last_name
                          ? `${contact.first_name || ''} ${contact.last_name || ''}`.trim()
                          : contact.email}
                      </div>
                      <div className="text-sm text-muted-foreground">{contact.email}</div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addContactToList(contact.id)}
                    >
                      Add
                    </Button>
                  </div>
                ))}
                {availableContacts.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    No available contacts
                  </p>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">List Members</h3>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {listContacts.map((contact) => (
                  <div key={contact.id} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <div className="font-medium">
                        {contact.first_name || contact.last_name
                          ? `${contact.first_name || ''} ${contact.last_name || ''}`.trim()
                          : contact.email}
                      </div>
                      <div className="text-sm text-muted-foreground">{contact.email}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeContactFromList(contact.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                {listContacts.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    No contacts in this list
                  </p>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}