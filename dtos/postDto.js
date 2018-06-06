export default (post) => {
	return {
		id: post.uuid,
		author: post.User.name,
		authorId: post.User.id,
		level: post.level,
		content: post.content,
		createdAt: post.created_at
	}
}