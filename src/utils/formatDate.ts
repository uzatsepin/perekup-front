export const formatDate = (date: Date) => {
	return date.toLocaleDateString('uk-UA', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	})
}
