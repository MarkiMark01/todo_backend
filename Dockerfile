# Use the official Node.js 20 image as the base
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy dependency files to the working directory
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

# Install all project dependencies
RUN npm install

# Copy source code and configuration files
COPY src /app/src
COPY prisma /app/prisma
COPY tsconfig.json /app/tsconfig.json
COPY nest-cli.json /app/nest-cli.json

# Generate Prisma Client to enable database interaction
RUN npx prisma generate

# Expose the application port
EXPOSE 3000

# Apply pending migrations and start the application in development mode
# This ensures the app runs directly from source files
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:dev"]