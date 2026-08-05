# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
# Nuxt embeds public runtime config in the browser bundle at build time.
# Keep production defaults explicit; override with compose build args when needed.
ARG API_BASE_URL=https://tejaris.ir/api
ARG SITE_URL=https://tejaris.ir
ENV API_BASE_URL=$API_BASE_URL
ENV SITE_URL=$SITE_URL
RUN yarn build

# Run Stage
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
