"use client";

import { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

// Sample leave data
const initialLeaves = [
  {
    id: 1,
    type: "Casual Leave",
    from: "2025-11-15",
    to: "2025-11-18",
    days: 4,
    reason: "Family event",
    status: "pending",
  },
  {
    id: 2,
    type: "Sick Leave",
    from: "2025-10-05",
    to: "2025-10-07",
    days: 3,
    reason: "Fever",
    status: "approved",
  },
  {
    id: 3,
    type: "Earned Leave",
    from: "2025-09-20",
    to: "2025-09-22",
    days: 3,
    reason: "Vacation",
    status: "rejected",
  },
];

export default function Status() {
  const [leaves, setLeaves] = useState(initialLeaves);

  // Handle cancel / update actions
  const handleCancel = (id: number) => {
    setLeaves((prev) =>
      prev.map((leave) =>
        leave.id === id ? { ...leave, status: "cancelled" } : leave
      )
    );
  };

  const handleUpdate = (id: number) => {
    alert(`Redirecting to update form for Leave ID: ${id}`);
    // Navigate to update form or open modal
  };

  const renderLeaveTable = (status: string) => {
    const filtered = leaves.filter((l) => l.status === status);
    if (filtered.length === 0)
      return <p className="text-gray-500 text-center py-4">No {status} leaves.</p>;

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Days</TableHead>
            <TableHead>Reason</TableHead>
            {status === "pending" && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((leave) => (
            <TableRow key={leave.id}>
              <TableCell>{leave.type}</TableCell>
              <TableCell>{leave.from}</TableCell>
              <TableCell>{leave.to}</TableCell>
              <TableCell>{leave.days}</TableCell>
              <TableCell>{leave.reason}</TableCell>
              {status === "pending" && (
                <TableCell className="space-x-2">
                  <Button variant="outline" onClick={() => handleUpdate(leave.id)}>
                    Update
                  </Button>
                  <Button variant="destructive" onClick={() => handleCancel(leave.id)}>
                    Cancel
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-6 ">
      <Card className="w-full max-w-5xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Leave Status
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid grid-cols-4 w-full mb-4">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {renderLeaveTable("pending")}
            </TabsContent>

            <TabsContent value="approved">
              {renderLeaveTable("approved")}
            </TabsContent>

            <TabsContent value="rejected">
              {renderLeaveTable("rejected")}
            </TabsContent>

            <TabsContent value="cancelled">
              {renderLeaveTable("cancelled")}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
