# ---------- Build Stage ----------
FROM node:22-slim as builder

WORKDIR /app

COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

# ---------- Run Stage ----------
FROM node:22-slim as runner

WORKDIR /app

COPY --from=builder /app ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["pnpm", "preview"]
