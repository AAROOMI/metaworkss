import { Router, Request, Response } from "express";
import { z } from "zod";

const router = Router();

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required")
});

router.post('/api/contact', async (req: Request, res: Response) => {
  try {
    const validatedData = contactSchema.parse(req.body);
    
    console.log('=== Contact Form Submission ===');
    console.log('Name:', validatedData.name);
    console.log('Email:', validatedData.email);
    console.log('Message:', validatedData.message);
    console.log('Timestamp:', new Date().toISOString());
    console.log('================================');
    
    res.status(200).json({ 
      success: true, 
      message: 'Contact form submitted successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        errors: error.errors 
      });
    }
    
    console.error('Error processing contact form:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process contact form'
    });
  }
});

export default router;
