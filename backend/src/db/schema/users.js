import {
  pgTable,
  integer,
  text,
  varchar,
  pgEnum,
  date,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { timestamps } from "./columns.helper.js";
import { organizations, departments } from "./organization.js";
import { leaveBalances, leaveRequests } from "./leave.js";

// Enums
export const roles = pgEnum("role", ["admin", "employee"]);

// Tables
export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  orgEmpId: text("org_emp_id").notNull(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email", { length: 200 }).notNull().unique(),
  password: text("password").notNull(),
  contactNo: text("contact_no").notNull(),
  role: roles("role").notNull().default("employee"),
  address: text("address").notNull(),
  joiningDate: date("joining_date").notNull(),
  refreshToken: text("refresh_token"),
  ...timestamps,
});

export const admins = pgTable("admins", {
  adminId: integer("admin_id")
    .notNull()
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  manages: integer("manages")
    .notNull()
    .references(() => departments.id),
  ...timestamps,
});

export const employees = pgTable("employees", {
  employeeId: integer("employee_id")
    .notNull()
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  isApproved: boolean("is_approved").notNull().default(false),
  adminId: integer("admin_id")
    .notNull()
    .references(() => admins.adminId),
  ...timestamps,
});

export const userRecords = pgTable("user_records", {
  id: integer("id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  organizationId: integer("organization_id").references(() => organizations.id),
  departmentId: integer("department_id").references(() => departments.id),
  ...timestamps,
});

// Relations
export const userRelations = relations(users, ({ one }) => ({
  admin: one(admins, {
    fields: [users.id],
    references: [admins.adminId],
  }),
  employee: one(employees, {
    fields: [users.id],
    references: [employees.employeeId],
  }),
  userRecord: one(userRecords, {
    fields: [users.id],
    references: [userRecords.id],
  }),
}));


export const adminRelations = relations(admins, ({ one, many }) => ({
  user: one(users, {
    fields: [admins.adminId],
    references: [users.id],
  }),
  manages: one(departments, {
    fields: [admins.manages],
    references: [departments.id],
  }),
  employees: many(employees),
  leaveRequest: many(leaveRequests),
}));

export const employeeRelations = relations(employees, ({ one, many }) => ({
  user: one(users, {
    fields: [employees.employeeId],
    references: [users.id],
  }),
  admin: one(admins, {
    fields: [employees.adminId],
    references: [admins.adminId],
  }),
  leaveBalance: many(leaveBalances),
  leaveRequest: many(leaveRequests),
}));

export const userRecordRelations = relations(userRecords, ({ one }) => ({
  user: one(users, {
    fields: [userRecords.id],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [userRecords.organizationId],
    references: [organizations.id],
  }),
  department: one(departments, {
    fields: [userRecords.departmentId],
    references: [departments.id],
  }),
}));
