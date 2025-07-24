import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePickerWithRange } from '@/components/ui/date-picker'
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar,
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MousePointer, 
  Mail, 
  Users,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Calendar,
  Filter,
  Download,
  Share
} from 'lucide-react'

// Mock data - replace with real data from your backend
const campaignData = [
  { name: 'Jan', sent: 4000, delivered: 3800, opened: 1200, clicked: 280 },
  { name: 'Feb', sent: 3000, delivered: 2900, opened: 890, clicked: 195 },
  { name: 'Mar', sent: 2000, delivered: 1950, opened: 680, clicked: 142 },
  { name: 'Apr', sent: 2780, delivered: 2710, opened: 920, clicked: 201 },
  { name: 'May', sent: 1890, delivered: 1850, opened: 590, clicked: 128 },
  { name: 'Jun', sent: 2390, delivered: 2340, opened: 780, clicked: 175 },
]

const engagementData = [
  { time: '00:00', opens: 12, clicks: 3 },
  { time: '04:00', opens: 8, clicks: 1 },
  { time: '08:00', opens: 45, clicks: 12 },
  { time: '12:00', opens: 38, clicks: 8 },
  { time: '16:00', opens: 52, clicks: 15 },
  { time: '20:00', opens: 28, clicks: 6 },
]

const deviceData = [
  { name: 'Desktop', value: 45, color: '#8b5cf6' },
  { name: 'Mobile', value: 40, color: '#10b981' },
  { name: 'Tablet', value: 15, color: '#f59e0b' },
]

const geographicData = [
  { country: 'United States', opens: 1234, clicks: 289, rate: 23.4 },
  { country: 'United Kingdom', opens: 856, clicks: 198, rate: 23.1 },
  { country: 'Canada', opens: 642, clicks: 142, rate: 22.1 },
  { country: 'Germany', opens: 489, clicks: 98, rate: 20.0 },
  { country: 'France', opens: 367, clicks: 71, rate: 19.3 },
]

const topCampaigns = [
  { id: 1, name: 'Welcome Series #3', sent: 5420, opens: 1342, clicks: 289, rate: 24.8 },
  { id: 2, name: 'Product Launch', sent: 3210, opens: 789, clicks: 156, rate: 24.6 },
  { id: 3, name: 'Newsletter #42', sent: 8950, opens: 2156, clicks: 387, rate: 24.1 },
  { id: 4, name: 'Holiday Special', sent: 2340, opens: 534, clicks: 98, rate: 22.8 },
  { id: 5, name: 'Feature Update', sent: 1820, opens: 398, clicks: 67, rate: 21.9 },
]

interface AdvancedAnalyticsProps {
  className?: string
}

export const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ className }) => {
  const [dateRange, setDateRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('engagement')

  const stats = {
    totalSent: 25430,
    deliveryRate: 98.2,
    openRate: 24.8,
    clickRate: 6.9,
    unsubscribeRate: 0.3,
    bounceRate: 1.8,
    growth: {
      sent: 12.5,
      opens: 8.3,
      clicks: 15.2,
      deliveries: 2.1
    }
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into your email performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emails Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSent.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-success" />
              <span className="text-success">+{stats.growth.sent}%</span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-success" />
              <span className="text-success">+{stats.growth.opens}%</span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clickRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-success" />
              <span className="text-success">+{stats.growth.clicks}%</span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.deliveryRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-success" />
              <span className="text-success">+{stats.growth.deliveries}%</span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Campaign Performance Trends</CardTitle>
            <CardDescription>Email metrics over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={campaignData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sent" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Sent"
                />
                <Line 
                  type="monotone" 
                  dataKey="delivered" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  name="Delivered"
                />
                <Line 
                  type="monotone" 
                  dataKey="opened" 
                  stroke="hsl(var(--warning))" 
                  strokeWidth={2}
                  name="Opened"
                />
                <Line 
                  type="monotone" 
                  dataKey="clicked" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={2}
                  name="Clicked"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Engagement by Time</CardTitle>
            <CardDescription>Best times to send emails</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="opens" 
                  stackId="1"
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.6}
                  name="Opens"
                />
                <Area 
                  type="monotone" 
                  dataKey="clicks" 
                  stackId="1"
                  stroke="hsl(var(--success))" 
                  fill="hsl(var(--success))" 
                  fillOpacity={0.6}
                  name="Clicks"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Detailed Analytics</CardTitle>
          <CardDescription>Deep dive into your email performance data</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="geography">Geography</TabsTrigger>
              <TabsTrigger value="campaigns">Top Campaigns</TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-destructive">{stats.bounceRate}%</div>
                  <div className="text-sm text-muted-foreground">Bounce Rate</div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-warning">{stats.unsubscribeRate}%</div>
                  <div className="text-sm text-muted-foreground">Unsubscribe Rate</div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-success">4.2x</div>
                  <div className="text-sm text-muted-foreground">ROI</div>
                </div>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={campaignData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="opened" fill="hsl(var(--primary))" name="Opens" />
                    <Bar dataKey="clicked" fill="hsl(var(--success))" name="Clicks" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="devices" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-4">
                  {deviceData.map((device, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {device.name === 'Desktop' && <Monitor className="w-5 h-5 text-muted-foreground" />}
                        {device.name === 'Mobile' && <Smartphone className="w-5 h-5 text-muted-foreground" />}
                        {device.name === 'Tablet' && <Globe className="w-5 h-5 text-muted-foreground" />}
                        <span className="font-medium">{device.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{device.value}%</div>
                        <div className="text-sm text-muted-foreground">of opens</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="geography" className="space-y-4">
              {geographicData.map((country, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Globe className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{country.country}</div>
                      <div className="text-sm text-muted-foreground">{country.opens} opens</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{country.rate}%</div>
                    <div className="text-sm text-muted-foreground">{country.clicks} clicks</div>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="campaigns" className="space-y-4">
              {topCampaigns.map((campaign, index) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <div>
                      <div className="font-medium">{campaign.name}</div>
                      <div className="text-sm text-muted-foreground">{campaign.sent} sent</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{campaign.rate}%</div>
                    <div className="text-sm text-muted-foreground">
                      {campaign.opens} opens • {campaign.clicks} clicks
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}