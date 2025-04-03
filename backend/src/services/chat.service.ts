import { v4 as uuidv4 } from 'uuid';
import ChatSession from '../models/chat.model';
import HealthProfile from '../models/healthProfile.model';
import { generateChatResponse, analyzeHealthQuery } from './ai.service';
import logger from '../utils/logger';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const createChatSession = async (userId?: string): Promise<string> => {
  try {
    const sessionId = uuidv4();
    
    const newSession = new ChatSession({
      userId,
      sessionId,
      messages: [
        {
          role: 'assistant',
          content: 'Hi, I\'m HealthSpark AI. How can I assist you with your health questions today?'
        }
      ]
    });
    
    await newSession.save();
    return sessionId;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error creating chat session: ${error.message}`);
    } else {
      logger.error('Unknown error creating chat session');
    }
    throw error;
  }
};

export const getChatSession = async (sessionId: string) => {
  try {
    const session = await ChatSession.findOne({ sessionId });
    if (!session) {
      throw new Error('Chat session not found');
    }
    return session;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error fetching chat session: ${error.message}`);
    } else {
      logger.error('Unknown error fetching chat session');
    }
    throw error;
  }
};

export const getUserChatSessions = async (userId: string) => {
  try {
    const sessions = await ChatSession.find({ userId }).sort({ updatedAt: -1 });
    return sessions;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error fetching user chat sessions: ${error.message}`);
    } else {
      logger.error('Unknown error fetching user chat sessions');
    }
    throw error;
  }
};

export const sendMessage = async (sessionId: string, content: string, userId?: string) => {
  try {
    // Get the chat session
    let session = await ChatSession.findOne({ sessionId });
    if (!session) {
      // Create a new session if one doesn't exist
      session = new ChatSession({
        userId,
        sessionId,
        messages: []
      });
    }
    
    // Add user message to the session
    session.messages.push({
      role: 'user',
      content,
      timestamp: new Date()
    });
    
    // Save the session with the user message
    await session.save();
    
    // Get user health profile for context if available
    let healthContext = {};
    if (userId) {
      const healthProfile = await HealthProfile.findOne({ userId });
      if (healthProfile) {
        healthContext = {
          basicInfo: healthProfile.basicInfo,
          medicalHistory: healthProfile.medicalHistory,
          lifestyle: healthProfile.lifestyle
        };
      }
    }
    
    // Analyze the query for health insights
    let analysis;
    try {
      analysis = await analyzeHealthQuery(content);
    } catch (error) {
      logger.error('Error analyzing query, continuing with basic response:', error);
      analysis = { error: 'Failed to analyze health query' };
    }
    
    // Update session health context with analysis
    session.healthContext = {
      ...session.healthContext,
      recentAnalysis: analysis
    };
    
    // Format messages for AI processing
    const aiMessages: Message[] = session.messages
      .slice(-10) // Get last 10 messages for context
      .map((msg: any) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }));
    
    // Generate AI response
    let aiResponse;
    try {
      aiResponse = await generateChatResponse(aiMessages, Object.keys(healthContext).length > 0 ? healthContext : undefined);
    } catch (error) {
      logger.error('Error generating AI response:', error);
      if (error instanceof Error) {
        // Check for quota or API key errors
        if (error.message.includes('quota') || error.message.includes('429')) {
          return {
            error: 'OpenAI API quota exceeded. Please check billing details or try again later.',
            sessionId,
            analysis
          };
        } else if (error.message.includes('API key')) {
          return {
            error: 'Invalid API key configuration. Please contact support.',
            sessionId,
            analysis
          };
        }
      }
      // Re-throw for other errors
      throw error;
    }
    
    // Add AI response to the session
    session.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    });
    
    // Save the updated session
    await session.save();
    
    return {
      message: aiResponse,
      sessionId,
      analysis
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error sending message: ${error.message}`);
    } else {
      logger.error('Unknown error sending message');
    }
    throw error;
  }
}; 