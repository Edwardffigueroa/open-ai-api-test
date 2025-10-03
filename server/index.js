// https://platform.openai.com/docs/quickstart

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(express.json()); // utility to process JSON in requests
app.use(cors()); // utility to allow clients to make requests from other hosts or ips

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "../public")));

// Chat completion endpoint: https://platform.openai.com/docs/guides/chat-completions/chat-completions
app.post("/chat-completion", async (req, res) => {
  try {
    const { input } = req.body;

    const response = await openai.responses.create({
      model: "gpt-4o",
      instructions:
        "Habla como un experto en moda",
      input,
    });

    // Extract only the text from the response
    const textContent = response.output_text || response.output[0]?.content[0]?.text || "";

    res.json({ text: textContent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Image generation endpoint: https://platform.openai.com/docs/guides/images/image-generation
app.post("/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Text-to-speech endpoint (custom implementation):
app.post("/text-to-speech", async (req, res) => {
  try {
    const { prompt } = req.body;

    // Generate unique ID for the audio file
    const audioId = `audio_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const audioFileName = `${audioId}.mp3`;
    const audioFilePath = path.resolve(`./public/audios/${audioFileName}`);

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: prompt,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(audioFilePath, buffer);

    res.status(200).json({
      status: "Audio created",
      audioUrl: `/audios/${audioFileName}`,
      audioId: audioId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => {
  console.log(`Server is running on http://localhost:${5000}`);
});
