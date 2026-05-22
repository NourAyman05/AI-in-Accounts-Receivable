import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Layers, AlertCircle, FileText } from "lucide-react";

// Sample outstanding invoices spread across aging buckets
const invoices = [
  { invoiceId: "INV-10100", customer: "BuildTech LLC", amount: 18500, dueDate: "2026-05-08", daysOverdue: 0 },
  { invoiceId: "INV-10110", customer: "MediSupply Co", amount: 22000, dueDate: "2026-05-10", daysOverdue: 0 },
  { invoiceId: "INV-10145", customer: "Global Industries", amount: 32500, dueDate: "2026-05-12", daysOverdue: 0 },
  { invoiceId: "INV-10212", customer: "Acme Logistics", amount: 14200, dueDate: "2026-04-28", daysOverdue: 18 },
  { invoiceId: "INV-10225", customer: "FastShip Inc", amount: 8900, dueDate: "2026-04-25", daysOverdue: 21 },
  { invoiceId: "INV-10198", customer: "Tech Solutions", amount: 18900, dueDate: "2026-04-10", daysOverdue: 36 },
  { invoiceId: "INV-10178", customer: "Retail Group", amount: 42300, dueDate: "2026-04-05", daysOverdue: 41 },
  { invoiceId: "INV-10156", customer: "Manufacturing Inc", amount: 28000, dueDate: "2026-03-20", daysOverdue: 57 },
  { invoiceId: "INV-10142", customer: "Construct Co", amount: 35000, dueDate: "2026-03-10", daysOverdue: 67 },
  { invoiceId: "INV-10245", customer: "Acme Corp", amount: 45000, dueDate: "2026-02-25", daysOverdue: 80 },
  { invoiceId: "INV-10089", customer: "Heritage Imports", amount: 12500, dueDate: "2026-01-15", daysOverdue: 121 },
  { invoiceId: "INV-10075", customer: "Legacy Corp", amount: 8800, dueDate: "2026-01-05", daysOverdue: 131 },
];

const buckets = [
  { name: "Current", badDebtPct: 0.01, borderClass: "border-l-green-500", badgeClass: "bg-green-50 text-green-700 border-green-300", barClass: "bg-green-500" },
  { name: "1-30 days", badDebtPct: 0.05, borderClass: "border-l-yellow-500", badgeClass: "bg-yellow-50 text-yellow-700 border-yellow-300", barClass: "bg-yellow-500" },
  { name: "31-60 days", badDebtPct: 0.10, borderClass: "border-l-orange-500", badgeClass: "bg-orange-50 text-orange-700 border-orange-300", barClass: "bg-orange-500" },
  { name: "61-90 days", badDebtPct: 0.25, borderClass: "border-l-red-500", badgeClass: "bg-red-50 text-red-700 border-red-300", barClass: "bg-red-500" },
  { name: "90+ days", badDebtPct: 0.50, borderClass: "border-l-red-700", badgeClass: "bg-red-100 text-red-800 border-red-400", barClass: "bg-red-700" },
];

const getBucketIndex = (daysOverdue: number) => {
  if (daysOverdue === 0) return 0;
  if (daysOverdue <= 30) return 1;
  if (daysOverdue <= 60) return 2;
  if (daysOverdue <= 90) return 3;
  return 4;
};

export default function AgingAnalysis() {
  const bucketTotals = buckets.map((b, idx) => {
    const bucketInvoices = invoices.filter((inv) => getBucketIndex(inv.daysOverdue) === idx);
    const totalAmount = bucketInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    return {
      ...b,
      count: bucketInvoices.length,
      totalAmount,
      estimatedBadDebt: totalAmount * b.badDebtPct,
    };
  });

  const totalReceivables = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalEstimatedBadDebt = bucketTotals.reduce((sum, b) => sum + b.estimatedBadDebt, 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl text-gray-900 mb-2">Aging Analysis</h1>
        <p className="text-gray-600">
          Categorization of outstanding receivables by overdue period, with estimated bad debt allowance per bucket
        </p>
      </div>

      {/* Bucket summary cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {bucketTotals.map((b) => (
          <Card key={b.name} className={`border-l-4 ${b.borderClass}`}>
            <CardContent className="p-4">
              <div className="text-xs text-gray-600 mb-1">{b.name}</div>
              <div className="text-xl font-semibold mb-1">
                ${(b.totalAmount / 1000).toFixed(1)}K
              </div>
              <div className="text-xs text-gray-500 mb-2">
                {b.count} invoice{b.count !== 1 ? "s" : ""}
              </div>
              <Badge variant="outline" className="text-xs">
                {(b.badDebtPct * 100).toFixed(0)}% bad debt
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Distribution bar */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm">Receivables Distribution by Aging Bucket</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-10 rounded-lg overflow-hidden border border-gray-200">
            {bucketTotals.map((b) => {
              const widthPercent = (b.totalAmount / totalReceivables) * 100;
              if (widthPercent === 0) return null;
              return (
                <div
                  key={b.name}
                  className={`flex items-center justify-center text-xs text-white font-medium ${b.barClass}`}
                  style={{ width: `${widthPercent}%` }}
                  title={`${b.name}: ${widthPercent.toFixed(1)}%`}
                >
                  {widthPercent > 8 ? `${widthPercent.toFixed(0)}%` : ""}
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-600">
            {bucketTotals.map((b) => (
              <div key={b.name} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded ${b.barClass}`}></div>
                <span>{b.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Totals */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Total Receivables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-900">
              ${totalReceivables.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Across {invoices.length} outstanding invoices
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Estimated Bad Debt Allowance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-red-600">
              ${totalEstimatedBadDebt.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Based on aging-bucket percentages ({((totalEstimatedBadDebt / totalReceivables) * 100).toFixed(1)}% of total)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Invoices table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-gray-600" />
            Invoices by Aging Bucket
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Days Overdue</TableHead>
                <TableHead>Aging Bucket</TableHead>
                <TableHead className="text-right">Est. Bad Debt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices
                .slice()
                .sort((a, b) => a.daysOverdue - b.daysOverdue)
                .map((inv) => {
                  const bucket = buckets[getBucketIndex(inv.daysOverdue)];
                  const estimatedBadDebt = inv.amount * bucket.badDebtPct;
                  return (
                    <TableRow key={inv.invoiceId}>
                      <TableCell className="font-medium">{inv.invoiceId}</TableCell>
                      <TableCell>{inv.customer}</TableCell>
                      <TableCell className="text-right">
                        ${inv.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{inv.dueDate}</TableCell>
                      <TableCell
                        className={
                          inv.daysOverdue > 0 ? "text-red-600" : "text-green-600"
                        }
                      >
                        {inv.daysOverdue === 0 ? "Not overdue" : `${inv.daysOverdue} days`}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={bucket.badgeClass}>
                          {bucket.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        ${estimatedBadDebt.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}