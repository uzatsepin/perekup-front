import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProfileView from '@/views/ProfileView.vue'
import GarageView from '@/views/GarageView.vue'
import RatingView from '@/views/RatingView.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
		},
		{
			path: '/profile',
			name: 'profile',
			component: ProfileView,
		},
		{
			path: '/garage',
			name: 'garage',
			component: GarageView,
		},
		{
			path: '/car/:id',
			name: 'car-detail',
			component: () => import('@/views/OwnedCarDetailView.vue'),
		},
		{
			path: '/car/:id/sell',
			name: 'car-sell',
			component: () => import('@/views/OwnedCarDetailView.vue'),
		},
		{
			path: '/rating',
			name: 'rating',
			component: RatingView,
		},
		{
			path: '/market',
			name: 'car-market',
			component: () => import('@/views/CarMarketView.vue'),
		},
		{
			path: '/market/car/:id',
			name: 'car-details',
			component: () => import('@/views/CarDetailView.vue'),
		},
		{
			path: '/market/dealership/:id',
			name: 'dealership',
			component: () => import('@/views/DealershipView.vue'),
		},
		{
			path: '/balance',
			name: 'balance',
			component: () => import('../views/BalanceView.vue'),
		},
	],
})

// Добавляем задержку при переходе между маршрутами для отображения анимации загрузки
// router.beforeEach((to, from, next) => {
// 	// Если мы переходим с одной страницы на другую (не первичная загрузка)
// 	if (from.name) {
// 		// Имитируем задержку на 500-1000мс для показа анимации загрузки
// 		setTimeout(
// 			() => {
// 				next()
// 			},
// 			Math.random() * 500 + 500,
// 		) // Случайная задержка от 500 до 1000мс
// 	} else {
// 		// Если это первичная загрузка, не добавляем задержку
// 		next()
// 	}
// })

export default router
