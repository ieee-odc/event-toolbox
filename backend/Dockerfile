# Use an official Node.js image as the base
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the backend code to the working directory
COPY . .

# Expose the port (replace 6001 with the port used in your environment)
EXPOSE 6001

# Start the backend server
CMD ["node", "server.js"]
