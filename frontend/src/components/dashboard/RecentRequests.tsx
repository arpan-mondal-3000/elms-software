import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
  days: number;
}

const recentRequests: LeaveRequest[] = [
  {
    id: "1",
    type: "Annual Leave",
    startDate: "Jan 15, 2025",
    endDate: "Jan 17, 2025",
    status: "approved",
    days: 3,
  },
  {
    id: "2",
    type: "Sick Leave",
    startDate: "Jan 10, 2025",
    endDate: "Jan 10, 2025",
    status: "approved",
    days: 1,
  },
  {
    id: "3",
    type: "Personal Leave",
    startDate: "Feb 01, 2025",
    endDate: "Feb 02, 2025",
    status: "pending",
    days: 2,
  },
  {
    id: "4",
    type: "Annual Leave",
    startDate: "Dec 20, 2024",
    endDate: "Dec 20, 2024",
    status: "rejected",
    days: 1,
  },
];

const statusStyles = {
  pending: "bg-warning/15 text-warning border-warning/30",
  approved: "bg-primary/10 text-primary border-primary/10",
  rejected: "bg-destructive/20 text-destructive border-destructive/10",
};

const RecentRequests = () => {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Recent Leave Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
            >
              <div className="space-y-1">
                <p className="font-medium text-foreground">{request.type}</p>
                <p className="text-sm text-muted-foreground">
                  {request.startDate} — {request.endDate} ({request.days} {request.days === 1 ? "day" : "days"})
                </p>
              </div>
              <Badge
                variant="outline"
                className={cn("capitalize", statusStyles[request.status])}
              >
                {request.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentRequests;
