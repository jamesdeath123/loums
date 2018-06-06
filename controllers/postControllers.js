import express from 'express'
import { handleResponse } from '../util/responseHandler'
import { toDto } from '../util/DtoHandler'
import postDto from '../dtos/postDto'
import entities from '../entities'

let router = express.Router()

router.post('/new', function(req, res, next) {
	const content = req.body.content
	const author = req.body.author
	const level = req.body.level
	entities.Posts.new(content, author, level)
	.then(function(result) {
		res = handleResponse(res, true, 1, result)
		next()
	})
})

router.get('/:id', function(req, res, next) {
	entities.Posts.getByUUId(req.params.id)
	.then(function(result) {
		if (!result || JSON.stringify(result) === "{}") {
			res = handleResponse(res, true, 0, [])
			next()
		} else {
			res = handleResponse(res, true, 1, toDto(result, postDto))
			next()
		}
	})
})

export default router