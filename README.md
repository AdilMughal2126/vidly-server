# Vidly API

An Express REST API for [takanome-vidly.netlify.app](https://takanome-vidly.netlify.app/).
See [vidly-client](https://github.com/aTmb405/breads-client) for front end code and more details about the project.

# ⬇️ Installations

- Clone the project: `git clone https://github.com/TAKANOME-DEV/vidly-server.git`
- Install dependencies: `pnpm install`
- Start the server: `pnpm dev`

# Using Docker 🐬

- Build an image: `docker-compose -f docker-compose.yml -f docker-compose.dev.yml build`
- Start the server: `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up`
- You can combine them by running: `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build`

# Technologies 🧑‍💻

- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](http://expressjs.com/)
- [Jest](https://jestjs.io/)
- [MongoDB](https://www.mongodb.com/)
