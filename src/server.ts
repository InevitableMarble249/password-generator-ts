// src/server-simple.ts
import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

// GitHub dictionary URLs
const GITHUB_ADJECTIVES = 'https://raw.githubusercontent.com/InevitableMarble249/dictionaries/refs/heads/main/adjectives.json';
const GITHUB_NOUNS = 'https://raw.githubusercontent.com/InevitableMarble249/dictionaries/refs/heads/main/nouns.json';
const SPECIAL_CHARS = ['!', '@', '#', '$', '%', '^', '&', '*', '?', '!!', '!!!', '@@', '@@@', '##', '###', '$$', '$$$', '%%', '^^', '&&', '&&&'];

// Utility functions
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement<T>(arr: T[]): T {
  return arr[getRandomInt(0, arr.length - 1)];
}

function capitalize(word: string): string {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Serve static files from public directory
app.use(express.static('public'));

// Generate password
async function generatePassword() {
  console.log('Starting password generation with GitHub dictionaries...');
  
  try {
    // Fetch adjectives and nouns from GitHub
    console.log('Fetching from GitHub sources...');
    const [adjectivesRes, nounsRes] = await Promise.all([
      fetch(GITHUB_ADJECTIVES),
      fetch(GITHUB_NOUNS)
    ]);

    if (!adjectivesRes.ok || !nounsRes.ok) {
      throw new Error('Failed to fetch dictionaries from GitHub');
    }

    const adjectives: string[] = await adjectivesRes.json();
    const nouns: string[] = await nounsRes.json();

    // Generate password components
    const adjective = getRandomElement(adjectives);
    const noun = getRandomElement(nouns);
    const capitalized_adjective = capitalize(adjective);
    const capitalized_noun = capitalize(noun);
    
    console.log('Selected adjective:', capitalized_adjective);
    console.log('Selected noun:', capitalized_noun);

    // Add numbers and special character
    const numbers = Array.from({ length: 3 }, () => getRandomInt(0, 9)).join('');
    const special = getRandomElement(SPECIAL_CHARS);

    // Create password
    const password = `${capitalized_adjective}${capitalized_noun}${numbers}${special}`;
    console.log('Password generated (obscured):', '*'.repeat(password.length));

    return {
      password,
      words: {
        adjective: {
          word: capitalized_adjective,
          definition: 'Definition not available'
        },
        noun: {
          word: capitalized_noun,
          definition: 'Definition not available'
        }
      }
    };
  } catch (error) {
    console.error('Error generating password:', error);
    throw error;
  }
}

// API endpoint
app.get('/generate', async (req, res) => {
  console.log('Password generation request received');
  try {
    const result = await generatePassword();
    console.log('Password generated successfully');
    res.json(result);
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ 
      error: 'Failed to generate password',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Using GitHub dictionaries only, no WordNet dependency`);
});
