import { db } from "../db/db.js";
import { users, employees } from "../db/schema/users.js";
import { eq } from "drizzle-orm";

export const getAllEmployees = async (req, res) => {
    try {
        const adminId = req.user.id;

        const adminEmployees = await db.select({
            id: users.id,
            orgEmpId: users.orgEmpId,
            firstName: users.firstName,
            lastName: users.lastName,
            // position: employees.position,
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