import { useState } from "react";
import { Check, X, Eye, Search, Filter, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface LeaveRequest {
  id: string;
  employeeName: string;
  employeeEmail: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  submittedAt: string;
}

interface CancellationRequest {
  id: string;
  employeeName: string;
  employeeEmail: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  originalReason: string;
  cancellationReason: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

const mockLeaveRequests: LeaveRequest[] = [
  { id: "1", employeeName: "John Smith", employeeEmail: "john.smith@company.com", leaveType: "Annual Leave", startDate: "Jan 15, 2025", endDate: "Jan 17, 2025", days: 3, reason: "Family vacation", status: "pending", submittedAt: "Dec 28, 2024" },
  { id: "2", employeeName: "Sarah Johnson", employeeEmail: "sarah.j@company.com", leaveType: "Sick Leave", startDate: "Jan 2, 2025", endDate: "Jan 2, 2025", days: 1, reason: "Doctor appointment", status: "pending", submittedAt: "Dec 29, 2024" },
  { id: "3", employeeName: "Mike Brown", employeeEmail: "mike.b@company.com", leaveType: "Personal Leave", startDate: "Jan 10, 2025", endDate: "Jan 11, 2025", days: 2, reason: "Personal matters", status: "approved", submittedAt: "Dec 20, 2024" },
  { id: "4", employeeName: "Emily Davis", employeeEmail: "emily.d@company.com", leaveType: "Annual Leave", startDate: "Feb 1, 2025", endDate: "Feb 5, 2025", days: 5, reason: "Wedding anniversary trip", status: "pending", submittedAt: "Dec 30, 2024" },
  { id: "5", employeeName: "Chris Wilson", employeeEmail: "chris.w@company.com", leaveType: "Sick Leave", startDate: "Dec 20, 2024", endDate: "Dec 21, 2024", days: 2, reason: "Flu symptoms", status: "rejected", rejectionReason: "Insufficient sick leave balance", submittedAt: "Dec 18, 2024" },
];

const mockCancellationRequests: CancellationRequest[] = [
  { id: "1", employeeName: "Mike Brown", employeeEmail: "mike.b@company.com", leaveType: "Personal Leave", startDate: "Jan 10, 2025", endDate: "Jan 11, 2025", days: 2, originalReason: "Personal matters", cancellationReason: "Plans changed, need to attend important meeting", status: "pending", submittedAt: "Dec 29, 2024" },
  { id: "2", employeeName: "Lisa Anderson", employeeEmail: "lisa.a@company.com", leaveType: "Annual Leave", startDate: "Jan 20, 2025", endDate: "Jan 22, 2025", days: 3, originalReason: "Family trip", cancellationReason: "Family emergency resolved", status: "pending", submittedAt: "Dec 28, 2024" },
  { id: "3", employeeName: "Tom Parker", employeeEmail: "tom.p@company.com", leaveType: "Annual Leave", startDate: "Jan 5, 2025", endDate: "Jan 7, 2025", days: 3, originalReason: "Vacation", cancellationReason: "Need to reschedule", status: "approved", submittedAt: "Dec 25, 2024" },
];

const statusStyles = {
  pending: "bg-warning/10 text-warning border-warning/20",
  approved: "bg-success/10 text-success border-success/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

const LeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState(mockLeaveRequests);
  const [cancellationRequests, setCancellationRequests] = useState(mockCancellationRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [selectedCancellation, setSelectedCancellation] = useState<CancellationRequest | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [cancellationDialogOpen, setCancellationDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const filteredLeaveRequests = leaveRequests.filter((req) => {
    const matchesSearch =
      req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || req.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredCancellations = cancellationRequests.filter((req) => {
    const matchesSearch =
      req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || req.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleApprove = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "approved" as const } : req))
    );
    setViewDialogOpen(false);
  };

  const handleReject = () => {
    if (selectedRequest && rejectionReason) {
      setLeaveRequests((prev) =>
        prev.map((req) =>
          req.id === selectedRequest.id
            ? { ...req, status: "rejected" as const, rejectionReason }
            : req
        )
      );
      setRejectDialogOpen(false);
      setViewDialogOpen(false);
      setRejectionReason("");
    }
  };

  const handleApproveCancellation = (id: string) => {
    setCancellationRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "approved" as const } : req))
    );
    setCancellationDialogOpen(false);
  };

  const handleRejectCancellation = (id: string) => {
    setCancellationRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "rejected" as const } : req))
    );
    setCancellationDialogOpen(false);
  };

  return (
    
      <div className="space-y-6 mx-10 mt-6 mb-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-3">Leave Requests</h1>
          <p className="text-muted-foreground">Manage employee leave and cancellation requests</p>
        </div>

        {/* Filters */}
        <Card className="shadow-card animate-fade-in" style={{ animationDelay: "50ms" }}>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by employee name or leave type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="leave-requests" className="animate-fade-in" style={{ animationDelay: "100ms" }}>
          <TabsList>
            <TabsTrigger value="leave-requests">
              Leave Requests ({filteredLeaveRequests.length})
            </TabsTrigger>
            <TabsTrigger value="cancellations" className="flex items-center gap-2">
              Cancelled Requests ({filteredCancellations.length})
              {filteredCancellations.filter((c) => c.status === "pending").length > 0 && (
                <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {filteredCancellations.filter((c) => c.status === "pending").length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Leave Requests Tab */}
          <TabsContent value="leave-requests">
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Leave Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Leave Type</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeaveRequests.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{req.employeeName}</p>
                            <p className="text-xs text-muted-foreground">{req.employeeEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>{req.leaveType}</TableCell>
                        <TableCell>
                          <p className="text-sm">{req.startDate}</p>
                          <p className="text-xs text-muted-foreground">to {req.endDate}</p>
                        </TableCell>
                        <TableCell>{req.days}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusStyles[req.status]}>
                            {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedRequest(req);
                                setViewDialogOpen(true);
                              }}
                              className="h-8 w-8"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {req.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleApprove(req.id)}
                                  className="h-8 w-8 text-success hover:text-success hover:bg-success/10"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setSelectedRequest(req);
                                    setRejectDialogOpen(true);
                                  }}
                                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cancellation Requests Tab */}
          <TabsContent value="cancellations">
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Cancelled Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Original Leave</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Cancellation Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCancellations.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{req.employeeName}</p>
                            <p className="text-xs text-muted-foreground">{req.employeeEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>{req.leaveType}</TableCell>
                        <TableCell>
                          <p className="text-sm">{req.startDate}</p>
                          <p className="text-xs text-muted-foreground">to {req.endDate}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm max-w-[200px] truncate">{req.cancellationReason}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusStyles[req.status]}>
                            {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedCancellation(req);
                                setCancellationDialogOpen(true);
                              }}
                              className="h-8 w-8"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {req.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleApproveCancellation(req.id)}
                                  className="h-8 w-8 text-success hover:text-success hover:bg-success/10"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRejectCancellation(req.id)}
                                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* View Leave Request Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Leave Request Details</DialogTitle>
              <DialogDescription>Review the leave request information</DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Employee</p>
                    <p className="font-medium">{selectedRequest.employeeName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Leave Type</p>
                    <p className="font-medium">{selectedRequest.leaveType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">{selectedRequest.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p className="font-medium">{selectedRequest.endDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Days</p>
                    <p className="font-medium">{selectedRequest.days} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Submitted At</p>
                    <p className="font-medium">{selectedRequest.submittedAt}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reason</p>
                  <p className="font-medium">{selectedRequest.reason}</p>
                </div>
                {selectedRequest.rejectionReason && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-muted-foreground">Rejection Reason</p>
                    <p className="font-medium text-destructive">{selectedRequest.rejectionReason}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="outline" className={statusStyles[selectedRequest.status]}>
                    {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                  </Badge>
                </div>
              </div>
            )}
            <DialogFooter>
              {selectedRequest?.status === "pending" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setRejectDialogOpen(true);
                    }}
                    className="text-destructive"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button onClick={() => handleApprove(selectedRequest.id)}>
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Leave Request</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this leave request
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter rejection reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
              >
                Reject Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cancellation Dialog */}
        <Dialog open={cancellationDialogOpen} onOpenChange={setCancellationDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancellation Request Details</DialogTitle>
              <DialogDescription>Review the leave cancellation request</DialogDescription>
            </DialogHeader>
            {selectedCancellation && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Employee</p>
                    <p className="font-medium">{selectedCancellation.employeeName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Leave Type</p>
                    <p className="font-medium">{selectedCancellation.leaveType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">{selectedCancellation.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p className="font-medium">{selectedCancellation.endDate}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Original Reason</p>
                  <p className="font-medium">{selectedCancellation.originalReason}</p>
                </div>
                <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <p className="text-sm text-muted-foreground">Cancellation Reason</p>
                  <p className="font-medium">{selectedCancellation.cancellationReason}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="outline" className={statusStyles[selectedCancellation.status]}>
                    {selectedCancellation.status.charAt(0).toUpperCase() +
                      selectedCancellation.status.slice(1)}
                  </Badge>
                </div>
              </div>
            )}
            <DialogFooter>
              {selectedCancellation?.status === "pending" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleRejectCancellation(selectedCancellation.id)}
                    className="text-destructive"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Deny Cancellation
                  </Button>
                  <Button onClick={() => handleApproveCancellation(selectedCancellation.id)}>
                    <Check className="h-4 w-4 mr-2" />
                    Approve Cancellation
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    
  );
};

export default LeaveRequests;
