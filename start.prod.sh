
node ./node_modules/sequelize-cli/bin/sequelize db:migrate

node ./node_modules/sequelize-cli/bin/sequelize db:seed:all

rm ./config/config.json

cp ./config/config.prod.json ./config/config.json

npm start