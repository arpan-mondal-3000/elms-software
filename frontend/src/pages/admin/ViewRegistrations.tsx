import { useEffect, useState } from "react";
import { Check, X, Eye, Search, Filter } from "lucide-react";
import { api } from "../../api/api";
import { toast } from "sonner";
import { Oval } from "react-loader-spinner";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
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
import { AxiosError } from "axios";

type Registration = {
  id: string;
  orgEmpId: string;
  name: string;
  email: string;
  contactNo: string;
  address: string;
  position: string;
  joinDate: string;
  status: "pending" | "approved";
  submittedAt: string;
}

const statusStyles = {
  pending: "bg-red-400/10 text-red-600 border-red-400",
  approved: "bg-green-400/10 text-green-600 border-green-400",
};

const ViewRegistrations = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || reg.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleApprove = async (id: string) => {
    try {
      await api.post("/admin/approve", { employeeId: id });
      setRegistrations((prev) =>
        prev.map((reg) => (reg.id === id ? { ...reg, status: "approved" as const } : reg))
      );
      setViewDialogOpen(false);
    } catch (err) {
      if (err instanceof AxiosError) {
        const message = err?.response?.data.message;
        console.log(err, message);
        toast.error(`Failed to approve employee please try again. ${message}`);
      }
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.post("/admin/reject", { employeeId: id });
      setRegistrations((prev) =>
        prev.filter((reg: Registration) => reg.id !== id)
      );
      setViewDialogOpen(false);
    } catch (err) {
      if (err instanceof AxiosError) {
        const message = err?.response?.data.message;
        console.log(err, message);
        toast.error(`Failed to approve employee please try again. ${message}`);
      }
    }
  };

  const handleView = (registration: Registration) => {
    setSelectedRegistration(registration);
    setViewDialogOpen(true);
  };

  useEffect(() => {
    const fetchAllEmployees = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/employees");
        console.log(res);
        const regData = res.data.data;
        // build the registration data array
        const adjustedData: Registration[] = regData.map((reg: any) => ({
          id: reg.id,
          orgEmpId: reg.orgEmpId,
          name: reg.firstName + " " + reg.lastName,
          email: reg.email,
          contactNo: reg.contactNo,
          address: reg.address,
          position: "Employee",
          joinDate: reg.joinDate,
          status: reg.isApproved ? "approved" : "pending",
          submittedAt: (new Date(reg.submittedAt)).toDateString()
        }))
        setRegistrations(adjustedData);
      } catch (err) {
        toast.error("Failed to fetch employee registration details!");
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAllEmployees();
  }, [])

  return (

    <div className="space-y-6 m-10">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Employee Registrations</h1>
        <p className="text-muted-foreground">Review and approve employee registrations</p>
      </div>

      {/* Filters */}
      <Card className="shadow-card animate-fade-in" style={{ animationDelay: "50ms" }}>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email or position"
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
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-card animate-fade-in" style={{ animationDelay: "100ms" }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">
            Registrations ({filteredRegistrations.length})
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
                  <TableHead>Position</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.map((reg) => (
                  <TableRow key={reg.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{reg.name}</p>
                        <p className="text-xs text-muted-foreground">{reg.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{reg.position}</TableCell>
                    <TableCell>{reg.joinDate}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusStyles[reg.status]}>
                        {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(reg)}
                          className="h-8 w-8"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {reg.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleApprove(reg.id)}
                              className="h-8 w-8 text-success hover:text-success hover:bg-success/10"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleReject(reg.id)}
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

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registration Details</DialogTitle>
            <DialogDescription>
              Review the employee registration information
            </DialogDescription>
          </DialogHeader>
          {selectedRegistration && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{selectedRegistration.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedRegistration.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employee ID</p>
                  <p className="font-medium">{selectedRegistration.orgEmpId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Position</p>
                  <p className="font-medium">{selectedRegistration.position}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact no</p>
                  <p className="font-medium">{selectedRegistration.contactNo}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{selectedRegistration.address}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Join Date</p>
                  <p className="font-medium">{selectedRegistration.joinDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted At</p>
                  <p className="font-medium">{selectedRegistration.submittedAt}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant="outline" className={statusStyles[selectedRegistration.status]}>
                  {selectedRegistration.status.charAt(0).toUpperCase() +
                    selectedRegistration.status.slice(1)}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            {selectedRegistration?.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleReject(selectedRegistration.id)}
                  className="text-destructive"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button onClick={() => handleApprove(selectedRegistration.id)}>
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

  );
};

export default ViewRegistrations;
