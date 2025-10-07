import { Router, Request, Response } from "express";
import { z } from "zod";

const router = Router();

const demoRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  message: z.string().optional()
});

router.post('/api/book-demo', async (req: Request, res: Response) => {
  try {
    const validatedData = demoRequestSchema.parse(req.body);
    
    console.log('=== Demo Request Submission ===');
    console.log('Name:', validatedData.name);
    console.log('Email:', validatedData.email);
    console.log('Company:', validatedData.company || 'Not provided');
    console.log('Message:', validatedData.message || 'Not provided');
    console.log('Timestamp:', new Date().toISOString());
    console.log('================================');
    
    res.status(200).json({ 
      success: true, 
      message: 'Demo request submitted successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        errors: error.errors 
      });
    }
    
    console.error('Error processing demo request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process demo request'
    });
  }
});

export default router;
