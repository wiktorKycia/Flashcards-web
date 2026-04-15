FROM node:22-bullseye

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci

COPY . .

EXPOSE 8081 19006

CMD ["npm", "run", "start", "--", "--web", "--clear"]