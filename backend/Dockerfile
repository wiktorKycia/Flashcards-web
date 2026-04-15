FROM node:22.18-slim
LABEL authors="wiktor, Jan"

RUN apt-get update -y \
&& apt-get install -y openssl

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]