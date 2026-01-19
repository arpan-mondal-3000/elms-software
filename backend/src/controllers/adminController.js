import { db } from "../db/db.js";
import { users, employees, userRecords, leaveRequests } from "../db/schema/schema.js";
import { eq, and } from "drizzle-orm";

export const getAllEmployees = async (req, res) => {
    try {
        const adminId = req.user.id;

        const adminEmployees = await db.select({
            id: users.id,
            orgEmpId: users.orgEmpId,
            firstName: users.firstName,
            lastName: users.lastName,
            position: employees.position,
            email: users.email,
            contactNo: users.contactNo,
            address: users.address,
            joinDate: users.joiningDate,
            isApproved: employees.isApproved,
            submittedAt: users.createdAt
        })
            .from(users)
            .leftJoin(employees, eq(employees.employeeId, users.id))
            .where(eq(employees.adminId, adminId));
        return res.status(200).json({ success: true, data: adminEmployees });
    } catch (err) {
        console.error("Error fetching employees: ", err);
        return res.status(500).json({ success: false, message: "Error fetching all employees." });
    }
}

export const approveEmployee = async (req, res) => {
    try {
        const { employeeId } = req.body;
        // Check if the employee is already approved
        const [employee] = await db.select().from(employees).where(eq(employees.employeeId, employeeId)).limit(1);
        if (employee.isApproved) {
            console.log("Employee is already approved.");
            return res.status(208).json({ success: false, message: "Employee is already verified" });
        }
        // Approve Employee
        await db.update(employees).set({ isApproved: true }).where(eq(employees.employeeId, employeeId));

        return res.status(200).json({ success: true, message: "Employee registration approved successfully." });
    } catch (err) {
        console.error("Error approving Employee registration: ", err);
        return res.status(500).json({ success: false, message: "Error approving employee registration!" });
    }
}

export const deleteEmployee = async (req, res) => {
    try {
        const { employeeId } = req.body;
        // Delete user from database
        await db.delete(users).where(eq(users.id, employeeId));
        return res.status(200).json({ success: true, message: "User deleted successfully." });
    } catch (err) {
        console.error("Error deleting employee: ", err);
        return res.status(500).json({ success: false, message: "Error deleting employee!" });
    }
}

export const analyzeAbsentee = async (req, res) => {
    try {
        const {
            departmentId,
            fromDate,
            toDate
        } = req.body;

        // Select the approved leave requests of the employees of this department
        const leaveData = await db.select({
            startDate: leaveRequests.startDate,
            endDate: leaveRequests.endDate
        })
            .from(userRecords)
            .innerJoin(leaveRequests, and(eq(userRecords.id, leaveRequests.employeeId), eq(leaveRequests.status, "approved")))
            .where(eq(userRecords.departmentId, departmentId));

        const DAYS = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];

        const result = {
            Sunday: 0,
            Monday: 0,
            Tuesday: 0,
            Wednesday: 0,
            Thursday: 0,
            Friday: 0,
            Saturday: 0,
        };
        const from = new Date(fromDate);
        const to = new Date(toDate);

        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);

        for (const leave of leaveData) {
            let start = new Date(leave.startDate);
            let end = new Date(leave.endDate);

            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);

            // Skip if no overlap
            if (end < from || start > to) continue;
            // Clamp to requested range
            const current = new Date(
                Math.max(start.getTime(), from.getTime())
            );
            const last = new Date(
                Math.min(end.getTime(), to.getTime())
            );
            // let current = start;
            while (current <= end) {
                const dayName = DAYS[current.getDay()];
                result[dayName]++;

                // Move to next day
                current.setDate(current.getDate() + 1);
            }
        }
        return res.status(200).json({ success: true, data: result });
    } catch (err) {
        console.error("Error generating absentee report: ", err);
        return res.status(500).json({ success: false, message: "Error generating absentee report" });
    }
}