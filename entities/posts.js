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
		parentPostId: {
			type: sequelize.INTEGER(11),
			allowNull: true,
			field: "parent_post_id",
			references: {
				model: 'posts',
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
		Posts.belongsTo(entities.Posts, {as: 'ParentPost', foreignKey: 'parent_post_id', through: Posts})
	}

	Posts.getByUUId = function(uuid) {
		let getPostPromise = new Promise((resolve, reject) => {
				Posts.find({where:{uuid},
				include: [{model: entities.Users}]})
			.then(function(post) {
				Posts.findAll({where:{parentPostId: post.id}, include: [{model: entities.Users}]})
				.then(function(replyPosts) {
					post.replies = replyPosts
					resolve(post)
				}).catch(function(err) {
					console.log(err)
					reject(err)
				})
			}).catch(function(err) {
					console.log(err)
				reject(err)
			})
		})
		return getPostPromise
	}

	Posts.getReplies = function(uuid) {
		let getRepliesPromise = new Promise((resolve, reject) => {
			Posts.find({where:{uuid},
				include: [{model: entities.Users}]})
			.then(function(post) {
				Posts.findAll({where:{parentPostId: post.id}, include: [{model: entities.Users}]})
				.then(function(replyPosts) {
					if (replyPosts.length > 0) {
						let digReplies = []
						for(let reply of replyPosts) {
							let getReplies = Posts.getReplies(reply.uuid).then(function(subReplies) {
								reply.replies = subReplies
							})
							digReplies.push(getReplies)
						}
						Promise.all(digReplies).then(function(subReplies) {
							resolve(replyPosts)
						})
					} else {
						resolve(replyPosts)
					}
				}).catch(function(err) {
					console.log(err)
					reject(err)
				})
			}).catch(function(err) {
					console.log(err)
				reject(err)
			})
		})
		return getRepliesPromise
	}

	Posts.new = function(content, author, level, parentId = null) {
		let createPost = new Promise((resolve, reject) => {
			entities.PostActionTypes.find({name: 'create'})
			.then(function(type) {
				const uuidv4 = uuid.v4()
				entities.Users.find({where:{name: author}})
				.then(function(user) {
					if (!user) {
						entities.Users.create({name: author})
						.then(function(newUser) {
							let newPostData = {content, level, userId: newUser.id, uuid: uuidv4}
							if (parentId != null) {
								newPostData.parentPostId = parentId
							}
							Posts.create(newPostData)
							.then(function(newPost) {
								//createPostHistory is not important so won't use callback to block next action
								entities.PostHistory.create({postId: newPost.id, postActionTypeId: type.id})
								resolve(uuidv4)
							}).catch(function(err) {
								reject(err)
							})
						}).catch(function(err) {
							reject(err)
						})
					} else {
						let newPostData = {content, level, userId: user.id, uuid: uuidv4}
						if (parentId != null) {
							newPostData.parentPostId = parentId
						}
						Posts.create(newPostData)
						.then(function(newPost) {
							//createPostHistory is not important so won't use callback to block next action
								entities.PostHistory.create({postId: newPost.id, postActionTypeId: type.id})
							resolve(uuidv4)
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

	Posts.reply = function(parentId, content, author) {
		let replyPromise = new Promise((resolve, reject) => {
			Posts.getByUUId(parentId)
			.then(function(parentPost) {
				if (!parentPost) {
					reject("Parent post does not exist.")
				} else {
					let level = parentPost.level + 1
					Posts.new(content, author, level, parentPost.id)
					.then(function(newPostId) {
						entities.PostActionTypes.find({name: 'reply'})
						.then(function(pat) {
							entities.PostHistory.create({postId: parentPost.id, postActionTypeId: pat.id})
							resolve(newPostId)
						}).catch(function(err) {
							reject(err)
						})
					}).catch(function(err) {
						reject(err)
					})
				}
			}).catch(function(err) {
				reject(err)
			})
		})

		return replyPromise
	}

	return Posts
}