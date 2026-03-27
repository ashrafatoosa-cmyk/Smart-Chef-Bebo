'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) 
  : null;

export async function analyzeFridge(base64Image: string, retryCount = 0): Promise<any> {
  try {
    if (!genAI) throw new Error("GEMINI_API_KEY is not set.");
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // 1. Prepare the image for Gemini
    const imageData = {
      inlineData: {
        data: base64Image.split(',')[1], // Remove the "data:image/png;base64," part
        mimeType: "image/jpeg",
      },
    };

    const prompt = "List every food item, fruit, or vegetable you see in this fridge. Return ONLY a comma-separated list of names.";

    // 2. Ask Gemini to see the food
    const result = await model.generateContent([prompt, imageData]);
    const text = result.response.text();
    const items = text.split(',').map(item => item.trim());

    // 3. Save to Supabase 'ingredients' table
    if (supabase) {
      for (const item of items) {
        const { error } = await supabase.from('ingredients').insert({ name: item });
        if (error) console.error("Supabase Insert Error:", error);
      }
    } else {
      console.warn("Supabase is not initialized. Skipping ingredients sync.");
    }

    return { success: true, items };
  } catch (error: any) {
    if (error.message?.includes('429') && retryCount < 1) {
      console.warn("429 Quota Exceeded. Retrying in 50 seconds...");
      await new Promise(resolve => setTimeout(resolve, 50000));
      return analyzeFridge(base64Image, retryCount + 1);
    }
    
    console.error("Chef Error Details:", {
      message: error.message,
      stack: error.stack,
      raw: error
    });
    return { success: false, error: error.message || "Failed to scan fridge" };
  }
}

export async function getIngredients() {
  try {
    if (!supabase) return { success: false, error: "Database not connected" };
    
    const { data, error } = await supabase
      .from('ingredients')
      .select('name')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Extract unique names
    const names = Array.from(new Set(data.map((item: any) => item.name)));
    return { success: true, items: names };
  } catch (error: any) {
    console.error("Get Ingredients Error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteIngredient(name: string) {
  try {
    if (!supabase) return { success: false, error: "Database not connected" };
    
    const { error } = await supabase
      .from('ingredients')
      .delete()
      .eq('name', name);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Delete Ingredient Error:", error);
    return { success: false, error: error.message };
  }
}
