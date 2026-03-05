# 1. Use a lightweight Node.js version
FROM node:20-alpine

# 2. Use /app as the folder inside the container (to match your docker-compose)
WORKDIR /app

# 3. Copy only the "grocery list" (package files) first
COPY package*.json ./

# 4. Install the libraries
RUN npm install

# 5. Copy your actual code files
COPY . .

# 6. Expose the port (must match your app's port)
EXPOSE 5000

# 7. THE FIX: Run the source file directly instead of a missing 'dist' folder
# If your main file is named 'server.js', use this:
CMD ["node", "server.js"]