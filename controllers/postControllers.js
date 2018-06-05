import express from 'express'
import { handleResponse } from '../util/responseHandler'
import entities from '../entities'

let router = express.Router()

router.post('/new', function(req, res, next) {
	const content = req.body.content
	const level = req.body.level
	entities.Posts.new(content, level)
	.then(function(result) {
		res = handleResponse(res, true, result)
		next()
	})
})

export default router