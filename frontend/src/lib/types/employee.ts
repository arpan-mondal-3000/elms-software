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
