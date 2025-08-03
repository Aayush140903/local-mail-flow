import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignManagement } from "@/components/campaigns/CampaignManagement";
import { DripsAndAutomation } from "@/components/campaigns/DripsAndAutomation";
import { ABTestingManager } from "@/components/campaigns/ABTestingManager";

export default function Campaigns() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Campaign Management</h1>
          <p className="text-muted-foreground">
            Create, schedule, and manage your email campaigns
          </p>
        </div>

        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="automation">Drips & Automation</TabsTrigger>
            <TabsTrigger value="testing">A/B Testing</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-6">
            <CampaignManagement />
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <DripsAndAutomation />
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <ABTestingManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}