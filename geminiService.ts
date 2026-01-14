
import { GoogleGenAI, Type } from "@google/genai";
import { PRODUCTS } from "./constants";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Streaming chat for the persistent Designer assistant
 */
export const startDesignerChat = (history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  const ai = getAI();
  const productContext = PRODUCTS.map(p => `${p.name} ($${p.price}) in ${p.category}`).join(', ');
  
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are the FURNEXA Luxury Design Assistant. You are elegant, helpful, and knowledgeable. 
      You help users find furniture from our catalog and give interior design advice.
      Catalog: ${productContext}. 
      Keep answers concise and luxurious. Always mention specific product names if relevant.`,
      temperature: 0.7,
    },
    history: history
  });
};

export const analyzeRoomAndSuggest = async (imageBase64?: string, userText?: string) => {
  const ai = getAI();
  const productContext = JSON.stringify(PRODUCTS.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    description: p.description
  })));

  const systemInstruction = `
    You are an expert luxury interior designer for FURNEXA. 
    Analyze the provided image and/or text to suggest exactly 2 products from our catalog.
    CATALOG: ${productContext}
    Response MUST be JSON format with:
    {
      "recommendations": [
        { "productId": "id", "reason": "Why this fits", "stylingTip": "How to style it" }
      ],
      "overallFeedback": "Professional assessment of the space/request"
    }
  `;

  const contents: any[] = [];
  if (imageBase64) {
    contents.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageBase64.split(',')[1] || imageBase64
      }
    });
  }
  
  contents.push({ text: userText || "Suggest the best furniture from the catalog for this room." });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: contents },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  productId: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  stylingTip: { type: Type.STRING }
                },
                required: ["productId", "reason", "stylingTip"]
              }
            },
            overallFeedback: { type: Type.STRING }
          },
          required: ["recommendations", "overallFeedback"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("AI Analysis failed", error);
    throw error;
  }
};

export const generateVisualizerImage = async (prompt: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `High-end luxury interior design showroom featuring: ${prompt}. Cinematic lighting, 8k resolution, photorealistic.` }]
      },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    const imagePart = response.candidates[0].content.parts.find(p => p.inlineData);
    return imagePart?.inlineData ? `data:image/png;base64,${imagePart.inlineData.data}` : null;
  } catch (error) {
    console.error("Image generation failed", error);
    throw error;
  }
};
