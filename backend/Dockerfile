FROM node:24-bookworm

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3333

CMD ["node", "ace.js", "serve", "--hmr"]