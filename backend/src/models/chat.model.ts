import mongoose from 'mongoose';

// Define Message schema
const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Define Chat Session schema
const chatSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: false, // Optional for anonymous users
    index: true,
  },
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  messages: [messageSchema],
  healthContext: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
chatSessionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create and export Chat Session model
const ChatSession = mongoose.model('ChatSession', chatSessionSchema);

export default ChatSession; 