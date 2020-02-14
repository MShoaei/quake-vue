FROM node:lts-alpine as builder
RUN apk add python make gcc g++
WORKDIR /app
COPY package*.json ./
#RUN npm install node-gyp --verbose
RUN npm install --verbose
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
#COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
