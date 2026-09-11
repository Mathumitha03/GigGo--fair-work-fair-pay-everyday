# Stage 1: Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies based on lockfile
COPY package*.json ./
RUN npm install

# Copy source code and build the production bundle
COPY . .
RUN npm run build

# Stage 2: Production web server (Nginx)
FROM nginx:alpine

# Copy custom Nginx web server config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy production build files from build stage to Nginx serve folder
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
