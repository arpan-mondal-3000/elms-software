export interface LeaveSummary {
    label: string;
    daysLeft: number;
}

export interface LeaveDetail {
    title: string;
    total: number;
    used: number;
    tone?: "blue" | "teal" | "amber";
}

export type LeaveType = {
    id: number;
    name: string;
    description: string;
    maxDaysPerYear: number;
}

export type EmployeeLeaveDetails = {
    id: number;
    type: string;
    from: string;
    to: string;
    days: number;
    reason: string;
    status: string;
    approvalComment?: string;
    approvalDate?: string;
}

export interface RecentLeaveRequest {
    id: number;
    type: string;
    startDate: string;
    endDate: string;
    status: string;
    days: number;
}