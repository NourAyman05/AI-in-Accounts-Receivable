import { useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  TrendingUp,
  TrendingDown,
  ArrowLeft,
} from "lucide-react";

const getDaysOverdue = (dueDate: string) => {
  const today = new Date("2026-04-18");
  const due = new Date(dueDate);
  const diffMs = today.getTime() - due.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

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
    return "High";
  }

  if (
    (onTimeProbability >= 0.5 && onTimeProbability <= 0.79) ||
    (daysOverdue >= 1 && daysOverdue <= 15) ||
    moderateLateHistory
  ) {
    return "Medium";
  }

  return "Low";
};

const getProbabilityBand = (probability: number) => {
  const pct = Math.round(probability * 100);

  if (pct >= 85) return "Very likely on time";
  if (pct >= 70) return "Likely on time";
  if (pct >= 50) return "Uncertain / moderate risk";
  if (pct >= 30) return "Likely late";
  return "Highly likely late";
};

const calculateOnTimeProbability = ({
  previousLatePayments,
  avgDaysToPay,
  amount,
  daysOverdue,
  hasActiveDispute = false,
  isLoyalCustomer = false,
}: {
  previousLatePayments: number;
  avgDaysToPay: number;
  amount: number;
  daysOverdue: number;
  hasActiveDispute?: boolean;
  isLoyalCustomer?: boolean;
}) => {
  let score = 70;

  if (previousLatePayments === 0) score += 10;
  else if (previousLatePayments <= 2) score -= 10;
  else if (previousLatePayments > 3) score -= 20;

  if (avgDaysToPay <= 5) score += 8;
  else if (avgDaysToPay <= 15) score -= 10;
  else score -= 20;

  if (amount >= 10000 && amount < 30000) score -= 10;
  else if (amount >= 30000) score -= 15;

  if (daysOverdue >= 1 && daysOverdue <= 7) score -= 10;
  else if (daysOverdue >= 8 && daysOverdue <= 15) score -= 20;
  else if (daysOverdue > 15) score -= 30;

  if (hasActiveDispute) score -= 25;
  if (isLoyalCustomer) score += 7;

  const clamped = Math.max(0, Math.min(100, score));
  return clamped / 100;
};

export default function InvoicePredictions() {
  const navigate = useNavigate();
  const predictions = [
    {
      invoiceId: "INV-10245",
      customer: "Acme Corp",
      amount: 45000,
      dueDate: "2026-04-03",
      predictedDays: 52,
      hasActiveDispute: false,
      repeatedLateHistory: true,
      moderateLateHistory: false,
      previousLatePayments: 4,
      avgDaysToPay: 18,
      isLoyalCustomer: false,
    },
    {
      invoiceId: "INV-10198",
      customer: "Global Industries",
      amount: 32500,
      dueDate: "2026-04-10",
      predictedDays: 38,
      hasActiveDispute: false,
      repeatedLateHistory: false,
      moderateLateHistory: true,
      previousLatePayments: 2,
      avgDaysToPay: 10,
      isLoyalCustomer: false,
    },
    {
      invoiceId: "INV-10312",
      customer: "Tech Solutions",
      amount: 18900,
      dueDate: "2026-03-27",
      predictedDays: 28,
      hasActiveDispute: false,
      repeatedLateHistory: false,
      moderateLateHistory: false,
      previousLatePayments: 0,
      avgDaysToPay: 4,
      isLoyalCustomer: true,
    },
    {
      invoiceId: "INV-10156",
      customer: "BuildTech LLC",
      amount: 28000,
      dueDate: "2026-04-10",
      predictedDays: 25,
      hasActiveDispute: false,
      repeatedLateHistory: false,
      moderateLateHistory: false,
      previousLatePayments: 0,
      avgDaysToPay: 5,
      isLoyalCustomer: true,
    },
    {
      invoiceId: "INV-10201",
      customer: "MediSupply Co",
      amount: 15400,
      dueDate: "2026-04-15",
      predictedDays: 45,
      hasActiveDispute: false,
      repeatedLateHistory: false,
      moderateLateHistory: true,
      previousLatePayments: 2,
      avgDaysToPay: 12,
      isLoyalCustomer: false,
    },
  ]
    .map((row) => {
      const daysOverdue = getDaysOverdue(row.dueDate);

      const onTimeProbability = calculateOnTimeProbability({
        previousLatePayments: row.previousLatePayments,
        avgDaysToPay: row.avgDaysToPay,
        amount: row.amount,
        daysOverdue,
        hasActiveDispute: row.hasActiveDispute,
        isLoyalCustomer: row.isLoyalCustomer,
      });

      const riskLevel = calculateRiskLevel({
        onTimeProbability,
        daysOverdue,
        hasActiveDispute: row.hasActiveDispute,
        repeatedLateHistory: row.repeatedLateHistory,
        moderateLateHistory: row.moderateLateHistory,
      });

      return {
        ...row,
        daysOverdue,
        onTimeProbability,
        riskLevel,
        probabilityBand: getProbabilityBand(onTimeProbability),
      };
    })
    .map((row) => {
      const daysOverdue = getDaysOverdue(row.dueDate);
      const riskLevel = calculateRiskLevel({
        onTimeProbability: row.onTimeProbability,
        daysOverdue,
        hasActiveDispute: row.hasActiveDispute,
        repeatedLateHistory: row.repeatedLateHistory,
        moderateLateHistory: row.moderateLateHistory,
      });

      return {
        ...row,
        daysOverdue,
        riskLevel,
        probabilityBand: getProbabilityBand(
          row.onTimeProbability,
        ),
      };
    });

  return (
    <div className="p-8">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <div className="mb-8">
        <h1 className="text-2xl text-gray-900 mb-2">
          Invoice Predictions
        </h1>
        <p className="text-gray-600">
          ML-powered payment timing predictions. Risk level is
          determined by on-time probability, overdue days, and
          payment history.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">
                  Amount
                </TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Days Overdue</TableHead>
                <TableHead>On-Time Probability</TableHead>
                <TableHead>Predicted Days</TableHead>
                <TableHead>Risk Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {predictions.map((row) => (
                <TableRow key={row.invoiceId}>
                  <TableCell className="font-medium">
                    {row.invoiceId}
                  </TableCell>
                  <TableCell>{row.customer}</TableCell>
                  <TableCell className="text-right">
                    ${row.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>{row.dueDate}</TableCell>
                  <TableCell>
                    <span
                      className={
                        row.daysOverdue > 0
                          ? "text-red-600 font-medium"
                          : "text-green-600 font-medium"
                      }
                    >
                      {row.daysOverdue > 0
                        ? `${row.daysOverdue} days`
                        : "Current"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col min-w-[140px]">
                      <div className="flex items-center gap-2">
                        {row.onTimeProbability >= 0.7 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span>
                          {Math.round(
                            row.onTimeProbability * 100,
                          )}
                          %
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {row.probabilityBand}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {row.predictedDays} days
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        row.riskLevel === "High"
                          ? "destructive"
                          : row.riskLevel === "Medium"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {row.riskLevel === "Low" && (
                        <span className="text-green-700 bg-green-50">
                          {row.riskLevel}
                        </span>
                      )}
                      {row.riskLevel !== "Low" && row.riskLevel}
                    </Badge>
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