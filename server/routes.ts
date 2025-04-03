import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, hashPassword } from "./auth";
import path from "path";
import { logoUpload, documentUpload, saveFileToDatabase, getFileById, deleteFile } from "./file-service";
import dotenv from "dotenv";

export async function registerRoutes(app: Express): Promise<Server> {
  // Load environment variables
  dotenv.config();
  
  // Setup authentication endpoints
  setupAuth(app);
  
  // Clerk authentication API key endpoint
  app.get("/api/clerk-key", (req, res) => {
    res.json({ publishableKey: process.env.CLERK_PUBLISHABLE_KEY });
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

  // Framework management endpoints
  app.post("/api/frameworks", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      // Verify user is admin (in a real app, check user.role === 'admin')
      const framework = await storage.saveFramework(req.body);
      res.status(201).json(framework);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/frameworks", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const frameworks = await storage.getFrameworks();
      res.json(frameworks);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/frameworks/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const { id } = req.params;
      const framework = await storage.getFrameworkById(parseInt(id));
      
      if (!framework) {
        return res.status(404).json({ error: "Framework not found" });
      }
      
      res.json(framework);
    } catch (error) {
      next(error);
    }
  });

  // Domain management endpoints
  app.post("/api/domains", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      // Verify user is admin (in a real app, check user.role === 'admin')
      const domain = await storage.saveDomain(req.body);
      res.status(201).json(domain);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/frameworks/:frameworkId/domains", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const { frameworkId } = req.params;
      const domains = await storage.getDomainsByFrameworkId(parseInt(frameworkId));
      res.json(domains);
    } catch (error) {
      next(error);
    }
  });

  // Control management endpoints
  app.post("/api/controls", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      // Verify user is admin (in a real app, check user.role === 'admin')
      const control = await storage.saveControl(req.body);
      res.status(201).json(control);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/domains/:domainId/controls", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const { domainId } = req.params;
      const controls = await storage.getControlsByDomainId(parseInt(domainId));
      res.json(controls);
    } catch (error) {
      next(error);
    }
  });

  // Assessment management endpoints
  app.post("/api/assessments", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      if (!req.user?.id) {
        return res.status(401).json({ error: "User ID not found" });
      }
      
      const assessment = await storage.createAssessment({
        ...req.body,
        createdBy: req.user.id
      });
      
      res.status(201).json(assessment);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/assessments", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      // In a real app, you would get the company ID from the user's profile
      // or use the user's ID to filter assessments
      const companyId = parseInt(req.query.companyId as string) || 1;
      
      const assessments = await storage.getAssessmentsByCompanyId(companyId);
      res.json(assessments);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/assessments/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const { id } = req.params;
      const assessment = await storage.getAssessmentById(parseInt(id));
      
      if (!assessment) {
        return res.status(404).json({ error: "Assessment not found" });
      }
      
      res.json(assessment);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/assessments/:id/status", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const { id } = req.params;
      const { status, score } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      
      const assessment = await storage.updateAssessmentStatus(parseInt(id), status, score);
      res.json(assessment);
    } catch (error) {
      next(error);
    }
  });

  // Assessment Results endpoints
  app.post("/api/assessment-results", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      if (!req.user?.id) {
        return res.status(401).json({ error: "User ID not found" });
      }
      
      const result = await storage.saveAssessmentResult({
        ...req.body,
        updatedBy: req.user.id
      });
      
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/assessments/:assessmentId/results", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const { assessmentId } = req.params;
      const results = await storage.getAssessmentResultsByAssessmentId(parseInt(assessmentId));
      res.json(results);
    } catch (error) {
      next(error);
    }
  });

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
