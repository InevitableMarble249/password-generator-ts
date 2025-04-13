# Strong Password Generator

A modern password generator web application built with TypeScript, Express, and Node.js that creates secure passwords following the format: `AdjectiveNoun123!@#`.

## Features

- **Strong Password Generation**: Creates memorable yet secure passwords combining adjectives, nouns, numbers, and special characters
- **Copy to Clipboard**: One-click copying of generated passwords
- **Dark/Light Mode**: Toggle between themes with automatic system preference detection
- **Responsive Design**: Works on mobile and desktop devices
- **Docker Support**: Easy deployment with Docker and docker-compose

## How It Works

The password generator creates strong, memorable passwords by combining:
- A random capitalized adjective
- A random capitalized noun
- 3 random numbers
- 3 random special characters

For example: `BrightStar123!@#`

This format creates passwords that are:
- Strong (high entropy)
- Easy to remember (due to the word combination)
- Meet requirements for most websites (uppercase, lowercase, numbers, special chars)

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Docker and docker-compose (optional, for containerized deployment)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/password-generator-ts.git
   cd password-generator-ts
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create cache directory
   ```bash
   mkdir -p cache
   ```

4. Run the application
   ```bash
   npm start
   ```

5. Visit `http://localhost:3000` in your browser

### Docker Deployment

To run using Docker:

```bash
docker-compose up -d
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
password-generator-ts/
├── public/                 # Static files
│   ├── index.html          # Main HTML file
│   ├── styles.css          # Styling including dark mode
│   └── script.js           # Client-side JavaScript
├── src/                    # TypeScript source code
│   └── server.ts           # Express server implementation
├── cache/                  # Word cache storage
│   ├── adjectives.json     # Cached adjectives
│   └── nouns.json          # Cached nouns
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose configuration
├── package.json            # Project dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## Development

### Install Development Dependencies

```bash
npm install --save-dev typescript ts-node @types/node @types/express
```

### Run in Development Mode

```bash
npm run dev
```

## Customization

You can modify the password generation logic in `src/server.ts` if you want to change the password format.

## API

The application exposes a simple API:

- `GET /generate` - Returns a JSON object with a randomly generated password
  ```json
  {
    "password": "ExamplePassword123!@#"
  }
  ```

## Security Considerations

- Passwords are generated on the server side
- No passwords are stored on the server
- All password generation happens in memory

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- Word lists are cached for improved performance
- Inspired by modern password security best practices
