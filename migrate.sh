#!/bin/bash

# Navigate to the directory containing the Sequelize CLI
cd /Users/timeless/metalbrain/src/server/loader/data

# Run migrations using Sequelize CLI
npx sequelize-cli db:migrate

env-cmd npx sequelize-cli db:migrate

env-cmd npx sequelize-cli db:migrate:undo

# Create a new migration file
npm run migration:create -- --name create-users-table

# Create a new seed file
npm run seed:create -- --name demo-user

# Run seeders
npx sequelize-cli db:seed:all

# Undo seeders
npx sequelize-cli db:seed:undo:all

# Undo migrations
npx sequelize-cli db:migrate:undo

# Undo all migrations
npx sequelize-cli db:migrate:undo:all

# Optionally, run any other necessary commands
# npx sequelize-cli db:seed:all

