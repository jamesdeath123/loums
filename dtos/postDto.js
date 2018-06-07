const toDto = (post) => {
	if (!post.length) {
		//input is a single post
		let replies = []
		if (post.replies) {
			for(let reply of post.replies) {
				replies.push(toDto(reply))
			}
		}
		return {
			id: post.uuid,
			author: post.User.name,
			authorId: post.User.id,
			level: post.level,
			replies: replies,
			content: post.content,
			createdAt: post.created_at
		}
	} else {
		//input is an array of posts
		let results = []
		for(let item of post) {
			results.push(toDto(item))
		}
		return results
	}
}

export default toDto