FROM node:16.14-alpine3.15

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

COPY package.json ./

RUN npm install --only=production

COPY . /home/node/app

EXPOSE 3001

CMD ["npm", "start"]