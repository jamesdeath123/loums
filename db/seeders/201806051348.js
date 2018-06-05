
module.exports = {
	up: function(queryInterface) {
		return queryInterface.sequelize.query(
				"INSERT INTO `post_action_types` VALUES \
				(1,'create'),(2,'edit'),(3,'reply'),\
				(4,'delete'),(5,'flag inappropriate'),(6, 'suggested edit');"
	)}
}