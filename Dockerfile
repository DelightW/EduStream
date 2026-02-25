FROM node:22-alpine AS build
WORKDIR /app

# Cache npm install layer separately
COPY package*.json ./
RUN npm ci --prefer-offline

# Copy source and build
COPY . .
RUN ./node_modules/.bin/ng build --configuration production

FROM nginx:alpine
COPY --from=build /app/dist/edu-stream/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]