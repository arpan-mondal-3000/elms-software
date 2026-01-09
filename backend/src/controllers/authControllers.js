import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { users, employees, admins, userRecords } from "../db/schema/users.js";
import { sendMail } from "../utils/mail.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;

const generateAccessToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
const generateRefreshToken = (user) =>
  jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      organizationId,
      departmentId,
      orgEmpId,
      joiningDate,
      contactNo,
      address,
    } = req.body;

    // Check if the user already exists
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (user) {
      return res
        .status(403)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));

    // Insert into users table
    const [newUser] = await db
      .insert(users)
      .values({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: "employee",
        organizationId,
        departmentId,
        orgEmpId,
        joiningDate: new Date(joiningDate),
        contactNo,
        address,
      })
      .returning();

    if (!newUser) {
      console.error("User insertion unsuccessful");
      return res.status(500).json({ success: false, message: "Error in registering employee!" });
    }

    // Get the admin id and email for the user
    const [admin] = await db.select({
      adminId: admins.adminId,
      email: users.email
    }).from(admins)
      .innerJoin(users, eq(users.id, admins.adminId))
      .where(eq(admins.manages, Number(departmentId))).limit(1);

    // Insert into employees table
    await db.insert(employees).values({
      employeeId: newUser.id,
      adminId: admin.adminId
    });

    // Insert into userRecords table
    await db.insert(userRecords).values({
      id: newUser.id,
      organizationId: Number(organizationId),
      departmentId: Number(departmentId)
    });

    // Send email to admin
    await sendMail(
      admin.email,
      "New registration request",
      `A new registration request has been submitted by ${newUser.firstName} ${newUser.lastName}`,
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #f8fafc; padding: 24px; border-radius: 10px; border: 1px solid #e2e8f0;">
        
        <h2 style="color: #0f172a; margin-top: 0;">
          New Registration Request
        </h2>

        <p style="font-size: 15px; color: #334155;">
          A new registration request has been submitted by
          <strong>${newUser.firstName} ${newUser.lastName}</strong>.
        </p>

        <p style="font-size: 15px; color: #334155;">
          Please review the request and take the appropriate action.
        </p>

        <a 
          href="${process.env.FRONTEND_URL}/admin/view-registrations"
          style="
            display: inline-block;
            margin-top: 16px;
            padding: 12px 20px;
            background: #2563eb;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: bold;
          "
        >
          Review Request
        </a>

        <p style="font-size: 13px; color: #64748b; margin-top: 24px;">
          — Proleave System
        </p>

      </div>
      `
    )

    return res.status(200).json({ success: true, message: "Registration successful wait for admin approval." });
  } catch (err) {
    console.error("Error in registration: ", err);
    return res.status(500).json({ success: false, message: "Error in registering employee!" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // check if user exists
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found!" });
    }

    // Check if the password matches
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials!" });
    }

    // Different logic for employee and admin
    if (user.role === "employee") {
      const [employee] = await db
        .select()
        .from(employees)
        .where(eq(employees.employeeId, user.id))
        .limit(1);
      if (!employee) {
        return res
          .status(400)
          .json({ success: false, message: "Employee not found!" });
      }
      // Check if employee is approved by admin
      if (!employee.isApproved) {
        return res.status(400).json({
          success: false,
          message: "Employee is not approved by admin!",
        });
      }
      // Send data and cookies
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      // Update refresh token in database.
      await db.update(users).set({ refreshToken }).where(eq(users.id, user.id));
      console.log("Employee logged in with ID: ", user.id);
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
          success: true,
          message: "Login successful.",
          user: {
            id: user.id,
            orgEmpId: user.orgEmpId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            contactNo: user.contactNo,
            role: user.role,
            address: user.address,
            joiningDate: user.joiningDate,
            adminId: employee.adminId,
          },
        });
    } else if (user.role === "admin") {
      const [admin] = await db
        .select()
        .from(admins)
        .where(eq(admins.adminId, user.id))
        .limit(1);
      // check if admin exists.
      if (!admin) {
        return res
          .status(400)
          .json({ success: false, message: "Admin not Found." });
      }
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      await db.update(users).set({ refreshToken }).where(eq(users.id, user.id));
      console.log("Admin logged in with ID: ", user.id);
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
          success: true,
          message: "Login Successful",
          user: {
            id: user.id,
            orgEmpId: user.orgEmpId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            contactNo: user.contactNo,
            role: user.role,
            address: user.address,
            joiningDate: user.joiningDate,
            manages: admin.manages,
          },
        });
    }

    return res
      .status(400)
      .json({ success: false, message: "Invalid credentials!" });
  } catch (err) {
    console.error("Error in login: ", err);
    res
      .status(500)
      .json({ success: false, message: "Server error while logging in!" });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    // if no refresh token sent.
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh Token not Found." });
    }
    // verify the refresh token
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Invalid or expired refresh token ",
        });
      }
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, decoded.id))
        .limit(1);

      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "user not found" });
      }
      if (user.refreshToken !== refreshToken) {
        return res.status(403).json({
          success: false,
          message: "Invalid or expired refresh token ",
        });
      }
      // Generate a new Access Token.
      const newAccessToken = generateAccessToken(user);
      // Send the new Access Token
      res
        .cookie("accessToken", newAccessToken, {
          httpOnly: true,
          sameSite: "lax",
          secure: false,
          maxAge: 60 * 60 * 1000, // 1 hour
        })
        .status(200)
        .json({
          success: true,
          message: "Access Token Refreshed succesfully . ",
        });
    });
  } catch (err) {
    console.error("error in refreshing access token :", err);
    res.status(500).json({
      success: false,
      message: "server error in refreshing access token ",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.user.id;
    if (userId) {
      // Make refreshToken null in database
      await db.update(users).set({ refreshToken: null }).where(eq(users.id, userId));

      // Clear accessToken and refreshToken in client side
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });

      return res.status(200).json({ success: false, message: "Logged out successfully" });
    }
  } catch (err) {
    console.error("Error in logout: ", err);
    return res.status(500).json({ success: false, message: "Error logging out" });
  }
}