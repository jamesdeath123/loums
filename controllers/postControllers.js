import express from 'express'
import { handleResponse } from '../util/responseHandler'
import { toDto } from '../util/DtoHandler'
import postDto from '../dtos/postDto'
import entities from '../entities'

let router = express.Router()

router.post('/new', function(req, res, next) {
	const content = req.body.content
	const author = req.body.author
	const level = 1
	entities.Posts.new(content, author, level)
	.then(function(result) {
		res = handleResponse(res, true, 1, result)
		next()
	}).catch(function(err) {
		appLogger.error(err)
		res.status = 500
		res = handleResponse(res, false, 0, {})
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
	}).catch(function(err) {
		appLogger.error(err)
		res.status = 500
		res = handleResponse(res, false, 0, [])
		next()
	})
})

router.post('/:id/reply', function(req, res, next) {
	const content = req.body.content
	const author = req.body.author
	const parentId = req.params.id
	entities.Posts.reply(parentId, content, author)
	.then(function(result) {
		if (!result || JSON.stringify(result) === "{}") {
			res = handleResponse(res, true, 0, {})
			next()
		} else {
			res = handleResponse(res, true, 1, result)
			next()
		}
	}).catch(function(err) {
		appLogger.error(err)
		res.status = 500
		res = handleResponse(res, false, 0, {})
		next()
	})
})

router.get('/:id/replies', function(req, res, next) {
	entities.Posts.getReplies(req.params.id)
	.then(function(results) {
		if (!results || JSON.stringify(results) === "[]") {
			res = handleResponse(res, true, 0, [])
			next()
		} else {
			res = handleResponse(res, true, 1, toDto(results, postDto))
			next()
		}
	}).catch(function(err) {
		appLogger.error(err)
		res.status = 500
		res = handleResponse(res, false, 0, [])
		next()
	})
})

export default router