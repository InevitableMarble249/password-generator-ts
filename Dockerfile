FROM node:18-alpine

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Create cache directory
RUN mkdir -p cache

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
