export const getConditionText = (condition: number) => {
	if (condition >= 80) return 'Отличное'
	if (condition >= 60) return 'Хорошее'
	if (condition >= 40) return 'Среднее'
	return 'Требует ремонта'
}
