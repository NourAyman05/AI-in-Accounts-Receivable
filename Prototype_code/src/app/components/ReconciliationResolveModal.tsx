import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState } from 'react';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

interface ReconciliationResolveModalProps {
  isOpen: boolean;
  onClose: () => void;
  exception: {
    receiptId: string;
    invoiceId: string;
    exceptionReason: string;
    invoiceAmount: number;
    receiptAmount: number;
  };
  onSubmit: () => void;
}

export default function ReconciliationResolveModal({ isOpen, onClose, exception, onSubmit }: ReconciliationResolveModalProps) {
  const [resolution, setResolution] = useState('');
  const [notes, setNotes] = useState('');

  const variance = Math.abs(exception.invoiceAmount - exception.receiptAmount);
  const isOverpayment = exception.receiptAmount > exception.invoiceAmount;
  const isUnderpayment = exception.receiptAmount < exception.invoiceAmount;

  const handleSubmit = () => {
    if (!resolution) {
      toast.error('Resolution required', {
        description: 'Please select a resolution action',
      });
      return;
    }
    if (!notes.trim()) {
      toast.warning('Notes recommended', {
        description: 'Adding resolution notes is recommended for audit purposes',
      });
      return;
    }
    onSubmit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Resolve Reconciliation Exception</DialogTitle>
          <DialogDescription>
            Select a resolution action and provide notes for this exception
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <div className="font-medium text-yellow-900 mb-1">{exception.exceptionReason}</div>
                <div className="text-sm text-yellow-800">
                  Variance: ${variance.toLocaleString()}
                  {isOverpayment && ' (Overpayment)'}
                  {isUnderpayment && ' (Underpayment)'}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Receipt ID</div>
              <div className="font-medium">{exception.receiptId}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Invoice ID</div>
              <div className="font-medium">{exception.invoiceId || 'No match'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Invoice Amount</div>
              <div className="font-medium">${exception.invoiceAmount.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Receipt Amount</div>
              <div className="font-medium">${exception.receiptAmount.toLocaleString()}</div>
            </div>
          </div>

          <div>
            <Label htmlFor="resolution">Resolution Action *</Label>
            <Select value={resolution} onValueChange={setResolution}>
              <SelectTrigger>
                <SelectValue placeholder="Select resolution action..." />
              </SelectTrigger>
              <SelectContent>
                {isOverpayment && (
                  <>
                    <SelectItem value="credit-note">Issue Credit Note</SelectItem>
                    <SelectItem value="refund">Process Refund</SelectItem>
                    <SelectItem value="apply-future">Apply to Future Invoice</SelectItem>
                  </>
                )}
                {isUnderpayment && (
                  <>
                    <SelectItem value="contact-customer">Contact Customer for Balance</SelectItem>
                    <SelectItem value="write-off">Write Off Difference</SelectItem>
                    <SelectItem value="send-invoice">Send Supplemental Invoice</SelectItem>
                  </>
                )}
                {!exception.invoiceId && (
                  <>
                    <SelectItem value="manual-match">Manual Match to Invoice</SelectItem>
                    <SelectItem value="return-payment">Return Payment to Sender</SelectItem>
                    <SelectItem value="unapplied">Leave as Unapplied Cash</SelectItem>
                  </>
                )}
                <SelectItem value="adjustment">Create Adjustment Entry</SelectItem>
                <SelectItem value="investigate">Escalate for Investigation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Resolution Notes *</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter detailed notes explaining the resolution and any actions taken..."
              rows={4}
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1">{notes.length}/500 characters</div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit Resolution</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
