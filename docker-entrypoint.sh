#!/bin/sh

echo "Waiting for MongoDB to start..."
./wait-for.sh db:27017

echo "Inserting seed-data to the database..."
npm run seed

echo "Starting dev server...."
npm run dev