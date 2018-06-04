import express from 'express'
import { handleResponse } from '../util/responseHandler'

let router = express.Router()

router.post('/post', function(req, res, next) {
	res = handleResponse(res, true, req.body.data)
	next()
})

export default router