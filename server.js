// server.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;

app.post("/api/chat", async (req, res) => {
    try {
      const userPrompt = req.body.prompt;
  
      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              { text: userPrompt }
            ]
          }
        ]
      };
  
      const response = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      console.log("===== Gemini API Raw Response =====");
      console.dir(data, { depth: null });
  
      if (data.error) {
        console.error("❌ Gemini API Error:", data.error);
      }
  
      res.json(data);
    } catch (err) {
      console.error("🔥 Server Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "app.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
