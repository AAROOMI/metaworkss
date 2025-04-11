import { Router } from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize OpenAI with API key from environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Create router
const mascotRouter = Router();

// Define valid personality types
type PersonalityType = 'friendly' | 'serious' | 'quirky';

// Define personality prompts
const personalityPrompts: Record<PersonalityType, string> = {
  friendly: `You are a friendly and approachable security mascot named "Security Buddy" for a cybersecurity compliance platform. 
  Your tone is supportive, encouraging, and helpful. You explain security concepts in simple terms with relatable examples. 
  You always maintain a positive outlook, even when discussing security threats or compliance gaps. 
  Keep your responses concise (1-3 sentences) and focus on actionable advice.`,
  
  serious: `You are a professional and authoritative security mascot named "Security Guardian" for a cybersecurity compliance platform. 
  Your tone is formal, precise, and fact-based. You use industry-standard terminology and refer to compliance frameworks precisely. 
  You emphasize the importance of security best practices and the potential risks of non-compliance. 
  Keep your responses concise (1-3 sentences) and highlight the most critical security considerations.`,
  
  quirky: `You are a quirky and memorable security mascot named "Security Sidekick" for a cybersecurity compliance platform. 
  Your tone is conversational with occasional humor and pop culture references that relate to cybersecurity. 
  You make security concepts interesting and memorable through creative analogies. 
  While you keep things light, you never downplay the importance of security. 
  Keep your responses concise (1-3 sentences) with a unique twist that helps the advice stick.`
};

// Endpoint for asking the mascot a question
mascotRouter.post('/api/mascot/ask', async (req, res) => {
  try {
    // Get the question and personality from the request
    const { question, personality = 'friendly' } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
    
    // Get the appropriate personality prompt
    const systemPrompt = personalityPrompts[personality] || personalityPrompts.friendly;
    
    // Add context about cybersecurity compliance
    const complianceContext = `
      Consider the following cybersecurity compliance frameworks if relevant to the question:
      - NCA ECC (National Cybersecurity Authority Essential Cybersecurity Controls)
      - SAMA (Saudi Arabian Monetary Authority Cyber Security Framework)
      - PDPL (Personal Data Protection Law)
      - ISO 27001 (Information Security Management)
      - ITGC (IT General Controls)
      
      When providing guidance, focus on practical tips for compliance and security improvements.
    `;
    
    // Get response from OpenAI
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt + complianceContext },
        { role: "user", content: question }
      ],
      max_tokens: 150, // Keep responses concise
      temperature: personality === 'quirky' ? 0.8 : 0.5, // Higher temperature for quirky personality
    });
    
    // Extract and return the answer
    const answer = response.choices[0].message.content;
    res.json({ answer });
    
  } catch (error) {
    console.error('Error processing mascot question:', error);
    res.status(500).json({ 
      error: 'Failed to process your question',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Endpoint for getting contextual tips based on the current page/section
mascotRouter.post('/api/mascot/contextual-tips', async (req, res) => {
  try {
    const { context, personality = 'friendly' } = req.body;
    
    if (!context) {
      return res.status(400).json({ error: 'Context is required' });
    }
    
    // Get the appropriate personality prompt
    const systemPrompt = personalityPrompts[personality] || personalityPrompts.friendly;
    
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: `${systemPrompt} 
          You are providing a helpful tip related to the user's current context in the cybersecurity compliance platform.
          Focus on providing ONE concise, helpful tip that is directly relevant to the context.` 
        },
        { 
          role: "user", 
          content: `I'm currently viewing the "${context}" section of the cybersecurity compliance platform. 
          Provide a relevant security tip or guidance for this context.` 
        }
      ],
      max_tokens: 100,
      temperature: 0.5,
    });
    
    const tip = response.choices[0].message.content;
    res.json({ tip });
    
  } catch (error) {
    console.error('Error generating contextual tip:', error);
    res.status(500).json({ 
      error: 'Failed to generate contextual tip',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default mascotRouter;