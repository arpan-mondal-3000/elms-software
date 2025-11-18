import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "./columns.helper.js";

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
