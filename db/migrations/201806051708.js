'use strict'

module.exports = {

up: function (queryInterface, sequelize) {
	return queryInterface.createTable(
				'users', {
					id: {
						type: sequelize.INTEGER(11),
						primaryKey: true,
						autoIncrement: true,
						isUnique: true,
						allowNull: false
					},
					name: {
						type: sequelize.STRING(100),
						allowNull: false
					},
					created_at: {
						type: sequelize.DATE,
						allowNull: false,
						defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
					},
					updated_at: {
						type: sequelize.DATE,
						allowNull: false,
						defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
					}
		}).then(function() {
			return queryInterface.addColumn(
				'posts',
				'user_id',
				{
					type: sequelize.INTEGER(11),
					allowNull: false,
					references: {
						model: 'users',
						key: 'id'
					},
					onUpdate: "CASCADE",
					onDelete: "CASCADE"
				}
		)
	})
},

down: function (queryInterface) {
	return queryInterface.removeColumn(
		'posts',
		'user_id'
	).then(function() {
		return queryInterface.dropTable('users')
	})
}
}
