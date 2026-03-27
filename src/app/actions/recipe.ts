'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) 
  : null;

export async function generateRecipe(ingredients: string[], retryCount = 0): Promise<any> {
  try {
    if (!genAI) throw new Error("GEMINI_API_KEY is not set.");
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `Based on these ingredients: ${ingredients.join(", ")}, suggest a creative and easy-to-follow recipe. 
    Format the response with a 'Title', 'Ingredients' list, and 'Instructions' steps. 
    Be concise and encouraging!`;

    const result = await model.generateContent(prompt);
    const recipe = result.response.text();

    return { success: true, recipe };
  } catch (error: any) {
    if (error.message?.includes('429') && retryCount < 1) {
      console.warn("429 Quota Exceeded. Retrying in 50 seconds...");
      await new Promise(resolve => setTimeout(resolve, 50000));
      return generateRecipe(ingredients, retryCount + 1);
    }
    console.error("Recipe Error Details:", {
      message: error.message,
      stack: error.stack,
      raw: error
    });
    return { success: false, error: error.message || "Failed to generate recipe" };
  }
}
