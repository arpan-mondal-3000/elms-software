import { Calendar, CheckCircle, Clock } from "lucide-react";

import StatsCard from "../../components/dashboard/StatsCard";
import RecentRequests from "../../components/dashboard/RecentRequests";
import UpcomingTimeOff from "../../components/dashboard/UpcomingTimeOff";

import { useAuthStore } from "../../store/authStore";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import type { EmployeeLeaveDetails, RecentLeaveRequest } from "../../lib/types";
import { toast } from "sonner";
import { Oval } from "react-loader-spinner";

type LeaveStats = {
  totalLeaveDays: number;
  leavesTaken: number;
  pendingRequests: number;
}

const EmployeeDashboardHome = () => {
  const { user } = useAuthStore();
  const [recentLeaves, setRecentLeaves] = useState<RecentLeaveRequest[]>([]);
  const [leaveStats, setLeaveStats] = useState<LeaveStats>({
    totalLeaveDays: 0,
    leavesTaken: 0,
    pendingRequests: 0
  })
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        setLoading(true);

        const res = await api.get("/leave/employee");

        // yesterday (local date, midnight)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        const updatedLeaves: EmployeeLeaveDetails[] = res.data.data.map(
          (leave: EmployeeLeaveDetails) => {
            const fromDate = new Date(leave.from);
            fromDate.setHours(0, 0, 0, 0);

            return {
              ...leave,
              status:
                fromDate <= yesterday ? "expired" : leave.status,
            };
          }
        );

        let totalLeaveDays = 0;
        let leavesTaken = 0;
        let pendingRequests = 0;

        updatedLeaves.forEach((leave) => {
          if (leave.status === "approved") {
            totalLeaveDays += leave.days;
            leavesTaken += 1;
          } else if (leave.status === "pending") {
            pendingRequests += 1;
          }
        })

        setLeaveStats({
          totalLeaveDays,
          leavesTaken,
          pendingRequests
        })

        updatedLeaves.sort((a, b) => a.from < b.from ? 1 : -1);
        const recentLeaves: RecentLeaveRequest[] = []
        for (let i = 0; i < updatedLeaves.length; i++) {
          if (updatedLeaves[i].status !== "expired")
            recentLeaves.push({
              id: updatedLeaves[i].id,
              type: updatedLeaves[i].type,
              startDate: updatedLeaves[i].from,
              endDate: updatedLeaves[i].to,
              status: updatedLeaves[i].status,
              days: updatedLeaves[i].days,
            })
          if (i === 5) break;
        }
        setRecentLeaves(recentLeaves);
      } catch (err) {
        console.log("Error fetching employee leave data: ", err);
        toast.error("Failed to fetch leave data");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveData();
  }, []);

  return (

    <div className="space-y-6 mx-10 mt-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-4xl font-semibold tracking-tight leading-relaxed text-foreground">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your leave status
        </p>
      </div>

      {/* Stats Grid */}
      {loading ?
        <div className="flex items-center justify-center">
          < Oval
            visible={true}
            height="80"
            width="80"
            color="#000814"
            secondaryColor="#bad6ff"
            ariaLabel="oval-loading"
            wrapperStyle={{}
            }
            wrapperClass=""
          />
        </div >
        :
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="animate-fade-in" style={{ animationDelay: "0ms" }}>
            <StatsCard
              title="Total leave days"
              value={leaveStats.totalLeaveDays}
              icon={Calendar}
              variant="primary"
              description="Annual allocation"
            />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "50ms" }}>
            <StatsCard
              title="Leaves Taken"
              value={leaveStats.leavesTaken}
              icon={CheckCircle}
              variant="success"
              description="This year"
            />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
            <StatsCard
              title="Pending Requests"
              value={leaveStats.pendingRequests}
              icon={Clock}
              variant="warning"
              description="Awaiting approval"
            />
          </div>
        </div>}

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <RecentRequests recentRequests={recentLeaves} />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: "250ms" }}>
          <UpcomingTimeOff />
        </div>
      </div>
    </div>

  );
};

export default EmployeeDashboardHome;
