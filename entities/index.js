let fs = require("fs")
let path = require("path")
let Sequelize = require("sequelize")
let config = require(__dirname + '/../config/config.json')
let connection = new Sequelize(config.db.database, config.db.username, config.db.password, config.db)
let db = {}

fs
	.readdirSync(__dirname)
	.filter(function(file) {
		return (file.indexOf(".") > 0 ) && (file !== "index.js") && (file.indexOf('.log') == -1 );
	})
	.forEach(function(file) {
		let model = connection.import(path.join(__dirname, file));
		db[model.name] = model;
	})

Object.keys(db).forEach(function(modelName) {
	if ("associate" in db[modelName]) {
		db[modelName].associate(db);
	}
})

db.sequelize = connection
db.Sequelize = Sequelize

export default db
