import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdvancedAnalytics } from '@/components/analytics/AdvancedAnalytics';
import { ComprehensiveAnalytics } from '@/components/analytics/ComprehensiveAnalytics';
import { CustomReportBuilder } from '@/components/analytics/CustomReportBuilder';
import { PageTooltip } from "@/components/shared/PageTooltip";

export default function Analytics() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Comprehensive analytics and business intelligence for your email campaigns
            </p>
          </div>
          <PageTooltip 
            title="Analytics Guide"
            description="Understand your email performance with detailed analytics"
            features={[
              {
                title: "Overview Analytics",
                description: "View key metrics and campaign performance",
                steps: ["Check delivery rates", "Monitor open rates", "Analyze click rates", "Review bounce rates"]
              },
              {
                title: "Advanced Analytics",
                description: "Deep dive into campaign performance",
                steps: ["View time-based trends", "Analyze geographic data", "Check device breakdowns", "Compare campaigns"]
              },
              {
                title: "Custom Reports",
                description: "Create personalized analytics reports",
                steps: ["Select date ranges", "Choose metrics", "Apply filters", "Export reports"]
              }
            ]}
          />
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Analytics</TabsTrigger>
          <TabsTrigger value="reports">Custom Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AdvancedAnalytics />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <ComprehensiveAnalytics />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <CustomReportBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
}