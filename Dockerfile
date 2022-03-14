FROM node:16.14-alpine3.15

RUN npm i -g pnpm

RUN addgroup app && adduser -S -G app app

WORKDIR /app

RUN chown -R app:app /app

RUN chmod 777 /app

USER app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm build

EXPOSE 3001

CMD [ "pnpm", "start"]

# FROM node:16.13.2-alpine3.14
# RUN addgroup app && adduser -S -G app app
# # https://stackoverflow.com/questions/45972608/how-to-give-folder-permissions-inside-a-docker-container-folder#45973108
# WORKDIR /app
# RUN chown -R app:app /app
# RUN chmod 777 /app
# USER app
# COPY package.json ./
# RUN yarn install
# COPY . .
# EXPOSE 3001
# CMD [ "yarn", "run", "dev" ]
