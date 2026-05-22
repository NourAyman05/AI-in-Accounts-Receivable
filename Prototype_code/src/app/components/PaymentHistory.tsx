import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Calendar, DollarSign, CheckCircle } from 'lucide-react';

interface PaymentHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: {
    invoiceId: string;
    customer: string;
  };
}

export default function PaymentHistory({ isOpen, onClose, invoice }: PaymentHistoryProps) {
  const history = [
    { date: '2026-04-18', type: 'Reminder Email', status: 'Sent', notes: 'Second reminder sent' },
    { date: '2026-04-15', type: 'Phone Call', status: 'Completed', notes: 'Spoke with finance manager' },
    { date: '2026-04-10', type: 'Reminder Email', status: 'Sent', notes: 'First reminder sent' },
    { date: '2026-04-05', type: 'Invoice Sent', status: 'Delivered', notes: 'Invoice delivered' },
    { date: '2026-03-28', type: 'Partial Payment', status: 'Received', notes: '$5,000 received' },
    { date: '2026-03-15', type: 'Payment Promise', status: 'Recorded', notes: 'Promise to pay by month end' },
  ];

  const getStatusBadge = (status: string) => {
    if (status === 'Completed' || status === 'Received') {
      return (
        <Badge className="bg-green-50 text-green-700 border border-green-200 hover:bg-green-50 text-xs px-2 py-0.5">
          {status}
        </Badge>
      );
    }

    return (
      <Badge
        variant="secondary"
        className="bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-100 text-xs px-2 py-0.5"
      >
        {status}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[78vw] max-w-2xl rounded-xl p-0 overflow-hidden max-h-none">
        <div className="px-5 py-4 border-b bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900">
              Payment History - {invoice.invoiceId}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500 mt-1">
              {invoice.customer}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-5 space-y-4 bg-white">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-slate-600">Total Paid</span>
              </div>
              <div className="text-2xl font-semibold text-slate-900">$5,000</div>
            </div>

            <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-medium text-slate-600">Last Contact</span>
              </div>
              <div className="text-2xl font-semibold text-slate-900">2 days ago</div>
            </div>

            <div className="p-3 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-slate-600">Actions</span>
              </div>
              <div className="text-2xl font-semibold text-slate-900">{history.length}</div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
              <h4 className="text-lg font-semibold text-slate-900">Activity Timeline</h4>
              <p className="text-xs text-slate-500 mt-1">
                Communication and payment history for this invoice.
              </p>
            </div>

           <div className="w-full overflow-x-auto">
  <Table className="w-max min-w-[950px]">
    <TableHeader>
      <TableRow>
        <TableHead className="py-2 text-xs whitespace-nowrap">Date</TableHead>
        <TableHead className="py-2 text-xs whitespace-nowrap">Action</TableHead>
        <TableHead className="py-2 text-xs whitespace-nowrap">Status</TableHead>
        <TableHead className="py-2 text-xs whitespace-nowrap">Notes</TableHead>
      </TableRow>
    </TableHeader>

    <TableBody>
      {history.map((item, idx) => (
        <TableRow key={idx}>
          <TableCell className="py-2 text-sm font-medium whitespace-nowrap">
            {item.date}
          </TableCell>
          <TableCell className="py-2 text-sm whitespace-nowrap">
            {item.type}
          </TableCell>
          <TableCell className="py-2 whitespace-nowrap">
            {getStatusBadge(item.status)}
          </TableCell>
          <TableCell className="py-2 text-sm text-slate-600 min-w-[280px]">
            {item.notes}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}