# Install dependencies only
FROM node:20-alpine AS builder
WORKDIR /app

# Enable corepack for pnpm
RUN corepack enable

# Copy lockfile and workspace manifest
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./

# Copy only the package.json for client-app and packages it depends on
COPY apps/client-app/ apps/client-app/
COPY packages/tsconfig/package.json packages/tsconfig/


#Environment variables for build time
# 👇 ADD THIS
ARG NEXT_PUBLIC_OSWebServerURL
ENV NEXT_PUBLIC_OSWebServerURL=$NEXT_PUBLIC_OSWebServerURL
ENV NODE_ENV=production
ENV PORT=3000

# Install dependencies
RUN pnpm install --frozen-lockfile --filter @vritt-os/client-app

#Build the application
RUN pnpm --filter @vritt-os/client-app build


# Final production image
FROM node:20-alpine AS runner
WORKDIR /app


ENV NODE_ENV=production
ENV PORT=3000

# Copy necessary files for running the app
COPY --from=builder /app/apps/client-app/.next ./.next
COPY --from=builder /app/apps/client-app/public ./public
COPY --from=builder /app/apps/client-app/next.config.ts ./
COPY --from=builder /app/apps/client-app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Install only production dependencies
RUN corepack enable && pnpm install --prod --filter @vritt-os/client-app

EXPOSE 3000

CMD ["pnpm", "start"]
