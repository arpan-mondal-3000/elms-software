export type LeaveRequest = {
    id: string;
    orgEmpId: string;
    employeeName: string;
    employeeEmail: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    days: number;
    reason: string;
    status: "pending" | "approved" | "rejected" | "canceled";
    approvalComments?: string;
    approvalDate?: string;
    submittedAt: string;
}

export type CancelledRequests = {
    id: string;
    orgEmpId: string;
    employeeName: string;
    employeeEmail: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    days: number;
    cancellationReason: string;
    submittedAt: string;
}

export type Registration = {
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