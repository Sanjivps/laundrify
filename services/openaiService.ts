import OpenAI from "openai";
import { Platform } from "react-native";
import * as FileSystem from 'expo-file-system';

// Initialize the OpenAI client with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
      try {
        // For native platforms, convert file URI to base64
        console.log("Processing image URI:", imageUri.substring(0, 50) + "...");
        
        const base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        if (!base64 || base64.length === 0) {
          console.error("Failed to read image file: Empty base64 data");
          return "I couldn't process the image file. The image data appears to be empty or corrupted.";
        }
        
        base64Image = `data:image/jpeg;base64,${base64}`;
        console.log("Successfully encoded image to base64. Length:", base64Image.length);
      } catch (fileError) {
        console.error("Error reading image file:", fileError);
        return "I couldn't read the image file. Please try uploading a different image.";
      }
    }

    console.log("Sending image to OpenAI API...");
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

    console.log("Received response from OpenAI API");
    // Extract the assistant's reply
    const reply = response.choices[0]?.message?.content?.trim() || 
      "I couldn't analyze the image. Please ensure it's a clear picture of clothing and try again.";
    
    return reply;
  } catch (error: any) {
    console.error('Error analyzing clothing image:', error);
    // Provide more detailed error messages based on the type of error
    if (error.status === 400) {
      return "There seems to be an issue with the image format. Please try a different image.";
    } else if (error.status === 401) {
      return "Authentication error. Please notify the app developers.";
    } else if (error.name === "AbortError" || error.code === "ECONNABORTED") {
      return "The request timed out. Please check your internet connection and try again.";
    }
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