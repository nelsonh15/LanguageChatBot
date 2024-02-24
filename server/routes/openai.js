// Represents all the routes that points to OpenAI
import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();
const router = express.Router();

/* OPEN AI CONFIGURATION */
export const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY
});

router.post("/text", async (req, res) => {
  try {
    const { text, language } = req.body;
    const instruction = `You are a virtual assistant fluent in ${language}. 
                            A user has written to you in ${language}, and your task 
                            is to provide a helpful and relevant response without 
                            continuing the user's message. User's message: "${text}" 
                            Your response:`;
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: instruction,
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
      stop: ["\n"]
    });
    res.status(200).json({ text: response.choices[0].text });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: error.message })
  }
})

router.post("/chat-completion", async (req, res) => {
  try {
    const { messages, language } = req.body;
    const prompt = `Pretend that you're a sociable person fluent in ${language}. 
                        A user has written to you in ${language}, and your task is 
                        to provide a response only in ${language}. If the user responds 
                        in any other language other than ${language}, you must still 
                        respond in ${language}`
    messages.unshift({ content: prompt, role: "system" })
    const response = await openai.chat.completions.create({
      messages: messages,
      model: "gpt-3.5-turbo",
      max_tokens: 256,
    });
    res.status(200).json({ text: response.choices[0].message.content })
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: error.message })
  }
})

router.post("/translated", async (req, res) => {
  try {
    const { text, language, translated } = req.body;
    const prompt = `Translate the following text from ${language} to ${translated}. If the text is already in ${translated}, 
                        do not translate it again. Text: "${text}" Translation:`;
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: prompt,
      temperature: 0.3,
      max_tokens: 256,
      stop: ["\n"]
    });
    res.status(200).json({ text: response.choices[0].text });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: error.message })
  }
})

router.post("/text-to-speech", async (req, res) => {
  try {
    const { text } = req.body;
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    res.set('Content-Type', 'audio/mpeg');
    res.send(buffer);
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;