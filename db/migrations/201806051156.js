'use strict'

module.exports = {

up: function(queryInterface, sequelize) {
	return queryInterface.createTable(
		'posts', {
			id: {
				type: sequelize.INTEGER(11),
				primaryKey: true,
				autoIncrement: true,
				isUnique: true,
				allowNull: false
			},
			content: {
				type: sequelize.STRING(280),
				allowNull: false
			},
			uuid: {
				type: sequelize.STRING(45),
				allowNull: false,
				isUnique: true
			},
			level: {
				type: sequelize.INTEGER(4),
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
			return queryInterface.createTable(
				'post_action_types', {
					id: {
						type: sequelize.INTEGER(11),
						primaryKey: true,
						autoIncrement: true,
						isUnique: true,
						allowNull: false
					},
					name: {
						type: sequelize.STRING(30),
						allowNull: false
					}
		}).then(function() {
			return queryInterface.createTable(
				'post_history', {
					id: {
						type: sequelize.INTEGER(11),
						primaryKey: true,
						autoIncrement: true,
						isUnique: true,
						allowNull: false
					},
					post_id: {
						type: sequelize.INTEGER(11),
						allowNull: false,
						references: {
							model: 'posts',
							key: 'id'
						},
						onUpdate: "CASCADE",
						onDelete: "CASCADE"
					},
					post_action_type_id: {
						type: sequelize.INTEGER(11),
						allowNull: false,
						references: {
							model: 'post_action_types',
							key: 'id'
						},
						onUpdate: "CASCADE",
						onDelete: "CASCADE"
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
				})
		})
		})
	}
}