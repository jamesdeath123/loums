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
		userId: {
			type: sequelize.INTEGER(11),
			allowNull: false,
			field: "user_id",
			references: {
				model: 'users',
				key: 'id'
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE"
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
		Posts.belongsTo(entities.Users)
		Posts.hasMany(entities.PostHistory)
	}

	Posts.getByUUId = function(uuid) {
		return Posts.findAll({where:{uuid},
						include: [{model: entities.Users}]})
	}

	Posts.new = function(content, author, level) {
		let createPost = new Promise((resolve, reject) => {
			entities.PostActionTypes.find({name: 'create'})
			.then(function(type) {
				const uuidv4 = uuid.v4()
				entities.Users.find({where:{name: author}})
				.then(function(user) {
					if (!user) {
						entities.Users.create({name: author})
						.then(function(newUser) {
							Posts.create({content, level, userId: newUser.id, uuid: uuidv4})
							.then(function(newPost) {
								//createPostHistory is not important so won't use callback to block next action
								entities.PostHistory.create({postId: newPost.id, postActionTypeId: type.id})
								resolve(newPost.uuidv4)
							}).catch(function(err) {
								reject(err)
							})
						}).catch(function(err) {
							reject(err)
						})
					} else {
						Posts.create({content, level, userId: user.id, uuid: uuidv4})
						.then(function(newPost) {
							//createPostHistory is not important so won't use callback to block next action
								entities.PostHistory.create({postId: newPost.id, postActionTypeId: type.id})
							resolve(newPost.uuidv4)
						}).catch(function(err) {
							reject(err)
						})
					}
				}).catch(function(err){
					reject(err)
				})
			}).catch(function(err){
				reject(err)
			})
		})
		return createPost
	}

	Posts.getByAuthor = function(author) {
		let getByAuthorPromise = new Promise((resolve, reject) => { entities.Users.find({where:{name:author}})
		.then(function(user) {
			if (!user) {
				resolve({})
			} else {
				entities.Posts.findAll({where:{userId:user.id},
						include: [{model: entities.Users}]})
				.then(function(posts) {
					resolve(posts)
				}).catch(function(err) {
					reject(err)
				})
			}
		}).catch(function(err) {
			reject(err)
		})})
		return getByAuthorPromise
	}

	return Posts
}