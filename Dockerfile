# Use an official Node.js runtime as a parent image for building the
# application. Using a separate build stage allows us to include
# development dependencies such as the TypeScript compiler and ts-node
# during the build without bloating the final image.
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package manifest files first to leverage Docker's layer caching. If
# package.json or package-lock.json haven't changed, this layer will be
# reused on subsequent builds which speeds up the build process.
COPY package*.json ./

# Install all dependencies, including devDependencies, because we need
# TypeScript and ts-node during the build stage to compile the TypeScript
# source code. You can optionally run `npm ci` instead of `npm install`
# for more deterministic installs.
RUN npm install

RUN npm audit fix

# Copy the rest of the application into the build container
COPY . .

# Ensure cache directory exists even if it's empty
RUN mkdir -p /app/cache

# Compile the TypeScript sources into JavaScript under the `dist` directory.
RUN npm run build


# Begin a new, minimal runtime stage. Only production dependencies are
# installed here, and the compiled output is copied from the build stage.
FROM node:18-alpine AS runtime

# Set the working directory inside the runtime container
WORKDIR /app

# Copy the package manifests from the build stage. This lets us
# install only the runtime dependencies by excluding devDependencies.
COPY package*.json ./

# Install only production dependencies. The `--omit=dev` flag tells npm
# to skip devDependencies, resulting in a smaller final image.
RUN npm install --omit=dev

# Copy the compiled JavaScript files and public assets from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public

# Copy any other runtime files you need. Here we copy the `cache`
# directory if it exists to ensure runtime has access to cached word
# lists. The `cache` directory will be created at runtime if it does not
# exist in the image.
COPY --from=build /app/cache ./cache

# Create the cache directory if it wasn't present in the source. Doing this
# explicitly prevents the application from crashing if it expects the
# directory to exist on startup.
RUN mkdir -p cache

# Expose the port the application listens on. This allows Docker to map
# incoming traffic to the container port.
EXPOSE 3000

# Define the command to run the application. We run the compiled
# JavaScript rather than the TypeScript sources to avoid requiring
# ts-node in production.
CMD ["node", "dist/server.js"]
