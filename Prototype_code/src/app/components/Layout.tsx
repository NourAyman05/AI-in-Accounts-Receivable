import { Outlet, Link, useLocation } from 'react-router';
import { LayoutDashboard, FileText, AlertTriangle, MessageSquare, Upload, Receipt, History, Layers } from 'lucide-react';

export default function Layout() {
  const location = useLocation();

 const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/case-intake', icon: Upload, label: 'Case Intake' },
    { path: '/invoice-predictions', icon: FileText, label: 'Invoice Predictions' },
    { path: '/aging-analysis', icon: Layers, label: 'Aging Analysis' },
    { path: '/high-risk-worklist', icon: AlertTriangle, label: 'High Risk Worklist' },
    { path: '/nlp-analysis', icon: MessageSquare, label: 'NLP Analysis' },
    { path: '/nlp-promise-to-pay', icon: MessageSquare, label: 'Promise-to-Pay' },
    { path: '/reconciliation', icon: Receipt, label: 'Reconciliation' },
    { path: '/audit-trail', icon: History, label: 'Audit Trail' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl text-blue-600">AR AI System</h1>
          <p className="text-sm text-gray-500 mt-1">Enterprise Prototype</p>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
