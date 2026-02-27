# Use a Debian-slim Node image with up-to-date security patches
FROM node:24-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the package files first to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your frontend code
COPY . .

# Expose the port Vite uses (5173)
EXPOSE 5173

# Run the development server
CMD ["npm", "run", "dev", "--", "--host"]