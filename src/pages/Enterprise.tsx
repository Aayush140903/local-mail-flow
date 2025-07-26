import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamManagement } from "@/components/enterprise/TeamManagement";
import { SecurityAudit } from "@/components/enterprise/SecurityAudit";
import { MultiTenancy } from "@/components/enterprise/MultiTenancy";

export default function Enterprise() {
  const [selectedTab, setSelectedTab] = useState("team");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Enterprise Features</h1>
        <p className="text-muted-foreground">
          Advanced team collaboration, security, and multi-tenant management
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="team">Team Management</TabsTrigger>
          <TabsTrigger value="security">Security & Audit</TabsTrigger>
          <TabsTrigger value="tenancy">Multi-Tenancy</TabsTrigger>
        </TabsList>

        <TabsContent value="team">
          <TeamManagement />
        </TabsContent>

        <TabsContent value="security">
          <SecurityAudit />
        </TabsContent>

        <TabsContent value="tenancy">
          <MultiTenancy />
        </TabsContent>
      </Tabs>
    </div>
  );
}