import express from 'express'
import { handleResponse } from '../util/responseHandler'

let router = express.Router()

router.get('/', function(req, res, next) {
	res.response = '<div>hello world!</div>'
	next()
})

export default router