import express from "express";
import fetch from "node-fetch";

const router = express.Router();

const PYTHON_NLP_URL = process.env.PYTHON_NLP_URL || 'http://localhost:5001';

/* EXTRACT NOUNS FROM TEXT */
router.post("/extract-nouns", async (req, res) => {
  try {
    const { text, language = 'en' } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    // Call Python spaCy service
    const response = await fetch(`${PYTHON_NLP_URL}/extract-nouns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, language }),
    });

    if (!response.ok) {
      throw new Error(`Python service error: ${response.status}`);
    }

    const result = await response.json();
    res.json(result);

  } catch (error) {
    console.error("Error extracting nouns:", error);
    res.status(500).json({ 
      error: "Failed to extract nouns",
      details: error.message 
    });
  }
});

/* HEALTH CHECK FOR NLP SERVICE */
router.get("/health", async (req, res) => {
  try {
    const response = await fetch(`${PYTHON_NLP_URL}/health`);
    
    if (!response.ok) {
      throw new Error(`Python service unavailable: ${response.status}`);
    }

    const result = await response.json();
    res.json({ 
      status: "healthy", 
      python_service: result 
    });

  } catch (error) {
    console.error("NLP service health check failed:", error);
    res.status(503).json({ 
      status: "unhealthy", 
      error: error.message 
    });
  }
});

export default router;