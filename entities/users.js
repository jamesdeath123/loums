import entities from '../entities'

export default function(database, sequelize) {
	let Users = database.define('Users', {
		id: {
			type: sequelize.INTEGER(11),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
			isUnique: true
		},
		name: {
			type: sequelize.STRING(100),
			allowNull: false,
			isUnique: true
		}
	}, {
		tableName: 'users',
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
		underscoredAll: true
	})

	Users.associate = function(entities) {
		Users.hasMany(entities.Posts)
	}

	return Users
}