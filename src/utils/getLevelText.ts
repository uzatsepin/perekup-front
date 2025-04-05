export const getLevelText = (level: string) => {
	switch (level) {
		case 'premium':
			return 'Премиум'
		case 'standard':
			return 'Стандарт'
		case 'economy':
			return 'Эконом'
		default:
			return level
	}
}
