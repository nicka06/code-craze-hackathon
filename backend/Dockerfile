# Use Node.js LTS
FROM node:20-slim

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Generate Prisma Client (with dummy DATABASE_URL for build time)
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"
RUN npx prisma generate
ENV DATABASE_URL=""

# Build TypeScript
RUN npm run build

# Expose port (Cloud Run will set PORT env var)
EXPOSE 8080

# Start the app
CMD ["node", "dist/index.js"]

