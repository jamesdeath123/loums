export const handleResponse = (res, result, resultCount, responseData) => {
	const response = {result: result, count: resultCount, data: responseData}
	res.response = response
	return res
}