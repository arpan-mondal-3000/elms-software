import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { users, employees } from "../db/schema/users.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;

const generateAccessToken = (user) => jwt.sign({ id: user.id, email: user.email, role: user.role }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
const generateRefreshToken = (user) => jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

export const register = async (req, res) => {
    const { } = req.body;
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // check if user exists
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found!" });
        }

        // Check if the password matches
        const match = bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ success: false, message: "Invalid credentials!" })
        }

        // Different logic for employee and admin
        if (user.role === "employee") {
            const [employee] = await db.select().from(employees).where(eq(employees.employeeId, user.id)).limit(1);
            if (!employee) {
                return res.status(400).json({ success: false, message: "Employee not found!" });
            }
            // Check if employee is approved by admin
            if (!employee.isApproved) {
                return res.status(400).json({ success: false, message: "Employee is not approved by admin!" });
            }
            // Send data and cookies
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
            return res
                .cookie("accessToken", accessToken, {
                    httpOnly: true,
                    sameSite: "lax",
                    secure: false,
                    maxAge: 60 * 60 * 1000, // 1 hour
                })
                .cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    sameSite: "lax",
                    secure: false,
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                })
                .status(200)
                .json({
                    success: true, message: "Login successful.", data: {
                        id: user.id,
                        orgEmpId: user.orgEmpId,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        contactNo: user.contactNo,
                        role: user.role,
                        address: user.address,
                        joiningDate: user.joiningDate,
                    }
                });
        } else if (user.role === "admin") {

        }

        return res.status(400).json({ success: false, message: "Invalid credentials!" });
    } catch (err) {
        console.log("Error in login: ", err);
        res.status(500).json({ success: false, message: "Server error while logging in!" })
    }
}

export const refreshAccessToken = async (req, res) => {

}