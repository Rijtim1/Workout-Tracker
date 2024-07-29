# syntax=docker/dockerfile:1

# Use node alpine as it's a small node image
ARG NODE_VERSION=20.12.1
FROM node:${NODE_VERSION}-alpine

# Create the directory on the node image where our app will live
RUN mkdir -p /usr/src/app

# Set /usr/src/app as the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source files into the image
COPY . .

# Ensure port 3000 is accessible to our system
EXPOSE 3000

# Run the application
CMD ["npm", "run", "dev"]
