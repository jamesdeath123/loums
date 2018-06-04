export const handleResponse = (res, result, responseData) => {
	const response = {result: result, data: responseData}
	res.response = response
	return res
}