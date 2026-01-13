import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { type LeaveRequest, type CancelledRequests } from "../../lib/types";

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog"
import { api } from "../../api/api";
import { Oval } from "react-loader-spinner";

const statusStyles = {
  pending: "bg-warning/10 text-warning border-warning/20",
  approved: "bg-green-400/10 text-green-600 border-green-400",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  canceled: "bg-destructive/10 text-destructive border-destructive/20"
};

const LeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [cancellationRequests, setCancellationRequests] = useState<CancelledRequests[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [selectedCancellation, setSelectedCancellation] = useState<CancelledRequests | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [cancellationDialogOpen, setCancellationDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(false);

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
    const matchesFilter = filterStatus === "all";
    return matchesSearch && matchesFilter;
  });

  const handleApprove = async (id: string) => {
    try {
      setLoading(true);
      await api.post(`/leave/status/${id}`, { status: "approved" });
      setLeaveRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: "approved" as const } : req))
      );
      toast.success("Leave request approved successfully");
    } catch (err) {
      if (err instanceof AxiosError) {
        const message = err.response?.data.message;
        console.log(err, message);
        toast.error(`Error approving request: ${message}`);
      }
    } finally {
      setViewDialogOpen(false);
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (selectedRequest && rejectionReason) {
      try {
        setLoading(true);
        const res = await api.post(`/leave/status/${selectedRequest.id}`, { status: "rejected", approverComment: rejectionReason });
        const reason = res.data.data.approverComment;
        setLeaveRequests((prev) =>
          prev.map((req) =>
            req.id === selectedRequest.id
              ? { ...req, status: "rejected" as const, approvalComments: reason }
              : req
          )
        );
        toast.success("Leave request rejected successfully");
        setRejectDialogOpen(false);
        setViewDialogOpen(false);
        setRejectionReason("");
      } catch (err) {
        if (err instanceof AxiosError) {
          const message = err.response?.data.message;
          console.log(err, message);
          toast.error(`Error rejecting request: ${message}`);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchAdminLeaves = async () => {
      try {
        setLoading(true);
        const res = await api.get("/leave/admin");
        const leaveData = res.data.data;
        setLeaveRequests(leaveData.filter((l: any) => l.status !== "canceled").map((leave: any) => ({
          id: leave.id,
          orgEmpId: leave.orgEmpId,
          employeeName: leave.firstName + " " + leave.lastName,
          employeeEmail: leave.employeeEmail,
          leaveType: leave.leaveType,
          startDate: leave.startDate,
          endDate: leave.endDate,
          days: leave.days,
          reason: leave.reason,
          status: leave.status,
          approvalComments: leave.status === "rejected" ? leave.approvalComment : "",
          approvalDate: leave.status === "approved" ? leave.approvalDate : "",
          submittedAt: (new Date(leave.submittedAt)).toDateString()
        })));

        setCancellationRequests(leaveData.filter((leave: any) => leave.status === "canceled").map((l: any) => ({
          id: l.id,
          orgEmpId: l.orgEmpId,
          employeeName: l.firstName + " " + l.lastName,
          employeeEmail: l.employeeEmail,
          leaveType: l.leaveType,
          startDate: l.startDate,
          endDate: l.endDate,
          days: l.days,
          cancellationReason: l.reason,
          submittedAt: (new Date(l.submittedAt)).toDateString()
        })));

      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch employee leave requests!");
      } finally {
        setLoading(false);
      }
    }

    fetchAdminLeaves();
  }, [])

  return (
    <div className="space-y-6 m-10">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Leave Requests</h1>
        <p className="text-muted-foreground">Manage employee leave</p>
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
              <SelectTrigger className="w-full sm:w-45">
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
          </TabsTrigger>
        </TabsList>

        {/* Leave Requests Tab */}
        <TabsContent value="leave-requests">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Leave Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ?
                <div className="flex items-center justify-center">
                  <Oval
                    visible={true}
                    height="80"
                    width="80"
                    color="#000814"
                    secondaryColor="#bad6ff"
                    ariaLabel="oval-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                </div>
                :
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
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-success hover:text-success hover:bg-success/10">
                                      <Check className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Do you want to approve the leave request?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction className="bg-black" onClick={() => handleApprove(req.id)}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
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
                </Table>}
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
              {loading ?
                <div className="flex items-center justify-center">
                  <Oval
                    visible={true}
                    height="80"
                    width="80"
                    color="#000814"
                    secondaryColor="#bad6ff"
                    ariaLabel="oval-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                </div>
                :
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
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
                        <TableCell>
                          <p className="text-sm">{req.startDate}</p>
                          <p className="text-xs text-muted-foreground">to {req.endDate}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm max-w-50 truncate">{req.cancellationReason}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusStyles["canceled"]}>
                            Cancelled
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
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>}
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
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedRequest.employeeEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employee ID</p>
                  <p className="font-medium">{selectedRequest.orgEmpId}</p>
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
              {selectedRequest.approvalComments && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-muted-foreground">Rejection Reason</p>
                  <p className="font-medium text-destructive">{selectedRequest.approvalComments}</p>
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
            <DialogTitle>Cancellation of leave</DialogTitle>
            <DialogDescription>Check the cancellation details</DialogDescription>
          </DialogHeader>
          {selectedCancellation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Employee</p>
                  <p className="font-medium">{selectedCancellation.employeeName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedCancellation.employeeEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employee ID</p>
                  <p className="font-medium">{selectedCancellation.orgEmpId}</p>
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
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-sm text-muted-foreground">Cancellation Reason</p>
                <p className="font-medium">{selectedCancellation.cancellationReason}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>

  );
};

export default LeaveRequests;
