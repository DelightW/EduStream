# Build
FROM node:20-alpine AS build
WORKDIR /app

# dependencies
COPY package*.json ./
RUN npm install

# Production Build
COPY . .
RUN npx ng build --configuration production

# Serve
FROM nginx:alpine

COPY --from=build /app/dist/edu-stream/browser /usr/share/nginx/html

COPY nginx.conf /etc/ngi~nx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]