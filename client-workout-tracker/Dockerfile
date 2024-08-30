FROM node:20-alpine
WORKDIR /app

# Copy only package.json and package-lock.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Now copy the rest of the application code
COPY . .

EXPOSE 3000
ENV NODE_ENV=development

CMD ["npm", "run", "dev"]
