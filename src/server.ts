import * as fs from 'fs';
import * as path from 'path';
import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Cache file paths
const ADJECTIVES_CACHE_PATH = path.join(__dirname, '../cache/adjectives.json');
const NOUNS_CACHE_PATH = path.join(__dirname, '../cache/nouns.json');

// Special characters for password
const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '{', '}', '[', ']', '|', '\\', ':', ';', '<', '>', ',', '.', '?', '/'];

/**
 * Checks if cache files exist
 */
function cacheExists(): boolean {
  return fs.existsSync(ADJECTIVES_CACHE_PATH) && fs.existsSync(NOUNS_CACHE_PATH);
}

/**
 * Reads cached words from files
 */
function readFromCache(): Promise<{ adjectives: string[], nouns: string[] }> {
  return new Promise((resolve, reject) => {
    try {
      const adjectives = JSON.parse(fs.readFileSync(ADJECTIVES_CACHE_PATH, 'utf8'));
      const nouns = JSON.parse(fs.readFileSync(NOUNS_CACHE_PATH, 'utf8'));
      resolve({ adjectives, nouns });
    } catch (error) {
      reject(error);
    }
  });
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
 * Main function to load words from cache
 */
async function getWords(): Promise<{ adjectives: string[], nouns: string[] }> {
  if (!cacheExists()) {
    throw new Error('Cache files do not exist. Please run the generator with WordNet first to create the cache files.');
  }
  
  console.log('Loading words from cache...');
  try {
    const { adjectives, nouns } = await readFromCache();
    
    // Verify cache has enough words
    if (adjectives.length < 10 || nouns.length < 10) {
      throw new Error('Cache files contain insufficient words. Please regenerate them.');
    }
    
    console.log(`Loaded ${adjectives.length} adjectives and ${nouns.length} nouns from cache.`);
    return { adjectives, nouns };
  } catch (error) {
    console.error('Error reading cache:', error);
    throw new Error('Failed to read cache files.');
  }
}

/**
 * Generates a password in the format: Adjective + Noun + 3 numbers + 3 special characters
 * Both adjective and noun are capitalized
 */
function generatePassword(adjectives: string[], nouns: string[]): string {
  // Get random adjective and noun and capitalize them
  const adjective = capitalize(getRandomElement(adjectives));
  const noun = capitalize(getRandomElement(nouns));
  
  // Generate 3 random numbers
  const numbers = Array.from({ length: 3 }, () => getRandomInt(0, 9)).join('');
  
  // Get 3 random special characters
  const specials = Array.from({ length: 3 }, () => getRandomElement(specialChars)).join('');
  
  // Combine to form password
  return `${adjective}${noun}${numbers}${specials}`;
}

// Global variables to store loaded words
let adjectives: string[] = [];
let nouns: string[] = [];

// Route for generating passwords
app.get('/generate', async (req: Request, res: Response) => {
  try {
    // Load words if they haven't been loaded yet
    if (adjectives.length === 0 || nouns.length === 0) {
      const words = await getWords();
      adjectives = words.adjectives;
      nouns = words.nouns;
    }
    
    const password = generatePassword(adjectives, nouns);
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
