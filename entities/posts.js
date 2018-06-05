import entities from '../entities'
import uuid from 'uuid'

export default function(database, sequelize) {
	let Posts = database.define('Posts', {
		id: {
			type: sequelize.INTEGER(11),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
			isUnique: true
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
		}
	}, {
		tableName: 'posts',
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
		underscoredAll: true
	})

	Posts.associate = function(entities) {
		Posts.hasMany(entities.PostHistory)
	}

	Posts.new = function(content, level) {
		let createPost = new Promise((resolve, reject) => {
			entities.PostActionTypes.find({name: 'create'})
			.then(function(type) {
				const uuidv4 = uuid.v4()
				Posts.create({content, level, uuid: uuidv4})
				.then(function(newPost) {
					entities.PostHistory.create({postId: newPost.id, postActionTypeId: type.id})
					.then(function() {
						resolve(newPost.uuid)
					}).catch(function(err){
						reject(err)
					})
				}).catch(function(err){
					reject(err)
				})
			}).catch(function(err){
				reject(err)
			})
		})
		return createPost
	}

	return Posts
}