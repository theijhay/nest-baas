# Build
FROM node:23-alpine AS builder

WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

# Run
FROM node:23-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.env ./

CMD ["node", "dist/main"]