
# Builder stage.

FROM node AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY ./src ./src
RUN npm ci --quiet && npm run build

# Production stage.

FROM node:14-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --quiet --only=production

COPY --from=builder /usr/src/app/build ./

EXPOSE 3000
CMD [ "node", "index.js" ]

