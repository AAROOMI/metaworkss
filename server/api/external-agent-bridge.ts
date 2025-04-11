/**
 * External AI Agent Bridge API
 * 
 * This API acts as a bridge to integrate with external AI agent services.
 * It provides endpoints for configuring and interacting with your custom AI agent
 * implementation without tightly coupling it to the main application.
 */

import { Router } from 'express';
import axios from 'axios';
import { z } from 'zod';

// Create a dedicated router for external agent integration
const externalAgentRouter = Router();

// Configuration for the external agent service
let externalAgentConfig = {
  enabled: true,
  // This URL can be updated to point to your custom AI agent service
  serviceUrl: process.env.EXTERNAL_AGENT_URL || 'http://localhost:5001',
  // Default configuration for agent display
  displayConfig: {
    title: "AI Security Consultant",
    subtitle: "Ask questions about cybersecurity and compliance",
    iconType: "shield", // Options: shield, user, bot, custom
    customIconUrl: ""
  }
};

// Validation schema for agent configuration
const configurationSchema = z.object({
  serviceUrl: z.string().url().optional(),
  displayConfig: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    iconType: z.enum(["shield", "user", "bot", "custom"]).optional(),
    customIconUrl: z.string().url().optional()
  }).optional(),
  apiKey: z.string().optional(),
  enabled: z.boolean().optional()
});

// GET endpoint to retrieve the current external agent configuration
externalAgentRouter.get('/config', (req, res) => {
  // Remove sensitive information like API keys before sending to frontend
  const safeConfig = {
    ...externalAgentConfig,
    serviceUrl: undefined,
    apiKey: undefined,
    enabled: externalAgentConfig.enabled
  };
  
  res.json(safeConfig);
});

// POST endpoint to update the external agent configuration
externalAgentRouter.post('/config', async (req, res) => {
  try {
    // Validate the configuration
    const validation = configurationSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        error: "Invalid configuration", 
        details: validation.error.format() 
      });
    }
    
    // Update the configuration
    externalAgentConfig = {
      ...externalAgentConfig,
      ...validation.data,
      displayConfig: {
        ...externalAgentConfig.displayConfig,
        ...validation.data.displayConfig
      }
    };
    
    res.json({ success: true, message: "External agent configuration updated" });
  } catch (error) {
    console.error("Error updating external agent configuration:", error);
    res.status(500).json({ error: "Failed to update configuration" });
  }
});

// POST endpoint to proxy requests to the external agent service
externalAgentRouter.post('/query', async (req, res) => {
  try {
    if (!externalAgentConfig.enabled) {
      return res.status(503).json({ error: "External agent service is disabled" });
    }
    
    // Extract the query from the request body
    const { query, sessionId } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }
    
    // Forward the query to the external agent service
    const response = await axios.post(`${externalAgentConfig.serviceUrl}/api/agent/query`, {
      query,
      sessionId,
      // Include any additional context or user information needed
      context: {
        userId: req.user?.id,
        username: req.user?.username,
        timestamp: new Date().toISOString()
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        // Include authentication if needed
        'Authorization': `Bearer ${process.env.EXTERNAL_AGENT_API_KEY || ''}`
      },
      timeout: 30000 // 30-second timeout
    });
    
    // Return the response from the external agent
    res.json(response.data);
  } catch (error: any) {
    console.error("Error querying external agent:", error);
    
    // Handle different types of errors
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        return res.status(503).json({ 
          error: "External agent service unavailable", 
          message: "Could not connect to the external agent service. Please check if it's running." 
        });
      }
      
      if (error.response) {
        return res.status(error.response.status).json({
          error: "External agent service error",
          details: error.response.data
        });
      }
    }
    
    res.status(500).json({ 
      error: "Failed to communicate with external agent", 
      message: error.message || "Unknown error" 
    });
  }
});

// POST endpoint to initialize a new session with the external agent
externalAgentRouter.post('/session', async (req, res) => {
  try {
    if (!externalAgentConfig.enabled) {
      return res.status(503).json({ error: "External agent service is disabled" });
    }
    
    // Extract the user information
    const { userId, username } = req.body;
    
    // Initialize a new session with the external agent service
    const response = await axios.post(`${externalAgentConfig.serviceUrl}/api/agent/session`, {
      userId,
      username,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EXTERNAL_AGENT_API_KEY || ''}`
      }
    });
    
    // Return the session information
    res.json(response.data);
  } catch (error: any) {
    console.error("Error initializing external agent session:", error);
    
    if (axios.isAxiosError(error) && error.response) {
      return res.status(error.response.status).json({
        error: "Failed to initialize session with external agent",
        details: error.response.data
      });
    }
    
    res.status(500).json({ 
      error: "Failed to initialize session with external agent", 
      message: error.message || "Unknown error"
    });
  }
});

// Health check endpoint to verify the external agent service is available
externalAgentRouter.get('/health', async (req, res) => {
  try {
    if (!externalAgentConfig.enabled) {
      return res.json({ status: "disabled" });
    }
    
    // Check if the external agent service is available
    const response = await axios.get(`${externalAgentConfig.serviceUrl}/health`, {
      timeout: 5000
    });
    
    res.json({ 
      status: response.status === 200 ? "available" : "degraded",
      details: response.data
    });
  } catch (error: any) {
    console.error("External agent health check failed:", error);
    res.json({ 
      status: "unavailable",
      message: error.message || "Connection error"
    });
  }
});

export default externalAgentRouter;