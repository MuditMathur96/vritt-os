# Use Node.js base image
FROM node:20

# Set working directory
WORKDIR /app

# Install required system dependencies
RUN apt-get update && apt-get install -y \
    make \
    python3 \
    build-essential
# Copy package manager files first (to leverage Docker cache)
COPY package.json pnpm-workspace.yaml ./
COPY packages/tsconfig/package.json packages/tsconfig/
COPY apps/web/package.json apps/web/
COPY pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm i

# Copy source code
COPY . .

# # Build TypeScript files
# RUN pnpm run build -r
EXPOSE 9000
# Set startup command
CMD ["pnpm", "--filter","@vritt-os/server","run","dev"]
