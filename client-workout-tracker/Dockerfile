# Use the official Node.js 20 Alpine image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Install dependencies from package.json
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000 to the host
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=development

# Install development dependencies and start the development server
CMD ["npm", "run", "dev"]
