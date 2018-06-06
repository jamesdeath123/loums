export default function(database, sequelize) {
	let PostHistory = database.define('PostHistory', {
		id: {
			type: sequelize.INTEGER(11),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
			isUnique: true
		},
		postId: {
			type: sequelize.INTEGER(11),
			allowNull: false,
			field: "post_id",
			references: {
				model: 'posts',
				key: 'id'
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE"
		},
		postActionTypeId: {
			type: sequelize.INTEGER(11),
			allowNull: false,
			field: "post_action_type_id",
			references: {
				model: 'postActionTypes',
				key: 'id'
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE"
		}
	}, {
		tableName: 'post_history',
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
		underscoredAll: true
	})

	PostHistory.associate = function(entities) {
		PostHistory.belongsTo(entities.Posts)
		PostHistory.belongsTo(entities.PostActionTypes)
	}

	return PostHistory
}