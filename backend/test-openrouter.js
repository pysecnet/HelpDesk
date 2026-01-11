import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1'
});

async function testOpenRouter() {
  try {
    console.log('🔑 API Key loaded:', process.env.OPENROUTER_API_KEY ? 'Yes' : 'No');
    
    console.log('📤 Sending test request...');
    
    const completion = await client.chat.completions.create({
      model: 'meta-llama/llama-3.2-3b-instruct:free',
      messages: [
        { role: 'user', content: 'Say hello in 5 words' }
      ]
    });
    
    console.log('✅ OpenRouter Response:', completion.choices[0].message.content);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testOpenRouter();
