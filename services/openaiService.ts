import OpenAI from "openai";
import { Platform } from "react-native";
import * as FileSystem from 'expo-file-system';

// Initialize the OpenAI client with your API key
const openai = new OpenAI({
  apiKey: "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",
  dangerouslyAllowBrowser: true // Allow usage in browser environment (needed for React Native)
});

// System prompt that ensures responses are only about laundry
const SYSTEM_PROMPT = 
  "You are a laundry expert. Only provide answers related to washing clothes, dryer settings, fabric care, and other laundry-related topics. " +
  "If a question is off-topic, ask the user to ask about laundry. " +
  "Keep answers concise and helpful. " +
  "Provide specific settings for different types of fabrics and stains when asked.";

// System prompt for image analysis
const IMAGE_ANALYSIS_PROMPT = 
  "You are a laundry expert analyzing an image of clothing. " +
  "First, identify the type of garment and the likely fabric. " +
  "Then, provide detailed but concise laundry instructions for this specific item, including: " +
  "1. Recommended water temperature " +
  "2. Washer cycle type " +
  "3. Detergent recommendations " +
  "4. Drying method (air dry or machine dry) " +
  "5. Special care instructions " +
  "Format your response in easy-to-follow numbered steps. " +
  "Focus only on laundry care instructions for the garment in the image.";

/**
 * Sends a text message to OpenAI's API and returns the response
 * @param message The user's message
 * @returns A Promise that resolves to the AI's response
 */
export async function askLaundryBot(userQuery: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: userQuery
        }
      ],
      max_tokens: 200,
    });

    // Extract the assistant's reply
    const reply = response.choices[0]?.message?.content?.trim() || "I couldn't generate a response. Please try again.";
    return reply;
  } catch (error) {
    console.error('Error calling the OpenAI API:', error);
    return "I'm having trouble getting an answer right now. Please check your internet connection and try again.";
  }
}

/**
 * Analyzes an image of clothing and provides laundry instructions
 * @param imageUri URI of the clothing image
 * @returns A Promise that resolves to the analysis response
 */
export async function analyzeClothingImage(imageUri: string): Promise<string> {
  try {
    let base64Image: string;
    
    if (Platform.OS === 'web') {
      // For web platform, keep as is
      base64Image = imageUri;
    } else {
      // For native platforms, convert file URI to base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      base64Image = `data:image/jpeg;base64,${base64}`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: IMAGE_ANALYSIS_PROMPT
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Please analyze this clothing item and provide laundry instructions." },
            { type: "image_url", image_url: { url: base64Image } }
          ]
        }
      ],
      max_tokens: 500,
    });

    // Extract the assistant's reply
    const reply = response.choices[0]?.message?.content?.trim() || 
      "I couldn't analyze the image. Please ensure it's a clear picture of clothing and try again.";
    
    return reply;
  } catch (error) {
    console.error('Error analyzing clothing image:', error);
    return "I'm having trouble analyzing this image. Please check your internet connection and try again, or make sure the image clearly shows a clothing item.";
  }
}

// Simple validation to check if the query is likely laundry-related
export function isLaundryQuery(query: string): boolean {
  const keywords = [
    'laundry', 'wash', 'dryer', 'clothes', 'fabric', 'detergent', 
    'stain', 'iron', 'fold', 'temperature', 'cycle', 'settings',
    'washer', 'machine', 'lint', 'wrinkle', 'dry', 'clean', 'dirty',
    'dry cleaning', 'bleach', 'softener', 'shrink', 'color', 'load'
  ];
  return keywords.some(keyword => query.toLowerCase().includes(keyword)) || query.length > 25;
}

/**
 * Sends a message to OpenAI's API and returns the response
 * @param message The user's message
 * @returns A Promise that resolves to the AI's response
 */
export const sendMessageToOpenAI = async (message: string): Promise<string> => {
  // Use the existing askLaundryBot function which already has the API key
  return askLaundryBot(message);
}; 