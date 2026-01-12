import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGemini() {
  try {
    console.log('🔑 API Key loaded:', process.env.GEMINI_API_KEY ? 'Yes' : 'No');
    
    // Try lighter models first (less likely to be overloaded)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
    
    console.log('📤 Sending test request...');
    const result = await model.generateContent('Say hello in 5 words');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini Response:', text);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGemini();
