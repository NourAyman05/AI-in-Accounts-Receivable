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
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: {
    invoiceId: string;
    customer: string;
    amount: number;
    nextAction: string;
  };
  onSubmit: () => void;
  onApprovalRequired: (data: {
    actions: string[];
    notes: string;
  }) => void;
}

export default function ActionModal({
  isOpen,
  onClose,
  invoice,
  onSubmit,
  onApprovalRequired,
}: ActionModalProps) {
  const [selectedActions, setSelectedActions] = useState<
    string[]
  >([]);
  const [notes, setNotes] = useState("");

  const APPROVAL_REQUIRED_ACTIONS = [
    "Escalate to collections team",
    "Write off invoice (uncollectable)",
  ];

  const availableActions = [
    "Send final notice email",
    "Schedule phone call with customer",
    "Escalate to collections team",
    "Request payment plan discussion",
    "Send legal notice",
    "Place account on hold",
    "Write off invoice (uncollectable)",
  ];

  const selectedApprovalActions = selectedActions.filter((a) =>
    APPROVAL_REQUIRED_ACTIONS.includes(a),
  );
  const requiresApproval = selectedApprovalActions.length > 0;

  const handleToggleAction = (action: string) => {
    if (selectedActions.includes(action)) {
      setSelectedActions(
        selectedActions.filter((a) => a !== action),
      );
    } else {
      setSelectedActions([...selectedActions, action]);
    }
  };

  const handleSubmit = () => {
    if (requiresApproval) {
      onApprovalRequired({ actions: selectedActions, notes });
      setSelectedActions([]);
      setNotes("");
      // do NOT call onClose() here — parent already closes the modal,
      // and onClose() would clear selectedCase before the approval modal can use it
    } else {
      onSubmit();
      setSelectedActions([]);
      setNotes("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Take Action - {invoice.invoiceId}
          </DialogTitle>
          <DialogDescription>
            Select and execute actions for this high-risk
            invoice
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
          {requiresApproval && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-amber-900">
                <span className="font-semibold">
                  Manager Approval Required.
                </span>{" "}
                The following selected actions cannot be
                executed directly by an AR Specialist and will
                be sent to a manager for approval:
                <ul className="mt-1 space-y-0.5">
                  {selectedApprovalActions.map((a) => (
                    <li key={a}>• {a}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">
                Customer
              </div>
              <div className="font-medium">
                {invoice.customer}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">
                Amount
              </div>
              <div className="font-medium">
                ${invoice.amount.toLocaleString()}
              </div>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">
              Recommended Action
            </div>
            <div className="text-sm bg-blue-50 p-3 rounded-lg border border-blue-200">
              {invoice.nextAction}
            </div>
          </div>
          <div>
            <Label>Select Actions to Execute</Label>
            <div className="space-y-3 mt-2">
              {availableActions.map((action) => (
                <div
                  key={action}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={action}
                    checked={selectedActions.includes(action)}
                    onCheckedChange={() =>
                      handleToggleAction(action)
                    }
                  />
                  <label
                    htmlFor={action}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {action}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Action Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any additional notes or context..."
              rows={3}
            />
          </div>
          {selectedActions.length > 0 && (
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-sm font-medium text-green-800 mb-2">
                <CheckCircle className="w-4 h-4" />
                Actions to be executed:
              </div>
              <ul className="text-sm text-green-700 space-y-1">
                {selectedActions.map((action) => (
                  <li key={action}>• {action}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedActions.length === 0}
          >
            {requiresApproval
              ? `Submit for Approval (${selectedActions.length})`
              : `Execute Actions (${selectedActions.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}