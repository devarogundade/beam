# Use the official Node.js image as a base
FROM node:18

# Create and change to the app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Build the app
RUN npm run build

# Expose the port the app runs on
EXPOSE 80

# Start the app
CMD ["npm", "run", "start:prod"]