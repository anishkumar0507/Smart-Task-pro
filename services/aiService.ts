
import { GoogleGenAI } from "@google/genai";

export const aiService = {
  async optimizeTaskDescription(title: string, description: string): Promise<string> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Given the task title "${title}" and description "${description}", provide a more professional, clear, and actionable version of the description. Return ONLY the refined description text.`,
      });
      return response.text || description;
    } catch (error) {
      console.error("AI Error:", error);
      return description;
    }
  },

  async suggestSubtasks(title: string): Promise<string[]> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Break down the task "${title}" into 3-5 simple, actionable steps. Return ONLY a JSON array of strings.`,
        config: {
          responseMimeType: "application/json",
        }
      });
      return JSON.parse(response.text || '[]');
    } catch (error) {
      console.error("AI Error:", error);
      return [];
    }
  }
};
