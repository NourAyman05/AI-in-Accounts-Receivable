import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Search, Filter, AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import ReconciliationResolveModal from './ReconciliationResolveModal';

export default function ReconciliationExceptions() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialFilter = location.state?.filter || 'all';

  const [statusFilter, setStatusFilter] = useState(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [resolvedItems, setResolvedItems] = useState<string[]>([]);
  const [selectedException, setSelectedException] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    if (location.state?.filter) {
      setStatusFilter(location.state.filter);
      setCurrentPage(1);
    }
  }, [location.state]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  const handleResolve = (exception: any) => {
    setSelectedException(exception);
    setIsModalOpen(true);
  };

  const handleSubmitResolution = () => {
    if (selectedException) {
      setResolvedItems([...resolvedItems, selectedException.receiptId]);
      toast.success('Exception resolved', {
        description: `${selectedException.receiptId} has been marked as resolved`,
      });
      setIsModalOpen(false);
      setSelectedException(null);
    }
  };

  // Generate more matched transactions to reach 142
  const generateMatchedTransactions = () => {
    const matched = [];
    for (let i = 8800; i < 8942; i++) {
      matched.push({
        receiptId: `RCP-${i}`,
        bankRef: `BANK-${45900 + i - 8800}`,
        invoiceId: `INV-${10000 + (i % 500)}`,
        invoiceAmount: Math.floor(Math.random() * 50000) + 5000,
        receiptAmount: 0,
        matchStatus: 'Matched',
        exceptionReason: '-',
        recommendedAction: '-',
      });
    }
    // Set receipt amount equal to invoice amount for matched
    return matched.map(m => ({ ...m, receiptAmount: m.invoiceAmount }));
  };

  const exceptions = [
    {
      receiptId: 'RCP-8822',
      bankRef: 'BANK-45893',
      invoiceId: 'INV-10198',
      invoiceAmount: 32500,
      receiptAmount: 32000,
      matchStatus: 'Exception',
      exceptionReason: 'Partial payment ($500 short)',
      recommendedAction: 'Contact customer for remaining balance',
    },
    {
      receiptId: 'RCP-8824',
      bankRef: 'BANK-45895',
      invoiceId: 'INV-10156',
      invoiceAmount: 28000,
      receiptAmount: 29000,
      matchStatus: 'Exception',
      exceptionReason: 'Overpayment ($1,000 excess)',
      recommendedAction: 'Issue credit note or refund',
    },
    {
      receiptId: 'RCP-8825',
      bankRef: 'BANK-45896',
      invoiceId: '-',
      invoiceAmount: 0,
      receiptAmount: 15400,
      matchStatus: 'Exception',
      exceptionReason: 'No matching invoice found',
      recommendedAction: 'Identify invoice or return payment',
    },
    {
      receiptId: 'RCP-8827',
      bankRef: 'BANK-45898',
      invoiceId: 'INV-10178',
      invoiceAmount: 42300,
      receiptAmount: 40000,
      matchStatus: 'Exception',
      exceptionReason: 'Partial payment ($2,300 short)',
      recommendedAction: 'Send reminder for outstanding amount',
    },
    {
      receiptId: 'RCP-8829',
      bankRef: 'BANK-45900',
      invoiceId: 'INV-10234',
      invoiceAmount: 18500,
      receiptAmount: 17500,
      matchStatus: 'Exception',
      exceptionReason: 'Partial payment ($1,000 short)',
      recommendedAction: 'Contact customer for remaining balance',
    },
    {
      receiptId: 'RCP-8830',
      bankRef: 'BANK-45901',
      invoiceId: 'INV-10256',
      invoiceAmount: 0,
      receiptAmount: 22000,
      matchStatus: 'Pending',
      exceptionReason: 'Pending identification',
      recommendedAction: 'Manual review required',
    },
    {
      receiptId: 'RCP-8831',
      bankRef: 'BANK-45902',
      invoiceId: 'INV-10267',
      invoiceAmount: 0,
      receiptAmount: 8900,
      matchStatus: 'Pending',
      exceptionReason: 'Pending identification',
      recommendedAction: 'Manual review required',
    },
    {
      receiptId: 'RCP-8832',
      bankRef: 'BANK-45903',
      invoiceId: 'INV-10278',
      invoiceAmount: 0,
      receiptAmount: 5200,
      matchStatus: 'Pending',
      exceptionReason: 'Pending identification',
      recommendedAction: 'Manual review required',
    },
    {
      receiptId: 'RCP-8833',
      bankRef: 'BANK-45904',
      invoiceId: 'INV-10289',
      invoiceAmount: 0,
      receiptAmount: 3500,
      matchStatus: 'Pending',
      exceptionReason: 'Pending identification',
      recommendedAction: 'Manual review required',
    },
    {
      receiptId: 'RCP-8834',
      bankRef: 'BANK-45905',
      invoiceId: 'INV-10290',
      invoiceAmount: 0,
      receiptAmount: 2700,
      matchStatus: 'Pending',
      exceptionReason: 'Pending identification',
      recommendedAction: 'Manual review required',
    },
    ...generateMatchedTransactions(),
  ];

  const filteredExceptions = exceptions.filter(e => {
    const isResolved = resolvedItems.includes(e.receiptId);
    const effectiveStatus = isResolved ? 'Matched' : e.matchStatus;

    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'matched' && effectiveStatus === 'Matched') ||
      (statusFilter === 'exceptions' && effectiveStatus === 'Exception') ||
      (statusFilter === 'pending' && effectiveStatus === 'Pending');
    const matchesSearch = searchQuery === '' ||
      e.receiptId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.bankRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.invoiceId && e.invoiceId !== '-' && e.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredExceptions.length / itemsPerPage);
  const paginatedExceptions = filteredExceptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const summary = {
    total: exceptions.length,
    matched: exceptions.filter(e => e.matchStatus === 'Matched').length + resolvedItems.length,
    exceptions: exceptions.filter(e => e.matchStatus === 'Exception').length - resolvedItems.length,
    pending: exceptions.filter(e => e.matchStatus === 'Pending').length,
    totalExceptionAmount: exceptions
      .filter(e => e.matchStatus === 'Exception' && !resolvedItems.includes(e.receiptId))
      .reduce((sum, e) => sum + Math.abs(e.invoiceAmount - e.receiptAmount), 0),
  };

  return (
    <div className="p-8">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate('/dashboard')}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>
      <div className="mb-8">
        <h1 className="text-2xl text-gray-900 mb-2">Reconciliation</h1>
        <p className="text-gray-600">RPA-assisted payment matching and exception handling</p>
      </div>

      <div className="grid grid-cols-5 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-2">Total Receipts</div>
            <div className="text-2xl mb-1">{summary.total}</div>
            <span className="text-xs text-gray-500">Processed today</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-2">Matched</div>
            <div className="text-2xl mb-1 text-green-600">{summary.matched}</div>
            <span className="text-xs text-gray-500">{Math.round((summary.matched / summary.total) * 100)}% match rate</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-2">Exceptions</div>
            <div className="text-2xl mb-1 text-red-600">{summary.exceptions}</div>
            <span className="text-xs text-gray-500">Require attention</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-2">Pending</div>
            <div className="text-2xl mb-1 text-orange-600">{summary.pending}</div>
            <span className="text-xs text-gray-500">Under review</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-2">Exception Amount</div>
            <div className="text-2xl mb-1">${summary.totalExceptionAmount.toLocaleString()}</div>
            <span className="text-xs text-gray-500">Total variance</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Reconciliation Details</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search receipts..."
                  className="pl-9 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="matched">Matched</SelectItem>
                  <SelectItem value="exception">Exceptions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt ID</TableHead>
                <TableHead>Bank Reference</TableHead>
                <TableHead>Invoice ID</TableHead>
                <TableHead className="text-right">Invoice Amount</TableHead>
                <TableHead className="text-right">Receipt Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Exception Reason</TableHead>
                <TableHead>Recommended Action</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedExceptions.map((row) => (
                <TableRow key={row.receiptId}>
                  <TableCell className="font-medium">{row.receiptId}</TableCell>
                  <TableCell>{row.bankRef}</TableCell>
                  <TableCell>{row.invoiceId || '-'}</TableCell>
                  <TableCell className="text-right">
                    {row.invoiceAmount > 0 ? `$${row.invoiceAmount.toLocaleString()}` : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    ${row.receiptAmount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {resolvedItems.includes(row.receiptId) ? (
                      <Badge variant="outline">
                        <span className="text-green-700 bg-green-50">Matched</span>
                      </Badge>
                    ) : (
                      <Badge variant={
                        row.matchStatus === 'Matched' ? 'outline' :
                        row.matchStatus === 'Pending' ? 'secondary' :
                        'destructive'
                      }>
                        {row.matchStatus === 'Matched' && <span className="text-green-700 bg-green-50">Matched</span>}
                        {row.matchStatus === 'Pending' && <span className="text-orange-700 bg-orange-50">Pending</span>}
                        {row.matchStatus === 'Exception' && (
                          <span className="flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Exception
                          </span>
                        )}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{row.exceptionReason}</TableCell>
                  <TableCell className="text-sm text-gray-600">{row.recommendedAction}</TableCell>
                  <TableCell>
                    {row.matchStatus === 'Exception' && (
                      resolvedItems.includes(row.receiptId) ? (
                        <span className="text-sm text-green-600">Resolved ✓</span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResolve(row)}
                        >
                          Resolve
                        </Button>
                      )
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredExceptions.length)} of {filteredExceptions.length} receipts
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedException && (
        <ReconciliationResolveModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedException(null);
          }}
          exception={selectedException}
          onSubmit={handleSubmitResolution}
        />
      )}
    </div>
  );
}
