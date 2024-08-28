# Step 1: Build the frontend
FROM node:20-alpine as frontend-build

WORKDIR /app/frontend

# Copy the frontend's package.json and package-lock.json
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the frontend code
COPY frontend/ .

# Build the frontend for production with a custom backend URL
ARG VITE_BACKEND
ENV VITE_BACKEND=$VITE_BACKEND


RUN npm run build

# Step 2: Setup the backend
FROM node:20-alpine

WORKDIR /app/backend

# Copy the backend's package.json and package-lock.json
COPY backend/package*.json ./

# Install backend dependencies
RUN npm install

# Copy the backend code
COPY backend/ .

# Copy the frontend build output to the backend's public directory
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist

# Expose the backend port
EXPOSE 6001

# Start the backend server, which serves both backend API and frontend
CMD ["node", "server.js"]
