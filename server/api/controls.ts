import { Router } from "express";
import { storage } from "../storage";
import { insertControlSchema } from "@shared/schema";

const router = Router();

// Get all controls for a domain
router.get("/api/domains/:domainId/controls", async (req, res) => {
  try {
    const domainId = parseInt(req.params.domainId);
    const domain = await storage.getDomainById(domainId);
    
    if (!domain) {
      return res.status(404).json({ error: "Domain not found" });
    }
    
    const controls = await storage.getControlsByDomainId(domainId);
    
    // Enhance controls with their codes
    const controlsWithCodes = controls.map((control, index) => {
      return {
        ...control,
        code: `C${index + 1}`,
        domainName: domain.name,
      };
    });
    
    res.json(controlsWithCodes);
  } catch (error) {
    console.error("Error fetching controls:", error);
    res.status(500).json({ error: "Failed to fetch controls" });
  }
});

// Get a specific control
router.get("/api/controls/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const control = await storage.getControlById(id);
    
    if (!control) {
      return res.status(404).json({ error: "Control not found" });
    }
    
    res.json(control);
  } catch (error) {
    console.error("Error fetching control:", error);
    res.status(500).json({ error: "Failed to fetch control" });
  }
});

// Create a new control (Admin only)
router.post("/api/controls", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  try {
    const parsedData = insertControlSchema.parse(req.body);
    const control = await storage.saveControl(parsedData);
    res.status(201).json(control);
  } catch (error) {
    console.error("Error creating control:", error);
    res.status(400).json({ error: "Failed to create control" });
  }
});

export default router;