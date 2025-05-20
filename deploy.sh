#!/bin/bash

# Exit on error
set -e

echo "Starting deployment process..."

# Install dependencies
echo "Installing dependencies..."
npm install --legacy-peer-deps

# Build the application
echo "Building the application..."
npm run build

# Check if the build was successful
if [ $? -eq 0 ]; then
  echo "Build successful!"
else
  echo "Build failed. Exiting deployment."
  exit 1
fi

# Start the application in production mode
echo "Starting the application in production mode..."
npm run start

# Note: In a real deployment scenario, you might want to use a process manager like PM2
# or deploy to a hosting service like Vercel, Netlify, or AWS.
# Example PM2 command:
# pm2 start npm --name "ai-agents-app" -- start

echo "Deployment completed successfully!"
