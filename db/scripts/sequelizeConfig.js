const path = require('path')
const fs = require('fs')

let env = process.env.NODE_ENV || 'development'
let dbConfig = require(__dirname + "/../../config/config.json")
let sequelizeRC = require(__dirname + "/../../.sequelizerc")

let targetFile = path.resolve(sequelizeRC.config)

let sequelizeCLIConfig = {}
sequelizeCLIConfig[env] = dbConfig.db

fs.writeFile(targetFile, JSON.stringify(sequelizeCLIConfig, null, 4), function(err) {
    if(err) {
        return console.log(err)
    }

    console.log("The sequelizeCLI config file was saved at " + targetFile + "!")
})