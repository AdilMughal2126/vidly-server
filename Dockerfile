# Stage 1: Build stage
FROM node:16.14-alpine3.15 AS build-stage

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Production
FROM node:16.14-alpine3.15

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

ENV PATH=$PATH:/home/node/.npm-global/bin

RUN npm i -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod

COPY --from=build-stage /app/dist /home/node/app/

COPY migrate-mongo-config.js migrations /home/node/app/

EXPOSE 3001

CMD ["pnpm", "start"]