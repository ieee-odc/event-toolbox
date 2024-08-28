# Step 1: Build the frontend
FROM node:20-alpine as build

WORKDIR /app

# Copy the frontend's package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the frontend code
COPY . .

# Build the frontend for production with a custom backend URL
ARG VITE_BACKEND
ENV VITE_BACKEND=$VITE_BACKEND

RUN npm run build

# Step 2: Serve the frontend
FROM nginx:alpine

# Copy the build output to the Nginx HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
