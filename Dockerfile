FROM node:22.4.1-alpine
WORKDIR /usr/src
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

#cmd ["npm", "start"]
