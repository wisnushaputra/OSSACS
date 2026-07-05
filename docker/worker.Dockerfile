# Use official Node.js image for the worker
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json for the worker
COPY worker/package*.json ./worker/

# Install worker dependencies
RUN npm install --prefix ./worker

# Copy worker source code
COPY worker/src ./worker/src

# Build the worker application
RUN npm run build --prefix ./worker

# --- Final Stage ---
FROM node:20-alpine
WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/worker/dist ./dist
COPY --from=builder /app/worker/node_modules ./node_modules
COPY --from=builder /app/worker/package.json ./
COPY --from=builder /app/worker/.env ./

# Expose port if worker listens on one (not typical for job queue workers)
# EXPOSE 3000

# Command to run the worker
CMD ["node", "dist/index.js"]