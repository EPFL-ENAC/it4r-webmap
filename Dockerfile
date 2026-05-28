FROM node:24-alpine AS build-stage

WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

FROM nginx:stable-alpine AS production-stage

RUN mkdir /app
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/dist/spa  /app

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
