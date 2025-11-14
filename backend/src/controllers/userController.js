import { db } from "../db/db.js";
import { users, employees, admins } from "../db/schema/users.js";
import { eq } from "drizzle-orm";

export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;

        // send user details to frontend according to role
        if (role === "employee") {
            const [user] = await db
                .select({
                    id: users.id,
                    orgEmpId: users.orgEmpId,
                    firstName: users.firstName,
                    lastName: users.lastName,
                    email: users.email,
                    contactNo: users.contactNo,
                    role: users.role,
                    address: users.address,
                    joiningDate: users.joiningDate,

                    adminId: employees.adminId,
                })
                .from(users)
                .leftJoin(employees, eq(users.id, employees.employeeId))
                .where(eq(users.id, userId))
                .limit(1);

            if (!user) {
                return res.status(401).json({ success: false, message: "User not found!" });
            }
            return res.status(200).json({
                success: true, message: "User profile fetched successfully.", user: {
                    id: user.id,
                    orgEmpId: user.orgEmpId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    contactNo: user.contactNo,
                    role: user.role,
                    address: user.address,
                    joiningDate: user.joiningDate,
                    adminId: user.adminId,
                }
            })
        } else if (role === "admin") {
            const [user] = await db
                .select({
                    id: users.id,
                    orgEmpId: users.orgEmpId,
                    firstName: users.firstName,
                    lastName: users.lastName,
                    email: users.email,
                    contactNo: users.contactNo,
                    role: users.role,
                    address: users.address,
                    joiningDate: users.joiningDate,

                    manages: admins.manages
                })
                .from(users)
                .leftJoin(admins, eq(users.id, admins.adminId))
                .where(eq(users.id, userId))
                .limit(1);

            if (!user) {
                return res.status(401).json({ success: false, message: "User not found!" });
            }
            return res.status(200).json({
                success: true, message: "User profile fetched successfully.", user: {
                    id: user.id,
                    orgEmpId: user.orgEmpId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    contactNo: user.contactNo,
                    role: user.role,
                    address: user.address,
                    joiningDate: user.joiningDate,
                    manages: user.manages,
                }
            })
        }
    } catch (err) {
        console.error("Error fetching user profile: ", err);
        res.status(500).json({ success: false, message: "Error fetching user profile!" });
    }
}