"use client";

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
import { Button } from "../../components/ui/button";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { type LeaveType, type LeaveDetail } from "../../lib/types";
import LeaveCard from "../../components/LeaveCard";
import { Oval } from "react-loader-spinner";

// Validation Schema
const formSchema = z.object({
  leaveType: z.string().min(1, "Please select a leave type"),
  fromDate: z.string().min(1, "From date is required"),
  toDate: z.string().min(1, "To date is required"),
  reason: z.string().min(5, "Reason must be at least 5 characters"),
});

type LeaveFormValues = z.infer<typeof formSchema>;

export default function ApplyForLeaveForm() {
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
  const [loading, setLoading] = useState(false);

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
      await api.post("/leave/", {
        leaveType: leaveTypeId,
        startDate: values.fromDate,
        endDate: values.toDate,
        reason: values.reason,
      });

      toast.success("Leave application submitted successfully!");
      form.reset();

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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-8 mx-4">
        <h2 className="text-2xl font-semibold text-center mb-6">Apply for Leave</h2>

        <Form {...form}>
          {
            loading ?
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
                          <strong>Description:</strong> {leaveTypes.filter((l: LeaveType) => l.name === selectedLeaveType)[0].description}
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
          }
        </Form>
      </div>
    </div>
  );
}
