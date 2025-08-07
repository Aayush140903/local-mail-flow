import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, FileText, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactLists } from "@/components/contacts/ContactLists";
import { ContactManagement } from "@/components/contacts/ContactManagement";
import { SegmentBuilder } from "@/components/contacts/SegmentBuilder";
import { GDPRCompliance } from "@/components/contacts/GDPRCompliance";
import { PageTooltip } from "@/components/shared/PageTooltip";

export default function Contacts() {
  const [activeTab, setActiveTab] = useState("contacts");

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Contact Management</h1>
            <p className="text-muted-foreground">
              Manage your contacts, create segments, and ensure GDPR compliance
            </p>
          </div>
          <PageTooltip 
            title="Contact Management Guide"
            description="Learn how to manage contacts, create lists and segments"
            features={[
              {
                title: "Contact Management",
                description: "Add, edit, and organize your contacts",
                steps: ["Import contacts from CSV", "Add contacts manually", "Edit contact details", "View contact history"]
              },
              {
                title: "Contact Lists",
                description: "Create and manage contact lists",
                steps: ["Create new list", "Add contacts to lists", "Export lists", "Manage list settings"]
              },
              {
                title: "Segments",
                description: "Create targeted segments with filters",
                steps: ["Define segment criteria", "Preview segment results", "Save and name segment", "Use in campaigns"]
              },
              {
                title: "GDPR Compliance",
                description: "Manage consent and data protection",
                steps: ["Track consent status", "Handle data requests", "Manage opt-outs", "Export compliance reports"]
              }
            ]}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="contacts" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Contacts
          </TabsTrigger>
          <TabsTrigger value="lists" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Lists
          </TabsTrigger>
          <TabsTrigger value="segments" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Segments
          </TabsTrigger>
          <TabsTrigger value="gdpr" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            GDPR
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-6">
          <ContactManagement />
        </TabsContent>

        <TabsContent value="lists" className="space-y-6">
          <ContactLists />
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          <SegmentBuilder />
        </TabsContent>

        <TabsContent value="gdpr" className="space-y-6">
          <GDPRCompliance />
        </TabsContent>
      </Tabs>
    </div>
  );
}