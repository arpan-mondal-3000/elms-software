import { roles, genders, users, admins, employees, userRecords } from "./users.js"
import { organizations, departments } from "./organization.js"
import { statuses, leaveTypes, leaveBalances, leaveRequests } from "./leave.js";
import { relations } from "drizzle-orm";

export {
    users, genders, roles, admins, employees, userRecords,
    organizations, departments,
    statuses, leaveTypes, leaveBalances, leaveRequests
};


// User relations
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

// Organization relations
export const departmentRelations = relations(departments, ({ one }) => ({
    organization: one(organizations, {
        fields: [departments.organizationId],
        references: [organizations.id],
    }),
    admin: one(admins),
    userRecord: one(userRecords),
}));

export const organizationRelations = relations(organizations, ({ one, many }) => ({
    departments: many(departments),
    userRecord: one(userRecords),
}));

// Leave relations
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
        references: [leaveTypes.id],
    }),
}));
