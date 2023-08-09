FROM node:16-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY pnpm-lock.yaml /usr/src/app/

RUN npm install -g pnpm

RUN pnpm install --registry=https://registry.npmmirror.com

COPY . /usr/src/app

EXPOSE 3000
CMD [ "pnpm", "start" ]