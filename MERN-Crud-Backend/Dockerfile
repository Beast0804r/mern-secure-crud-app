# Use official Node.js image
FROM node:18

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy backend files
COPY . .

# Expose backend port
EXPOSE 5000

CMD ["npm", "start"]
