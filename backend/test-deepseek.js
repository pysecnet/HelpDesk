import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com'
});

async function testDeepSeek() {
  try {
    console.log('🔑 API Key loaded:', process.env.DEEPSEEK_API_KEY ? 'Yes' : 'No');
    
    console.log('📤 Sending test request...');
    
    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'user', content: 'Say hello in 5 words' }
      ]
    });
    
    console.log('✅ DeepSeek Response:', completion.choices[0].message.content);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testDeepSeek();
