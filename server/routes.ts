import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTimesheetSchema, insertHazardAnalysisSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Timesheet routes
  app.get("/api/timesheets", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const timesheets = await storage.getTimesheets(userId);
      res.json(timesheets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch timesheets" });
    }
  });

  app.get("/api/timesheets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const timesheet = await storage.getTimesheet(id);
      if (!timesheet) {
        return res.status(404).json({ error: "Timesheet not found" });
      }
      res.json(timesheet);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch timesheet" });
    }
  });

  app.post("/api/timesheets", async (req, res) => {
    try {
      const validatedData = insertTimesheetSchema.parse(req.body);
      const timesheet = await storage.createTimesheet(validatedData);
      res.status(201).json(timesheet);
    } catch (error) {
      res.status(400).json({ error: "Invalid timesheet data" });
    }
  });

  app.put("/api/timesheets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertTimesheetSchema.partial().parse(req.body);
      const timesheet = await storage.updateTimesheet(id, validatedData);
      if (!timesheet) {
        return res.status(404).json({ error: "Timesheet not found" });
      }
      res.json(timesheet);
    } catch (error) {
      res.status(400).json({ error: "Invalid timesheet data" });
    }
  });

  app.delete("/api/timesheets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTimesheet(id);
      if (!deleted) {
        return res.status(404).json({ error: "Timesheet not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete timesheet" });
    }
  });

  // Hazard Analysis routes
  app.get("/api/hazard-analyses", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const hazardAnalyses = await storage.getHazardAnalyses(userId);
      res.json(hazardAnalyses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hazard analyses" });
    }
  });

  app.get("/api/hazard-analyses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const hazardAnalysis = await storage.getHazardAnalysis(id);
      if (!hazardAnalysis) {
        return res.status(404).json({ error: "Hazard analysis not found" });
      }
      res.json(hazardAnalysis);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hazard analysis" });
    }
  });

  app.post("/api/hazard-analyses", async (req, res) => {
    try {
      const validatedData = insertHazardAnalysisSchema.parse(req.body);
      const hazardAnalysis = await storage.createHazardAnalysis(validatedData);
      res.status(201).json(hazardAnalysis);
    } catch (error) {
      res.status(400).json({ error: "Invalid hazard analysis data" });
    }
  });

  app.put("/api/hazard-analyses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertHazardAnalysisSchema.partial().parse(req.body);
      const hazardAnalysis = await storage.updateHazardAnalysis(id, validatedData);
      if (!hazardAnalysis) {
        return res.status(404).json({ error: "Hazard analysis not found" });
      }
      res.json(hazardAnalysis);
    } catch (error) {
      res.status(400).json({ error: "Invalid hazard analysis data" });
    }
  });

  app.delete("/api/hazard-analyses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteHazardAnalysis(id);
      if (!deleted) {
        return res.status(404).json({ error: "Hazard analysis not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete hazard analysis" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
