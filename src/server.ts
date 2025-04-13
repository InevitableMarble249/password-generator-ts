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
 * Fetches a random noun from WordNet API with retry logic
 */
async function fetchRandomNoun(retries = 3): Promise<string> {
  try {
    const response = await axios.get(`${WORDNET_API_URL}/noun`, { timeout: 5000 });
    return response.data.word;
  } catch (error) {
    console.error('Error fetching random noun:', error);
    if (retries > 0) {
      // Wait for 500ms before retrying
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`Retrying noun fetch (${3 - retries + 1}/3)...`);
      return fetchRandomNoun(retries - 1);
    }
    throw new Error('Failed to fetch random noun from WordNet API');
  }
}

/**
 * Fetches a random adjective from WordNet API with retry logic
 */
async function fetchRandomAdjective(retries = 3): Promise<string> {
  try {
    const response = await axios.get(`${WORDNET_API_URL}/adjective`, { timeout: 5000 });
    return response.data.word;
  } catch (error) {
    console.error('Error fetching random adjective:', error);
    if (retries > 0) {
      // Wait for 500ms before retrying
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`Retrying adjective fetch (${3 - retries + 1}/3)...`);
      return fetchRandomAdjective(retries - 1);
    }
    throw new Error('Failed to fetch random adjective from WordNet API');
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
 * Generates a fallback password when API fails
 */
function generateFallbackPassword(): string {
  const fallbackAdjectives = ['Happy', 'Clever', 'Brave', 'Bright', 'Smart', 'Quick', 'Strong', 'Active'];
  const fallbackNouns = ['Tiger', 'Eagle', 'Dolphin', 'Jaguar', 'Falcon', 'Panther', 'Lion', 'Wolf'];
  
  const adjective = getRandomElement(fallbackAdjectives);
  const noun = getRandomElement(fallbackNouns);
  
  // Generate 3 random numbers
  const numbers = Array.from({ length: 3 }, () => getRandomInt(0, 9)).join('');
  
  // Get 3 random special characters
  const specials = Array.from({ length: 3 }, () => getRandomElement(specialChars)).join('');
  
  return `${adjective}${noun}${numbers}${specials}`;
}

/**
 * Generates a password in the format: Adjective + Noun + 3 numbers + 3 special characters
 * Both adjective and noun are capitalized
 */
async function generatePassword(): Promise<string> {
  try {
    // Get random adjective and noun from the WordNet API and capitalize them
    const [adjective, noun] = await Promise.all([
      fetchRandomAdjective().then(capitalize),
      fetchRandomNoun().then(capitalize)
    ]);
    
    // Generate 3 random numbers
    const numbers = Array.from({ length: 3 }, () => getRandomInt(0, 9)).join('');
    
    // Get 3 random special characters
    const specials = Array.from({ length: 3 }, () => getRandomElement(specialChars)).join('');
    
    // Combine to form password
    return `${adjective}${noun}${numbers}${specials}`;
  } catch (error) {
    console.error('Error in password generation, using fallback:', error);
    return generateFallbackPassword();
  }
}

// Route for generating passwords
app.get('/generate', async (req: Request, res: Response) => {
  try {
    const password = await generatePassword();
    res.json({ password });
  } catch (error) {
    console.error('Error generating password:', error);
    res.status(500).json({ error: 'Failed to generate password' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
