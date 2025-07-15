# === Stage 1: Build the Vite app ===
FROM node:18 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# === Stage 2: Serve the Vite build ===
FROM node:18

WORKDIR /app
RUN npm install -g serve

# COPY build folder from previous stage
COPY --from=builder /app/dist ./build/

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
