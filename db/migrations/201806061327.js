'use strict'

module.exports = {

up: function (queryInterface, sequelize) {
	return queryInterface.addColumn(
		'posts',
		'parent_post_id',
		{
			type: sequelize.INTEGER(11),
			allowNull: true,
			references: {
				model: 'posts',
				key: 'id'
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE"
		})
},

down: function (queryInterface) {
	return queryInterface.removeColumn(
		'posts',
		'parent_post_id'
	)
}

}
