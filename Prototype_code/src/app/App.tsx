import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import InvoicePredictions from "./components/InvoicePredictions";
import AgingAnalysis from "./components/AgingAnalysis";
import HighRiskWorklist from "./components/HighRiskWorklist";
import NLPAnalysis from "./components/NLPAnalysis";
import InvoiceDetails from "./components/InvoiceDetails";
import CaseIntake from "./components/CaseIntake";
import NLPPromiseToPay from "./components/NLPPromiseToPay";
import ReconciliationExceptions from "./components/ReconciliationExceptions";
import AuditTrail from "./components/AuditTrail";
import PromiseToPayList from "./components/PromiseToPayList";
import Disputes from "./components/Disputes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={<Navigate to="/dashboard" replace />}
          />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="case-intake" element={<CaseIntake />} />
          <Route
            path="invoice-predictions"
            element={<InvoicePredictions />}
          />
          <Route
            path="aging-analysis"
            element={<AgingAnalysis />}
          />
          <Route
            path="high-risk-worklist"
            element={<HighRiskWorklist />}
          />
          <Route
            path="nlp-analysis"
            element={<NLPAnalysis />}
          />
          <Route
            path="nlp-promise-to-pay"
            element={<NLPPromiseToPay />}
          />
          <Route
            path="nlp-promise-to-pay/:id"
            element={<NLPPromiseToPay />}
          />
          <Route
            path="promise-to-pay-list"
            element={<PromiseToPayList />}
          />
          <Route path="disputes" element={<Disputes />} />
          <Route
            path="invoice-details/:id"
            element={<InvoiceDetails />}
          />
          <Route
            path="reconciliation"
            element={<ReconciliationExceptions />}
          />
          <Route path="audit-trail" element={<AuditTrail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}