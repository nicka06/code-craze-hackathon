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

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client (with dummy DATABASE_URL for build time)
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"
RUN npx prisma generate
ENV DATABASE_URL=""

# Build TypeScript
RUN npm run build

# Copy email templates to dist folder (they're not compiled by TypeScript)
RUN mkdir -p dist/templates && cp -r src/templates/* dist/templates/

# Expose port (Cloud Run will set PORT env var)
EXPOSE 8080

# Start the app
CMD ["node", "dist/index.js"]

