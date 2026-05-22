import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState } from 'react';
import { toast } from 'sonner';

interface DisputeReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: {
    invoice: string;
    customer: string;
    amount: string;
    reason: string;
    status: string;
  };
  onSubmit: (resolution: string, notes: string) => void;
}

export default function DisputeReviewModal({ isOpen, onClose, invoice, onSubmit }: DisputeReviewModalProps) {
  const [resolution, setResolution] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!resolution) {
      toast.error('Resolution required', {
        description: 'Please select a resolution action',
      });
      return;
    }
    if (!notes.trim()) {
      toast.warning('Notes recommended', {
        description: 'Adding resolution notes is recommended',
      });
    }
    onSubmit(resolution, notes);
    setResolution('');
    setNotes('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Review Dispute - {invoice.invoice}</DialogTitle>
          <DialogDescription>
            Review and resolve the dispute for this invoice
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Customer</div>
              <div className="font-medium">{invoice.customer}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Amount</div>
              <div className="font-medium">{invoice.amount}</div>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Dispute Reason</div>
            <div className="text-sm bg-yellow-50 p-3 rounded-lg border border-yellow-200">{invoice.reason}</div>
          </div>
          <div>
            <Label htmlFor="resolution">Resolution Action *</Label>
            <Select value={resolution} onValueChange={setResolution}>
              <SelectTrigger>
                <SelectValue placeholder="Select resolution action..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">Approve Dispute - Issue Credit</SelectItem>
                <SelectItem value="rejected">Reject Dispute - Invoice Valid</SelectItem>
                <SelectItem value="partial">Partial Approval - Adjust Amount</SelectItem>
                <SelectItem value="investigation">Requires Further Investigation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="notes">Resolution Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter resolution notes and next steps..."
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
