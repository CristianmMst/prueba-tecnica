# Base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and install deps
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Run the app
CMD ["node", "dist/index.js"]
