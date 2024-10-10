import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;

export async function textToSpeech(text: string): Promise<string> {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: 'You are a text-to-speech converter. Convert the given text to speech and return the audio URL.'
          },
          {
            role: 'user',
            content: `Convert the following text to speech: "${text}"`
          }
        ],
        max_tokens: 1024,
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract the audio URL from the response
    const audioUrl = response.data.choices[0].message.content;
    
    // Validate the audio URL
    if (!audioUrl || typeof audioUrl !== 'string' || !audioUrl.startsWith('http')) {
      throw new Error('Invalid audio URL received from the API');
    }

    return audioUrl;
  } catch (error) {
    console.error('Error in text-to-speech conversion:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`API error: ${error.response.status} - ${error.response.data.error || 'Unknown error'}`);
    }
    throw new Error('Failed to convert text to speech');
  }
}