import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Search, Filter, Bot, User, ArrowLeft } from 'lucide-react';

export default function AuditTrail() {
  const navigate = useNavigate();
  const [filterAction, setFilterAction] = useState('all');
  const [filterTriggered, setFilterTriggered] = useState('all');

  const auditEntries = [
    {
      id: 1,
      actionType: 'Reminder Email Sent',
      invoiceId: 'INV-10245',
      triggeredBy: 'System',
      timestamp: '2026-04-18 09:15:23',
      actionStatus: 'Success',
      overrideFlag: false,
      notes: 'Automated reminder for 15 days overdue',
    },
    {
      id: 2,
      actionType: 'Risk Score Updated',
      invoiceId: 'INV-10198',
      triggeredBy: 'System',
      timestamp: '2026-04-18 08:42:10',
      actionStatus: 'Success',
      overrideFlag: false,
      notes: 'ML model increased risk from Medium to High',
    },
    {
      id: 3,
      actionType: 'Payment Plan Created',
      invoiceId: 'INV-10312',
      triggeredBy: 'User (Sarah Mitchell)',
      timestamp: '2026-04-18 07:30:45',
      actionStatus: 'Success',
      overrideFlag: true,
      notes: 'Manual override: 3-month payment plan approved',
    },
    {
      id: 4,
      actionType: 'NLP Analysis Completed',
      invoiceId: 'INV-10156',
      triggeredBy: 'System',
      timestamp: '2026-04-18 07:12:33',
      actionStatus: 'Success',
      overrideFlag: false,
      notes: 'Promise-to-Pay detected with 94% confidence',
    },
    {
      id: 5,
      actionType: 'Escalation to Collections',
      invoiceId: 'INV-10178',
      triggeredBy: 'System',
      timestamp: '2026-04-18 06:55:18',
      actionStatus: 'Failed',
      overrideFlag: false,
      notes: 'Error: Collections queue full, retry scheduled',
    },
    {
      id: 6,
      actionType: 'Dispute Flag Added',
      invoiceId: 'INV-10189',
      triggeredBy: 'User (John Davis)',
      timestamp: '2026-04-18 06:20:02',
      actionStatus: 'Success',
      overrideFlag: true,
      notes: 'Manual override: Customer reported delivery date discrepancy',
    },
    {
      id: 7,
      actionType: 'Reconciliation Auto-Match',
      invoiceId: 'INV-10201',
      triggeredBy: 'System',
      timestamp: '2026-04-17 23:45:12',
      actionStatus: 'Success',
      overrideFlag: false,
      notes: 'RPA matched payment receipt BANK-45897',
    },
    {
      id: 8,
      actionType: 'Credit Note Issued',
      invoiceId: 'INV-10156',
      triggeredBy: 'User (Sarah Mitchell)',
      timestamp: '2026-04-17 22:10:55',
      actionStatus: 'Success',
      overrideFlag: true,
      notes: 'Manual override: $1,000 overpayment credited',
    },
    {
      id: 9,
      actionType: 'Prediction Run',
      invoiceId: 'INV-10312',
      triggeredBy: 'System',
      timestamp: '2026-04-17 21:30:40',
      actionStatus: 'Success',
      overrideFlag: false,
      notes: 'Daily batch prediction: 85% on-time probability',
    },
    {
      id: 10,
      actionType: 'Reminder Suppressed',
      invoiceId: 'INV-10245',
      triggeredBy: 'User (John Davis)',
      timestamp: '2026-04-17 20:15:28',
      actionStatus: 'Success',
      overrideFlag: true,
      notes: 'Manual override: Customer in active negotiation',
    },
  ];

  const filteredEntries = auditEntries.filter(entry => {
    if (filterAction !== 'all' && !entry.actionType.toLowerCase().includes(filterAction)) return false;
    if (filterTriggered === 'system' && entry.triggeredBy !== 'System') return false;
    if (filterTriggered === 'user' && entry.triggeredBy === 'System') return false;
    return true;
  });

  return (
    <div className="p-8">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate('/dashboard')}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>
      <div className="mb-8">
        <h1 className="text-2xl text-gray-900 mb-2">Automation & Audit Trail</h1>
        <p className="text-gray-600">Complete history of system actions and user overrides</p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Bot className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">System Actions</span>
            </div>
            <div className="text-2xl mb-1">
              {auditEntries.filter(e => e.triggeredBy === 'System').length}
            </div>
            <span className="text-xs text-gray-500">Last 24 hours</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <User className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600">User Actions</span>
            </div>
            <div className="text-2xl mb-1">
              {auditEntries.filter(e => e.triggeredBy !== 'System').length}
            </div>
            <span className="text-xs text-gray-500">Last 24 hours</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-2">Successful</div>
            <div className="text-2xl mb-1 text-green-600">
              {auditEntries.filter(e => e.actionStatus === 'Success').length}
            </div>
            <span className="text-xs text-gray-500">
              {Math.round((auditEntries.filter(e => e.actionStatus === 'Success').length / auditEntries.length) * 100)}% success rate
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-2">Overrides</div>
            <div className="text-2xl mb-1 text-orange-600">
              {auditEntries.filter(e => e.overrideFlag).length}
            </div>
            <span className="text-xs text-gray-500">Manual interventions</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Activity Log</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input placeholder="Search actions..." className="pl-9 w-64" />
              </div>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="reminder">Reminders</SelectItem>
                  <SelectItem value="prediction">Predictions</SelectItem>
                  <SelectItem value="nlp">NLP Analysis</SelectItem>
                  <SelectItem value="reconciliation">Reconciliation</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterTriggered} onValueChange={setFilterTriggered}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="system">System Only</SelectItem>
                  <SelectItem value="user">User Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action Type</TableHead>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Triggered By</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Override</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.actionType}</TableCell>
                  <TableCell>{entry.invoiceId}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {entry.triggeredBy === 'System' ? (
                        <>
                          <Bot className="w-4 h-4 text-blue-600" />
                          <span>System</span>
                        </>
                      ) : (
                        <>
                          <User className="w-4 h-4 text-purple-600" />
                          <span>{entry.triggeredBy.replace('User (', '').replace(')', '')}</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{entry.timestamp}</TableCell>
                  <TableCell>
                    <Badge variant={entry.actionStatus === 'Success' ? 'outline' : 'destructive'}>
                      {entry.actionStatus === 'Success' && <span className="text-green-700 bg-green-50">Success</span>}
                      {entry.actionStatus === 'Failed' && <span>Failed</span>}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {entry.overrideFlag && (
                      <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">
                        Override
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 max-w-xs">{entry.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
