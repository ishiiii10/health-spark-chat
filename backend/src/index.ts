import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import healthRoutes from './routes/health.routes';
import chatRoutes from './routes/chat.routes';
import logger from './utils/logger';

// Load environment variables
dotenv.config();
console.log('Environment loaded, NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  credentials: true
}));
console.log('CORS configured with origin:', process.env.CORS_ORIGIN || 'http://localhost:8080');
app.use(helmet());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  console.log('Health check endpoint hit');
  res.json({ message: 'Health Assistant API is running' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    console.log('Starting server...');
    // Connect to MongoDB
    await connectDB();
    
    // Start express server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

console.log('Calling startServer()');
startServer(); 