import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { timestamps } from "./columns.helper.js";
import { admins, userRecords } from "./users.js";

// Tables
export const organizations = pgTable("organizations", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  ...timestamps,
});

export const departments = pgTable("departments", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: text("name").notNull(),
  organizationId: integer("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  ...timestamps,
});

// Relations
export const departmentRelations = relations(departments, ({ one }) => ({
  organization: one(organizations, {
    fields: [departments.organizationId],
    references: [organizations.id],
  }),
  admin: one(admins),
  userRecord: one(userRecords),
}));

export const organizationRelations = relations(organizations, ({ many }) => ({
  departments: many(departments),
  userRecord: one(userRecords),
}));
