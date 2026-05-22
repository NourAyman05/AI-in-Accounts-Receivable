import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  CheckCircle,
  Calendar,
  AlertCircle,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { promiseToPayData } from "../data/invoicesData";

export default function NLPPromiseToPay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reminderScheduled, setReminderScheduled] =
    useState(false);
  const [markedResolved, setMarkedResolved] = useState(false);
  const [confirmationSent, setConfirmationSent] =
    useState(false);

  const data =
    promiseToPayData[id || "INV-10156"] ||
    promiseToPayData["INV-10156"];

  const handleScheduleReminder = () => {
    setReminderScheduled(true);
    toast.success("Reminder scheduled", {
      description: `Follow-up reminder set for ${data.promiseDate}`,
    });
  };

  const handleMarkResolved = () => {
    setMarkedResolved(true);
    localStorage.setItem(`resolved_${data.invoice}`, "true");
    toast.success("Case marked as resolved", {
      description: `${data.invoice} moved to resolved status`,
    });
    setTimeout(() => {
      navigate("/promise-to-pay-list");
    }, 1500);
  };

  const handleSendConfirmation = () => {
    setConfirmationSent(true);
    toast.success("Confirmation sent", {
      description: `Payment confirmation email sent to ${data.customer}`,
    });
  };

  const analysisData = {
    customerMessage: data.messageText,
    intent: "Promise to Pay",
    intentConfidence: data.confidence,
    promiseDate: data.promiseDate,
    promiseDateConfidence: 0.91,
    invoiceId: data.invoice,
    extractedAmount: data.amount,
    sentiment: data.sentiment,
    sentimentConfidence: 0.84,
    customer: data.customer,
  };

  const timeline = [
    {
      date: "2026-04-10",
      event: "Invoice Due Date",
      status: "past",
    },
    {
      date: "2026-04-15",
      event: "First Reminder Sent",
      status: "past",
    },
    {
      date: "2026-04-18",
      event: "Customer Response Received",
      status: "current",
    },
    {
      date: "2026-04-22",
      event: "Promised Payment Date",
      status: "future",
    },
  ];

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
          NLP Promise-to-Pay Analysis
        </h1>
        <p className="text-gray-600">
          AI-powered analysis of customer payment commitments
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">
                Intent Detected
              </span>
            </div>
            <div className="text-xl mb-1">
              {analysisData.intent}
            </div>
            <Badge
              variant="outline"
              className="text-xs bg-green-50 text-green-700 border-green-200"
            >
              {Math.round(analysisData.intentConfidence * 100)}%
              confidence
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">
                Promised Payment Date
              </span>
            </div>
            <div className="text-xl mb-1">
              {analysisData.promiseDate}
            </div>
            <Badge
              variant="outline"
              className="text-xs bg-blue-50 text-blue-700 border-blue-200"
            >
              {Math.round(
                analysisData.promiseDateConfidence * 100,
              )}
              % confidence
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600">
                Sentiment
              </span>
            </div>
            <div className="text-xl mb-1">
              {analysisData.sentiment}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="outline"
                className="text-xs bg-purple-50 text-purple-700 border-purple-200"
              >
                Cooperative tone
              </Badge>
              <Badge
                variant="outline"
                className="text-xs bg-purple-50 text-purple-700 border-purple-200"
              >
                {Math.round(
                  analysisData.sentimentConfidence * 100,
                )}
                % confidence
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Message</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700 leading-relaxed">
                {analysisData.customerMessage}
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">
                  Related Invoice
                </div>
                <div className="text-sm font-medium">
                  {analysisData.invoiceId}
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">
                  Extracted Amount
                </div>
                <div className="text-sm font-medium">
                  {analysisData.extractedAmount}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Recommended Next Action
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium text-sm text-blue-900 mb-1">
                    Reschedule Follow-up Reminder
                  </div>
                  <p className="text-sm text-blue-800">
                    Set automated reminder for{" "}
                    <span className="font-medium">
                      {analysisData.promiseDate}
                    </span>{" "}
                    to verify payment receipt.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={handleScheduleReminder}
                disabled={reminderScheduled}
              >
                {reminderScheduled
                  ? "Reminder Scheduled ✓"
                  : "Schedule Reminder for April 22"}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleMarkResolved}
                disabled={markedResolved}
              >
                {markedResolved
                  ? "Marked as Resolved ✓"
                  : "Mark as Resolved"}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleSendConfirmation}
                disabled={confirmationSent}
              >
                {confirmationSent
                  ? "Confirmation Sent ✓"
                  : "Send Confirmation to Customer"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Timeline & AI Explanation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            {timeline.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div
                  className={`w-3 h-3 rounded-full mt-1.5 ${
                    item.status === "current"
                      ? "bg-blue-600"
                      : item.status === "past"
                        ? "bg-gray-400"
                        : "bg-gray-300"
                  }`}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm ${item.status === "current" ? "font-medium" : ""}`}
                    >
                      {item.event}
                    </span>
                    {item.status === "current" && (
                      <Badge
                        variant="outline"
                        className="text-xs"
                      >
                        Current
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {item.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium mb-2">
              AI Analysis Explanation
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              The Natural Language Processing model detected a
              clear payment commitment with high confidence (
              {Math.round(analysisData.intentConfidence * 100)}
              %). Key indicators include the explicit date
              mention "{analysisData.promiseDate}" and
              commitment language indicating payment intent. The
              sentiment analysis shows a{" "}
              {analysisData.sentiment.toLowerCase()} tone,
              supporting the promise-to-pay classification for{" "}
              {analysisData.customer}.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}