import { Router } from 'express';

const didAgentRouter = Router();

// Endpoint to securely fetch D-ID agent credentials
didAgentRouter.get('/credentials', (req, res) => {
  try {
    // Retrieve credentials from environment variables
    const clientKey = process.env.DID_CLIENT_KEY;
    const agentId = process.env.DID_AGENT_ID;
    
    // Validate that credentials are available
    if (!clientKey || !agentId) {
      console.error('Missing D-ID credentials in environment variables');
      return res.status(500).json({ 
        error: 'Missing D-ID agent credentials. Please configure DID_CLIENT_KEY and DID_AGENT_ID in environment variables.' 
      });
    }
    
    // Return the credentials to the client
    res.json({
      clientKey,
      agentId
    });
  } catch (error) {
    console.error('Error fetching D-ID credentials:', error);
    res.status(500).json({ error: 'Failed to fetch D-ID credentials' });
  }
});

export default didAgentRouter;