# Use official Node.js image
FROM node:20-alpine AS base

# Install dependencies
WORKDIR /app
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY packages/shared-types/package*.json ./packages/shared-types/
COPY packages/shared-utils/package*.json ./packages/shared-utils/
COPY packages/socket-contracts/package*.json ./packages/socket-contracts/
RUN npm install

# Copy source code
COPY . .
WORKDIR /app/backend
RUN npm run build

# Final image
FROM node:20-alpine
WORKDIR /app
COPY --from=base /app/backend/dist ./dist
COPY --from=base /app/backend/node_modules ./node_modules
COPY --from=base /app/backend/package*.json ./

EXPOSE 3000
CMD ["node", "dist/index.js"]
