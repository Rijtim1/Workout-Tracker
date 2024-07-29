# Stage 1: Install dependencies
FROM node:18-alpine AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

# Stage 2: Build the application
FROM node:18-alpine AS builder

WORKDIR /app

COPY . .

COPY --from=dependencies /app/node_modules ./node_modules

RUN npm run build

# Stage 3: Run the application in development mode
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "run", "dev"]
