
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export interface GeminiResponse {
  text: string;
  sources: any[];
}

export const runQuery = async (
  prompt: string,
  imageFile: File | null,
  enableWebSearch: boolean
): Promise<GeminiResponse> => {
  try {
    const contents: any[] = [];
    if (imageFile) {
      const imagePart = await fileToGenerativePart(imageFile);
      contents.push(imagePart);
    }
    contents.push({ text: prompt });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: contents },
      config: {
        tools: enableWebSearch ? [{ googleSearch: {} }] : [],
      },
    });
    
    const text = response.text;
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks?.map((chunk: any) => chunk.web) || [];
    
    return { text, sources };
  } catch (error) {
    console.error("Error running query with Gemini:", error);
    if (error instanceof Error) {
        return { text: `An error occurred: ${error.message}`, sources: [] };
    }
    return { text: "An unknown error occurred.", sources: [] };
  }
};
