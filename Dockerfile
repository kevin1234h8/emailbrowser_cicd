FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN apk --no-cache add python3 make g++

RUN npm install --force

COPY . .

EXPOSE 3000

CMD ["npm","start"]
