export default function(database, sequelize) {
	let PostActionTypes = database.define('PostActionTypes', {
		id: {
			type: sequelize.INTEGER(11),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
			isUnique: true
		},
		name: {
			type: sequelize.STRING(30),
			allowNull: false
		}
	}, {
		tableName: 'post_action_types',
		timestamps: false,
		underscoredAll: true
	})

	PostActionTypes.associate = function(entities) {
		PostActionTypes.hasMany(entities.PostHistory)
	}

	return PostActionTypes
}