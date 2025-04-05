import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBalanceStore = defineStore('balance', () => {
	const showTopUpModal = ref(false)
	const topUpMethod = ref('stars')
	const topUpAmount = ref(10)
	const balance = ref(5000)

	const openTopUpModal = () => {
		showTopUpModal.value = true
		topUpAmount.value = 10
	}

	const closeTopUpModal = () => {
		showTopUpModal.value = false
	}

	const calculateStars = () => {
		return topUpAmount.value / 10
	}
	const processTopUp = () => {
		// В реальном приложении здесь был бы API-запрос для пополнения
		if (topUpMethod.value === 'stars') {
			// Интеграция с Telegram для оплаты Stars
			// window.Telegram?.WebApp?.showPopup(...);

			// Имитация успешного пополнения
			balance.value += topUpAmount.value

			// Добавляем транзакцию в историю
			// transactions.value.unshift({
			//   date: new Date(),
			//   amount: topUpAmount.value,
			//   type: "stars",
			//   description: "Пополнение через Telegram Stars",
			// });
		} else {
			// Другие методы пополнения
			balance.value += topUpAmount.value

			// Добавляем транзакцию в историю
			// transactions.value.unshift({
			//   date: new Date(),
			//   amount: topUpAmount.value,
			//   type: "deposit",
			//   description: "Пополнение баланса",
			// });
		}

		showTopUpModal.value = false
	}

	return { showTopUpModal, topUpMethod, topUpAmount, balance, calculateStars, openTopUpModal, processTopUp, closeTopUpModal }
})
