import express, { Router } from 'express';
import * as healthController from '../controllers/health.controller';

const router: Router = express.Router();

// Health profile routes
router.post('/profile', healthController.createHealthProfile);
router.get('/profile/:userId', healthController.getHealthProfile);
router.put('/profile/:userId', healthController.updateHealthProfile);

// Topics and information routes
router.get('/topics', healthController.getHealthTopics);
router.get('/topics/:topic', healthController.getTopicInfo);

// Health check route
router.get('/status', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Health API is running' });
});

export default router; 