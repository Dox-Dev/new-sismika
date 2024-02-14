# Use an official Node runtime as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and pnpm-lock.yaml for installing dependencies
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN npm install -g pnpm && pnpm install

# Bundle your app source inside Docker
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["pnpm", "run", "dev", "--", "--host"]
