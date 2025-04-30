# --- Build Stage ---
    FROM node:23-alpine AS builder

    WORKDIR /app
    
    # Copy and install from root
    COPY ../../package.json ../../yarn.lock ./
    RUN yarn install --frozen-lockfile
    
    # Copy full monorepo
    COPY ../../ .
    
    # Build everything
    RUN yarn build
    
    # --- Production Stage ---
    FROM node:23-alpine
    
    WORKDIR /app
    
    COPY --from=builder /app/dist/apps/email ./dist
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/package.json ./
    COPY --from=builder /app/.env ./
    
    EXPOSE 3001
    CMD ["node", "dist/main"]