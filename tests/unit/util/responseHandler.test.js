import { assert, expect } from 'chai'

import { handleResponse } from '../../../util/responseHandler'

describe ('handleResponse', function () {

	describe('happy case', function() {
		let res = {}
		let resData = "hello"
		const expectedData = { data: 'hello' }
		it("should contain response data in res.", function() {
			const actualResponse = handleResponse(res, resData)
			assert.equal(JSON.stringify(expectedData), JSON.stringify(actualResponse.response))
		})
	})

	describe('empty resData', function() {
		let res = {}
		let resData = ""
		const expectedData = { data: '' }
		it("should contain response data in res.", function() {
			const actualResponse = handleResponse(res, resData)
			assert.equal(JSON.stringify(expectedData), JSON.stringify(actualResponse.response))
		})
	})

	describe('undefined resData', function() {
		let res = {}
		let resData = undefined
		const expectedData = {}
		it("should not contain response data in res.", function() {
			const actualResponse = handleResponse(res, resData)
			assert.equal(JSON.stringify(expectedData), JSON.stringify(actualResponse.response))
		})
	})

	describe('undefined res', function() {
		let res = undefined
		let resData = "test"
		const expectedData = {}
		it("should not contain response data in res.", function() {
			expect(() => handleResponse(res, resData)).to.throw("Cannot set property 'response' of undefined")
		})
	})
})