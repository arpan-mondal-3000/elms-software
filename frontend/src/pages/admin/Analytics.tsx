import { TrendingUp, TrendingDown, Users, Calendar, Clock, CheckCircle } from "lucide-react";
//import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

const monthlyLeaveData = [
  { month: "Jul", approved: 45, rejected: 5, pending: 3 },
  { month: "Aug", approved: 52, rejected: 8, pending: 2 },
  { month: "Sep", approved: 38, rejected: 4, pending: 5 },
  { month: "Oct", approved: 61, rejected: 7, pending: 4 },
  { month: "Nov", approved: 55, rejected: 6, pending: 8 },
  { month: "Dec", approved: 48, rejected: 3, pending: 12 },
];

const leaveTypeData = [
  { name: "Annual Leave", value: 145, color: "hsl(var(--primary))" },
  { name: "Sick Leave", value: 78, color: "hsl(var(--info))" },
  { name: "Personal Leave", value: 45, color: "hsl(var(--warning))" },
  { name: "Other", value: 22, color: "hsl(var(--muted-foreground))" },
];

const departmentData = [
  { department: "Engineering", leaves: 85, employees: 45 },
  { department: "Marketing", leaves: 42, employees: 22 },
  { department: "Finance", leaves: 38, employees: 18 },
  { department: "HR", leaves: 25, employees: 12 },
  { department: "Operations", leaves: 55, employees: 28 },
];

const trendData = [
  { month: "Jul", thisYear: 53, lastYear: 48 },
  { month: "Aug", thisYear: 62, lastYear: 55 },
  { month: "Sep", thisYear: 47, lastYear: 52 },
  { month: "Oct", thisYear: 72, lastYear: 61 },
  { month: "Nov", thisYear: 69, lastYear: 58 },
  { month: "Dec", thisYear: 63, lastYear: 54 },
];

const chartConfig = {
  approved: { label: "Approved", color: "hsl(var(--success))" },
  rejected: { label: "Rejected", color: "hsl(var(--destructive))" },
  pending: { label: "Pending", color: "hsl(var(--warning))" },
  thisYear: { label: "2024", color: "hsl(var(--primary))" },
  lastYear: { label: "2023", color: "hsl(var(--muted-foreground))" },
};

const Analytics = () => {
  const totalLeaves = leaveTypeData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Insights and trends for leave management</p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-card animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Leaves (YTD)</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{totalLeaves}</p>
                  <div className="flex items-center mt-2 text-success text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+12% from last year</span>
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card animate-fade-in" style={{ animationDelay: "50ms" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approval Rate</p>
                  <p className="text-3xl font-bold text-foreground mt-1">89%</p>
                  <div className="flex items-center mt-2 text-success text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+3% from last month</span>
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card animate-fade-in" style={{ animationDelay: "100ms" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Response Time</p>
                  <p className="text-3xl font-bold text-foreground mt-1">1.2d</p>
                  <div className="flex items-center mt-2 text-destructive text-sm">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    <span>-0.3d from last month</span>
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info/10">
                  <Clock className="h-6 w-6 text-info" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card animate-fade-in" style={{ animationDelay: "150ms" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Employees</p>
                  <p className="text-3xl font-bold text-foreground mt-1">156</p>
                  <div className="flex items-center mt-2 text-success text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+8 new this month</span>
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Monthly Leave Requests */}
          <Card className="shadow-card animate-fade-in" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Monthly Leave Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyLeaveData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="approved" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="rejected" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pending" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-success" />
                  <span className="text-sm text-muted-foreground">Approved</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-destructive" />
                  <span className="text-sm text-muted-foreground">Rejected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-warning" />
                  <span className="text-sm text-muted-foreground">Pending</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leave Type Distribution */}
          <Card className="shadow-card animate-fade-in" style={{ animationDelay: "250ms" }}>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Leave Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ChartContainer config={chartConfig} className="h-[250px] w-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leaveTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {leaveTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {leaveTypeData.map((type) => (
                  <div key={type.name} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: type.color }}
                    />
                    <span className="text-sm text-muted-foreground">{type.name}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {type.value}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Year over Year Comparison */}
          <Card className="shadow-card animate-fade-in" style={{ animationDelay: "300ms" }}>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Year over Year Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="thisYear"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="lastYear"
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-6 bg-primary" />
                  <span className="text-sm text-muted-foreground">2024</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-6 bg-muted-foreground" style={{ borderStyle: "dashed" }} />
                  <span className="text-sm text-muted-foreground">2023</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Department Breakdown */}
          <Card className="shadow-card animate-fade-in" style={{ animationDelay: "350ms" }}>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Leave by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentData.map((dept, index) => {
                  const percentage = Math.round((dept.leaves / totalLeaves) * 100);
                  return (
                    <div key={dept.department}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium">{dept.department}</p>
                          <p className="text-xs text-muted-foreground">
                            {dept.employees} employees
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{dept.leaves} leaves</p>
                          <p className="text-xs text-muted-foreground">{percentage}%</p>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            animationDelay: `${index * 100}ms`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    
  );
};

export default Analytics;
