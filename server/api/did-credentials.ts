import { Router } from 'express';

const router = Router();

/**
 * Endpoint that returns the D-ID credentials from environment variables
 * This allows us to avoid hardcoding credentials in the HTML
 */
router.get('/did-credentials', (req, res) => {
  // Return environment variables
  res.json({
    didAgentId: process.env.DID_AGENT_ID,
    didClientKey: process.env.DID_CLIENT_KEY
  });
});

export default router;