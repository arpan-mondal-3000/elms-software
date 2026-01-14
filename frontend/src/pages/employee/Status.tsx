"use client";

import { useEffect, useState } from "react";
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
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { toast } from "sonner";
import { api } from "../../api/api";
import { Oval } from "react-loader-spinner";
import { type EmployeeLeaveDetails } from "../../lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog"
import { AxiosError } from "axios";

import * as z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import LeaveCard from "../../components/LeaveCard";
import { type LeaveType, type LeaveDetail } from "../../lib/types";
import { ArrowLeft } from 'lucide-react';

// Validation Schema
const formSchema = z.object({
  leaveType: z.string().min(1, "Please select a leave type"),
  fromDate: z.string().min(1, "From date is required"),
  toDate: z.string().min(1, "To date is required"),
  reason: z.string().min(5, "Reason must be at least 5 characters"),
});

type LeaveFormValues = z.infer<typeof formSchema>;

export default function Status() {
  const [leaves, setLeaves] = useState<EmployeeLeaveDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingLeave, setUpdatingLeave] = useState<EmployeeLeaveDetails>();
  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      leaveType: "",
      fromDate: "",
      toDate: "",
      reason: "",
    },
  });
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [leaveBalanceDetails, setLeaveBalanceDetails] = useState<LeaveDetail>({
    title: "",
    total: 0,
    used: 0
  });
  const [leaveDetailsLoading, setLeaveDetailsLoading] = useState(false);
  const selectedLeaveType = useWatch({
    control: form.control,
    name: "leaveType",
  });

  // Handle cancel
  const handleCancel = async (id: number) => {
    try {
      setLoading(true);
      await api.post(`/leave/cancel/${id}`);
      setLeaves((prev) =>
        prev.map((leave) =>
          leave.id === id ? { ...leave, status: "cancelled" } : leave
        )
      );
    } catch (err) {
      if (err instanceof AxiosError) {
        const message = err.response?.data.message;
        toast.error(`Failed to cancel leave request: ${message}`);
        console.log(err, message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (id: number) => {
    const leaveObj = leaves.find((l) => l.id === id);
    if (leaveObj) {
      setUpdatingLeave(leaveObj);
      form.setValue("leaveType", leaveObj.type);
      form.setValue("fromDate", leaveObj.from);
      form.setValue("toDate", leaveObj.to);
      form.setValue("reason", leaveObj.reason);
      setIsUpdating(true);
    }
  };

  const onSubmit = async (values: LeaveFormValues) => {
    try {
      setLoading(true);
      // Find selected leave type object
      const leaveTypeObj = leaveTypes.find(
        (lt) => lt.name === values.leaveType
      );

      if (!leaveTypeObj) {
        toast.error("Invalid leave type selected");
        return;
      }

      const leaveTypeId = leaveTypeObj.id;

      // Date validation
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const startDate = new Date(values.fromDate);
      const endDate = new Date(values.toDate);

      if (startDate < today) {
        toast.error("Start date must be today or a future date");
        return;
      }

      if (endDate < startDate) {
        toast.error("End date cannot be before start date");
        return;
      }

      // Calculate total leave days (inclusive)
      const oneDay = 1000 * 60 * 60 * 24;
      const totalDays =
        Math.floor((endDate.getTime() - startDate.getTime()) / oneDay) + 1;

      // Check remaining leave balance
      const remainingDays =
        leaveBalanceDetails.total - leaveBalanceDetails.used;

      if (totalDays > remainingDays) {
        toast.error(
          `Insufficient leave balance. You have only ${remainingDays} days remaining`
        );
        return;
      }

      // POST request
      const res = await api.put(`/leave/${updatingLeave?.id}`, {
        leaveType: leaveTypeId,
        startDate: values.fromDate,
        endDate: values.toDate,
        reason: values.reason,
      });

      const updatedLeaveData = res.data.data;
      // Update the leave request
      if (updatingLeave && updatedLeaveData) {
        const updatedLeave: EmployeeLeaveDetails = {
          id: updatedLeaveData.id,
          type: updatingLeave.type,
          from: updatedLeaveData.startDate,
          to: updatedLeaveData.endDate,
          days: updatedLeaveData.totalDays,
          reason: updatedLeaveData.reason,
          status: updatedLeaveData.status
        }
        setLeaves((prev) => prev.map((leave) => {
          if (leave.id !== updatedLeave.id)
            return leave;
          return updatedLeave;
        }));
      }

      toast.success("Leave updation submitted successfully!");
      form.reset();
      setIsUpdating(false);
    } catch (err) {
      if (err instanceof AxiosError) {
        const message = err.response?.data?.message || "Something went wrong";
        toast.error(message);
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

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

        setLeaves(updatedLeaves);
      } catch (err) {
        console.log("Error fetching employee leave data: ", err);
        toast.error("Failed to fetch leave data");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveData();
  }, []);



  useEffect(() => {
    const fetchLeaveBalance = async () => {
      try {
        // fetch leave balance for the selected type
        if (selectedLeaveType) {
          setLeaveDetailsLoading(true);
          const leaveTypeDetails = leaveTypes.filter((l) => l.name === selectedLeaveType)[0];
          const leaveTypeId = leaveTypeDetails.id;
          const leaveBalanceRes = await api.get(`leave/leave-balance/${leaveTypeId}`);
          setLeaveBalanceDetails({
            title: selectedLeaveType,
            total: leaveTypeDetails.maxDaysPerYear,
            used: leaveBalanceRes.data.data.usedDays,
            tone: "blue"
          })
        }
      } catch (err) {
        if (err instanceof AxiosError) {
          const message = err.response?.data.message;
          console.log(err, message);
          toast.error(`Failed to fetch leave balance: `, message);
        }
      } finally {
        setLeaveDetailsLoading(false);
      }
    }

    fetchLeaveBalance();
  }, [selectedLeaveType])

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        // fetch leave types
        const leaveTypesRes = await api.get("/leave/leave-types");
        setLeaveTypes(leaveTypesRes.data.data);
      } catch (err) {
        if (err instanceof AxiosError) {
          const message = err.response?.data.message;
          console.log(err, message);
          toast.error(`Failed to fetch leave types: `, message);
        }
      }
    }
    fetchLeaveTypes();
  }, []);

  const renderLeaveTable = (status: string) => {
    const filtered = leaves.filter((l) => l.status === status);
    if (loading)
      return (
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
      )
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
            {status === "approved" && <TableHead>Approval date</TableHead>}
            {status === "rejected" && <TableHead>Rejection date</TableHead>}
            {status === "rejected" && <TableHead>Rejection reason</TableHead>}
            {(status === "pending" || status === "approved") && <TableHead>Actions</TableHead>}
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
              {(status === "approved" || status === "rejected") && <TableCell>{leave.approvalDate}</TableCell>}
              {status === "rejected" && <TableCell>{leave.approvalComment}</TableCell>}
              {(status === "pending" || status === "approved") && (leave.from > new Date().toLocaleDateString("en-CA")) && (
                <TableCell className="space-x-2">
                  <Button variant="outline" onClick={() => handleUpdate(leave.id)}>
                    Update
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        Cancel
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Do you want to cancel your leave request?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-500" onClick={() => handleCancel(leave.id)}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  if (isUpdating) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background-light">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-8 mx-4">
          <Button onClick={() => setIsUpdating(false)}><ArrowLeft /></Button>
          <h2 className="text-2xl font-semibold text-center mb-6">Update Leave Request</h2>
          {
            loading ?
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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="leaveType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select leave Type</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select leave type" />
                            </SelectTrigger>
                            <SelectContent>
                              {leaveTypes.map((lt: LeaveType) => (
                                <SelectItem value={lt.name} key={lt.id}>
                                  {lt.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {
                    leaveDetailsLoading ?
                      <div className="flex items-center justify-center">
                        <Oval
                          visible={true}
                          height="80"
                          width="80"
                          color="#000814"
                          secondaryColor="#bad6ff"
                          ariaLabel="oval-loading"
                          wrapperStyle={{}}
                          wrapperClass=""
                        />
                      </div>
                      :
                      <>
                        {
                          selectedLeaveType &&
                          <div className="text-sm text-muted-foreground border p-2 rounded-lg">
                            <strong>Description:</strong> {leaveTypes.filter((l: LeaveType) => l.name === selectedLeaveType)[0]?.description}
                          </div>
                        }

                        {
                          selectedLeaveType && leaveBalanceDetails.title.trim() !== "" &&
                          <LeaveCard detail={leaveBalanceDetails} />
                        }
                      </>
                  }
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fromDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="toDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>To Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason for Leave</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter reason for your leave..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">Submit Application</Button>
                </form>
              </Form>
          }
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-background-light p-6 ">
      <Card className="w-full max-w-5xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Leave Status
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid grid-cols-5 w-full mb-4">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
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

            <TabsContent value="expired">
              {renderLeaveTable("expired")}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
