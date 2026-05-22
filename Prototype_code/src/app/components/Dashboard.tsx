import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const navigate = useNavigate();
  const [remindedInvoices, setRemindedInvoices] = useState<
    string[]
  >([]);

  useEffect(() => {
    // Check which invoices have been reminded
    const reminded: string[] = [];
    ["INV-10156", "INV-10201"].forEach((id) => {
      if (localStorage.getItem(`reminded_${id}`) === "true") {
        reminded.push(id);
      }
    });
    setRemindedInvoices(reminded);
  }, []);

  const metrics = [
    {
      label: "Total Outstanding",
      value: "$2.4M",
      change: "+12%",
      trend: "up",
    },
    {
      label: "High Risk Invoices",
      value: "28",
      change: "+5",
      trend: "up",
    },
    {
      label: "Avg. Days to Pay",
      value: "42",
      change: "-3 days",
      trend: "down",
    },
    {
      label: "Collection Rate",
      value: "94%",
      change: "+2%",
      trend: "up",
    },
  ];

  const priorityCases = [
    {
      id: "INV-10245",
      customer: "Acme Corp",
      amount: "$45,000",
      daysOverdue: 15,
      risk: "High",
    },
    {
      id: "INV-10198",
      customer: "Global Industries",
      amount: "$32,500",
      daysOverdue: 8,
      risk: "Medium",
    },
    {
      id: "INV-10312",
      customer: "Tech Solutions",
      amount: "$18,900",
      daysOverdue: 22,
      risk: "High",
    },
  ];

  const aiAlerts = [
    {
      type: "Payment Delay",
      invoice: "INV-10245",
      message: "Customer shows payment pattern change",
      time: "2h ago",
    },
    {
      type: "Risk Escalation",
      invoice: "INV-10198",
      message: "Risk score increased from Medium to High",
      time: "4h ago",
    },
    {
      type: "Promise Detected",
      invoice: "INV-10156",
      message: "Customer committed to pay by Apr 22",
      time: "1d ago",
    },
  ];

  const allPromises = [
    {
      invoice: "INV-10156",
      customer: "BuildTech LLC",
      amount: "$28,000",
      promiseDate: "2026-04-22",
    },
    {
      invoice: "INV-10201",
      customer: "MediSupply Co",
      amount: "$15,400",
      promiseDate: "2026-04-25",
    },
  ];

  const upcomingPromises = allPromises.filter(
    (p) => !remindedInvoices.includes(p.invoice),
  );

  const disputes = [
    {
      invoice: "INV-10178",
      customer: "Retail Group",
      reason: "Invoice amount discrepancy",
      status: "Pending",
    },
    {
      invoice: "INV-10189",
      customer: "Manufacturing Inc",
      reason: "Delivery date dispute",
      status: "Under Review",
    },
  ];

  const reconciliationSummary = [
    { status: "Matched", count: 142, amount: "$1.2M" },
    { status: "Exceptions", count: 8, amount: "$84,500" },
    { status: "Pending", count: 5, amount: "$42,300" },
  ];

  const cashFlowForecast = [
    { week: "Wk 1", amount: 285 },
    { week: "Wk 2", amount: 312 },
    { week: "Wk 3", amount: 295 },
    { week: "Wk 4", amount: 340 },
    { week: "Wk 5", amount: 305 },
    { week: "Wk 6", amount: 360 },
    { week: "Wk 7", amount: 325 },
    { week: "Wk 8", amount: 380 },
  ];

  const maxForecast = Math.max(
    ...cashFlowForecast.map((w) => w.amount),
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl text-gray-900 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          AI-Powered Accounts Receivable Overview
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, idx) => (
          <Card key={idx}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-600">
                  {metric.label}
                </span>
                <TrendingUp
                  className={`w-4 h-4 ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}
                />
              </div>
              <div className="text-2xl mb-1">
                {metric.value}
              </div>
              <span className="text-xs text-gray-500">
                {metric.change}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Top Priority Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {priorityCases.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() =>
                    navigate(`/invoice-details/${item.id}`)
                  }
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {item.id}
                      </span>
                      <Badge
                        variant={
                          item.risk === "High"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {item.risk}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.customer}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {item.amount}
                    </div>
                    <div className="text-xs text-red-600">
                      {item.daysOverdue} days overdue
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate("/high-risk-worklist")}
            >
              View All High Risk Cases
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Recent AI Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiAlerts.map((alert, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-blue-50 rounded-lg border border-blue-100"
                >
                  <div className="flex items-start justify-between mb-1">
                    <Badge
                      variant="outline"
                      className="text-xs"
                    >
                      {alert.type}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {alert.time}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 mb-1">
                    {alert.message}
                  </div>
                  <div className="text-xs text-gray-500">
                    {alert.invoice}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cash Flow Forecast — addresses Req 6 (CFO view) */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            AI-Based Cash Flow Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* 30 / 60 / 90 day summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="text-xs text-gray-600 mb-1">
                Expected Next 30 Days
              </div>
              <div className="text-2xl font-semibold text-indigo-900">
                $1.23M
              </div>
              <div className="text-xs text-green-600 mt-1">
                +8% vs. last month
              </div>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="text-xs text-gray-600 mb-1">
                Expected Next 60 Days
              </div>
              <div className="text-2xl font-semibold text-indigo-900">
                $2.47M
              </div>
              <div className="text-xs text-green-600 mt-1">
                +5% vs. last month
              </div>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="text-xs text-gray-600 mb-1">
                Expected Next 90 Days
              </div>
              <div className="text-2xl font-semibold text-indigo-900">
                $3.85M
              </div>
              <div className="text-xs text-green-600 mt-1">
                +12% vs. last month
              </div>
            </div>
          </div>

          {/* Weekly forecast bar chart */}
          <div>
            <div className="text-sm text-gray-600 mb-3">
              Predicted Weekly Cash Inflows (Next 8 Weeks)
            </div>
            <div className="flex items-end gap-3 h-48">
              {cashFlowForecast.map((week, idx) => {
                const barHeight = Math.round(
                  (week.amount / maxForecast) * 150,
                );
                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div className="text-xs text-gray-700 font-medium mb-1">
                      ${week.amount}K
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-indigo-500 to-indigo-300 rounded-t"
                      style={{ height: `${barHeight}px` }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-2">
                      {week.week}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Note */}
          <div className="mt-6 p-3 bg-gray-50 rounded text-xs text-gray-600">
            <span className="font-medium">Note:</span> Forecast
            is based on customer payment history, predicted
            on-time probabilities, active disputes, and
            promise-to-pay commitments.
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Upcoming Promised Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingPromises.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-green-50 rounded-lg border border-green-100 cursor-pointer hover:bg-green-100 transition-colors"
                  onClick={() =>
                    navigate(
                      `/invoice-details/${item.invoice}`,
                      { state: { fromPromises: true } },
                    )
                  }
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium">
                      {item.invoice}
                    </span>
                    <span className="text-sm font-medium text-green-700">
                      {item.amount}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    {item.customer}
                  </div>
                  <div className="text-xs text-gray-500">
                    Promise Date: {item.promiseDate}
                  </div>
                </div>
              ))}
            </div>
            {upcomingPromises.length === 0 && (
              <div className="text-center py-6 text-sm text-gray-500">
                No upcoming promises - all reminders sent
              </div>
            )}
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate("/promise-to-pay-list")}
            >
              View All Promises ({allPromises.length})
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Disputes Awaiting Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {disputes.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-yellow-50 rounded-lg border border-yellow-100 cursor-pointer hover:bg-yellow-100 transition-colors"
                  onClick={() =>
                    navigate(`/invoice-details/${item.invoice}`)
                  }
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">
                      {item.invoice}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-xs"
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    {item.customer}
                  </div>
                  <div className="text-xs text-gray-700">
                    {item.reason}
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate("/disputes")}
            >
              Review Disputes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reconciliation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reconciliationSummary.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() =>
                    navigate("/reconciliation", {
                      state: {
                        filter: item.status.toLowerCase(),
                      },
                    })
                  }
                >
                  <div>
                    <div className="text-sm font-medium">
                      {item.status}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.count} transactions
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    {item.amount}
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate("/reconciliation")}
            >
              View Reconciliation
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}