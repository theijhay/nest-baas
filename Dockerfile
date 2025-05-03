    FROM node:23-alpine AS builder

    WORKDIR /app
    
    # Only copy package.json first to cache layer
    COPY package.json yarn.lock ./
    
    RUN yarn install --frozen-lockfile
    
    # Now copy the rest of the code
    COPY . .
    
    RUN yarn build
    
    # Production Stage
    FROM node:23-alpine
    
    WORKDIR /app
    
    # Copy built code and node_modules from builder
    COPY --from=builder /app/dist/src ./dist
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/package.json ./
    COPY --from=builder /app/.env ./
    
    # Expose the app port
    EXPOSE 5000
    
    # Always listen on 0.0.0.0
    ENV HOST=0.0.0.0
    
    # Start the app
    CMD ["node", "dist/main"]