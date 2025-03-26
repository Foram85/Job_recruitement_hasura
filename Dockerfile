# Use a lightweight Node.js version
FROM node:16

# Set working directory
WORKDIR /app

# Copy only package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose the application port
EXPOSE 3000

# Use ts-node-dev for better watch mode support
CMD ["npm", "run", "start:dev"]
