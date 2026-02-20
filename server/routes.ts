import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.translations.list.path, async (req, res) => {
    try {
      const allTranslations = await storage.getTranslations();
      res.json(allTranslations);
    } catch (error) {
      console.error("Error fetching translations:", error);
      res.status(500).json({ message: "Failed to fetch translations" });
    }
  });

  app.post(api.translations.translate.path, async (req, res) => {
    try {
      const input = api.translations.translate.input.parse(req.body);
      
      const response = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          { role: "system", content: "You are a professional translator. Translate the following text from Assamese to English. Provide only the translation, no extra text." },
          { role: "user", content: input.text }
        ],
      });
      
      const translatedText = response.choices[0]?.message?.content?.trim() || "";
      
      if (!translatedText) {
        throw new Error("Empty translation returned from AI");
      }

      await storage.createTranslation({
        sourceText: input.text,
        translatedText,
      });

      res.status(200).json({ translatedText });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error("Translation error:", err);
      res.status(500).json({ message: "An error occurred during translation" });
    }
  });

  return httpServer;
}
