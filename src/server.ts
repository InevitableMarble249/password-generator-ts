import * as fs from 'fs';
import * as path from 'path';
import express, { Request, Response } from 'express';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// New URLs for adjectives and nouns
const ADJECTIVES_URL = 'https://raw.githubusercontent.com/InevitableMarble249/dictionaries/refs/heads/main/adjectives.json';
const NOUNS_URL = 'https://raw.githubusercontent.com/InevitableMarble249/dictionaries/refs/heads/main/nouns.json';

// Special characters for password
const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '?', '!!', '!!!', '@@', '@@@', '##', '###', '$$', '$$$', '%%', '^^', '&&', '&&&' ];

/**
 * Fetches a random noun from the new dictionary
 */
async function fetchRandomNoun(): Promise<{ word: string; definition: string }> {
  console.log('Fetching random noun...');
  try {
    const response = await axios.get(NOUNS_URL);
    const nouns = response.data;
    const randomNoun = getRandomElement(nouns);
    
    return {
      word: randomNoun,
      definition: 'Definition not available' // You can modify this if you have definitions
    };
  } catch (error: any) {
    console.error('Error fetching random noun:', error);
    throw error;
  }
}

/**
 * Fetches a random adjective from the new dictionary
 */
async function fetchRandomAdjective(): Promise<{ word: string; definition: string }> {
  console.log('Fetching random adjective...');
  try {
    const response = await axios.get(ADJECTIVES_URL);
    const adjectives = response.data;
    const randomAdjective = getRandomElement(adjectives);
    
    return {
      word: randomAdjective,
      definition: 'Definition not available' // You can modify this if you have definitions
    };
  } catch (error: any) {
    console.error('Error fetching random adjective:', error);
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
async function generatePassword(): Promise<{
  password: string;
  words: {
    adjective: { word: string; definition: string };
    noun: { word: string; definition: string };
  }
}> {
  // Get adjective first
  console.log('Starting password generation...');
  const adjectiveData = await fetchRandomAdjective();
  const capitalized_adjective = capitalize(adjectiveData.word);
  console.log('Got adjective:', capitalized_adjective);
  
  // Then get noun 
  const nounData = await fetchRandomNoun();
  const capitalized_noun = capitalize(nounData.word);
  console.log('Got noun:', capitalized_noun);
  
  // Generate 3 random numbers
  const numbers = Array.from({ length: 3 }, () => getRandomInt(0, 9)).join('');
  
  // Get 1-3 memorable special characters
  const specials = Array.from({ length: 1 }, () => getRandomElement(specialChars)).join('');
  
  // Combine to form password
  const password = `${capitalized_adjective}${capitalized_noun}${numbers}${specials}`;
  console.log('Generated password (obscured):', '*'.repeat(password.length));
  
  return {
    password,
    words: {
      adjective: {
        word: capitalized_adjective,
        definition: adjectiveData.definition
      },
      noun: {
        word: capitalized_noun,
        definition: nounData.definition
      }
    }
  };
}

// Route for generating passwords
app.get('/generate', async (req: Request, res: Response) => {
  console.log('Password generation request received');
  try {
    const result = await generatePassword();
    console.log('Password generated successfully');
    res.json(result);
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
