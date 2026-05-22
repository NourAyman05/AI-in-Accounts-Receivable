import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Upload,
  Play,
  MessageSquare,
  Save,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function CaseIntake() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerId: "",
    customerName: "",
    invoiceId: "",
    invoiceAmount: "",
    invoiceDate: "",
    dueDate: "",
    paymentTerms: "",
    outstandingBalance: "",
    previousLatePayments: "",
    avgDaysToPay: "",
    customerSegment: "",
    communicationChannel: "",
    messageText: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>(
    {},
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
const validatePredictionFields = () => {
  const newErrors: Record<string, string> = {};

  const customerIdPattern = /^C-\d{5}$/;
  const invoiceIdPattern = /^INV-\d{5}$/;

  if (!formData.customerId.trim()) {
    newErrors.customerId = "Customer ID is required";
  } else if (!customerIdPattern.test(formData.customerId.trim())) {
    newErrors.customerId = "Customer ID must be in format C-12345";
  }

  if (!formData.invoiceId.trim()) {
    newErrors.invoiceId = "Invoice ID is required";
  } else if (!invoiceIdPattern.test(formData.invoiceId.trim())) {
    newErrors.invoiceId = "Invoice ID must be in format INV-12345";
  }

  if (!formData.invoiceAmount.trim()) {
    newErrors.invoiceAmount = "Invoice Amount is required";
  } else if (parseFloat(formData.invoiceAmount) <= 0) {
    newErrors.invoiceAmount = "Invoice Amount must be greater than 0";
  }

  if (!formData.invoiceDate) {
    newErrors.invoiceDate = "Invoice Date is required";
  }

  if (!formData.dueDate) {
    newErrors.dueDate = "Due Date is required";
  } else if (formData.invoiceDate && formData.dueDate < formData.invoiceDate) {
    newErrors.dueDate =
      "Due Date must be equal to or later than Invoice Date";
  }

  if (!formData.paymentTerms) {
    newErrors.paymentTerms = "Payment Terms are required";
  }

  if (formData.previousLatePayments === "") {
    newErrors.previousLatePayments =
      "Previous Late Payments are required";
  } else if (parseFloat(formData.previousLatePayments) < 0) {
    newErrors.previousLatePayments =
      "Previous Late Payments cannot be negative";
  }

  if (formData.avgDaysToPay === "") {
    newErrors.avgDaysToPay = "Average Days to Pay is required";
  } else if (parseFloat(formData.avgDaysToPay) < 0) {
    newErrors.avgDaysToPay =
      "Average Days to Pay cannot be negative";
  }

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    toast.error("Please fix the highlighted fields", {
      description:
        "Some required prediction inputs are missing or invalid.",
    });
    return false;
  }

  return true;
};
  

  const handleSaveCase = () => {
  const isValid = validatePredictionFields();

  if (!isValid) {
    return;
  }

  toast.success("Case saved successfully", {
    description: `Case ${formData.invoiceId} has been added to the system`,
  });
};

  const handleRunPrediction = () => {
    const isValid = validatePredictionFields();

    if (!isValid) {
      return;
    }

    toast.success("Prediction model running", {
      description: "Analysis will complete in a few seconds...",
    });

    setTimeout(() => {
      navigate("/invoice-predictions");
    }, 1500);
  };

  const handleAnalyzeMessage = () => {
  setErrors((prev) => ({
    ...prev,
    messageText: "",
  }));

  if (!formData.messageText.trim()) {
    setErrors((prev) => ({
      ...prev,
      messageText: "Customer message is required for NLP analysis",
    }));

    toast.error("Message text required", {
      description: "Please enter customer message text to analyze",
    });
    return;
  }

  if (formData.messageText.trim().length < 10) {
    setErrors((prev) => ({
      ...prev,
      messageText: "Message must be at least 10 characters for analysis",
    }));

    toast.error("Message too short", {
      description: "Message must be at least 10 characters for analysis",
    });
    return;
  }

  toast.success("NLP analysis started", {
    description: "Processing customer message...",
  });

  setTimeout(() => {
    navigate("/nlp-analysis", {
      state: { caseData: formData },
    });
  }, 1500);
};

  const handleUploadEmail = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".eml,.msg,.txt";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast.success("Email uploaded", {
          description: `${file.name} has been processed`,
        });
        setFormData({
          ...formData,
          messageText: `[Email content from ${file.name} would be parsed and displayed here]`,
        });
      }
    };
    input.click();
  };

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
          AR Case Intake / Input
        </h1>
        <p className="text-gray-600">
          Enter or review customer and invoice information
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customerId">Customer ID</Label>
                <Input
                  id="customerId"
                  value={formData.customerId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customerId: e.target.value,
                    })
                  }
                  placeholder="C-12345"
                />
                {errors.customerId && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.customerId}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="customerName">
                  Customer Name
                </Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customerName: e.target.value,
                    })
                  }
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <Label htmlFor="customerSegment">
                  Customer Segment
                </Label>
                <Select
                  value={formData.customerSegment}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      customerSegment: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select segment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enterprise">
                      Enterprise
                    </SelectItem>
                    <SelectItem value="mid-market">
                      Mid-Market
                    </SelectItem>
                    <SelectItem value="small-business">
                      Small Business
                    </SelectItem>
                    <SelectItem value="startup">
                      Startup
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="communicationChannel">
                  Communication Channel
                </Label>
                <Select
                  value={formData.communicationChannel}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      communicationChannel: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="portal">
                      Customer Portal
                    </SelectItem>
                    <SelectItem value="chat">
                      Live Chat
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
  <Label htmlFor="invoiceId">Invoice ID</Label>
  <Input
    id="invoiceId"
    value={formData.invoiceId}
    onChange={(e) => {
      setFormData({ ...formData, invoiceId: e.target.value });
      if (errors.invoiceId) {
        setErrors({ ...errors, invoiceId: '' });
      }
    }}
    placeholder="INV-12345"
  />
  {errors.invoiceId && (
    <p className="text-sm text-red-500 mt-1">{errors.invoiceId}</p>
  )}
</div>
              <div>
  <Label htmlFor="invoiceAmount">Invoice Amount</Label>
  <Input
    id="invoiceAmount"
    type="number"
    value={formData.invoiceAmount}
    onChange={(e) => {
      setFormData({ ...formData, invoiceAmount: e.target.value });
      if (errors.invoiceAmount) {
        setErrors({ ...errors, invoiceAmount: '' });
      }
    }}
    placeholder="0.00"
  />
  {errors.invoiceAmount && (
    <p className="text-sm text-red-500 mt-1">{errors.invoiceAmount}</p>
  )}
</div>
              <div className="grid grid-cols-2 gap-4">
               <div>
  <Label htmlFor="invoiceDate">Invoice Date</Label>
  <Input
    id="invoiceDate"
    type="date"
    value={formData.invoiceDate}
    onChange={(e) => {
      setFormData({ ...formData, invoiceDate: e.target.value });
      if (errors.invoiceDate || errors.dueDate) {
        setErrors({ ...errors, invoiceDate: '', dueDate: '' });
      }
    }}
  />
  {errors.invoiceDate && (
    <p className="text-sm text-red-500 mt-1">{errors.invoiceDate}</p>
  )}
</div>
               <div>
  <Label htmlFor="dueDate">Due Date</Label>
  <Input
    id="dueDate"
    type="date"
    value={formData.dueDate}
    onChange={(e) => {
      setFormData({ ...formData, dueDate: e.target.value });
      if (errors.dueDate) {
        setErrors({ ...errors, dueDate: '' });
      }
    }}
  />
  {errors.dueDate && (
    <p className="text-sm text-red-500 mt-1">{errors.dueDate}</p>
  )}
</div>
              </div>
              <div>
  <Label htmlFor="paymentTerms">Payment Terms</Label>
  <Select
    value={formData.paymentTerms}
    onValueChange={(value) => {
      setFormData({ ...formData, paymentTerms: value });
      if (errors.paymentTerms) {
        setErrors({ ...errors, paymentTerms: '' });
      }
    }}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select terms" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="net-15">Net 15</SelectItem>
      <SelectItem value="net-30">Net 30</SelectItem>
      <SelectItem value="net-60">Net 60</SelectItem>
      <SelectItem value="net-90">Net 90</SelectItem>
    </SelectContent>
  </Select>

  {errors.paymentTerms && (
    <p className="text-sm text-red-500 mt-1">{errors.paymentTerms}</p>
  )}
</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="outstandingBalance">
                  Outstanding Balance
                </Label>
                <Input
                  id="outstandingBalance"
                  type="number"
                  value={formData.outstandingBalance}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      outstandingBalance: e.target.value,
                    })
                  }
                  placeholder="0.00"
                />
              </div>
             <div>
  <Label htmlFor="previousLatePayments">Previous Late Payments</Label>
  <Input
    id="previousLatePayments"
    type="number"
    value={formData.previousLatePayments}
    onChange={(e) => {
      setFormData({ ...formData, previousLatePayments: e.target.value });
      if (errors.previousLatePayments) {
        setErrors({ ...errors, previousLatePayments: '' });
      }
    }}
    placeholder="0"
  />
  {errors.previousLatePayments && (
    <p className="text-sm text-red-500 mt-1">{errors.previousLatePayments}</p>
  )}
</div>
              <div>
  <Label htmlFor="avgDaysToPay">Average Days to Pay</Label>
  <Input
    id="avgDaysToPay"
    type="number"
    value={formData.avgDaysToPay}
    onChange={(e) => {
      setFormData({ ...formData, avgDaysToPay: e.target.value });
      if (errors.avgDaysToPay) {
        setErrors({ ...errors, avgDaysToPay: '' });
      }
    }}
    placeholder="0"
  />
  {errors.avgDaysToPay && (
    <p className="text-sm text-red-500 mt-1">{errors.avgDaysToPay}</p>
  )}
</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Communication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
  <Label htmlFor="messageText">
    Customer Message / Email Text
  </Label>
  <Textarea
    id="messageText"
    value={formData.messageText}
    onChange={(e) => {
      setFormData({
        ...formData,
        messageText: e.target.value,
      });
      if (errors.messageText) {
        setErrors({ ...errors, messageText: "" });
      }
    }}
    placeholder="Paste customer message or email content here..."
    rows={6}
  />
  {errors.messageText && (
    <p className="text-sm text-red-500 mt-1">{errors.messageText}</p>
  )}
</div>
              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={handleUploadEmail}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Email
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveCase}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Case
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleAnalyzeMessage}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Analyze Message
          </Button>
          <Button type="button" onClick={handleRunPrediction}>
            <Play className="w-4 h-4 mr-2" />
            Run Prediction
          </Button>
        </div>
      </form>
    </div>
  );
}