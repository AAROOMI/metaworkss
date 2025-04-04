import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, hashPassword } from "./auth";
import path from "path";
import { logoUpload, documentUpload, saveFileToDatabase, getFileById, deleteFile } from "./file-service";
import dotenv from "dotenv";
import express from 'express';

// Import API routes
import assessmentsRouter from "./api/assessments";
import assessmentResultsRouter from "./api/assessment-results";
import frameworksRouter from "./api/frameworks";
import domainsRouter from "./api/domains";
import controlsRouter from "./api/controls";
import { registerReportsRoutes } from "./api/reports";


export async function registerRoutes(app: Express): Promise<Server> {
  // Load environment variables
  dotenv.config();

  // Setup authentication endpoints
  setupAuth(app);

  // Clerk authentication API key endpoint
  app.get("/api/clerk-key", (req, res) => {
    const publishableKey = process.env.CLERK_PUBLISHABLE_KEY;
    console.log("Sending Clerk publishable key:", publishableKey);
    res.json({ publishableKey });
  });

  // D-ID API keys endpoint
  app.get("/api/did-keys", (req, res) => {
    const clientKey = process.env.DID_CLIENT_KEY;
    const agentId = process.env.DID_AGENT_ID;
    const apiKey = process.env.DID_API_KEY;
    console.log("Sending D-ID keys - Client Key: (masked), Agent ID:", agentId);
    res.json({ clientKey, agentId, apiKey });
  });

  // D-ID API proxy endpoint for secure communication
  app.post("/api/did-agent", async (req, res, next) => {
    try {
      const apiKey = process.env.DID_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "D-ID API key is not configured" });
      }

      // Here we would typically make a request to the D-ID API
      // using the apiKey for authentication
      // This is a placeholder for the actual implementation
      res.json({ 
        success: true, 
        message: "D-ID agent API request processed successfully" 
      });
    } catch (error) {
      next(error);
    }
  });

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

      // If company has a logo, get the file info
      let logoUrl = null;
      if (companyInfo?.logoId) {
        const logoFile = await getFileById(companyInfo.logoId);
        if (logoFile) {
          logoUrl = `/uploads/logos/${path.basename(logoFile.path)}`;
        }
      }

      res.json({
        ...companyInfo,
        logoUrl,
        cybersecurityStaff: staffMembers.map(staff => staff.staffName)
      });
    } catch (error) {
      next(error);
    }
  });

  // File upload endpoints
  app.post("/api/upload/logo", logoUpload.single("logo"), async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });

      const userId = req.user?.id;
      const fileId = await saveFileToDatabase(req.file, "logo", userId);

      // Update company info with the logo file ID
      const companyInfo = await storage.getCompanyInfo();
      if (companyInfo) {
        // If there was a previous logo, delete it
        if (companyInfo.logoId) {
          await deleteFile(companyInfo.logoId);
        }

        await storage.saveCompanyInfo({
          ...companyInfo,
          logoId: fileId
        });
      }

      res.status(201).json({ 
        fileId,
        filename: req.file.filename,
        url: `/uploads/logos/${req.file.filename}`
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/upload/document", documentUpload.single("document"), async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });

      const userId = req.user?.id;
      const fileId = await saveFileToDatabase(req.file, "document", userId);

      res.status(201).json({ 
        fileId,
        filename: req.file.filename,
        url: `/uploads/documents/${req.file.filename}`
      });
    } catch (error) {
      next(error);
    }
  });

  // Serve uploaded files
  app.get("/uploads/logos/:filename", (req, res) => {
    res.sendFile(path.join(process.cwd(), "uploads", "logos", req.params.filename));
  });

  app.get("/uploads/documents/:filename", (req, res) => {
    res.sendFile(path.join(process.cwd(), "uploads", "documents", req.params.filename));
  });

  // Serve static files from attached_assets
  app.use('/attached_assets', express.static(path.join(process.cwd(), 'public', 'attached_assets')));

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

  app.post("/api/policies/:policyId/attach-document", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);

      const { policyId } = req.params;
      const { fileId } = req.body;

      if (!fileId) {
        return res.status(400).json({ error: "File ID is required" });
      }

      // Update policy with file ID
      const policy = await storage.getPolicyById(parseInt(policyId));
      if (!policy) {
        return res.status(404).json({ error: "Policy not found" });
      }

      const updatedPolicy = await storage.savePolicy({
        ...policy,
        fileId,
        updatedAt: new Date().toISOString()
      });

      res.json(updatedPolicy);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/policies", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);

      const policies = await storage.getPolicies();

      // Add file URLs to policies that have documents
      const policiesWithUrls = await Promise.all(policies.map(async (policy) => {
        let documentUrl = null;
        if (policy.fileId) {
          const docFile = await getFileById(policy.fileId);
          if (docFile) {
            documentUrl = `/uploads/documents/${path.basename(docFile.path)}`;
          }
        }
        return {
          ...policy,
          documentUrl
        };
      }));

      res.json(policiesWithUrls);
    } catch (error) {
      next(error);
    }
  });

  // Dashboard access check
app.get("/api/dashboard-access", async (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ error: "Not authenticated" });
  const user = req.user;
  res.json({ 
    hasAdminAccess: user.role === 'admin',
    hasUserAccess: true
  });
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
        password: await hashPassword(password),
        role,
        accessLevel,
        isActive
      });

      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  });

  // Register modular API routers
  app.use(frameworksRouter);
  app.use(domainsRouter);
  app.use(controlsRouter);
  app.use(assessmentsRouter);
  app.use(assessmentResultsRouter);
  
  // Register reports API routes
  registerReportsRoutes(app);



  // Remediation Tasks endpoints
  app.post("/api/remediation-tasks", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);

      const task = await storage.saveRemediationTask(req.body);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/assessments/:assessmentId/remediation-tasks", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);

      const { assessmentId } = req.params;
      const tasks = await storage.getRemediationTasksByAssessmentId(parseInt(assessmentId));
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/remediation-tasks/:id/status", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);

      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }

      const task = await storage.updateRemediationTaskStatus(parseInt(id), status);
      res.json(task);
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}