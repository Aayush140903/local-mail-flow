import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Clock, Play, Pause, RotateCcw, AlertCircle, CheckCircle, Timer, Search } from 'lucide-react';
import { emailService, EmailQueue as EmailQueueType } from '@/services/emailService';
import { formatDistanceToNow } from 'date-fns';

export function EmailQueue() {
  const [queues, setQueues] = useState<EmailQueueType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadQueues();
    const interval = setInterval(loadQueues, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadQueues = async () => {
    try {
      const data = await emailService.getEmailQueue();
      setQueues(data);
    } catch (error) {
      console.error('Failed to load queues:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Timer className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      processing: 'default',
      completed: 'default',
      failed: 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: 'secondary',
      normal: 'outline',
      high: 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[priority as keyof typeof variants] || 'outline'}>
        {priority}
      </Badge>
    );
  };

  const filteredQueues = queues.filter(queue => {
    if (filter !== 'all' && queue.status !== filter) return false;
    if (searchQuery && !queue.campaignId.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const queueStats = {
    total: queues.length,
    pending: queues.filter(q => q.status === 'pending').length,
    processing: queues.filter(q => q.status === 'processing').length,
    completed: queues.filter(q => q.status === 'completed').length,
    failed: queues.filter(q => q.status === 'failed').length
  };

  if (isLoading) {
    return <div>Loading email queue...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Email Queue</h2>
          <p className="text-muted-foreground">Monitor and manage email processing queues</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Play className="mr-2 h-4 w-4" />
            Resume All
          </Button>
          <Button variant="outline" size="sm">
            <Pause className="mr-2 h-4 w-4" />
            Pause All
          </Button>
        </div>
      </div>

      {/* Queue Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Queues</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queueStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{queueStats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Timer className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{queueStats.processing}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{queueStats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{queueStats.failed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>
        
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Queue Table */}
      <Card>
        <CardHeader>
          <CardTitle>Queue Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Queue ID</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Email Count</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Retries</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQueues.map((queue) => (
                <TableRow key={queue.id}>
                  <TableCell className="font-mono text-sm">{queue.id}</TableCell>
                  <TableCell>{queue.campaignId}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(queue.status)}
                      {getStatusBadge(queue.status)}
                    </div>
                  </TableCell>
                  <TableCell>{getPriorityBadge(queue.priority)}</TableCell>
                  <TableCell>{queue.emailCount.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="w-24">
                      <Progress 
                        value={queue.status === 'completed' ? 100 : queue.status === 'processing' ? 65 : 0} 
                        className="h-2"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(queue.createdAt, { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <span className={queue.retryCount > 0 ? 'text-red-600' : ''}>
                      {queue.retryCount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {queue.status === 'failed' && (
                        <Button variant="outline" size="sm">
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      )}
                      {queue.status === 'processing' && (
                        <Button variant="outline" size="sm">
                          <Pause className="h-3 w-3" />
                        </Button>
                      )}
                      {queue.status === 'pending' && (
                        <Button variant="outline" size="sm">
                          <Play className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Real-time Updates Indicator */}
      <div className="flex items-center justify-center text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live updates every 5 seconds</span>
        </div>
      </div>
    </div>
  );
}