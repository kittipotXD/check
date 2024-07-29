FROM --platform=linux/amd64 node:lts-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

FROM --platform=linux/amd64 node:lts-slim

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules

COPY . .

CMD ["node", "/app/server.js"]

EXPOSE 3000