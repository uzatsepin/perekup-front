export const formatStatus = (status: string) => {
	switch (status) {
		case 'ready':
			return 'Готов'
		case 'repair':
			return 'Ремонт'
		case 'selling':
			return 'Продается'
		default:
			return status
	}
}
