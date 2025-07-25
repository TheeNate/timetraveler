import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const timesheets = pgTable("timesheets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  date: text("date").notNull(),
  jobNumber: text("job_number").notNull(),
  woNumber: text("wo_number"),
  coNumber: text("co_number"),
  client: text("client").notNull(),
  billingAddress: text("billing_address"),
  location: text("location").notNull(),
  contact: text("contact"),
  contactPhone: text("contact_phone"),
  jobDescription: text("job_description"),
  notes: text("notes"),
  technicians: jsonb("technicians").$type<Array<{
    id: string;
    name: string;
    hours: {
      mon: number;
      tue: number;
      wed: number;
      thu: number;
      fri: number;
      sat: number;
      sun: number;
    };
    total: number;
  }>>(),
  jobDetails: jsonb("job_details").$type<Array<{
    id: string;
    workDescription: string;
    equipment: string;
    materials: string;
    quantity: number;
  }>>(),
  travelHours: jsonb("travel_hours").$type<{
    mon: number;
    tue: number;
    wed: number;
    thu: number;
    fri: number;
    sat: number;
    sun: number;
  }>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const hazardAnalyses = pgTable("hazard_analyses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  ropeAccessMethods: jsonb("rope_access_methods").$type<Record<string, boolean>>(),
  ropeAccessComments: jsonb("rope_access_comments").$type<Record<string, string>>(),
  riggingPlan: text("rigging_plan"),
  riggingConsiderations: jsonb("rigging_considerations").$type<Record<string, string>>(),
  rescuePersonnel: text("rescue_personnel"),
  rescueEquipment: jsonb("rescue_equipment").$type<Record<string, any>>(),
  rescuePlan: text("rescue_plan"),
  communicationMethods: jsonb("communication_methods").$type<Record<string, boolean>>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  timesheets: many(timesheets),
  hazardAnalyses: many(hazardAnalyses),
}));

export const timesheetsRelations = relations(timesheets, ({ one }) => ({
  user: one(users, {
    fields: [timesheets.userId],
    references: [users.id],
  }),
}));

export const hazardAnalysesRelations = relations(hazardAnalyses, ({ one }) => ({
  user: one(users, {
    fields: [hazardAnalyses.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTimesheetSchema = createInsertSchema(timesheets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHazardAnalysisSchema = createInsertSchema(hazardAnalyses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTimesheet = z.infer<typeof insertTimesheetSchema>;
export type Timesheet = typeof timesheets.$inferSelect;
export type InsertHazardAnalysis = z.infer<typeof insertHazardAnalysisSchema>;
export type HazardAnalysis = typeof hazardAnalyses.$inferSelect;
