import { 
  users, 
  timesheets, 
  hazardAnalyses,
  type User, 
  type InsertUser,
  type Timesheet,
  type InsertTimesheet,
  type HazardAnalysis,
  type InsertHazardAnalysis
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Timesheet methods
  getTimesheets(userId?: number): Promise<Timesheet[]>;
  getTimesheet(id: number): Promise<Timesheet | undefined>;
  createTimesheet(timesheet: InsertTimesheet): Promise<Timesheet>;
  updateTimesheet(id: number, timesheet: Partial<InsertTimesheet>): Promise<Timesheet | undefined>;
  deleteTimesheet(id: number): Promise<boolean>;
  
  // Hazard Analysis methods
  getHazardAnalyses(userId?: number): Promise<HazardAnalysis[]>;
  getHazardAnalysis(id: number): Promise<HazardAnalysis | undefined>;
  createHazardAnalysis(hazardAnalysis: InsertHazardAnalysis): Promise<HazardAnalysis>;
  updateHazardAnalysis(id: number, hazardAnalysis: Partial<InsertHazardAnalysis>): Promise<HazardAnalysis | undefined>;
  deleteHazardAnalysis(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Timesheet methods
  async getTimesheets(userId?: number): Promise<Timesheet[]> {
    if (userId) {
      return await db.select().from(timesheets).where(eq(timesheets.userId, userId));
    }
    return await db.select().from(timesheets);
  }

  async getTimesheet(id: number): Promise<Timesheet | undefined> {
    const [timesheet] = await db.select().from(timesheets).where(eq(timesheets.id, id));
    return timesheet || undefined;
  }

  async createTimesheet(insertTimesheet: InsertTimesheet): Promise<Timesheet> {
    const [timesheet] = await db
      .insert(timesheets)
      .values({
        ...insertTimesheet,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return timesheet;
  }

  async updateTimesheet(id: number, updateData: Partial<InsertTimesheet>): Promise<Timesheet | undefined> {
    const [timesheet] = await db
      .update(timesheets)
      .set({ 
        ...updateData, 
        updatedAt: new Date(),
      })
      .where(eq(timesheets.id, id))
      .returning();
    return timesheet || undefined;
  }

  async deleteTimesheet(id: number): Promise<boolean> {
    const result = await db.delete(timesheets).where(eq(timesheets.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Hazard Analysis methods
  async getHazardAnalyses(userId?: number): Promise<HazardAnalysis[]> {
    if (userId) {
      return await db.select().from(hazardAnalyses).where(eq(hazardAnalyses.userId, userId));
    }
    return await db.select().from(hazardAnalyses);
  }

  async getHazardAnalysis(id: number): Promise<HazardAnalysis | undefined> {
    const [hazardAnalysis] = await db.select().from(hazardAnalyses).where(eq(hazardAnalyses.id, id));
    return hazardAnalysis || undefined;
  }

  async createHazardAnalysis(insertHazardAnalysis: InsertHazardAnalysis): Promise<HazardAnalysis> {
    const [hazardAnalysis] = await db
      .insert(hazardAnalyses)
      .values({
        ...insertHazardAnalysis,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return hazardAnalysis;
  }

  async updateHazardAnalysis(id: number, updateData: Partial<InsertHazardAnalysis>): Promise<HazardAnalysis | undefined> {
    const [hazardAnalysis] = await db
      .update(hazardAnalyses)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(hazardAnalyses.id, id))
      .returning();
    return hazardAnalysis || undefined;
  }

  async deleteHazardAnalysis(id: number): Promise<boolean> {
    const result = await db.delete(hazardAnalyses).where(eq(hazardAnalyses.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();
