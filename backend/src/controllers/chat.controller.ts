import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as chatService from '../services/chat.service';
import logger from '../utils/logger';

/**
 * Create a new chat session
 */
export const createChatSession = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    
    const sessionId = await chatService.createChatSession(userId);
    
    res.status(201).json({
      success: true,
      data: { sessionId }
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error creating chat session: ${error.message}`);
      res.status(500).json({ success: false, error: error.message });
    } else {
      logger.error('Unknown error creating chat session');
      res.status(500).json({ success: false, error: 'Failed to create chat session' });
    }
  }
};

/**
 * Get a chat session by ID
 */
export const getChatSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    const session = await chatService.getChatSession(sessionId);
    
    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error fetching chat session: ${error.message}`);
      if (error.message === 'Chat session not found') {
        return res.status(404).json({ success: false, error: error.message });
      }
      res.status(500).json({ success: false, error: error.message });
    } else {
      logger.error('Unknown error fetching chat session');
      res.status(500).json({ success: false, error: 'Failed to fetch chat session' });
    }
  }
};

/**
 * Get all chat sessions for a user
 */
export const getUserChatSessions = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const sessions = await chatService.getUserChatSessions(userId);
    
    res.status(200).json({
      success: true,
      data: sessions
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error fetching user chat sessions: ${error.message}`);
      res.status(500).json({ success: false, error: error.message });
    } else {
      logger.error('Unknown error fetching user chat sessions');
      res.status(500).json({ success: false, error: 'Failed to fetch user chat sessions' });
    }
  }
};

/**
 * Send a message in a chat session
 */
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { sessionId, message, userId } = req.body;
    
    if (!sessionId || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Session ID and message are required' 
      });
    }
    
    const response = await chatService.sendMessage(sessionId, message, userId);
    
    // Check if the response contains an error
    if (response && 'error' in response) {
      return res.status(429).json({
        success: false,
        error: response.error,
        sessionId: response.sessionId,
        analysis: response.analysis
      });
    }
    
    res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error sending message: ${error.message}`);
      res.status(500).json({ success: false, error: error.message });
    } else {
      logger.error('Unknown error sending message');
      res.status(500).json({ success: false, error: 'Failed to send message' });
    }
  }
}; 