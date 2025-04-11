import { Router } from 'express';
import axios from 'axios';

const router = Router();

/**
 * D-ID Integration API
 */

// Get D-ID integration credentials
router.get('/api/did/credentials', async (req, res) => {
  try {
    const didAgentId = process.env.DID_AGENT_ID;
    const didClientKey = process.env.DID_CLIENT_KEY;
    
    if (!didAgentId || !didClientKey) {
      return res.status(500).json({ error: 'Missing D-ID credentials' });
    }
    
    // Return the credentials needed for direct integration
    res.json({
      agentId: didAgentId,
      clientKey: didClientKey
    });
  } catch (error: any) {
    console.error('Error getting D-ID credentials:', String(error));
    res.status(500).json({ error: 'Failed to get D-ID credentials' });
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