export const invoicesData: Record<string, {
  invoiceId: string;
  customer: string;
  customerId: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: string;
  daysOverdue: number;
  riskLevel: string;
  paymentTerms: string;
  outstandingBalance: number;
  contactEmail: string;
}> = {
  'INV-10245': {
    invoiceId: 'INV-10245',
    customer: 'Acme Corp',
    customerId: 'C-12345',
    amount: 45000,
    issueDate: '2026-03-03',
    dueDate: '2026-04-03',
    status: 'Overdue',
    daysOverdue: 15,
    riskLevel: 'High',
    paymentTerms: 'Net 30',
    outstandingBalance: 45000,
    contactEmail: 'finance@acmecorp.com',
  },
  'INV-10198': {
    invoiceId: 'INV-10198',
    customer: 'Global Industries',
    customerId: 'C-12346',
    amount: 32500,
    issueDate: '2026-03-12',
    dueDate: '2026-04-10',
    status: 'Overdue',
    daysOverdue: 8,
    riskLevel: 'Medium',
    paymentTerms: 'Net 30',
    outstandingBalance: 32500,
    contactEmail: 'ap@globalindustries.com',
  },
  'INV-10312': {
    invoiceId: 'INV-10312',
    customer: 'Tech Solutions',
    customerId: 'C-12347',
    amount: 18900,
    issueDate: '2026-03-05',
    dueDate: '2026-03-27',
    status: 'Overdue',
    daysOverdue: 22,
    riskLevel: 'High',
    paymentTerms: 'Net 15',
    outstandingBalance: 18900,
    contactEmail: 'billing@techsolutions.com',
  },
  'INV-10156': {
    invoiceId: 'INV-10156',
    customer: 'BuildTech LLC',
    customerId: 'C-12348',
    amount: 28000,
    issueDate: '2026-03-20',
    dueDate: '2026-04-10',
    status: 'Current',
    daysOverdue: 0,
    riskLevel: 'Low',
    paymentTerms: 'Net 30',
    outstandingBalance: 28000,
    contactEmail: 'payments@buildtech.com',
  },
  'INV-10201': {
    invoiceId: 'INV-10201',
    customer: 'MediSupply Co',
    customerId: 'C-12349',
    amount: 15400,
    issueDate: '2026-03-25',
    dueDate: '2026-04-15',
    status: 'Current',
    daysOverdue: 0,
    riskLevel: 'Medium',
    paymentTerms: 'Net 30',
    outstandingBalance: 15400,
    contactEmail: 'ar@medisupply.com',
  },
  'INV-10178': {
    invoiceId: 'INV-10178',
    customer: 'Retail Group',
    customerId: 'C-12350',
    amount: 42300,
    issueDate: '2026-03-18',
    dueDate: '2026-04-08',
    status: 'Disputed',
    daysOverdue: 8,
    riskLevel: 'High',
    paymentTerms: 'Net 30',
    outstandingBalance: 42300,
    contactEmail: 'finance@retailgroup.com',
  },
  'INV-10189': {
    invoiceId: 'INV-10189',
    customer: 'Manufacturing Inc',
    customerId: 'C-12351',
    amount: 24500,
    issueDate: '2026-03-22',
    dueDate: '2026-04-12',
    status: 'Disputed',
    daysOverdue: 0,
    riskLevel: 'Medium',
    paymentTerms: 'Net 30',
    outstandingBalance: 24500,
    contactEmail: 'payables@manufacturing.com',
  },
};

export const promiseToPayData: Record<string, {
  invoice: string;
  customer: string;
  amount: string;
  promiseDate: string;
  confidence: number;
  status: string;
  messageText: string;
  sentiment: string;
}> = {
  'INV-10156': {
    invoice: 'INV-10156',
    customer: 'BuildTech LLC',
    amount: '$28,000',
    promiseDate: '2026-04-22',
    confidence: 0.94,
    status: 'Active',
    messageText: "Hi, I apologize for the delay in payment. We've had some cash flow issues this quarter, but I can confirm that we will process the payment for Invoice INV-10156 on April 22nd, 2026. You should receive the full amount of $28,000 by that date. Thank you for your patience.",
    sentiment: 'Positive',
  },
  'INV-10201': {
    invoice: 'INV-10201',
    customer: 'MediSupply Co',
    amount: '$15,400',
    promiseDate: '2026-04-25',
    confidence: 0.88,
    status: 'Active',
    messageText: "Thank you for the reminder. We will make the payment for Invoice INV-10201 on April 25th. Our accounting department has scheduled the wire transfer for that date. The full amount of $15,400 will be paid.",
    sentiment: 'Neutral',
  },
  'INV-10299': {
    invoice: 'INV-10299',
    customer: 'Retail Solutions',
    amount: '$31,200',
    promiseDate: '2026-04-28',
    confidence: 0.91,
    status: 'Active',
    messageText: "We acknowledge receipt of Invoice INV-10299. Payment will be processed on April 28th as per our standard payment cycle. Expect $31,200 to be transferred on that date.",
    sentiment: 'Neutral',
  },
  'INV-10134': {
    invoice: 'INV-10134',
    customer: 'Tech Innovations',
    amount: '$22,500',
    promiseDate: '2026-04-20',
    confidence: 0.87,
    status: 'Overdue',
    messageText: "I can confirm we will pay Invoice INV-10134 by April 20th. We're working on finalizing our budget approval and will send the payment of $22,500 as soon as it's approved.",
    sentiment: 'Positive',
  },
  'INV-10267': {
    invoice: 'INV-10267',
    customer: 'Global Logistics',
    amount: '$19,800',
    promiseDate: '2026-04-30',
    confidence: 0.92,
    status: 'Active',
    messageText: "We will settle Invoice INV-10267 on April 30th. The payment of $19,800 is already scheduled in our system. Thank you for your understanding.",
    sentiment: 'Positive',
  },
};
