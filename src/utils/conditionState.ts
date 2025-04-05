export const getConditionClass = (condition: number) => {
	if (condition >= 80) return 'text-emerald-500'
	if (condition >= 60) return 'text-blue-500'
	if (condition >= 40) return 'text-amber-500'
	return 'text-red-500'
}
