import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ONOE Chatbot Backend Running");
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});

import { askBot } from "./chat.js";

app.post("/chat", async (req, res) => {
  try {
    console.log("User:", req.body.message);

    const reply = await askBot(req.body.message);

    console.log("Bot:", reply);

    res.json({
      reply,
      risk: "Informational"
    });
  } catch (err) {
    console.error("OPENAI ERROR:", err.response?.data || err.message);

    res.status(500).json({
      reply: null,
      error: "AI failed"
    });
  }
});