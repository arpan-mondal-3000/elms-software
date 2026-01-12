import React from "react";
import { type LeaveDetail } from "../lib/types";
import { Progress } from "../components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";


function toneToClasses(tone?: LeaveDetail['tone']) {
    switch (tone) {
        case "teal":
            return { chip: "bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300", bar: "bg-teal-500" };
        case "amber":
            return { chip: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300", bar: "bg-amber-500" };
        case "blue":
        default:
            return { chip: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300", bar: "bg-primary" };
    }
}

const LeaveCard: React.FC<{ detail: LeaveDetail }> = ({ detail }) => {
    const pct = Math.round((detail.used / detail.total) * 100);
    const classes = toneToClasses(detail.tone);

    return (
        <Card>
            <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-base">{detail.title}</CardTitle>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${classes.chip}`}>
                    Total: {detail.total} Days
                </span>
            </CardHeader>
            <CardContent>
                <div className="flex items-baseline justify-between text-sm">
                    <p className="text-sm text-muted-foreground">{detail.used} of {detail.total} days taken</p>
                    <p className="text-sm font-medium">{pct}% Used</p>
                </div>

                <div className="mt-3">
                    <Progress value={pct} className="h-2.5" />
                </div>
            </CardContent>
        </Card>
    );
};

export default LeaveCard;