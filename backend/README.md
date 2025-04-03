# HealthSparkChat Backend

The backend server for the HealthSparkChat AI health assistant application. This server handles chat interactions, health data storage, and communication with AI health models.

## Features

- AI-powered health assistant chat functionality
- Health profile management
- Session management for persistent conversations
- Health topic information API
- Integration with Google Gemini Pro for AI-powered health assistant

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- Google Generative AI (Gemini) API
- TensorFlow.js (for local model execution)

## Prerequisites

- Node.js (v18+)
- MongoDB (local or cloud instance)
- Google Gemini API key (free)

## Setup and Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root of the backend directory with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/health-assistant
   CORS_ORIGIN=http://localhost:3000
   LOG_LEVEL=debug
   
   # Gemini API Configuration
   GEMINI_API_KEY=your_gemini_api_key
   ```
5. Replace the API key placeholder with your actual key:
   - Get your free Gemini API key from: https://aistudio.google.com/app/apikey

## Testing the AI Provider

### Testing Gemini API Connection

Run the included test script to verify your Gemini API key is working:

```
node scripts/test-gemini.js
```

This will make a simple request to the Gemini API and display the response.

## Running the Server

### Development Mode

```
npm run dev
```

This will start the server in development mode with hot-reloading.

### Production Mode

Build the TypeScript code:
```
npm run build
```

Start the server:
```
npm start
```

## API Endpoints

### Health Endpoints

- `GET /api/health/status`: Check API status
- `POST /api/health/profile`: Create a health profile
- `GET /api/health/profile/:userId`: Get a user's health profile
- `PUT /api/health/profile/:userId`: Update a user's health profile
- `GET /api/health/topics`: Get list of health topics
- `GET /api/health/topics/:topic`: Get info about a specific health topic

### Chat Endpoints

- `POST /api/chat/sessions`: Create a new chat session
- `GET /api/chat/sessions/:sessionId`: Get a chat session by ID
- `GET /api/chat/sessions/user/:userId`: Get all chat sessions for a user
- `POST /api/chat/messages`: Send a message in a chat session

## Integration with Frontend

The backend is designed to be integrated with the HealthSparkChat frontend. The frontend makes API calls to these endpoints to provide the health assistant functionality to users.

## License

[MIT](LICENSE) 