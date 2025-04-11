import { Router } from 'express';
import axios from 'axios';

const router = Router();

/**
 * Proxy for D-ID API requests
 * This keeps API keys secure on the backend
 */

// Initialize agent
router.post('/api/did/initialize-agent', async (req, res) => {
  try {
    // Get credentials from environment variables
    const didApiKey = process.env.DID_API_KEY;
    const didAgentId = process.env.DID_AGENT_ID;
    
    if (!didApiKey || !didAgentId) {
      return res.status(500).json({ error: 'Missing D-ID credentials' });
    }
    
    // Make request to D-ID API to initialize agent
    const response = await axios.post('https://api.d-id.com/talks/streams', 
      {
        source_url: "presenter_id:Noelle",
        agent_id: didAgentId,
        driver_id: "mzmtwlxz7b" 
      },
      {
        headers: {
          'Authorization': `Basic ${didApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Return stream ID and session data to frontend
    res.json({
      streamId: response.data.id,
      sessionId: response.data.session_id,
      agentId: didAgentId
    });
  } catch (error: any) {
    console.error('Error initializing D-ID agent:', 
      error?.response?.data || error?.message || String(error));
    res.status(500).json({ 
      error: 'Failed to initialize D-ID agent',
      details: error?.response?.data || error?.message || String(error)
    });
  }
});

// Get D-ID share URL
router.get('/api/did/share-url', async (req, res) => {
  try {
    const didAgentId = process.env.DID_AGENT_ID;
    const didClientKey = process.env.DID_CLIENT_KEY;
    
    if (!didAgentId || !didClientKey) {
      return res.status(500).json({ error: 'Missing D-ID credentials' });
    }
    
    // Construct the D-ID share URL
    const shareUrl = `https://studio.d-id.com/agents/share?id=${didAgentId}&utm_source=copy&key=${didClientKey}`;
    
    res.json({ shareUrl });
  } catch (error: any) {
    console.error('Error getting D-ID share URL:', String(error));
    res.status(500).json({ error: 'Failed to get D-ID share URL' });
  }
});

export default router;