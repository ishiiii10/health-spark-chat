import { Request, Response } from 'express';
import HealthProfile from '../models/healthProfile.model';
import logger from '../utils/logger';

// Health topics data (could be moved to a database in production)
const healthTopics = [
  {
    id: 'nutrition',
    title: 'Nutrition',
    description: 'Information about healthy eating and dietary recommendations',
    subtopics: ['balanced-diet', 'nutrition-facts', 'dietary-supplements', 'hydration'],
  },
  {
    id: 'exercise',
    title: 'Physical Activity',
    description: 'Guidelines for exercise and staying physically active',
    subtopics: ['cardio', 'strength-training', 'flexibility', 'exercise-plans'],
  },
  {
    id: 'mental-health',
    title: 'Mental Health',
    description: 'Resources for mental wellbeing and psychological health',
    subtopics: ['stress-management', 'anxiety', 'depression', 'mindfulness'],
  },
  {
    id: 'sleep',
    title: 'Sleep Health',
    description: 'Information about healthy sleep habits and sleep disorders',
    subtopics: ['sleep-hygiene', 'sleep-disorders', 'improving-sleep'],
  },
  {
    id: 'preventive-care',
    title: 'Preventive Care',
    description: 'Guidelines for screenings, vaccinations, and preventive health measures',
    subtopics: ['screenings', 'vaccinations', 'check-ups', 'family-history'],
  },
];

/**
 * Create a new health profile
 */
export const createHealthProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }
    
    // Check if profile already exists
    const existingProfile = await HealthProfile.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({ 
        success: false, 
        error: 'Health profile already exists for this user' 
      });
    }
    
    const newProfile = new HealthProfile({
      userId,
      ...req.body,
    });
    
    const savedProfile = await newProfile.save();
    
    res.status(201).json({
      success: true,
      data: savedProfile,
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error creating health profile: ${error.message}`);
      res.status(500).json({ success: false, error: error.message });
    } else {
      logger.error('Unknown error creating health profile');
      res.status(500).json({ success: false, error: 'Failed to create health profile' });
    }
  }
};

/**
 * Get a user's health profile
 */
export const getHealthProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const profile = await HealthProfile.findOne({ userId });
    
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Health profile not found' });
    }
    
    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error fetching health profile: ${error.message}`);
      res.status(500).json({ success: false, error: error.message });
    } else {
      logger.error('Unknown error fetching health profile');
      res.status(500).json({ success: false, error: 'Failed to fetch health profile' });
    }
  }
};

/**
 * Update a user's health profile
 */
export const updateHealthProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const profile = await HealthProfile.findOne({ userId });
    
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Health profile not found' });
    }
    
    // Update profile with request body
    Object.keys(req.body).forEach((key) => {
      if (key !== 'userId') { // Don't allow changing userId
        if (typeof req.body[key] === 'object' && req.body[key] !== null) {
          // For nested objects like basicInfo, medicalHistory, etc.
          // Merge rather than replace to preserve existing fields
          const profileDoc = profile as any; // Type assertion to avoid index signature errors
          if (!profileDoc[key]) profileDoc[key] = {};
          profileDoc[key] = { ...profileDoc[key], ...req.body[key] };
        } else {
          (profile as any)[key] = req.body[key];
        }
      }
    });
    
    const updatedProfile = await profile.save();
    
    res.status(200).json({
      success: true,
      data: updatedProfile,
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error updating health profile: ${error.message}`);
      res.status(500).json({ success: false, error: error.message });
    } else {
      logger.error('Unknown error updating health profile');
      res.status(500).json({ success: false, error: 'Failed to update health profile' });
    }
  }
};

/**
 * Get list of health topics
 */
export const getHealthTopics = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      data: healthTopics,
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error fetching health topics: ${error.message}`);
      res.status(500).json({ success: false, error: error.message });
    } else {
      logger.error('Unknown error fetching health topics');
      res.status(500).json({ success: false, error: 'Failed to fetch health topics' });
    }
  }
};

/**
 * Get information about a specific health topic
 */
export const getTopicInfo = async (req: Request, res: Response) => {
  try {
    const { topic } = req.params;
    
    const topicInfo = healthTopics.find(t => t.id === topic);
    
    if (!topicInfo) {
      return res.status(404).json({ success: false, error: 'Health topic not found' });
    }
    
    // In a real implementation, you would likely fetch more detailed information
    // from a database or another data source
    
    res.status(200).json({
      success: true,
      data: topicInfo,
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error fetching topic info: ${error.message}`);
      res.status(500).json({ success: false, error: error.message });
    } else {
      logger.error('Unknown error fetching topic info');
      res.status(500).json({ success: false, error: 'Failed to fetch topic info' });
    }
  }
}; 