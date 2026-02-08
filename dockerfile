FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Vite preview runs on 4173 by default
EXPOSE 4173

# Serve the built app
CMD ["npm", "run", "preview", "--", "--host"]
