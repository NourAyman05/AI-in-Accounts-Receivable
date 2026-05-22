import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import DisputeReviewModal from './DisputeReviewModal';

export default function Disputes() {
  const navigate = useNavigate();
  const [reviewedDisputes, setReviewedDisputes] = useState<string[]>([]);
  const [disputeStatuses, setDisputeStatuses] = useState<Record<string, string>>({
    'INV-10178': 'Pending',
    'INV-10189': 'Under Review',
    'INV-10234': 'Pending',
    'INV-10267': 'Resolved',
  });
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReview = (dispute: any) => {
    if (dispute.status === 'Resolved') {
      toast.info('Dispute Resolution Details', {
        description: `${dispute.invoice}: Resolved on 2026-04-14. Customer accepted adjusted invoice amount.`,
        duration: 5000,
      });
      return;
    }
    setSelectedDispute(dispute);
    setIsModalOpen(true);
  };

  const handleSubmitResolution = (resolution: string, notes: string) => {
    if (selectedDispute) {
      setReviewedDisputes([...reviewedDisputes, selectedDispute.invoice]);
      setDisputeStatuses({
        ...disputeStatuses,
        [selectedDispute.invoice]: 'Under Review',
      });
      toast.success('Resolution submitted', {
        description: `${selectedDispute.invoice} moved to Under Review status`,
      });
      setIsModalOpen(false);
      setSelectedDispute(null);
    }
  };

  const disputes = [
    { invoice: 'INV-10178', customer: 'Retail Group', amount: '$42,300', reason: 'Invoice amount discrepancy', status: disputeStatuses['INV-10178'], submittedDate: '2026-04-15' },
    { invoice: 'INV-10189', customer: 'Manufacturing Inc', amount: '$24,500', reason: 'Delivery date dispute', status: disputeStatuses['INV-10189'], submittedDate: '2026-04-16' },
    { invoice: 'INV-10234', customer: 'Tech Solutions', amount: '$18,900', reason: 'Product quality issues', status: disputeStatuses['INV-10234'], submittedDate: '2026-04-17' },
    { invoice: 'INV-10267', customer: 'Global Logistics', amount: '$31,200', reason: 'Missing documentation', status: disputeStatuses['INV-10267'], submittedDate: '2026-04-14' },
  ];

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
        <h1 className="text-2xl text-gray-900 mb-2">Disputes Management</h1>
        <p className="text-gray-600">Customer disputes and resolution tracking</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-2">Open Disputes</div>
            <div className="text-2xl mb-1 text-orange-600">
              {disputes.filter(d => d.status !== 'Resolved').length}
            </div>
            <span className="text-xs text-gray-500">Require attention</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-2">Under Review</div>
            <div className="text-2xl mb-1">
              {disputes.filter(d => d.status === 'Under Review').length}
            </div>
            <span className="text-xs text-gray-500">In progress</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-2">Resolved</div>
            <div className="text-2xl mb-1 text-green-600">
              {disputes.filter(d => d.status === 'Resolved').length}
            </div>
            <span className="text-xs text-gray-500">This week</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Dispute Cases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Submitted Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disputes.map((row) => (
                <TableRow key={row.invoice}>
                  <TableCell className="font-medium">{row.invoice}</TableCell>
                  <TableCell>{row.customer}</TableCell>
                  <TableCell className="text-right">{row.amount}</TableCell>
                  <TableCell>{row.reason}</TableCell>
                  <TableCell>{row.submittedDate}</TableCell>
                  <TableCell>
                    <Badge variant={
                      row.status === 'Resolved' ? 'outline' :
                      row.status === 'Under Review' ? 'secondary' :
                      'destructive'
                    }>
                      {row.status === 'Resolved' && <span className="text-green-700 bg-green-50">{row.status}</span>}
                      {row.status !== 'Resolved' && row.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReview(row)}
                    >
                      {row.status === 'Resolved' ? 'View' : 'Review'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedDispute && (
        <DisputeReviewModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDispute(null);
          }}
          invoice={selectedDispute}
          onSubmit={handleSubmitResolution}
        />
      )}
    </div>
  );
}
