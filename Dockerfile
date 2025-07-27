# 1. Base image
FROM node:20

# 2. Set working directory
WORKDIR /app

# 3. Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# 4. Install dependencies
RUN yarn install --frozen-lockfile

# 5. Copy project files
COPY . .

# 6. Build Nuxt app
RUN yarn build

# 7. Expose port and run
EXPOSE 3000
CMD ["yarn", "start"]
