import { db } from "../db/db.js";
import { leaveRequests, employees, leaveBalances, leaveTypes } from "../db/schema/schema.js";
import { and, eq } from "drizzle-orm";

export const getAllAdminLeaves = async (req, res) => {
    try {
        const { id: adminId } = req.user;
        const leaves = await db.select()
            .from(leaveRequests)
            .where(eq(leaveRequests.approverId, adminId));

        res.status(200).json({ success: true, data: leaves });
    } catch (err) {
        console.error("Failed to fetch admin leave requests: ", err);
        res.status(500).json({ success: false, message: "Failed to fetch admin leave requests!" });
    }
}

export const getAllEmployeeLeaves = async (req, res) => {
    try {
        const { id: employeeId } = req.user;
        const leaves = await db.select()
            .from(leaveRequests)
            .where(eq(leaveRequests.employeeId, employeeId));

        res.status(200).json({ success: true, data: leaves });
    } catch (err) {
        console.error("Failed to fetch admin leave requests: ", err);
        res.status(500).json({ success: false, message: "Failed to fetch admin leave requests!" });
    }
}

export const createLeaveRequst = async (req, res) => {
    try {
        const { id: employeeId } = req.user;
        // Get the leave data from body
        const {
            leaveType,
            startDate,
            endDate,
            reason
        } = req.body;

        // Calculate the total days
        const startOfLeave = new Date(startDate);
        const endOfLeave = new Date(endDate);

        // Check if start date is less than current date
        const currentDate = new Date();
        if (startOfLeave <= currentDate) {
            console.error("Leave request cannot be created for past!");
            return res.status(406).json({ success: false, message: "Leave request cannot be created for past!" });
        }
        let totalDays = 0;
        const oneDayInMs = 1000 * 60 * 60 * 24;
        if (startDate <= endDate) {
            totalDays = Math.round(Math.abs((startOfLeave - endOfLeave) / oneDayInMs)) + 1;
        } else {
            console.error("Start date must be less than or equal to end date of leave!");
            return res.status(406).json({ success: false, message: "Start date must be less than or equal to end date of leave!" });
        }

        //Check if the employee has sufficient leave balancess
        const [leaveBalance] = await db.select()
            .from(leaveBalances)
            .where(and(eq(leaveBalances.employeeId, employeeId), eq(leaveBalances.leaveType, leaveType)))
            .limit(1);
        if (!leaveBalance) {
            // If there is no leave balance then create a new entry
            const [leaveTypeData] = await db.select().from(leaveTypes).where(eq(leaveTypes.id, leaveType)).limit(1);
            const maxDaysPerYear = Number(leaveTypeData.maxDaysPerYear);
            // Create a leave balance entry
            await db.insert(leaveBalances).values({
                employeeId,
                leaveType,
                usedDays: 0,
                remainingDays: maxDaysPerYear
            });
            if (totalDays > maxDaysPerYear) {
                console.err("Total number of days exceeded balance for user ", employeeId);
                return res.status(406).json({ success: false, message: "Total number of days exceeded your balance!" });
            }
        } else if (totalDays > Number(leaveBalance.remainingDays)) {
            // Leave cannot be created as limit is crossed
            console.error("Total number of days exceeded balance for user ", employeeId);
            return res.status(406).json({ success: false, message: "Total number of days exceeded your balance!" });
        }

        // Get the adminId for the employee
        const [employee] = await db.select().from(employees).where(eq(employees.employeeId, employeeId)).limit(1);
        // Insert leave request into database
        const [newLeaveRequest] = await db.insert(leaveRequests).values({
            employeeId,
            approverId: employee.adminId,
            leaveType,
            startDate,
            endDate,
            totalDays,
            reason
        }).returning();
        // Send mail to admin
        return res.status(200).json({ success: true, data: newLeaveRequest });
    } catch (err) {
        console.error("Failed to create leave request: ", err);
        res.status(500).json({ success: false, message: "Failed to create leave request!" });
    }
}

export const updateLeaveRequest = async (req, res) => {
    try {
        const { id: employeeId } = req.user;
        const { leaveId } = req.params;
        const {
            leaveType,
            startDate,
            endDate,
            reason
        } = req.body;

        // Fetch leave request
        const [oldLeaveRequest] = await db.select().from(leaveRequests).where(eq(leaveRequests.id, leaveId)).limit(1);
        // Leave can only be updated if leave period has not started yet
        const oldLeaveStart = new Date(oldLeaveRequest.startDate);
        const currentDate = new Date();
        if (oldLeaveStart >= currentDate) {
            console.error("Leave period has already started for leave ", leaveId);
            return res.status(406).json({ success: false, message: "Leave period has already started!" });
        }

        // Check if the updated leave request is valid
        // Calculate the total days
        const startOfLeave = new Date(startDate);
        const endOfLeave = new Date(endDate);
        // Check if start date is less than current date
        if (startOfLeave <= currentDate) {
            console.error("Leave request cannot be created for past!");
            return res.status(406).json({ success: false, message: "Leave request cannot be created for past!" });
        }
        let totalDays = 0;
        const oneDayInMs = 1000 * 60 * 60 * 24;
        if (startDate <= endDate) {
            totalDays = Math.round(Math.abs((startOfLeave - endOfLeave) / oneDayInMs)) + 1;
        } else {
            console.error("Start date must be less than or equal to end date of leave!");
            return res.status(406).json({ success: false, message: "Start date must be less than or equal to end date of leave!" });
        }

        let leaveBalance;
        // Fetch leave balance according to leave type id
        if (Number(leaveType) === Number(oldLeaveRequest.leaveType)) {
            [leaveBalance] = await db.select()
                .from(leaveBalances)
                .where(and(eq(leaveBalances.employeeId, employeeId), eq(leaveBalances.leaveType, oldLeaveRequest.leaveType)))
                .limit(1);
        } else {
            [leaveBalance] = await db.select()
                .from(leaveBalances)
                .where(and(eq(leaveBalances.employeeId, employeeId), eq(leaveBalances.leaveType, leaveType)))
                .limit(1);
        }

        // If leave request was already approved reset leave balance
        if (oldLeaveRequest.status === "approved") {
            await db.update(leaveBalances).set({
                usedDays: Number(leaveBalance.usedDays) - Number(oldLeaveRequest.totalDays),
                remainingDays: Number(leaveBalance.remainingDays) + Number(oldLeaveRequest.totalDays),
                updatedAt: new Date()
            }).where(and(eq(leaveBalances.employeeId, employeeId), eq(leaveBalances.leaveType, oldLeaveRequest.leaveType)));
        }

        //Check if the employee has sufficient leave balances
        if (!leaveBalance) {
            // If there is no leave balance then create a new entry
            const [leaveTypeData] = await db.select().from(leaveTypes).where(eq(leaveTypes.id, leaveType)).limit(1);
            const maxDaysPerYear = Number(leaveTypeData.maxDaysPerYear);
            await db.insert(leaveBalances).values({
                employeeId,
                leaveType,
                usedDays: 0,
                remainingDays: maxDaysPerYear
            });
            if (totalDays > maxDaysPerYear) {
                console.err("Total number of days exceeded balance for user ", employeeId);
                return res.status(406).json({ success: false, message: "Total number of days exceeded your balance!" });
            }
        } else if (totalDays > Number(leaveBalance.remainingDays)) {
            // Leave cannot be created as limit is crossed
            console.error("Total number of days exceeded balance for user ", employeeId);
            return res.status(406).json({ success: false, message: "Total number of days exceeded your balance!" });
        }

        // Update the leave request
        const [updatedLeaveRequest] = await db.update(leaveRequests).set({
            ...(leaveType && { leaveType }),
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
            ...(reason && { reason }),
            status: "pending",
            updatedAt: new Date()
        }).where(eq(leaveRequests.id, leaveId)).returning();

        return res.status(200).json({ success: true, data: updatedLeaveRequest });
    } catch (err) {
        console.error("Failed to update leave request: ", err);
        res.status(500).json({ success: false, message: "Failed to update leave request!" });
    }
}

export const cancelLeaveRequest = async (req, res) => {
    try {
        const { id: employeeId } = req.user;
        const { leaveId } = req.params;

        // Fetch the leave request to be cancelled
        const [oldLeaveRequest] = await db.select().from(leaveRequests).where(eq(leaveRequests.id, leaveId)).limit(1);

        // Check if it can be cancelled
        const oldStartDate = new Date(oldLeaveRequest.startDate);
        const currentDate = new Date();
        if (oldStartDate >= currentDate) {
            console.error("Leave period has already started!");
            return res.status(406).json({ success: false, message: "Leave period has already started!" });
        }

        // Update the leave balance only if the leave request was approved
        if (oldLeaveRequest.status === "approved") {
            // Fetch the previous leave balance
            const [oldLeaveBalance] = await db.select()
                .from(leaveBalances)
                .where(and(eq(leaveBalances.employeeId, employeeId), eq(leaveBalances.leaveType, oldLeaveRequest.leaveType)));
            // Update leave balance
            await db.update(leaveBalances).set({
                usedDays: oldLeaveBalance.usedDays - oldLeaveRequest.totalDays,
                remainingDays: oldLeaveBalance.remainingDays + oldLeaveRequest.totalDays,
                updatedAt: new Date()
            }).where(and(eq(leaveBalances.employeeId, employeeId), eq(leaveBalances.leaveType, oldLeaveRequest.leaveType)));
        }

        // Update the leave request to be cancelled
        const [cancelledLeaveRequest] = await db.update(leaveRequests).set({
            status: "canceled",
            updatedAt: new Date()
        }).where(eq(leaveRequests.id, leaveId)).returning();

        return res.status(200).json({ success: true, data: cancelledLeaveRequest });
    } catch (err) {
        console.error("Failed to cancel leave request: ", err);
        return res.status(500).json({ success: false, message: "Failed to cancel leave request!" });
    }
}

export const setLeaveStatus = async (req, res) => {
    try {
        const { id: adminId } = req.user;
        const { leaveId } = req.params;
        const { status, approverComment } = req.body;

        // Fetch the leave request
        const [leaveRequest] = await db.select().from(leaveRequests).where(eq(leaveRequests.id, leaveId));

        // Check if it can be approved or rejected
        const startOfLeave = new Date(leaveRequest.startDate);
        const currentDate = new Date();
        if (startOfLeave >= currentDate) {
            console.error("Leave period has already started!");
            return res.status(406).json({ success: false, message: "Leave period has already started!" });
        }

        if (status === "approved") {
            // Update leave balance
            const [leaveBalance] = await db.select().from(leaveBalances).where(and(eq(leaveBalances.employeeId, leaveRequest.employeeId), eq(leaveBalances.leaveType, leaveRequest.leaveType)));

            await db.update(leaveBalances).set({
                usedDays: Number(leaveBalance.usedDays) + Number(leaveRequest.totalDays),
                remainingDays: Number(leaveBalance.remainingDays) - Number(leaveRequest.totalDays),
                updatedAt: new Date()
            }).where(and(eq(leaveBalances.employeeId, leaveRequest.employeeId), eq(leaveBalances.leaveType, leaveRequest.leaveType)));

            // Update leave request
            const [updatedLeaveRequest] = await db.update(leaveRequests).set({
                status: "approved",
                approverComment,
                approvalDate: new Date(),
                updatedAt: new Date()
            }).where(eq(leaveRequests.id, leaveId));

            return res.status(200).json({ success: true, data: updatedLeaveRequest });
        } else if (status === "rejected") {
            const [updatedLeaveRequest] = await db.update(leaveRequests).set({
                status: "rejected",
                approverComment,
                approvalDate: new Date(),
                updatedAt: new Date()
            }).where(eq(leaveRequests.id, leaveId));

            return res.status(200).json({ success: true, data: updatedLeaveRequest });
        } else {
            console.error("Leave status should either be approved or rejected!");
            return res.status(406).json({ success: false, message: "Leave status should either be approved or rejected!" });
        }
    } catch (err) {
        console.error("Failed to set status of leave request: ", err);
        return res.status(500).json({ success: false, message: "Failed to set status of leave request!" });
    }
}