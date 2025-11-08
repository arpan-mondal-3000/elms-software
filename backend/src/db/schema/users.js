import { pgTable, integer, text, varchar, pgEnum, date, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { timestamps } from "./columns.helper.js";
import { departments } from "./organization.js";

// Enums
export const roles = pgEnum("role", ["admin", "employee"]);

// Tables
export const users = pgTable("users", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    orgEmpId: text("org_emp_id").notNull(),
    firstName: varchar("first_name").notNull(),
    lastName: varchar("last_name").notNull(),
    email: varchar("email", { length: 200 }).notNull().unique(),
    password: text("password").notNull(),
    contactNo: text("contact_no").notNull(),
    role: roles("role").notNull().default("employee"),
    address: text("address").notNull(),
    joiningDate: date("joining_date").notNull(),
    ...timestamps
});

export const admins = pgTable("adimn", {
    adminId: integer("admin_id").notNull().primaryKey().references(() => users.id),
    manages: integer("manages").notNull().references(() => departments.id),
    ...timestamps
});

export const employees = pgTable("employees", {
    employeeId: integer("employee_id").notNull().primaryKey().references(() => users.id),
    isApproved: boolean("is_approved").notNull().default(false),
    adminId: integer("admin_id").notNull().references(() => admins.adminId),
    ...timestamps
});

// Relations
export const adminRelations = relations(admins, ({ one }) => ({
    manages: one(departments, {
        fields: [admins.manages],
        references: [departments.id],
    })
}));

// export const employeeRelations = relations(employees, ({}));