import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace with your actual API Key from Google AI Studio
const genAI = new GoogleGenerativeAI("YOUR_GEMINI_API_KEY");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const getChatResponse = async (userPrompt: string) => {
  try {
    const systemInstruction = `
      You are the ConnectUs AI Assistant. 
      ConnectUs is a marketplace where users hire "Runners" to deliver or help with tasks.
      If the user wants to see runners, include the text "[SHOW_RUNNERS]" in your response.
      Keep answers helpful, local to South Africa, and concise.
    `;

    const result = await model.generateContent(systemInstruction + userPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having a bit of trouble thinking. Could you try that again?";
  }
};