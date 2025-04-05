export interface PlayerStats {
	value: number
	trend: number
	details?: string
}

export interface Player {
	id: number
	name: string
	avatar: string
	online: boolean
	badge: string
	isMe: boolean
	stats: PlayerStats[]
}

export interface Tab {
	name: string
	icon: string
	description: string
}
