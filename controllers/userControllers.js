import express from 'express'
import { handleResponse } from '../util/responseHandler'
import { toDto } from '../util/DtoHandler'
import postDto from '../dtos/postDto'
import entities from '../entities'

let router = express.Router()

router.get('/:userName/posts', function(req, res, next) {
	const userName = req.params.userName
	entities.Posts.getByAuthor(userName)
	.then(function(results) {
		if (!results) {
			res = handleResponse(res, true, 0, {})
			next()
		} else {
			res = handleResponse(res, true, results.length, toDto(results, postDto))
			next()
		}
	})
})

export default router