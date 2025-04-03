require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini client
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('Error: GEMINI_API_KEY not found in environment variables');
  console.log('Please add your Gemini API key to the .env file');
  console.log('Get your free Gemini API key from: https://aistudio.google.com/app/apikey');
  process.exit(1);
}

const gemini = new GoogleGenerativeAI(apiKey);

// Test function
async function testGeminiAPI() {
  try {
    console.log('Testing Gemini API connection...');
    
    // Initialize model
    const model = gemini.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    // Simple test prompt
    const prompt = 'What are 3 important health recommendations for maintaining a balanced lifestyle?';
    
    console.log(`Sending test prompt: "${prompt}"`);
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log('\nGemini API Response:');
    console.log('-------------------');
    console.log(text);
    console.log('-------------------');
    
    console.log('\n✅ Gemini API test successful!');
    
  } catch (error) {
    console.error('\n❌ Gemini API test failed');
    console.error('Error details:', error.message);
    
    if (error.message.includes('API key')) {
      console.log('\nTips:');
      console.log('1. Make sure your GEMINI_API_KEY is correct in the .env file');
      console.log('2. Get a new API key from: https://aistudio.google.com/app/apikey');
    }
  }
}

// Run the test
testGeminiAPI(); 