# Stage 1: Serve with Nginx
FROM nginx:alpine

# Copy the build output from your LOCAL machine to Docker
# Angular 21 generates files in dist/edu-stream/browser
COPY dist/edu-stream/browser /usr/share/nginx/html

# Copy your configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]