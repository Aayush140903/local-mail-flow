import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Download, Filter, Save, Share, Calendar, TrendingUp, BarChart3 } from 'lucide-react';

interface ReportConfig {
  name: string;
  metrics: string[];
  dimensions: string[];
  filters: any[];
  dateRange: { from: Date; to: Date };
  visualization: 'table' | 'bar' | 'line' | 'pie';
}

export function CustomReportBuilder() {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    name: 'Custom Report',
    metrics: ['opens', 'clicks'],
    dimensions: ['date'],
    filters: [],
    dateRange: { 
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
      to: new Date() 
    },
    visualization: 'line'
  });
  
  const [reportData, setReportData] = useState<any[]>([]);
  const [savedReports, setSavedReports] = useState<ReportConfig[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const availableMetrics = [
    { id: 'opens', name: 'Opens', category: 'Engagement' },
    { id: 'clicks', name: 'Clicks', category: 'Engagement' },
    { id: 'bounces', name: 'Bounces', category: 'Delivery' },
    { id: 'unsubscribes', name: 'Unsubscribes', category: 'Engagement' },
    { id: 'conversions', name: 'Conversions', category: 'Revenue' },
    { id: 'revenue', name: 'Revenue', category: 'Revenue' },
    { id: 'delivered', name: 'Delivered', category: 'Delivery' },
    { id: 'spam_complaints', name: 'Spam Complaints', category: 'Delivery' }
  ];

  const availableDimensions = [
    { id: 'date', name: 'Date' },
    { id: 'campaign', name: 'Campaign' },
    { id: 'country', name: 'Country' },
    { id: 'device', name: 'Device' },
    { id: 'email_client', name: 'Email Client' },
    { id: 'subject_line', name: 'Subject Line' },
    { id: 'sending_hour', name: 'Sending Hour' },
    { id: 'day_of_week', name: 'Day of Week' }
  ];

  const filterOperators = [
    { id: 'equals', name: 'Equals' },
    { id: 'not_equals', name: 'Not Equals' },
    { id: 'contains', name: 'Contains' },
    { id: 'greater_than', name: 'Greater Than' },
    { id: 'less_than', name: 'Less Than' },
    { id: 'in', name: 'In List' }
  ];

  useEffect(() => {
    // Load saved reports
    const saved = localStorage.getItem('savedReports');
    if (saved) {
      setSavedReports(JSON.parse(saved));
    }
  }, []);

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      // Mock report generation
      const mockData = [
        { date: '2024-01-01', opens: 1200, clicks: 240, bounces: 35, conversions: 48 },
        { date: '2024-01-02', opens: 1350, clicks: 280, bounces: 28, conversions: 52 },
        { date: '2024-01-03', opens: 1100, clicks: 190, bounces: 42, conversions: 38 },
        { date: '2024-01-04', opens: 1450, clicks: 320, bounces: 31, conversions: 64 },
        { date: '2024-01-05', opens: 1380, clicks: 295, bounces: 29, conversions: 59 }
      ];
      
      setReportData(mockData);
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveReport = () => {
    const newSavedReports = [...savedReports, { ...reportConfig, name: reportConfig.name || `Report ${savedReports.length + 1}` }];
    setSavedReports(newSavedReports);
    localStorage.setItem('savedReports', JSON.stringify(newSavedReports));
  };

  const loadReport = (savedReport: ReportConfig) => {
    setReportConfig(savedReport);
    generateReport();
  };

  const addFilter = () => {
    setReportConfig({
      ...reportConfig,
      filters: [...reportConfig.filters, { dimension: '', operator: 'equals', value: '' }]
    });
  };

  const updateFilter = (index: number, field: string, value: any) => {
    const newFilters = [...reportConfig.filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setReportConfig({ ...reportConfig, filters: newFilters });
  };

  const removeFilter = (index: number) => {
    const newFilters = reportConfig.filters.filter((_, i) => i !== index);
    setReportConfig({ ...reportConfig, filters: newFilters });
  };

  const exportReport = (format: 'csv' | 'pdf' | 'excel') => {
    // Mock export functionality
    console.log(`Exporting report as ${format}`);
  };

  const renderVisualization = () => {
    if (!reportData.length) return null;

    switch (reportConfig.visualization) {
      case 'bar':
        return (
          <ChartContainer config={{}} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={reportConfig.dimensions[0]} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                {reportConfig.metrics.map((metric, index) => (
                  <Bar key={metric} dataKey={metric} fill={`hsl(var(--chart-${index + 1}))`} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        );
      
      case 'line':
        return (
          <ChartContainer config={{}} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={reportConfig.dimensions[0]} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                {reportConfig.metrics.map((metric, index) => (
                  <Line 
                    key={metric} 
                    type="monotone" 
                    dataKey={metric} 
                    stroke={`hsl(var(--chart-${index + 1}))`} 
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        );
      
      default:
        return (
          <Table>
            <TableHeader>
              <TableRow>
                {reportConfig.dimensions.map(dim => (
                  <TableHead key={dim}>{availableDimensions.find(d => d.id === dim)?.name}</TableHead>
                ))}
                {reportConfig.metrics.map(metric => (
                  <TableHead key={metric}>{availableMetrics.find(m => m.id === metric)?.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.map((row, index) => (
                <TableRow key={index}>
                  {reportConfig.dimensions.map(dim => (
                    <TableCell key={dim}>{row[dim]}</TableCell>
                  ))}
                  {reportConfig.metrics.map(metric => (
                    <TableCell key={metric}>{row[metric]?.toLocaleString()}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Custom Report Builder</h2>
          <p className="text-muted-foreground">Create custom analytics reports with your own metrics and dimensions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={saveReport}>
            <Save className="mr-2 h-4 w-4" />
            Save Report
          </Button>
          <Button onClick={generateReport} disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Report Configuration */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Report Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Report Name */}
            <div className="space-y-2">
              <Label htmlFor="reportName">Report Name</Label>
              <Input
                id="reportName"
                value={reportConfig.name}
                onChange={(e) => setReportConfig({ ...reportConfig, name: e.target.value })}
                placeholder="Enter report name"
              />
            </div>

            {/* Metrics Selection */}
            <div className="space-y-2">
              <Label>Metrics</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {availableMetrics.map((metric) => (
                  <div key={metric.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={metric.id}
                      checked={reportConfig.metrics.includes(metric.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setReportConfig({
                            ...reportConfig,
                            metrics: [...reportConfig.metrics, metric.id]
                          });
                        } else {
                          setReportConfig({
                            ...reportConfig,
                            metrics: reportConfig.metrics.filter(m => m !== metric.id)
                          });
                        }
                      }}
                    />
                    <Label htmlFor={metric.id} className="text-sm">
                      {metric.name}
                      <span className="text-xs text-muted-foreground ml-1">({metric.category})</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Dimensions Selection */}
            <div className="space-y-2">
              <Label>Dimensions</Label>
              <div className="space-y-2">
                {availableDimensions.map((dimension) => (
                  <div key={dimension.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={dimension.id}
                      checked={reportConfig.dimensions.includes(dimension.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setReportConfig({
                            ...reportConfig,
                            dimensions: [...reportConfig.dimensions, dimension.id]
                          });
                        } else {
                          setReportConfig({
                            ...reportConfig,
                            dimensions: reportConfig.dimensions.filter(d => d !== dimension.id)
                          });
                        }
                      }}
                    />
                    <Label htmlFor={dimension.id} className="text-sm">{dimension.name}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Visualization Type */}
            <div className="space-y-2">
              <Label>Visualization</Label>
              <Select 
                value={reportConfig.visualization} 
                onValueChange={(value: any) => setReportConfig({ ...reportConfig, visualization: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="table">Table</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="flex space-x-2">
                <DatePicker
                  selected={reportConfig.dateRange.from}
                  onSelect={(date) => date && setReportConfig({
                    ...reportConfig,
                    dateRange: { ...reportConfig.dateRange, from: date }
                  })}
                />
                <DatePicker
                  selected={reportConfig.dateRange.to}
                  onSelect={(date) => date && setReportConfig({
                    ...reportConfig,
                    dateRange: { ...reportConfig.dateRange, to: date }
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Display */}
        <div className="lg:col-span-3 space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Filters</CardTitle>
                <Button variant="outline" size="sm" onClick={addFilter}>
                  <Filter className="mr-2 h-4 w-4" />
                  Add Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {reportConfig.filters.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No filters applied</p>
              ) : (
                <div className="space-y-3">
                  {reportConfig.filters.map((filter, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Select 
                        value={filter.dimension} 
                        onValueChange={(value) => updateFilter(index, 'dimension', value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Dimension" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableDimensions.map(dim => (
                            <SelectItem key={dim.id} value={dim.id}>{dim.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select 
                        value={filter.operator} 
                        onValueChange={(value) => updateFilter(index, 'operator', value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Operator" />
                        </SelectTrigger>
                        <SelectContent>
                          {filterOperators.map(op => (
                            <SelectItem key={op.id} value={op.id}>{op.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Input
                        value={filter.value}
                        onChange={(e) => updateFilter(index, 'value', e.target.value)}
                        placeholder="Value"
                        className="flex-1"
                      />
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => removeFilter(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Report Results */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Report Results</CardTitle>
                {reportData.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => exportReport('csv')}>
                      <Download className="mr-2 h-4 w-4" />
                      CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportReport('excel')}>
                      <Download className="mr-2 h-4 w-4" />
                      Excel
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportReport('pdf')}>
                      <Download className="mr-2 h-4 w-4" />
                      PDF
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {reportData.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No Report Generated</h3>
                  <p className="text-muted-foreground">Configure your report settings and click "Generate Report"</p>
                </div>
              ) : (
                renderVisualization()
              )}
            </CardContent>
          </Card>

          {/* Saved Reports */}
          {savedReports.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Saved Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                  {savedReports.map((report, index) => (
                    <div 
                      key={index} 
                      className="p-3 border rounded-lg cursor-pointer hover:bg-accent"
                      onClick={() => loadReport(report)}
                    >
                      <div className="font-medium">{report.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {report.metrics.length} metrics, {report.dimensions.length} dimensions
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}