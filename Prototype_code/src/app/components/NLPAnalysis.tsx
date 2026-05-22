import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  AlertCircle,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

export default function NLPAnalysis() {
  const navigate = useNavigate();
  const location = useLocation();
  const caseData = location.state?.caseData;

  const [showTemplate, setShowTemplate] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTemplate, setEditedTemplate] = useState("");
  const [isReviewed, setIsReviewed] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const defaultMessage =
    "I'm sorry but we're experiencing temporary financial difficulties. We need to delay payment for Invoice INV-10245 until next month. Can we discuss a payment plan?";

  const analysisData = {
    customerMessage: caseData?.messageText || defaultMessage,
    invoiceId: caseData?.invoiceId || "INV-10245",
    customerName: caseData?.customerName || "Acme Corp",
    intent: "Payment Delay Request",
    intentConfidence: 0.92,
    sentiment: "Apologetic",
    sentimentConfidence: 0.85,
    urgency: "High",
    urgencyConfidence: 0.78,
    suggestedResponse: "Offer payment plan options",
  };

  const templateText = `Dear ${analysisData.customerName},

Thank you for reaching out regarding Invoice ${analysisData.invoiceId}. We understand that temporary financial challenges can occur, and we appreciate your communication.

We would be happy to discuss a payment plan that works for your situation. Our team can offer flexible options including:
• Extended payment terms (30/60/90 days)
• Installment payment plan
• Partial payment arrangements

Please let us know which option would work best for you, or we can schedule a call to discuss further.

Best regards,
AR Team`;

  const handleGenerateTemplate = () => {
    setShowTemplate(true);
    setEditedTemplate(templateText);
    setIsReviewed(false);
    setIsSent(false);
    toast.success("Draft response generated", {
      description: "Review required before sending",
    });
  };

  const handleEditTemplate = () => {
    setIsEditing(true);
    setIsReviewed(false); // edits invalidate prior review
  };

  const handleSaveTemplate = () => {
    setIsEditing(false);
    toast.success("Draft saved", {
      description: "Your edits have been saved",
    });
  };

  const handleMarkReviewed = () => {
    setIsReviewed(true);
    toast.success("Draft marked as reviewed", {
      description: "Ready to approve & send",
    });
  };

  const handleApproveAndSend = () => {
    setIsSent(true);
    toast.success("Response approved & sent", {
      description: `Reviewed response sent to ${analysisData.customerName}`,
    });
  };

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
          NLP Analysis
        </h1>
        <p className="text-gray-600">
          Natural language processing of customer communications
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Customer Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700 leading-relaxed">
                {analysisData.customerMessage}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              AI Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Intent</span>
              <div className="flex items-center gap-2">
                <Badge>{analysisData.intent}</Badge>
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  {Math.round(analysisData.intentConfidence * 100)}% confidence
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Sentiment</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{analysisData.sentiment}</Badge>
                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                  {Math.round(analysisData.sentimentConfidence * 100)}% confidence
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Urgency</span>
              <div className="flex items-center gap-2">
                <Badge variant="destructive">{analysisData.urgency}</Badge>
                <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                  {Math.round(analysisData.urgencyConfidence * 100)}% confidence
                </Badge>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="text-sm text-gray-600 mb-2">
                Suggested Response
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-sm">
                {analysisData.suggestedResponse}
              </div>
            </div>
            <Button
              className="w-full"
              onClick={handleGenerateTemplate}
            >
              Generate Draft Response
            </Button>
            {showTemplate && (
              <div className="mt-4">
                {/* DRAFT — Requires Review banner */}
                <div className="mb-3 p-3 bg-amber-50 border border-amber-300 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-amber-900">
                    <span className="font-semibold">
                      DRAFT — Requires Review Before Sending.
                    </span>{" "}
                    This AI-generated response must be reviewed
                    by an AR specialist before being sent to the
                    customer. Edit if needed to ensure tone and
                    content are appropriate.
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">
                      Draft Response:
                    </div>
                    {isReviewed && !isSent && (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-300 text-xs"
                      >
                        ✓ Reviewed
                      </Badge>
                    )}
                    {isSent && (
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-300 text-xs"
                      >
                        ✓ Sent
                      </Badge>
                    )}
                  </div>

                  {isEditing ? (
                    <Textarea
                      value={editedTemplate}
                      onChange={(e) =>
                        setEditedTemplate(e.target.value)
                      }
                      rows={15}
                      className="mb-3"
                    />
                  ) : (
                    <div className="text-sm text-gray-700 leading-relaxed mb-3 whitespace-pre-wrap">
                      {editedTemplate}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {isEditing ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleSaveTemplate}
                      >
                        Save Changes
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleEditTemplate}
                        disabled={isSent}
                      >
                        Edit Draft
                      </Button>
                    )}

                    {!isReviewed && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleMarkReviewed}
                        disabled={isEditing}
                      >
                        Mark as Reviewed
                      </Button>
                    )}

                    <Button
                      size="sm"
                      onClick={handleApproveAndSend}
                      disabled={
                        !isReviewed || isEditing || isSent
                      }
                    >
                      {isSent
                        ? "Sent ✓"
                        : "Approve & Send to Customer"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}