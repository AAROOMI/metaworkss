import { Router } from "express";

const router = Router();

/**
 * Endpoint to get D-ID agent credentials from environment variables
 * This provides better security than hardcoding credentials in the frontend
 */
router.get("/credentials", (req, res) => {
  try {
    // Get credentials from environment variables
    const agentId = process.env.DID_AGENT_ID;
    const clientKey = process.env.DID_CLIENT_KEY;
    
    // Validate credentials exist
    if (!agentId || !clientKey) {
      console.error("D-ID credentials missing from environment variables");
      return res.status(500).json({ 
        error: "D-ID credentials not configured", 
        message: "The application is not properly configured with D-ID credentials."
      });
    }
    
    // Return masked credentials (for security logging)
    console.log(`Sending D-ID credentials - Agent ID: ${maskString(agentId)}, Client Key: ${maskString(clientKey)}`);
    
    // Return credentials
    return res.status(200).json({
      agentId,
      clientKey
    });
  } catch (error) {
    console.error("Error retrieving D-ID credentials:", error);
    return res.status(500).json({ 
      error: "Internal server error", 
      message: "Failed to retrieve D-ID agent credentials."
    });
  }
});

/**
 * Helper function to mask sensitive strings for logging
 */
function maskString(str: string): string {
  if (!str) return '';
  if (str.length <= 8) {
    return '****';
  }
  return str.substring(0, 4) + '...' + str.substring(str.length - 4);
}

export default router;