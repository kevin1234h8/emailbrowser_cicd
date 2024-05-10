FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
COPY yarn*.lock ./

RUN apk --no-cache add python3 make g++

RUN npm install --force

COPY . .

RUN npm run build

FROM nginx:1.19.0

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/build .

ENTRYPOINT ["nginx", "-g", "daemon off;"]
