FROM node:16.13.2-alpine3.14

RUN npm install -g pnpm

RUN addgroup app && adduser -S -G app app

USER app

WORKDIR /app

# RUN mkdir data

COPY package.json ./
# COPY tsconfig.json ./

RUN pnpm install

COPY . .

EXPOSE 3001

CMD [ "pnpm", "run", "dev" ]