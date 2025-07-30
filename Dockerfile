FROM node:20

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 3000
CMD ["npx", "nuxt", "start", "--hostname", "0.0.0.0", "--port", "3000"]
