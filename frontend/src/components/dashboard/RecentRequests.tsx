import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";
import type { RecentLeaveRequest } from "../../lib/types";

type LeaveStatus = "pending" | "approved" | "rejected" | "expired";

const statusStyles: Record<LeaveStatus, string> = {
  pending: "bg-warning/15 text-warning border-warning/30",
  approved: "bg-primary/10 text-primary border-primary/10",
  rejected: "bg-destructive/20 text-destructive border-destructive/10",
  expired: "bg-muted/20 text-muted-foreground border-muted/30",
};

const RecentRequests = ({ recentRequests }: { recentRequests: RecentLeaveRequest[] }) => {
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
                className={cn(
                  "capitalize",
                  statusStyles[request.status as LeaveStatus]
                )}
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
