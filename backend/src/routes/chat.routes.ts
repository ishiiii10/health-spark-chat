import express, { Router } from 'express';
import * as chatController from '../controllers/chat.controller';

const router: Router = express.Router();

// Chat session routes
router.post('/sessions', chatController.createChatSession);
router.get('/sessions/:sessionId', chatController.getChatSession);
router.get('/sessions/user/:userId', chatController.getUserChatSessions);

// Chat message routes
router.post('/messages', chatController.sendMessage);

export default router; 