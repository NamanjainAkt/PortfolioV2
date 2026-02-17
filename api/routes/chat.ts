import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { context } from '../lib/context.js';

const router = express.Router();

// Initialize Gemini API
// We'll initialize the client lazily in the handler to allow for missing env var during dev setup

router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set');
      return res.status(503).json({ 
        error: 'Chat service is currently unavailable (API Key missing)',
        reply: "I'm sorry, I can't connect to my brain right now. Please tell Naman to set his API key!" 
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // Construct the chat history for Gemini
    // We prepend the system context
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `System Context: ${context}` }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I am Mars, Naman's AI assistant. I will answer questions based on the provided context." }],
        },
        ...(history || []).map((msg: any) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        })),
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    const errorMessage = error?.message || 'Unknown error occurred';
    res.status(500).json({
      error: `Failed to generate response: ${errorMessage}`,
      reply: "I apologize, but I'm experiencing technical difficulties right now. Please try again in a moment."
    });
  }
});

export default router;
