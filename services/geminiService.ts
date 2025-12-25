
import { GoogleGenAI, Type } from "@google/genai";

// Strictly follow the SDK guideline for initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const polishTranscript = async (title: string, rawTranscript: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Title: ${title}\n\nRaw Transcript: ${rawTranscript}`,
      config: {
        systemInstruction: `You are an expert editor and knowledge manager. 
        Your task is to take raw YouTube transcripts and transform them into high-quality Markdown documents.
        1. Correct grammatical errors and filler words.
        2. Organize content with logical headings (##, ###).
        3. Extract key takeaways as bullet points.
        4. Add a concise executive summary at the beginning.
        5. Maintain important technical terms and specific details.
        Output ONLY the polished Markdown.`,
      },
    });

    return response.text || "Failed to generate polished content.";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

export const fetchMockPlaylist = async (url: string): Promise<any> => {
  // Simulating a playlist fetch since real YouTube API requires backend/keys
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Simulate a YouTube playlist structure for this URL: ${url}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          videos: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                duration: { type: Type.STRING },
                author: { type: Type.STRING },
                thumbnail: { type: Type.STRING }
              }
            }
          }
        },
        required: ["id", "title", "videos"]
      }
    }
  });

  return JSON.parse(response.text);
};
