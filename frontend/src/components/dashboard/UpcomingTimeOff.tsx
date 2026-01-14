import { Calendar, PartyPopper } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

const upcomingHolidays = [
  { name: "New Year's Day", date: "Jan 1", daysLeft: 2 },
  { name: "Republic Day", date: "Jan 26", daysLeft: 27 },
];

const UpcomingTimeOff = () => {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Upcoming Holidays
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upcoming Holidays */}
        <div className="space-y-2">
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
