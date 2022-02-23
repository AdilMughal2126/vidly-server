#!/bin/sh

echo 'Waiting for MongoDB to start...'
./wait-for-it.sh db:27017

echo 'Inserting seed-data to the database...'
yarn run seed

echo 'Starting dev server....'
yarn run dev