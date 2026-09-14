FROM node:20-alpine

WORKDIR /app

# Install dependencies first for better layer caching
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# Copy application source code
COPY src/ ./src/

EXPOSE 5000

CMD ["node", "src/server.js"]
