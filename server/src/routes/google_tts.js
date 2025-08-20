import express from 'express';
import dotenv from 'dotenv';
import textToSpeech from '@google-cloud/text-to-speech';

dotenv.config();
const router = express.Router();
const googleCredentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

const googleTTSClient = new textToSpeech.TextToSpeechClient({
  credentials: googleCredentials,
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

router.post("/text-to-speech", async (req, res) => {
  try {
    const { text, langConfig, delayMs = 500 } = req.body;

    if (!text || !langConfig?.languageCode) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // Helpers for language-aware segmentation and safe SSML
    const containsCJK = (s) => /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uAC00-\uD7AF]/u.test(s);
    const containsThai = (s) => /[\u0E00-\u0E7F]/u.test(s);
    const hasWhitespace = (s) => /\s/.test(s);
    const escapeSsml = (s) => s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

    // Segment text:
    // - If it contains CJK characters, split by spaces first, then by characters/syllables
    // - If it has whitespace and no CJK, split by whitespace (covers most languages)
    // - If it contains Thai and no whitespace, split by Unicode code points (per character)
    // - Otherwise, fallback to splitting by code points
    let segments;
    if (containsCJK(text)) {
      // For CJK text, first split by spaces, then split each word by characters/syllables
      const words = text.trim().split(/\s+/).filter(Boolean);
      segments = [];
      words.forEach(word => {
        const wordSegments = word.match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uAC00-\uD7AF]|[^\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uAC00-\uD7AF]/g) || [];
        segments.push(...wordSegments);
      });
    } else if (hasWhitespace(text)) {
      segments = text.trim().split(/\s+/).filter(Boolean);
    } else if (containsThai(text)) {
      segments = Array.from(text);
    } else {
      segments = Array.from(text);
    }
console.log(segments)
    // Build SSML with a break after each segment
    const ssmlSentence = segments
      .map(token => `${escapeSsml(token)}<break time="${delayMs}ms"/>`)
      .join(' ');
    console.log(ssmlSentence);
    const request = {
      input: { ssml: `<speak>${ssmlSentence}</speak>` },
      voice: {
        languageCode: langConfig.languageCode,
        name: langConfig.voiceName,
      },
      audioConfig: {
        audioEncoding: 'LINEAR16', // can also use LINEAR16
        speakingRate: 1.0,
        pitch: 0.0,
        volumeGainDb: 0.0,
      },
    };

    const [response] = await googleTTSClient.synthesizeSpeech(request);

    res.set('Content-Type', 'audio/mpeg');
    res.send(response.audioContent);

  } catch (error) {
    console.error("Google TTS error", error);
    res.status(500).json({ error: "Text-to-speech conversion failed" });
  }
});

export default router;
