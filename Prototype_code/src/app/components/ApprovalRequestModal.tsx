import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { AlertCircle, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ApprovalRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: {
    invoiceId: string;
    customer: string;
    amount: number;
  };
  requestedActions: string[];
  notes: string;
  onApprovalSubmitted: () => void;
}

export default function ApprovalRequestModal({
  isOpen,
  onClose,
  invoice,
  requestedActions,
  notes,
  onApprovalSubmitted,
}: ApprovalRequestModalProps) {
  const [justification, setJustification] = useState("");
  const [approverRole, setApproverRole] =
    useState("AR Manager");

  const handleSubmit = () => {
    toast.success("Approval request submitted", {
      description: `Sent to ${approverRole} for review`,
    });
    onApprovalSubmitted();
    setJustification("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-600" />
            Manager Approval Required
          </DialogTitle>
          <DialogDescription>
            The selected actions have high business impact and
            must be approved by a manager before execution.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
          {/* Warning banner */}
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-amber-900">
              <span className="font-semibold">
                Approval-Required Actions Detected.
              </span>{" "}
              Escalation and write-off actions have a high
              business impact (legal exposure, expense
              recognition) and cannot be executed by an AR
              Specialist alone.
            </div>
          </div>

          {/* Invoice details */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <div className="text-xs text-gray-600 mb-1">
                Invoice
              </div>
              <div className="font-medium text-sm">
                {invoice.invoiceId}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">
                Customer
              </div>
              <div className="font-medium text-sm">
                {invoice.customer}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">
                Amount
              </div>
              <div className="font-medium text-sm">
                ${invoice.amount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Actions awaiting approval */}
          <div>
            <Label className="text-sm">
              Actions Awaiting Approval
            </Label>
            <ul className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900 space-y-1">
              {requestedActions.map((action) => (
                <li key={action}>• {action}</li>
              ))}
            </ul>
          </div>

          {/* Approver selection */}
          <div>
            <Label htmlFor="approver" className="text-sm">
              Send Approval Request To
            </Label>
            <select
              id="approver"
              value={approverRole}
              onChange={(e) => setApproverRole(e.target.value)}
              className="mt-2 w-full p-2 border border-gray-200 rounded-lg text-sm bg-white"
            >
              <option value="AR Manager">AR Manager</option>
              <option value="Credit Manager">
                Credit Manager
              </option>
              <option value="CFO">CFO</option>
            </select>
          </div>

          {/* Justification */}
          <div>
            <Label htmlFor="justification" className="text-sm">
              Justification
            </Label>
            <Textarea
              id="justification"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Briefly explain why these actions are required..."
              rows={3}
              className="mt-2"
            />
          </div>

          {/* Original notes from AR Specialist */}
          {notes && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">
                AR Specialist Notes
              </div>
              <div className="text-sm text-gray-700">
                {notes}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!justification.trim()}
          >
            Submit Approval Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}