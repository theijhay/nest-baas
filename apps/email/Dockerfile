# ----------------------
# Build stage
# ----------------------
    FROM node:23-alpine AS builder

    WORKDIR /app
    
    # Install only deps first (for cache)
    COPY package.json yarn.lock ./
    RUN yarn install --frozen-lockfile
    
    # Copy monorepo code
    COPY . .
    
    # Build only the email microservice
    RUN yarn build apps/email
    
    # ----------------------
    # Production
    # ----------------------
    FROM node:23-alpine
    
    WORKDIR /app
    
    # Copy only what's needed
    COPY --from=builder /app/dist/apps/email ./dist
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/package.json ./
    
    # Expose microservice port
    EXPOSE 3001
    
    CMD ["node", "dist/main"]
    