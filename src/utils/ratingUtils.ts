export function formatValue(value: number, tabIndex: number = 0): string {
	if (tabIndex === 0) {
		return value.toLocaleString() // Количество продаж
	} else {
		return `$${value.toLocaleString()}` // Денежные значения
	}
}

/**
 * Получение класса для тренда (положительный/отрицательный/нейтральный)
 */
export function getTrendClass(trend: number): string {
	if (trend > 0) return 'text-emerald-500'
	if (trend < 0) return 'text-red-500'
	return 'text-slate-500'
}

/**
 * Получение иконки для тренда
 */
export function getTrendIcon(trend: number): string {
	if (trend > 0) return 'mdi:arrow-up-bold'
	if (trend < 0) return 'mdi:arrow-down-bold'
	return 'mdi:minus'
}
