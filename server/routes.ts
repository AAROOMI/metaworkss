import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication endpoints
  setupAuth(app);

  // API endpoints for company information
  app.post("/api/company-info", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const companyInfo = await storage.saveCompanyInfo(req.body);
      
      // Handle cybersecurity staff
      if (req.body.cybersecurityStaff && Array.isArray(req.body.cybersecurityStaff)) {
        const staffMembers = req.body.cybersecurityStaff.filter((name: string) => name.trim() !== '');
        
        if (staffMembers.length > 0) {
          await storage.saveCybersecurityStaff(companyInfo.id, staffMembers);
        }
      }
      
      res.status(201).json(companyInfo);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/company-info", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const companyInfo = await storage.getCompanyInfo();
      const staffMembers = await storage.getCybersecurityStaff(companyInfo?.id || 0);
      
      res.json({
        ...companyInfo,
        cybersecurityStaff: staffMembers.map(staff => staff.staffName)
      });
    } catch (error) {
      next(error);
    }
  });

  // Policy management endpoints
  app.post("/api/policies", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const now = new Date().toISOString();
      const policy = await storage.savePolicy({
        ...req.body,
        createdAt: now,
        updatedAt: now
      });
      
      res.status(201).json(policy);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/policies", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const policies = await storage.getPolicies();
      res.json(policies);
    } catch (error) {
      next(error);
    }
  });

  // User management for admin
  app.get("/api/users", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      // Verify user is admin (in a real app, check user.role === 'admin')
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/users", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      // Verify user is admin (in a real app, check user.role === 'admin')
      const { username, password, role, accessLevel, isActive } = req.body;
      
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).send("Username already exists");
      }
      
      // Hash password and create user
      const user = await storage.createUser({
        username,
        password, // In a real app, this would be hashed
        role,
        accessLevel,
        isActive
      });
      
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
