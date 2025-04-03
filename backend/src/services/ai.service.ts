import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import dotenv from 'dotenv';
import logger from '../utils/logger';
import { healthContextPrompt } from '../utils/prompts';

dotenv.config();

// Initialize Gemini client
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Log Gemini API key info
const apiKey = process.env.GEMINI_API_KEY || '';
console.log('Gemini API Key configured:', apiKey ? `${apiKey.substring(0, 7)}...${apiKey.substring(apiKey.length - 4)}` : 'Not found');

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const generateChatResponse = async (
  messages: Message[],
  healthContext?: Record<string, any>
): Promise<string> => {
  try {
    // Include health context in the system message if available
    let systemMessages: Message[] = [];
    
    if (healthContext) {
      systemMessages.push({
        role: 'system',
        content: healthContextPrompt(healthContext),
      });
    } else {
      systemMessages.push({
        role: 'system',
        content: `You are HealthSparkAI, a friendly and knowledgeable health assistant. 
        Your purpose is to provide evidence-based health information and general wellness advice.
        Always clarify that you're not a doctor and encourage users to consult healthcare professionals for medical concerns.
        Focus on providing factual information about health topics, lifestyle recommendations, and general wellness tips.
        Avoid making definitive diagnoses or recommending specific treatments.
        Be empathetic, clear, and thoughtful in your responses, using simple language anyone can understand.`,
      });
    }

    // Combine system messages with user conversation
    const fullMessages = [...systemMessages, ...messages];
    
    console.log("About to generate Gemini response with messages:", JSON.stringify(fullMessages));
    
    try {
      return await generateGeminiResponse(fullMessages);
    } catch (chatError) {
      console.error("Chat-based generation failed, trying direct generation as fallback", chatError);
      
      // If the chat approach fails, try the direct generation as a fallback
      // Find the last user message
      const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
      if (lastUserMessage) {
        try {
          return await tryDirectGeneration(lastUserMessage.content);
        } catch (directError) {
          console.error("Direct generation also failed", directError);
          throw directError;
        }
      } else {
        throw new Error("No user message found to generate a response for");
      }
    }
  } catch (error) {
    console.error('Full AI error details:', error);
    if (error instanceof Error) {
      logger.error(`Error generating AI response: ${error.message}`);
      logger.error(`Error stack: ${error.stack}`);
      
      // Handle quota errors specifically
      if (error.message.includes('quota') || error.message.includes('429')) {
        logger.error('API quota exceeded. Please check your billing details.');
        return "I apologize, but my services are currently limited due to API usage restrictions. Please try again later or contact support for assistance.";
      }
      
      // Check for other common API key issues
      if (error.message.includes('API key')) {
        logger.error('This appears to be an API key issue. Please check your API key.');
      } else if (error.message.includes('rate limit')) {
        logger.error('You have hit rate limits. Please try again later.');
      }
    } else {
      logger.error('Unknown error generating AI response');
    }
    return "I'm sorry, I'm having difficulty processing your request at the moment. Please try again later.";
  }
};

async function generateGeminiResponse(messages: Message[]): Promise<string> {
  try {
    console.log('Sending request to Gemini Pro with messages:', JSON.stringify(messages));
    
    // Initialize Gemini model
    const model = gemini.getGenerativeModel({ 
      model: "gemini-1.5-pro",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    // Format messages for Gemini (combine system message with first user message if needed)
    const chatHistory = [];
    const systemMessage = messages[0].role === 'system' ? messages[0].content : '';
    
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      
      // Skip system message, it will be added as context to the first user message
      if (msg.role === 'system') continue;
      
      if (msg.role === 'user') {
        // If this is the first user message and we have a system message, prepend it
        const content = i === 1 && systemMessage 
          ? `Context for AI assistant: ${systemMessage}\n\nUser message: ${msg.content}`
          : msg.content;
        
        chatHistory.push({ role: 'user', parts: [{ text: content }] });
      } else if (msg.role === 'assistant') {
        chatHistory.push({ role: 'model', parts: [{ text: msg.content }] });
      }
    }

    // For simple user messages, try a direct generation if no chat history
    if (chatHistory.length === 1 && chatHistory[0].role === 'user') {
      console.log("Using direct generation instead of chat for single message");
      try {
        const result = await model.generateContent(chatHistory[0].parts[0].text);
        const response = result.response;
        return response.text() || 'I apologize, but I couldn\'t generate a response at this time.';
      } catch (error) {
        console.error("Direct generation failed, falling back to chat:", error);
        // Continue with chat approach below
      }
    }

    console.log("Final chat history being sent to Gemini:", JSON.stringify(chatHistory));

    // Create a chat session
    const chat = model.startChat({
      history: chatHistory.slice(0, -1), // All except the last message
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    // Get the last user message to send
    const lastMessage = chatHistory[chatHistory.length - 1];
    
    // Generate content
    console.log("Sending final message to Gemini:", lastMessage.parts[0].text);
    const result = await chat.sendMessage(lastMessage.parts[0].text);
    const response = result.response;
    
    const responseText = response.text();
    console.log("Received response from Gemini:", responseText);
    return responseText || 'I apologize, but I couldn\'t generate a response at this time.';
  } catch (error) {
    console.error("Detailed Gemini error:", error);
    if (error instanceof Error) {
      console.error(`Gemini error message: ${error.message}`);
      console.error(`Gemini error stack: ${error.stack}`);
    }
    throw error; // Rethrow to be handled by the parent function
  }
}

// A more medically-focused model for health analysis
export const analyzeHealthQuery = async (query: string): Promise<Record<string, any>> => {
  try {
    // The prompt for health analysis
    const systemPrompt = `You are a health analysis assistant. Extract key health information and intent from the user's query. 
    Return your analysis as structured JSON with the following format:
    {
      "intent": "diagnosis|information|advice|emergency|other",
      "healthConcern": "main health topic or condition mentioned",
      "symptoms": ["list of symptoms mentioned"],
      "relevantFactors": ["list of relevant contextual factors"],
      "urgencyLevel": "low|medium|high|emergency",
      "recommendedTopics": ["list of topics that might be helpful to discuss"]
    }`;
    
    // Using Gemini for analysis
    const model = gemini.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const result = await model.generateContent(`
      ${systemPrompt}
      
      User query: ${query}
      
      Return only valid JSON with no additional text.
    `);
    
    const response = result.response;
    const content = response.text().trim();
    
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                      content.match(/```\s*([\s\S]*?)\s*```/) || 
                      [null, content];
      
      const jsonContent = jsonMatch[1] || content;
      return JSON.parse(jsonContent);
    } catch (error) {
      console.error('Error parsing Gemini JSON response:', error);
      // Return a default analysis object
      return {
        intent: "information",
        healthConcern: query,
        symptoms: [],
        relevantFactors: [],
        urgencyLevel: "low",
        recommendedTopics: ["general health"]
      };
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error analyzing health query: ${error.message}`);
    } else {
      logger.error('Unknown error analyzing health query');
    }
    return { error: 'Failed to analyze health query' };
  }
};

async function tryDirectGeneration(query: string): Promise<string> {
  try {
    console.log("Attempting direct generation with Gemini");
    const model = gemini.getGenerativeModel({ 
      model: "gemini-1.5-pro" 
    });
    
    const prompt = `
    You are HealthSparkAI, a friendly and knowledgeable health assistant. Please respond to the following health question:
    
    USER QUESTION: ${query}
    
    Remember:
    - Provide evidence-based health information and general wellness advice
    - Clarify that you're not a doctor and encourage users to consult healthcare professionals for medical concerns
    - Focus on factual information about health topics, lifestyle recommendations, and general wellness tips
    - Avoid making definitive diagnoses or recommending specific treatments
    - Be empathetic, clear, and thoughtful in your response, using simple language
    `;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Direct generation failed completely:", error);
    throw error;
  }
} 