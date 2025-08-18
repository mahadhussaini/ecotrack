# Base image (Debian-based to avoid OpenSSL issues with Prisma)
FROM node:20-bookworm-slim AS base
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
RUN npm ci --ignore-scripts
COPY . .

# Build
FROM base AS build
RUN npm run prisma:generate || true
RUN npm run build

# Runtime
FROM node:20-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]

