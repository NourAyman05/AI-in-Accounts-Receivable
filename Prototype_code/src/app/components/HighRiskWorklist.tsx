import { useState } from "react";
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
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import ActionModal from "./ActionModal";
import ApprovalRequestModal from "./ApprovalRequestModal";

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

const calculateRiskScore = ({
  onTimeProbability,
  daysOverdue,
  amount,
  repeatedLateHistory = false,
  hasActiveDispute = false,
}: {
  onTimeProbability: number;
  daysOverdue: number;
  amount: number;
  repeatedLateHistory?: boolean;
  hasActiveDispute?: boolean;
}) => {
  let score = 0;

  score += (1 - onTimeProbability) * 50;
  score += Math.min(daysOverdue, 30) * 1.2;

  if (amount >= 30000) score += 10;
  if (repeatedLateHistory) score += 10;
  if (hasActiveDispute) score += 10;

  return Math.min(score / 100, 1);
};

const getRecommendedAction = (
  riskLevel: string,
  daysOverdue: number,
  hasActiveDispute = false,
) => {
  if (hasActiveDispute) return "Route to dispute review";
  if (riskLevel === "High" && daysOverdue > 15)
    return "Escalate to collections";
  if (riskLevel === "High") return "Follow-up call";
  if (riskLevel === "Medium") return "Send reminder";
  return "Monitor account";
};

export default function HighRiskWorklist() {
  const navigate = useNavigate();
  const [actionTaken, setActionTaken] = useState<string[]>([]);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] =
    useState(false);
  const [approvalRequestData, setApprovalRequestData] =
    useState<{
      actions: string[];
      notes: string;
    } | null>(null);
  const [pendingApproval, setPendingApproval] = useState<
    string[]
  >([]);

  const handleTakeAction = (caseItem: any) => {
    setSelectedCase(caseItem);
    setIsModalOpen(true);
  };

  const handleSubmitAction = () => {
    if (selectedCase) {
      setActionTaken([...actionTaken, selectedCase.invoiceId]);
      toast.success(
        `Actions executed for ${selectedCase.invoiceId}`,
        {
          description: `${selectedCase.RecommendedAction} completed successfully`,
        },
      );
      setIsModalOpen(false);
      setSelectedCase(null);
    }
  };

  const handleApprovalRequired = (data: {
    actions: string[];
    notes: string;
  }) => {
    setApprovalRequestData(data);
    setIsModalOpen(false);
    setIsApprovalModalOpen(true);
  };

  const handleApprovalSubmitted = () => {
    if (selectedCase) {
      setPendingApproval([
        ...pendingApproval,
        selectedCase.invoiceId,
      ]);
    }
    setIsApprovalModalOpen(false);
    setApprovalRequestData(null);
    setSelectedCase(null);
  };

  const initialCases = [
    {
      invoiceId: "INV-10245",
      customer: "Acme Corp",
      amount: 45000,
      daysOverdue: 15,
      onTimeProbability: 0.32,
      repeatedLateHistory: true,
      hasActiveDispute: false,
      moderateLateHistory: false,
      lastContact: "2026-04-10",
    },
    {
      invoiceId: "INV-10312",
      customer: "Tech Solutions",
      amount: 18900,
      daysOverdue: 22,
      onTimeProbability: 0.85,
      repeatedLateHistory: false,
      hasActiveDispute: false,
      moderateLateHistory: false,
      lastContact: "2026-04-05",
    },
    {
      invoiceId: "INV-10178",
      customer: "Retail Group",
      amount: 42300,
      daysOverdue: 8,
      onTimeProbability: 0.46,
      repeatedLateHistory: true,
      hasActiveDispute: true,
      moderateLateHistory: false,
      lastContact: "2026-04-15",
    },
  ]
    .map((row) => {
      const riskLevel = calculateRiskLevel({
        onTimeProbability: row.onTimeProbability,
        daysOverdue: row.daysOverdue,
        hasActiveDispute: row.hasActiveDispute,
        repeatedLateHistory: row.repeatedLateHistory,
        moderateLateHistory: row.moderateLateHistory,
      });

      const riskScore = calculateRiskScore({
        onTimeProbability: row.onTimeProbability,
        daysOverdue: row.daysOverdue,
        amount: row.amount,
        repeatedLateHistory: row.repeatedLateHistory,
        hasActiveDispute: row.hasActiveDispute,
      });

      return {
        ...row,
        riskLevel,
        riskScore,
        RecommendedAction: getRecommendedAction(
          riskLevel,
          row.daysOverdue,
          row.hasActiveDispute,
        ),
      };
    })
    .filter((row) => row.riskLevel === "High");

  const cases = initialCases.filter(
    (c) => !actionTaken.includes(c.invoiceId),
  );

  return (
    <div className="p-8">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/dashboard")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>
      <div className="mb-8">
        <h1 className="text-2xl text-gray-900 mb-2">
          High Risk Worklist
        </h1>
        <p className="text-gray-600">
          Priority cases requiring immediate attention
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-2">
              Active Cases
            </div>
            <div className="text-2xl mb-1 text-red-600">
              {cases.length}
            </div>
            <span className="text-xs text-gray-500">
              Require action
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-2">
              Actions Taken
            </div>
            <div className="text-2xl mb-1 text-green-600">
              {actionTaken.length}
            </div>
            <span className="text-xs text-gray-500">
              Completed today
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-2">
              Total at Risk
            </div>
            <div className="text-2xl mb-1">
              $
              {cases
                .reduce((sum, c) => sum + c.amount, 0)
                .toLocaleString()}
            </div>
            <span className="text-xs text-gray-500">
              Outstanding amount
            </span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            High Risk Cases
          </CardTitle>
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
                <TableHead>Days Overdue</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead>Recommended Action</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map((row) => (
                <TableRow key={row.invoiceId}>
                  <TableCell className="font-medium">
                    {row.invoiceId}
                  </TableCell>
                  <TableCell>{row.customer}</TableCell>
                  <TableCell className="text-right">
                    ${row.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-red-600">
                    {row.daysOverdue} days
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive">
                      {Math.round(row.riskScore * 100)}%
                    </Badge>
                  </TableCell>
                  <TableCell>{row.lastContact}</TableCell>
                  <TableCell>{row.RecommendedAction}</TableCell>
                  <TableCell>
                    {pendingApproval.includes(row.invoiceId) ? (
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-300"
                      >
                        Pending Approval
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleTakeAction(row)}
                      >
                        Take Action
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedCase && (
        <ActionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCase(null);
          }}
          invoice={selectedCase}
          onSubmit={handleSubmitAction}
          onApprovalRequired={handleApprovalRequired}
        />
      )}

      {selectedCase && approvalRequestData && (
        <ApprovalRequestModal
          isOpen={isApprovalModalOpen}
          onClose={() => {
            setIsApprovalModalOpen(false);
            setApprovalRequestData(null);
            setSelectedCase(null);
          }}
          invoice={selectedCase}
          requestedActions={approvalRequestData.actions}
          notes={approvalRequestData.notes}
          onApprovalSubmitted={handleApprovalSubmitted}
        />
      )}
    </div>
  );
}