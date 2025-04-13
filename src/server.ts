import * as fs from 'fs';
import * as path from 'path';
import express, { Request, Response } from 'express';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// WordNet API endpoints
const WORDNET_API_URL = 'http://docker-wordnet:5001/api/random';

// Special characters for password
const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '{', '}', '[', ']', '|', '\\', ':', ';', '<', '>', ',', '.', '?', '/'];

/**
 * Fetches a random noun from WordNet API
 */
async function fetchRandomNoun(): Promise<string> {
  console.log('Fetching random noun...');
  try {
    const response = await axios.get(`${WORDNET_API_URL}/noun`);
    console.log('Noun API response:', response.data);
    
    if (!response.data || !response.data.word) {
      console.error('Invalid noun response structure:', response.data);
      throw new Error('Invalid response from noun API');
    }
    
    return response.data.word;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error fetching noun:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
    } else {
      console.error('Error fetching random noun:', error);
    }
    throw error;
  }
}

/**
 * Fetches a random adjective from WordNet API
 */
async function fetchRandomAdjective(): Promise<string> {
  console.log('Fetching random adjective...');
  try {
    const response = await axios.get(`${WORDNET_API_URL}/adjective`);
    console.log('Adjective API response:', response.data);
    
    if (!response.data || !response.data.word) {
      console.error('Invalid adjective response structure:', response.data);
      throw new Error('Invalid response from adjective API');
    }
    
    return response.data.word;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error fetching adjective:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
    } else {
      console.error('Error fetching random adjective:', error);
    }
    throw error;
  }
}

/**
 * Capitalizes the first letter of a word
 */
function capitalize(word: string): string {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Generates a random integer between min and max (inclusive)
 */
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Gets a random element from an array
 */
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generates a password in the format: Adjective + Noun + 3 numbers + 3 special characters
 * Both adjective and noun are capitalized
 */
async function generatePassword(): Promise<string> {
  // Get adjective first
  console.log('Starting password generation...');
  const adjective = capitalize(await fetchRandomAdjective());
  console.log('Got adjective:', adjective);
  
  // Then get noun 
  const noun = capitalize(await fetchRandomNoun());
  console.log('Got noun:', noun);
  
  // Generate 3 random numbers
  const numbers = Array.from({ length: 3 }, () => getRandomInt(0, 9)).join('');
  
  // Get 3 random special characters
  const specials = Array.from({ length: 3 }, () => getRandomElement(specialChars)).join('');
  
  // Combine to form password
  const password = `${adjective}${noun}${numbers}${specials}`;
  console.log('Generated password (obscured):', '*'.repeat(password.length));
  return password;
}

// Route for generating passwords
app.get('/generate', async (req: Request, res: Response) => {
  console.log('Password generation request received');
  try {
    const password = await generatePassword();
    console.log('Password generated successfully');
    res.json({ password });
  } catch (error) {
    console.error('Error generating password:', error);
    res.status(500).json({ 
      error: 'Failed to generate password. Make sure the WordNet API is running.',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
