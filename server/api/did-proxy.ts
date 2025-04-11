import { Router } from 'express';
import axios from 'axios';

const router = Router();

/**
 * D-ID Integration API
 * 
 * This router handles the proxy between our frontend and D-ID's API
 * to avoid CORS issues when accessing D-ID services directly.
 */

// Helper: Create the base headers for D-ID API requests
const getDIDHeaders = () => {
  const didApiKey = process.env.DID_API_KEY;
  
  if (!didApiKey) {
    throw new Error('Missing DID_API_KEY');
  }
  
  return {
    'Authorization': `Basic ${didApiKey}`,
    'Content-Type': 'application/json'
  };
};

// Get public D-ID integration script configuration
router.get('/api/did/config', async (req, res) => {
  try {
    // Use new credentials provided by the user
    const didAgentId = "agt_mNHiVcSw";
    const didClientKey = "YXV0aDB8NjdmOTNiZmI4MDFlMDM5NzI0YjdmYTlkOmlIYUFHMWlQb005NFF0T0Z4Z0RvRw==";
    
    // Return minimal configuration for script loading
    res.json({
      scriptUrl: 'https://agent.d-id.com/v1/index.js',
      agentConfig: {
        agentId: didAgentId,
        clientKey: didClientKey,
        monitor: true,
        mode: 'fabio'
      }
    });
  } catch (error: any) {
    console.error('Error getting D-ID config:', String(error));
    res.status(500).json({ error: 'Failed to get D-ID config' });
  }
});

// Get D-ID share URL for external window
router.get('/api/did/share-url', async (req, res) => {
  try {
    // Use new credentials provided by the user
    const didAgentId = "agt_mNHiVcSw";
    const didClientKey = "YXV0aDB8NjdmOTNiZmI4MDFlMDM5NzI0YjdmYTlkOmlIYUFHMWlQb005NFF0T0Z4Z0RvRw==";
    
    // Construct the D-ID share URL
    const shareUrl = `https://studio.d-id.com/agents/share?id=${didAgentId}&utm_source=copy&key=${didClientKey}`;
    
    res.json({ shareUrl });
  } catch (error: any) {
    console.error('Error getting D-ID share URL:', String(error));
    res.status(500).json({ error: 'Failed to get D-ID share URL' });
  }
});

// Proxy for D-ID agent API - Get agent details
router.get('/api/did/agent/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const headers = getDIDHeaders();
    
    const response = await axios.get(`https://api.d-id.com/agents/${agentId}`, { 
      headers 
    });
    
    res.json(response.data);
  } catch (error: any) {
    console.error('Error getting agent info:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to get agent info', 
      details: error.response?.data || error.message 
    });
  }
});

// Proxy for D-ID initialize session
router.post('/api/did/initialize', async (req, res) => {
  try {
    // Use new credentials provided by the user
    const didAgentId = "agt_mNHiVcSw";
    
    const headers = getDIDHeaders();
    
    // Initialize a new stream with D-ID API
    const response = await axios.post(
      'https://api.d-id.com/talks/streams', 
      {
        source_url: "presenter_id:Noelle",
        agent_id: didAgentId,
        driver_id: "mzmtwlxz7b"
      },
      { headers }
    );
    
    res.json({
      streamId: response.data.id,
      sessionId: response.data.session_id
    });
  } catch (error: any) {
    console.error('Error initializing D-ID session:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to initialize D-ID session', 
      details: error.response?.data || error.message 
    });
  }
});

// Catch-all proxy for other D-ID API requests
router.post('/api/did/proxy/:path', async (req, res) => {
  try {
    const { path } = req.params;
    const headers = getDIDHeaders();
    
    console.log(`Proxying D-ID API request to ${path}`);
    
    const response = await axios.post(
      `https://api.d-id.com/${path}`,
      req.body,
      { headers }
    );
    
    res.json(response.data);
  } catch (error: any) {
    console.error(`Error in D-ID proxy (${req.params.path}):`, error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: `Failed to proxy D-ID request to ${req.params.path}`, 
      details: error.response?.data || error.message 
    });
  }
});

export default router;