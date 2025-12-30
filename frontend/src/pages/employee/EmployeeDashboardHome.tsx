import React from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";

export default function EmployeeDashboardHome(): JSX.Element {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-display">
      <header className="sticky top-0 z-10 w-full bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex items-center gap-4">
            <span className="text-primary font-bold text-xl">▲</span>
            <h2 className="text-lg font-bold tracking-[-0.015em]">LeaveSys</h2>
          </div>

          <nav className="hidden md:flex items-center gap-9">
            <a className="text-sm font-medium text-primary" href="#">Dashboard</a>
            <a className="text-sm hover:text-primary" href="#">My Requests</a>
            <a className="text-sm hover:text-primary" href="#">Team Calendar</a>
            <a className="text-sm hover:text-primary" href="#">Help</a>
          </nav>

          <div className="flex justify-end items-center gap-4">
            <Button variant="ghost" size="icon">
              <span className="material-symbols-outlined text-subtle-light dark:text-subtle-dark">notifications</span>
            </Button>
            <div
              className="bg-center bg-cover rounded-full size-10"
              style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAHnfV3ZZYR9o61qFH91IB-3STdv6WV3vzvE2HE1fpyLUs9yB0lymjetonlgmGXx3u-qxCc9VbPSQEQKao2FzgNvuwGi91tbOL-25MAuaKV-z9Q2_CasHs8GCuNNdiGVvvuelJSx7d5PmOifC7BO-CcTGlspqc0dPfHRL9C4reiFxHAXoPAQLh7Zga_Wiy98Fn_DB_gXszcpNvIpGnPt4Dcm797ibYCrAAGYXabM2XSnt4oC8sp8LT18TUPmT_JylJd4vPVVZsjlcQ')` }}
            ></div>
          </div>
        </div>
      </header>

      <main className="w-full py-8">
        <div className="mx-auto max-w-7xl flex flex-col gap-8 px-4 sm:px-6 lg:px-8">
          {/* Greeting */}
          <div>
            <h1 className="text-4xl font-black">Good morning, Alex!</h1>
            <p className="text-subtle-light dark:text-subtle-dark">Here's your leave summary and quick actions.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Section */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 flex flex-col gap-2">
                    <p className="font-medium">Annual Leave</p>
                    <p className="text-2xl font-bold">15/20 Days</p>
                    <Progress value={75} />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex flex-col gap-2">
                    <p className="font-medium">Sick Leave</p>
                    <p className="text-2xl font-bold">8/10 Days</p>
                    <Progress value={80} />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex flex-col gap-2">
                    <p className="font-medium">Personal Leave</p>
                    <p className="text-2xl font-bold">5/5 Days</p>
                    <Progress value={100} />
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardContent className="flex flex-col md:flex-row gap-6 p-6 justify-between">
                  <div className="flex flex-col gap-4 flex-1">
                    <h3 className="text-lg font-bold">Manage your leave</h3>
                    <p className="text-sm text-subtle-light dark:text-subtle-dark">Easily request new leave or view your past requests.</p>

                    <div className="flex gap-3">
                      <Button>
                        <span className="material-symbols-outlined text-lg">add</span>
                        Request Leave
                      </Button>
                      <Button variant="outline">View My Requests</Button>
                    </div>
                  </div>

                  <div
                    className="w-full md:w-1/3 bg-cover rounded-lg min-h-[150px]"
                    style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDSb4i6fOEJKcfyQsJF59I44fqbO9KR76MsvuLWwkxPm2wd3x7GzsmnGmgxkzgWcVa__0CrWgPhJ84T_aTh5L8jWbidjscPR6y1Dwu6VkJY2ukOgPjGIkpdm6WXMdi58Vjrm1SxHDzb9uSL_YsY5fJEcEEOoDaW67VuFbJYtElYbH3sdBWNyzRCWZGqCTb5q2IpRnTiuiU8HPwLrsXJLrO2vcRTGv0Q192Tw1Rqw-srHCwtQ41UrXmTjKTemhr-F2XIr7oUpXXz7oQ')` }}
                  ></div>
                </CardContent>
              </Card>
            </div>

            {/* Right Section */}
            <div className="flex flex-col gap-6">
              {/* Upcoming Leave */}
              <Card>
                <CardContent className="p-6 flex flex-col gap-4">
                  <h3 className="text-lg font-bold">Upcoming Time Off</h3>
                  <ul className="flex flex-col gap-4">
                    <li className="flex items-center gap-4">
                      <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10">
                        <span className="material-symbols-outlined text-primary">flight_takeoff</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Annual Leave</p>
                        <p className="text-sm text-subtle-light dark:text-subtle-dark">Oct 23 - Oct 27, 2024</p>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Approved</Badge>
                    </li>

                    <li className="flex items-center gap-4">
                      <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10">
                        <span className="material-symbols-outlined text-primary">calendar_month</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Personal Day</p>
                        <p className="text-sm text-subtle-light dark:text-subtle-dark">Nov 10, 2024</p>
                      </div>
                      <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400">Pending</Badge>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Holidays */}
              <Card>
                <CardContent className="p-6 flex flex-col gap-4">
                  <h3 className="text-lg font-bold">Company Holidays</h3>
                  <ul className="flex flex-col gap-4">
                    <li className="flex items-center gap-4">
                      <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10">
                        <span className="material-symbols-outlined text-primary">celebration</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Thanksgiving Day</p>
                        <p className="text-sm text-subtle-light dark:text-subtle-dark">Nov 28, 2024</p>
                      </div>
                    </li>

                    <li className="flex items-center gap-4">
                      <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10">
                        <span className="material-symbols-outlined text-primary">ac_unit</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Christmas Day</p>
                        <p className="text-sm text-subtle-light dark:text-subtle-dark">Dec 25, 2024</p>
                      </div>
                    </li>

                    <li className="flex items-center gap-4">
                      <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10">
                        <span className="material-symbols-outlined text-primary">nightlife</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">New Year's Day</p>
                        <p className="text-sm text-subtle-light dark:text-subtle-dark">Jan 1, 2025</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
