# Use a light server for serving static files
FROM node:20-alpine AS base
WORKDIR /app
COPY frontend/package*.json ./frontend/
RUN npm install

# Build frontend
COPY frontend/ ./frontend/
WORKDIR /app/frontend
RUN npm run build

# Final image using nginx
FROM nginx:alpine
COPY --from=base /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
