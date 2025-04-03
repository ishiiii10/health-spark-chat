# AI HealthBot - Smart Health Assistant Chatbot

AI HealthBot is an intelligent health assistant chatbot that provides personalized health information, advice, and wellness recommendations powered by AI.

![AI HealthBot Demo](demo-screenshot.png)

## Features

- 💬 AI-powered health assistant chat interface
- 💊 Personalized health recommendations
- 🧠 Integration with Google Gemini for free AI capabilities
- 📊 Health profile management
- 🔄 Persistent chat sessions
- 📱 Responsive design for all devices

## Project Structure

This project is organized into two main components:

- `frontend/`: React-based user interface built with Vite, TypeScript, and Tailwind CSS
- `backend/`: Node.js server using Express, TypeScript, and MongoDB

## Prerequisites

- Node.js (v18+)
- MongoDB (running locally or accessible via cloud)
- Google Gemini API key (free)

## Setup and Installation

### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/health-assistant
   CORS_ORIGIN=http://localhost:3000
   LOG_LEVEL=debug
   
   # Gemini API Configuration
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Replace `your_gemini_api_key` with your actual API key
   - Get your free Gemini API key from: https://aistudio.google.com/app/apikey

5. To test your Gemini API key, run:
   ```
   cd backend
   node scripts/test-gemini.js
   ```

### Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the frontend directory with:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

## Running the Application

### Backend

1. Start the development server:
   ```
   cd backend
   npm run dev
   ```

### Frontend

1. Start the development server:
   ```
   cd frontend
   npm run dev
   ```

2. Open your browser and visit:
   ```
   http://localhost:3000
   ```

## Deployment

### Backend

1. Build the TypeScript code:
   ```
   cd backend
   npm run build
   ```

2. Start the production server:
   ```
   npm start
   ```

### Frontend

1. Build the application:
   ```
   cd frontend
   npm run build
   ```

2. The compiled files will be in the `dist` directory and can be served by any static file server.

## AI Provider

This project uses Google's Gemini Pro for the health assistant functionality:

- Uses Gemini Pro model for advanced capabilities
- Offers free API access with generous quotas
- Get your free API key from: https://aistudio.google.com/app/apikey

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE) 