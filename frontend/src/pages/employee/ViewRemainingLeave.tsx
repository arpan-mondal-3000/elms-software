import { type JSX } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Calendar, Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

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
import LeaveCard from "../../components/LeaveCard";

const SUMMARY: LeaveSummary[] = [
  { label: "Annual Leave", daysLeft: 15 },
  { label: "Sick Leave", daysLeft: 8 },
  { label: "Personal Leave", daysLeft: 2 },
  { label: "Carry-over", daysLeft: 0 },
];

const DETAILS: LeaveDetail[] = [
  { title: "Annual Leave", total: 20, used: 5, tone: "blue" },
  { title: "Sick Leave", total: 10, used: 2, tone: "teal" },
  { title: "Personal Leave", total: 3, used: 1, tone: "amber" },
];

export default function ViewRemainingLeaveShadcn(): JSX.Element {

  const navigate = useNavigate();

  const [summary, setSummary] = useState<LeaveSummary[]>(SUMMARY);
  const [details, setDetails] = useState<LeaveDetail[]>(DETAILS);
  // useEffect(() => {
  //   const fetchOverview = async () => {
  //     const res = await fetch("/api/employee/leaves/overview", {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });

  //     const json = await res.json();
  //     if (!json.success) return;

  //     const data = json.data;

  //     // SUMMARY
  //     setSummary(
  //       data.map((d: any) => ({
  //         label: d.title,
  //         daysLeft: d.remaining,
  //       }))
  //     );

  //     // DETAILS
  //     setDetails(
  //       data.map((d: any) => ({
  //         title: d.title,
  //         total: d.total,
  //         used: d.used,
  //         tone:
  //           d.title === "Sick Leave"
  //             ? "teal"
  //             : d.title === "Personal Leave"
  //               ? "amber"
  //               : "blue",
  //       }))
  //     );
  //   };

  //   fetchOverview();
  // }, []);
  return (

    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark font-display">
      <div className="mx-auto max-w-7xl p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight leading-relaxed text-foreground">Leave Overview</h1>
            <p className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">Your leave balance for the current year at a glance.</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" className="gap-2">
              <Calendar size={16} />
              View full history
            </Button>

            <Button onClick={() => navigate("/employee/apply-for-leave")}>
              <Plus className="" size={14} />Request Leave
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {summary.map((s) => (
            <Card key={s.label} className="p-5">
              <CardContent className="p-0">
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  {s.label}
                </p>
                <div className="mt-2 text-2xl font-bold">
                  {s.daysLeft}
                  <span className="text-sm font-medium text-text-secondary-light          dark:text-text-secondary-dark">
                    {" "}Days Left
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {details.map((d) => (
            <LeaveCard key={d.title} detail={d} />
          ))}

        </div>

        <div className="mt-6">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-base">Company Policy</CardTitle>
              <Badge>Read</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Review the official guidelines for leave requests, accrual rates, and blackout periods.</p>
              <div className="mt-4">
                <Button variant="outline">View Policy</Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
