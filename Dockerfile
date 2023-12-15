# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to /app
COPY package*.json ./

# Install app dependencies
RUN npm install

# Install LaTeX utilities
RUN apt-get update && apt-get install -y \
    texlive-xetex \
    && rm -rf /var/lib/apt/lists/*

# Bundle app source
COPY . .

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Define environment variable
ENV PORT 8080

# Run app.js when the container launches
CMD ["node", "app.js"]
