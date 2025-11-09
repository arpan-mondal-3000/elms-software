import {
  integer,
  pgTable,
  varchar,
  pgEnum,
  text,
  date,
} from "drizzle-orm/pg-core";
import { timestamps } from "./columns.helper.js";
import { employees, admins } from "./users.js";
import { relations } from "drizzle-orm";

// Enums
export const statuses = pgEnum("statuses", [
  "pending",
  "approved",
  "rejected",
  "canceled",
]);

// Tables
export const leaveTypes = pgTable("leave_types", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  maxDaysPerYear: integer("max_days_per_year").notNull().default(0),
  ...timestamps,
});

export const leaveBalances = pgTable("leave_balances", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  employeeId: integer("employee_id")
    .notNull()
    .references(() => employees.employeeId),
  leaveType: integer("leave_type")
    .notNull()
    .references(() => leaveTypes.id),
  usedDays: integer("used_days").notNull().default(0),
  remainingDays: integer("remaining_days").notNull(),
  ...timestamps,
});

export const leaveRequests = pgTable("leave_requests", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  employeeId: integer("employee_id")
    .notNull()
    .references(() => employees.employeeId),
  approverId: integer("approver_id")
    .notNull()
    .references(() => admins.adminId),
  leaveType: integer("leave_type")
    .notNull()
    .references(() => leaveTypes.id),
  status: statuses("status").notNull().default("pending"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  totalDays: integer("total_days").notNull(),
  reason: text("reason").notNull(),
  approverComment: text("approval_comment"),
  approvalDate: date("approval_date"),
  ...timestamps,
});

// Relations
export const leaveTypeRelations = relations(leaveTypes, ({ many }) => ({
  leaveBalance: many(leaveBalances),
  leaveRequest: many(leaveRequests),
}));

export const leaveBalanceRelations = relations(leaveBalances, ({ one }) => ({
  employee: one(employees, {
    fields: [leaveBalances.employeeId],
    references: [employees.employeeId],
  }),
  leaveType: one(leaveTypes, {
    fields: [leaveBalances.leaveType],
    references: [leaveTypes.id],
  }),
}));

export const leaveRequestRelations = relations(leaveRequests, ({ one }) => ({
  employee: one(employees, {
    fields: [leaveRequests.employeeId],
    references: [employees.employeeId],
  }),
  admin: one(admins, {
    fields: [leaveRequests.approverId],
    references: [admins.adminId],
  }),
  leaveType: one(leaveTypes, {
    fields: [leaveRequests.leaveType],
    references: [leaveType.id],
  }),
}));
