import { Users, FileCheck, Clock, XCircle, CheckCircle, AlertTriangle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

const statsData = [
  { title: "Total Employees", value: "156", icon: Users, variant: "default" as const },
  { title: "Pending Registrations", value: "8", icon: Clock, variant: "warning" as const },
  { title: "Pending Leave Requests", value: "12", icon: FileCheck, variant: "info" as const },
  { title: "Cancellation Requests", value: "3", icon: AlertTriangle, variant: "destructive" as const },
];

const recentActivities = [
  { type: "registration", name: "John Smith", action: "submitted registration", time: "2 hours ago" },
  { type: "leave", name: "Sarah Johnson", action: "requested 3 days annual leave", time: "3 hours ago" },
  { type: "cancellation", name: "Mike Brown", action: "requested to cancel approved leave", time: "5 hours ago" },
  { type: "registration", name: "Emily Davis", action: "submitted registration", time: "1 day ago" },
  { type: "leave", name: "Chris Wilson", action: "requested 1 day sick leave", time: "1 day ago" },
];

const pendingActions = [
  { category: "Registrations", count: 8, urgent: 2 },
  { category: "Leave Requests", count: 12, urgent: 4 },
  { category: "Cancellations", count: 3, urgent: 1 },
];

const AdminHome = () => {
  return (
  
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of employee management and leave requests</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat, index) => (
            <Card
              key={stat.title}
              className="shadow-card animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                      stat.variant === "warning"
                        ? "bg-warning/10"
                        : stat.variant === "destructive"
                        ? "bg-destructive/10"
                        : stat.variant === "info"
                        ? "bg-info/10"
                        : "bg-primary/10"
                    }`}
                  >
                    <stat.icon
                      className={`h-6 w-6 ${
                        stat.variant === "warning"
                          ? "text-warning"
                          : stat.variant === "destructive"
                          ? "text-destructive"
                          : stat.variant === "info"
                          ? "text-info"
                          : "text-primary"
                      }`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Pending Actions Summary */}
          <Card className="shadow-card animate-fade-in lg:col-span-1" style={{ animationDelay: "200ms" }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Pending Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingActions.map((action) => (
                <div
                  key={action.category}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
                >
                  <div>
                    <p className="text-sm font-medium">{action.category}</p>
                    <p className="text-xs text-muted-foreground">{action.count} pending</p>
                  </div>
                  {action.urgent > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {action.urgent} urgent
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-card animate-fade-in lg:col-span-2" style={{ animationDelay: "250ms" }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0"
                  >
                    <div
                      className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${
                        activity.type === "registration"
                          ? "bg-primary/10"
                          : activity.type === "leave"
                          ? "bg-info/10"
                          : "bg-warning/10"
                      }`}
                    >
                      {activity.type === "registration" ? (
                        <Users className="h-4 w-4 text-primary" />
                      ) : activity.type === "leave" ? (
                        <FileCheck className="h-4 w-4 text-info" />
                      ) : (
                        <XCircle className="h-4 w-4 text-warning" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.name}</span>{" "}
                        <span className="text-muted-foreground">{activity.action}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Row */}
        <div className="grid gap-4 md:grid-cols-3 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <Card className="shadow-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">89%</p>
                <p className="text-xs text-muted-foreground">Approval Rate</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-info/10">
                <Clock className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">1.2 days</p>
                <p className="text-xs text-muted-foreground">Avg. Response Time</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">On Leave Today</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
   
  );
};

export default AdminHome;
