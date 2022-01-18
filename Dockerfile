FROM node:16.13.2-alpine3.14

RUN addgroup app && adduser -S -G app app

USER app

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

EXPOSE 3001

CMD [ "pnpm", "start" ]