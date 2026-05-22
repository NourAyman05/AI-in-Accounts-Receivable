import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { invoicesData } from '../data/invoicesData';
import PaymentHistory from './PaymentHistory';

const calculateRiskLevel = ({
  onTimeProbability,
  daysOverdue,
  hasActiveDispute = false,
  repeatedLateHistory = false,
  moderateLateHistory = false,
}: {
  onTimeProbability: number;
  daysOverdue: number;
  hasActiveDispute?: boolean;
  repeatedLateHistory?: boolean;
  moderateLateHistory?: boolean;
}) => {
  if (
    onTimeProbability < 0.5 ||
    daysOverdue > 15 ||
    repeatedLateHistory ||
    hasActiveDispute
  ) {
    return 'High';
  }

  if (
    (onTimeProbability >= 0.5 && onTimeProbability <= 0.79) ||
    (daysOverdue >= 1 && daysOverdue <= 15) ||
    moderateLateHistory
  ) {
    return 'Medium';
  }

  return 'Low';
};

const getProbabilityBand = (probability: number) => {
  const pct = Math.round(probability * 100);

  if (pct >= 85) return 'Very likely on time';
  if (pct >= 70) return 'Likely on time';
  if (pct >= 50) return 'Uncertain / moderate risk';
  if (pct >= 30) return 'Likely late';
  return 'Highly likely late';
};

export default function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [reminderSent, setReminderSent] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const invoice = invoicesData[id || 'INV-10245'] || invoicesData['INV-10245'];

  const computedRiskLevel = calculateRiskLevel({
    onTimeProbability: invoice.onTimeProbability ?? 0.5,
    daysOverdue: invoice.daysOverdue ?? 0,
    hasActiveDispute: invoice.status === 'Disputed',
    repeatedLateHistory: invoice.previousLatePayments
      ? invoice.previousLatePayments > 3
      : false,
    moderateLateHistory: invoice.previousLatePayments
      ? invoice.previousLatePayments >= 1 && invoice.previousLatePayments <= 3
      : false,
  });

  const probabilityBand = getProbabilityBand(invoice.onTimeProbability ?? 0.5);

  const handleSendReminder = () => {
    setReminderSent(true);
    toast.success('Reminder sent', {
      description: `Email reminder sent for ${invoice.invoiceId} to ${invoice.customer}`,
    });

    if (location.state?.fromPromises) {
      localStorage.setItem(`reminded_${invoice.invoiceId}`, 'true');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
  };

  return (
    <div className="p-8">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="mb-8">
        <h1 className="text-2xl text-gray-900 mb-2">Invoice Details</h1>
        <p className="text-gray-600">{invoice.invoiceId}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Customer</div>
              <div className="font-medium">{invoice.customer}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-1">Customer ID</div>
              <div className="font-medium">{invoice.customerId}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-1">Amount</div>
              <div className="font-medium">${invoice.amount.toLocaleString()}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-1">Outstanding Balance</div>
              <div className="font-medium">${invoice.outstandingBalance.toLocaleString()}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-1">Issue Date</div>
              <div className="font-medium">{invoice.issueDate}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-1">Due Date</div>
              <div className="font-medium">{invoice.dueDate}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-1">Payment Terms</div>
              <div className="font-medium">{invoice.paymentTerms}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-1">Days Overdue</div>
              <div
                className={`font-medium ${
                  invoice.daysOverdue > 0 ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {invoice.daysOverdue > 0 ? `${invoice.daysOverdue} days` : 'Current'}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-1">Status</div>
              <Badge
                variant={
                  invoice.status === 'Overdue' || invoice.status === 'Disputed'
                    ? 'destructive'
                    : 'outline'
                }
              >
                {invoice.status === 'Current' ? (
                  <span className="text-green-700 bg-green-50">{invoice.status}</span>
                ) : (
                  invoice.status
                )}
              </Badge>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-1">On-Time Probability</div>
              <div className="font-medium">
                {Math.round((invoice.onTimeProbability ?? 0.5) * 100)}%
              </div>
              <div className="text-xs text-gray-500">{probabilityBand}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-1">Risk Level</div>
              <Badge
                variant={
                  computedRiskLevel === 'High'
                    ? 'destructive'
                    : computedRiskLevel === 'Medium'
                    ? 'secondary'
                    : 'outline'
                }
              >
                {computedRiskLevel === 'Low' ? (
                  <span className="text-green-700 bg-green-50">{computedRiskLevel}</span>
                ) : (
                  computedRiskLevel
                )}
              </Badge>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-1">Contact Email</div>
              <div className="font-medium text-sm">{invoice.contactEmail}</div>
            </div>
          </div>

          <div className="pt-4 flex gap-2">
            <Button onClick={handleSendReminder} disabled={reminderSent}>
              {reminderSent ? 'Reminder Sent ✓' : 'Send Reminder'}
            </Button>
            <Button variant="outline" onClick={() => setShowHistory(true)}>
              View History
            </Button>
          </div>
        </CardContent>
      </Card>

      <PaymentHistory
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        invoice={invoice}
      />
    </div>
  );
}