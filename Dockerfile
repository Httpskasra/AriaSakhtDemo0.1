# 1. Use Node base image
FROM node:20

# 2. Enable corepack (for pnpm)
RUN corepack enable

# 3. Set working directory
WORKDIR /app

# 4. Copy package.json and lock file
COPY package.json pnpm-lock.yaml ./

# 5. Install dependencies
RUN pnpm install

# 6. Copy rest of the project
COPY . .

# 7. Build the Nuxt app
RUN pnpm build

# 8. Expose port and run
EXPOSE 3000
CMD ["pnpm", "start"]
