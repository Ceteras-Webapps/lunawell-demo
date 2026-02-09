import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { ContentItem } from "../types";
import { Type } from "@google/genai";
import { Quiz } from "../types";

let client: GoogleGenAI | null = null;

const getClient = (customApiKey?: string): GoogleGenAI => {
  if (!client) {
    const apiGeminiKey = customApiKey || process.env.API_KEY;
    console.log("Get AI client with API Key :", apiGeminiKey.substring(0,6) + '****');
    // In a real app, we would handle missing API key more gracefully UI-side.
    // For this prompt, we assume it's injected.
    client = new GoogleGenAI({apiKey: apiGeminiKey });
  }
  return client;
};

export const createChatSession = (contentLibrary: ContentItem[], language: string, customApiKey?: string): Chat => {
  const ai = getClient(customApiKey);
  
  // Construct a context string based on available content
  const contentContext = contentLibrary.map(item => 
    `- Title: ${item.title} (${item.type})\n  Description: ${item.description}`
  ).join('\n');

  const systemInstruction = `
    You are a helpful, gentle, and knowledgeable wellness assistant for a women's wellbeing website called "lunawell".
    Your tone should be calm, supportive, and focused on beauty, simplicity, and well-being.
    
    The user is speaking in ${language}. Please reply in the same language.
    
    Here is the list of curated Videos and Classes available on the platform:
    ${contentContext}
    
    If the user asks questions about the content, refer to these items specifically.
    If the user asks general wellness advice, provide simple, scientifically backed, and kind advice.
    Keep answers concise but warm.
  `;

  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction,
    },
  });
};

export const sendMessage = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "I'm sorry, I couldn't understand that gently.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I am having a moment of silence (connection error). Please try again.";
  }
};


export interface QuizGenerationResult {
  quizzes: Quiz[];
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

const generateQuizFromContent = async (
  base64Data: string, 
  mimeType: string,
  customApiKey?: string
): Promise<QuizGenerationResult> => {
  // Use custom key if provided, otherwise fallback to environment variable
  const apiKey = customApiKey || process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key is missing. Please add it in settings or configure the environment.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Schema definition for strict JSON output
  const responseSchema = {
    type: Type.ARRAY,
    description: "A list of quizzes generated from the content.",
    items: {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: "A short descriptive title for the quiz.",
        },
        questions: {
          type: Type.ARRAY,
          description: "A list of 3 to 4 questions for this quiz.",
          items: {
            type: Type.OBJECT,
            properties: {
              questionText: {
                type: Type.STRING,
                description: "The question based on the content.",
              },
              options: {
                type: Type.ARRAY,
                description: "4 multiple choice options.",
                items: { type: Type.STRING },
              },
              correctAnswerIndex: {
                type: Type.INTEGER,
                description: "The zero-based index of the correct option.",
              },
            },
            required: ["questionText", "options", "correctAnswerIndex"],
          },
        },
      },
      required: ["title", "questions"],
    },
  };

  const isVideo = mimeType.startsWith('video/');
  const promptText = isVideo 
    ? "Analyze this video and generate 1 or 2 quizzes based on the information presented. Each quiz must have exactly 3 to 4 questions. Ensure the questions are accurate to the video content."
    : "Analyze this document and generate 1 or 2 quizzes based on the information presented. Each quiz must have exactly 3 to 4 questions. Ensure the questions are accurate to the document content.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text) as Quiz[];
      return {
        quizzes: data,
        usageMetadata: response.usageMetadata as any
      };
    }
    
    throw new Error("No response text generated");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export { generateQuizFromContent };