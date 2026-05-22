import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function PromiseToPayList() {
  const navigate = useNavigate();
  const [resolvedPromises, setResolvedPromises] = useState<string[]>([]);

  useEffect(() => {
    // Check which promises have been resolved
    const resolved: string[] = [];
    ['INV-10156', 'INV-10201', 'INV-10299', 'INV-10134', 'INV-10267'].forEach(id => {
      if (localStorage.getItem(`resolved_${id}`) === 'true') {
        resolved.push(id);
      }
    });
    setResolvedPromises(resolved);
  }, []);

  const allPromises = [
    { invoice: 'INV-10156', customer: 'BuildTech LLC', amount: '$28,000', promiseDate: '2026-04-22', confidence: 0.94, status: 'Active' },
    { invoice: 'INV-10201', customer: 'MediSupply Co', amount: '$15,400', promiseDate: '2026-04-25', confidence: 0.88, status: 'Active' },
    { invoice: 'INV-10299', customer: 'Retail Solutions', amount: '$31,200', promiseDate: '2026-04-28', confidence: 0.91, status: 'Active' },
    { invoice: 'INV-10134', customer: 'Tech Innovations', amount: '$22,500', promiseDate: '2026-04-20', confidence: 0.87, status: 'Overdue' },
    { invoice: 'INV-10267', customer: 'Global Logistics', amount: '$19,800', promiseDate: '2026-04-30', confidence: 0.92, status: 'Active' },
  ];

  const promises = allPromises.map(p => ({
    ...p,
    status: resolvedPromises.includes(p.invoice) ? 'Resolved' : p.status
  }));

  const activeCount = promises.filter(p => p.status === 'Active').length;
  const resolvedCount = promises.filter(p => p.status === 'Resolved').length;

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
        <h1 className="text-2xl text-gray-900 mb-2">All Promise-to-Pay Commitments</h1>
        <p className="text-gray-600">Customer payment promises tracked by AI</p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-2">Total Promises</div>
            <div className="text-2xl mb-1">{promises.length}</div>
            <span className="text-xs text-gray-500">All commitments</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-2">Active</div>
            <div className="text-2xl mb-1 text-blue-600">{activeCount}</div>
            <span className="text-xs text-gray-500">Pending</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-2">Resolved</div>
            <div className="text-2xl mb-1 text-green-600">{resolvedCount}</div>
            <span className="text-xs text-gray-500">Completed</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-2">Total Amount</div>
            <div className="text-2xl mb-1">$117,900</div>
            <span className="text-xs text-gray-500">Expected</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            Promise-to-Pay Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Promise Date</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promises.map((row) => (
                <TableRow key={row.invoice}>
                  <TableCell className="font-medium">{row.invoice}</TableCell>
                  <TableCell>{row.customer}</TableCell>
                  <TableCell className="text-right">{row.amount}</TableCell>
                  <TableCell>{row.promiseDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {Math.round(row.confidence * 100)}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      row.status === 'Active' ? 'outline' :
                      row.status === 'Resolved' ? 'outline' :
                      'secondary'
                    }>
                      {row.status === 'Active' && <span className="text-blue-700 bg-blue-50">{row.status}</span>}
                      {row.status === 'Resolved' && <span className="text-green-700 bg-green-50">{row.status}</span>}
                      {row.status !== 'Active' && row.status !== 'Resolved' && row.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/nlp-promise-to-pay/${row.invoice}`)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
