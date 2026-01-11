import { Calendar, Sun, PartyPopper } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

const upcomingHolidays = [
  { name: "New Year's Day", date: "Jan 1", daysLeft: 2 },
  { name: "Republic Day", date: "Jan 26", daysLeft: 27 },
];

const approvedLeaves = [
  { type: "Annual Leave", startDate: "Jan 15", endDate: "Jan 17", days: 3 },
];

const UpcomingTimeOff = () => {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Upcoming Time Off
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Approved Leaves */}
        {approvedLeaves.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Your Approved Leaves
            </p>
            {approvedLeaves.map((leave, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20"
              >
                <div className="flex items-center gap-3">
                  <Sun className="h-4 w-4 text-success" />
                  <div>
                    <p className="text-sm font-medium">{leave.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {leave.startDate} - {leave.endDate}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {leave.days} days
                </Badge>
              </div>
            ))}
          </div>
        )}

        {/* Upcoming Holidays */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Upcoming Holidays
          </p>
          {upcomingHolidays.map((holiday, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-accent/50 border border-border"
            >
              <div className="flex items-center gap-3">
                <PartyPopper className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">{holiday.name}</p>
                  <p className="text-xs text-muted-foreground">{holiday.date}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {holiday.daysLeft} days
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingTimeOff;
