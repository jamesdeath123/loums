export const toDto = (data, dto) => {
	if (Array.isArray(data) && data.length > 0) {
		let resultDtos = []
		for(let item of data) {
			resultDtos.push(dto(item))
		}
		return resultDtos
	} else {
		return dto(data)
	}
}