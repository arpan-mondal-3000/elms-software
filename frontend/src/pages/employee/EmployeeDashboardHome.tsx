import { Calendar, CheckCircle, Clock } from "lucide-react";

import StatsCard from "../../components/dashboard/StatsCard";
import RecentRequests from "../../components/dashboard/RecentRequests";
import UpcomingTimeOff from "../../components/dashboard/UpcomingTimeOff";

const EmployeeDashboardHome = () => {
  return (

    <div className="space-y-6 mx-10 mt-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-4xl font-semibold tracking-tight leading-relaxed text-foreground">
          Welcome back, Arpan! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your leave status
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="animate-fade-in" style={{ animationDelay: "0ms" }}>
          <StatsCard
            title="Total Leaves"
            value={20}
            icon={Calendar}
            variant="primary"
            description="Annual allocation"
          />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: "50ms" }}>
          <StatsCard
            title="Leaves Taken"
            value={8}
            icon={CheckCircle}
            variant="success"
            description="This year"
          />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
          <StatsCard
            title="Pending Requests"
            value={1}
            icon={Clock}
            variant="warning"
            description="Awaiting approval"
          />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: "150ms" }}>
          <StatsCard
            title="Remaining Leaves"
            value={12}
            icon={Calendar}
            variant="default"
            description="Available to use"
          />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <RecentRequests />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: "250ms" }}>
          <UpcomingTimeOff />
        </div>
      </div>
    </div>

  );
};

export default EmployeeDashboardHome;
