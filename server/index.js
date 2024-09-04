const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");

const openai = new OpenAI({
  apiKey: "API...",
});

const app = express();
app.use(express.json()); // utility to process JSON in requests
app.use(cors()); // utility to allow clients to make requests from other hosts or ips


// Chat completion endpoint: https://platform.openai.com/docs/guides/chat-completions/chat-completions
app.post('/chat-completion', async (req, res) => {
  try {
    const { messages } = req.body;
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Image generation endpoint: https://platform.openai.com/docs/guides/images/image-generation
app.post('/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    const image_url = response.data[0].url;

    res.json(image_url);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const speechFile = path.resolve("./speech.mp3");
// Text-to-speech endpoint (custom implementation): 
app.post('/text-to-speech', async (req, res) => {
  // Placeholder for text-to-speech implementation
  const { prompt } = req.body;

  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: prompt,
  });
  console.log(speechFile);
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);

  res.status(200).json({ status: 'Audio created' });
});



app.listen(5050, () => {
  console.log(`Server is running on http://localhost:${5050}`);
});
