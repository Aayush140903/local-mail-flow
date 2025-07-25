import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProviderManagement } from '@/components/backend/ProviderManagement';
import { EmailQueue } from '@/components/backend/EmailQueue';
import { DomainVerification } from '@/components/backend/DomainVerification';

export default function Infrastructure() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Infrastructure</h1>
        <p className="text-muted-foreground">
          Manage email providers, queues, and domain authentication
        </p>
      </div>

      <Tabs defaultValue="providers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="providers">Email Providers</TabsTrigger>
          <TabsTrigger value="queue">Email Queue</TabsTrigger>
          <TabsTrigger value="domains">Domain Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-6">
          <ProviderManagement />
        </TabsContent>

        <TabsContent value="queue" className="space-y-6">
          <EmailQueue />
        </TabsContent>

        <TabsContent value="domains" className="space-y-6">
          <DomainVerification />
        </TabsContent>
      </Tabs>
    </div>
  );
}