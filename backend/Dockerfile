FROM node:24-bookworm-slim
LABEL authors="wiktor, Jan"

RUN apt-get update -y \
&& apt-get install -y openssl

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]