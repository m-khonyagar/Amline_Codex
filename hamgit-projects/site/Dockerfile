# Stage 1: build Next.js
FROM node:20-alpine AS builder

ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_BLOG_URL
ARG NEXT_PUBLIC_API_URL

WORKDIR /app

ENV NODE_ENV=production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only the dependency manifests first for better cache
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN pnpm build


# Stage 2: serve static files
FROM nginx:1.29.1

COPY --from=builder /app/out /usr/share/nginx/html

# Copy custom Nginx config
COPY .nginx/nginx.conf /etc/nginx/nginx.conf

# Expose HTTP port
EXPOSE 80

# Run nginx in foreground (required for Docker)
CMD ["nginx", "-g", "daemon off;"]