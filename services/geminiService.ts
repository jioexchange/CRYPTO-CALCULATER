import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiClient;
};

export const getCryptoInsight = async (coinName: string, currentPrice: number, currency: string) => {
  const client = getClient();
  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Provide a very short, professional financial summary (max 2 sentences) for ${coinName} at current price ${currentPrice} ${currency}. Is it bullish or bearish today?`,
      config: {
        tools: [{ googleSearch: {} }], // Use search grounding for live news check
      }
    });
    
    // Check for grounding chunks to display sources if needed, but for now we just want the text
    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(c => c.web?.uri).filter(Boolean) || [];
    
    return { text, sources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "AI insights currently unavailable.", sources: [] };
  }
};

export const askGeneralQuestion = async (question: string) => {
  const client = getClient();
  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a helpful crypto expert assistant. Answer this question concisely: ${question}`,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I couldn't connect to the AI service right now.";
  }
};
