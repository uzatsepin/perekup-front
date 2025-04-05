export const getLevelBadgeClass = (level: string) => {
	switch (level) {
		case 'premium':
			return 'bg-indigo-100 text-indigo-600'
		case 'standard':
			return 'bg-blue-100 text-blue-600'
		case 'economy':
			return 'bg-emerald-100 text-emerald-600'
		default:
			return 'bg-slate-100 text-slate-600'
	}
}
