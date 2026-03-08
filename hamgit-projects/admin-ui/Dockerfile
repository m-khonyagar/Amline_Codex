# deps
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json .npmrc* ./

RUN npm ci

# builder
FROM node:20-alpine AS builder

ARG VITE_APP_TITLE
ARG VITE_USER_CLIENT_APP_URL
ARG VITE_API_BASE_URL
ARG VITE_ACCESS_TOKEN_KEY
ARG VITE_REFRESH_TOKEN_KEY

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# runner
FROM nginx:alpine AS runner

RUN rm -rf /usr/share/nginx/html/*

COPY .nginx/nginx-spa.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
