"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Wallet, 
  TrendingUp, 
  Calendar, 
  Download,
  Search,
  Filter,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreHorizontal
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { exportToCSV, formatDataForCSV } from "@/lib/utils/csvExport";

interface PaymentSummary {
  totalEarnings: number;
  pendingPayouts: number;
  thisMonth: number;
  nextPayout: string;
}

interface ApiResponse<T> {
  data: T;
}

interface EarningsApiData {
  total_earnings: number;
  pending_payouts: number;
  monthly_earnings: number;
  next_payout_date: string;
}

interface Payout {
  id?: string;
  amount?: number;
  event?: string;
  date?: string;
  status?: string;
  method?: string;
  reference?: string;
}

interface PendingPayout {
  event?: string;
  amount?: number;
  ticketsSold?: number;
  eventDate?: string;
  payoutDate?: string;
}

export default function HostPaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<PaymentSummary>({
    totalEarnings: 0,
    pendingPayouts: 0,
    thisMonth: 0,
    nextPayout: "N/A"
  });
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [pendingPayouts, setPendingPayouts] = useState<PendingPayout[]>([]);

  useEffect(() => {
    loadPaymentData();
  }, []);

  const loadPaymentData = async () => {
    try {
      setLoading(true);
      
      // Load all payment data in parallel
      const [earningsResponse, payoutsResponse, pendingResponse] = await Promise.all([
        apiClient.get<ApiResponse<EarningsApiData>>("/hosts/me/payments/earnings"),
        apiClient.get<ApiResponse<Payout[]>>("/hosts/me/payments/payouts"),
        apiClient.get<ApiResponse<PendingPayout[]>>("/hosts/me/payments/pending")
      ]);

      setSummary({
        totalEarnings: earningsResponse?.data?.total_earnings || 0,
        pendingPayouts: earningsResponse?.data?.pending_payouts || 0,
        thisMonth: earningsResponse?.data?.monthly_earnings || 0,
        nextPayout: earningsResponse?.data?.next_payout_date || "N/A"
      });
      setPayouts(Array.isArray(payoutsResponse?.data) ? payoutsResponse.data : []);
      setPendingPayouts(Array.isArray(pendingResponse?.data) ? pendingResponse.data : []);
    } catch (error) {
      console.error("Failed to load payment data:", error);
      toast.error("Failed to load payment data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Processing":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "Failed":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredPayouts = payouts.filter(payout => {
    const matchesSearch = (payout.event || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (payout.reference || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || (payout.status || '').toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number | undefined) => {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return '₦0';
    }
    return `₦${amount.toLocaleString()}`;
  };

  const handleExportPayments = () => {
    try {
      // Combine both pending payouts and payment history
      const allPaymentsData = [
        // Add pending payouts
        ...pendingPayouts.map(payout => ({
          event: payout.event || 'Unknown Event',
          amount: formatCurrency(payout.amount),
          date: payout.eventDate || 'N/A',
          status: 'Pending',
          method: 'Automatic Transfer',
          reference: 'PENDING',
          type: 'Upcoming Payout',
          payoutDate: payout.payoutDate || 'N/A'
        })),
        // Add payment history
        ...filteredPayouts.map(payout => ({
          event: payout.event || 'N/A',
          amount: formatCurrency(payout.amount),
          date: payout.date || 'N/A',
          status: payout.status || 'Unknown',
          method: payout.method || 'N/A',
          reference: payout.reference || 'N/A',
          type: 'Payment History',
          payoutDate: payout.date || 'N/A'
        }))
      ];

      exportToCSV({
        filename: `motiv-payments-${new Date().toISOString().split('T')[0]}`,
        headers: ['event', 'amount', 'date', 'status', 'method', 'reference', 'type', 'payoutDate'],
        data: allPaymentsData,
        dateFields: ['date', 'payoutDate']
      });

      toast.success('Payment statement exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export payment statement');
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D72638] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-1">Track your earnings and payment history</p>
        </div>
        <Button 
          onClick={handleExportPayments}
          className="bg-[#D72638] hover:bg-[#B91E2F] text-white w-full sm:w-auto"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Statement
        </Button>
      </div>

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Earnings
            </CardTitle>
            <Wallet className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {formatCurrency(summary.totalEarnings)}
            </div>
            <p className="text-xs text-gray-600 mt-1">All time earnings</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              This Month
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {formatCurrency(summary.thisMonth)}
            </div>
            <p className="text-xs text-green-600 mt-1">Current month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Payouts
            </CardTitle>
            <Clock className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {formatCurrency(summary.pendingPayouts)}
            </div>
            <p className="text-xs text-gray-600 mt-1">{pendingPayouts.length} events pending</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Next Payout
            </CardTitle>
            <Calendar className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-xl font-bold text-gray-900">
              {summary.nextPayout}
            </div>
            <p className="text-xs text-gray-600 mt-1">Automatic transfer</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Payouts */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Upcoming Payouts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingPayouts.map((payout, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{payout.event || 'Unknown Event'}</h4>
                  <p className="text-sm text-gray-600">
                    {payout.ticketsSold || 0} tickets sold • Event: {payout.eventDate || 'N/A'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{formatCurrency(payout.amount)}</div>
                  <p className="text-sm text-gray-600">Payout: {payout.payoutDate || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search payments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border-gray-300 focus:border-[#D72638] focus:ring-[#D72638]"
          />
        </div>
        
        <div className="flex gap-3 sm:gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="flex-1 sm:w-32">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Payment History */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-3 sm:px-4 font-medium text-gray-600 text-xs sm:text-sm">EVENT</th>
                  <th className="text-left py-3 px-3 sm:px-4 font-medium text-gray-600 text-xs sm:text-sm">AMOUNT</th>
                  <th className="text-left py-3 px-3 sm:px-4 font-medium text-gray-600 text-xs sm:text-sm">DATE</th>
                  <th className="text-left py-3 px-3 sm:px-4 font-medium text-gray-600 text-xs sm:text-sm">METHOD</th>
                  <th className="text-left py-3 px-3 sm:px-4 font-medium text-gray-600 text-xs sm:text-sm">STATUS</th>
                  <th className="text-left py-3 px-3 sm:px-4 font-medium text-gray-600 text-xs sm:text-sm">REFERENCE</th>
                  <th className="text-left py-3 px-3 sm:px-4 font-medium text-gray-600 text-xs sm:text-sm"></th>
                </tr>
              </thead>
              <tbody>
                {filteredPayouts.map((payout, index) => (
                  <tr key={payout.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm text-gray-900 font-medium">
                      {payout.event || 'N/A'}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900">
                      {formatCurrency(payout.amount)}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm text-gray-600">
                      {payout.date || 'N/A'}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <CreditCard className="w-3 h-3" />
                        <span>{payout.method || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(payout.status || '')}
                        <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payout.status || '')}`}>
                          {payout.status || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm text-gray-500 font-mono">
                      {payout.reference || 'N/A'}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4">
                      <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Info */}
      <Card className="border-gray-200 bg-blue-50">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Payment Information</h3>
              <p className="text-sm text-gray-600 mb-2">
                Payments are processed automatically 5 business days after your event ends. 
                We take a 1% commission from each transaction.
              </p>
              <Button variant="outline" size="sm">
                Update Bank Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}