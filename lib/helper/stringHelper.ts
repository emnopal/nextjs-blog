function toTitleCase(str: string) {
	return str.replace(/\w\S*/g, function (txt: string) {
		return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
	})
}

export const stringHelper = {
	toTitleCase,
}
