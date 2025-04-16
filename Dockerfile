# Build
FROM node:18-alpine@sha256:9c1b6e7c6b4c9b3c6e5e6e7c8e9f6a7b8c9d0e1f2a3b4c5d6e7f8g9h0i1j2k3l AS builder

WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

# Run
FROM node:18-alpine@sha256:9c1b6e7c6b4c9b3c6e5e6e7c8e9f6a7b8c9d0e1f2a3b4c5d6e7f8g9h0i1j2k3l

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.env ./

CMD ["node", "dist/main"]
