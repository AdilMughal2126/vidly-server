# Stage 1: Build stage
FROM node:16.14-alpine3.15 AS build-stage

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm build

# Stage 2: Production
FROM node:16.14-alpine3.15

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

COPY package.json ./

RUN npm install --production

COPY --from=build-stage /app/dist /home/node/app/dist

EXPOSE 3001

CMD ["npm", "start"]