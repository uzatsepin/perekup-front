<template>
  <div
    class="bg-white rounded-xl shadow-md overflow-hidden mb-5 fade-in"
    style="animation-delay: 0.2s"
  >
    <div class="flex border-b">
      <button
        v-for="(period, index) in periods"
        :key="index"
        @click="selectedPeriod = period.value"
        class="flex-1 py-3 px-1 text-center font-medium transition-colors relative"
        :class="
          selectedPeriod === period.value
            ? 'text-blue-600'
            : 'text-slate-500 hover:text-slate-700'
        "
      >
        {{ period.label }}
        <div
          v-if="selectedPeriod === period.value"
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
        ></div>
      </button>
    </div>
  </div>

  <!-- История транзакций -->
  <div class="fade-in" style="animation-delay: 0.3s">
    <div class="flex justify-between items-center mb-3">
      <h2 class="text-lg font-bold">История операций</h2>
      <div class="text-sm text-slate-500">
        {{ filteredTransactions.length }}
        {{ getOperationWord(filteredTransactions.length) }}
      </div>
    </div>

    <!-- Список транзакций -->
    <div v-if="filteredTransactions.length > 0" class="space-y-3">
      <div
        v-for="(transaction, index) in filteredTransactions"
        :key="index"
        class="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between"
      >
        <div class="flex items-center">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center mr-3"
            :class="{
              'bg-green-100 text-green-600': transaction.type === 'deposit',
              'bg-red-100 text-red-600': transaction.type === 'withdrawal',
              'bg-blue-100 text-blue-600': transaction.type === 'purchase',
              'bg-amber-100 text-amber-600': transaction.type === 'sale',
              'bg-purple-100 text-purple-600': transaction.type === 'stars',
            }"
          >
            <Icon :icon="getTransactionIcon(transaction.type)" class="h-5 w-5" />
          </div>
          <div>
            <div class="font-medium">{{ transaction.description }}</div>
            <div class="text-xs text-slate-500">{{ formatDate(transaction.date) }}</div>
          </div>
        </div>
        <div
          class="font-bold"
          :class="{
            'text-green-600': transaction.amount > 0,
            'text-red-600': transaction.amount < 0,
          }"
        >
          {{ transaction.amount > 0 ? "+" : "" }}${{ formatNumber(transaction.amount) }}
        </div>
      </div>
    </div>

    <!-- Пустое состояние -->
    <BalanceEmpty v-else />
  </div>
</template>

<script setup lang="ts">
import { formatNumber } from "@/utils/formatNumber";
import { formatDate } from "@/utils/formatDate";
import { Icon } from "@iconify/vue";
import BalanceEmpty from "@/components/Balance/BalanceEmpty.vue";
import { computed, ref } from "vue";
type TransactionType = "deposit" | "withdrawal" | "purchase" | "sale" | "stars";

const periods = [
  { label: "Все", value: "all" },
  { label: "Неделя", value: "week" },
  { label: "Месяц", value: "month" },
];
const selectedPeriod = ref("all");

const transactions = ref<Transaction[]>([
  {
    date: new Date(2024, 5, 15),
    amount: 1000,
    type: "deposit",
    description: "Пополнение баланса",
  },
  {
    date: new Date(2024, 5, 12),
    amount: -8500,
    type: "purchase",
    description: "Покупка Honda Civic",
  },
  {
    date: new Date(2024, 5, 8),
    amount: 24000,
    type: "sale",
    description: "Продажа BMW X5",
  },
  {
    date: new Date(2024, 5, 5),
    amount: -500,
    type: "withdrawal",
    description: "Ремонт Toyota Camry",
  },
  {
    date: new Date(2024, 4, 20),
    amount: 2000,
    type: "stars",
    description: "Пополнение через Telegram Stars",
  },
]);

interface Transaction {
  date: Date;
  amount: number;
  type: TransactionType;
  description: string;
}

// Фильтрованные транзакции в зависимости от выбранного периода
const filteredTransactions = computed(() => {
  if (selectedPeriod.value === "all") {
    return transactions.value;
  }

  const now = new Date();
  let cutoffDate = new Date();

  if (selectedPeriod.value === "week") {
    cutoffDate.setDate(now.getDate() - 7);
  } else if (selectedPeriod.value === "month") {
    cutoffDate.setMonth(now.getMonth() - 1);
  }

  return transactions.value.filter((transaction) => transaction.date >= cutoffDate);
});

const getTransactionIcon = (type: TransactionType) => {
  switch (type) {
    case "deposit":
      return "mdi:bank-plus";
    case "withdrawal":
      return "mdi:bank-minus";
    case "purchase":
      return "mdi:cart";
    case "sale":
      return "mdi:tag-check";
    case "stars":
      return "mdi:star";
    default:
      return "mdi:cash";
  }
};

const getOperationWord = (count: number) => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return "операция";
  } else if ([2, 3, 4].includes(lastDigit) && ![12, 13, 14].includes(lastTwoDigits)) {
    return "операции";
  } else {
    return "операций";
  }
};
</script>

<style scoped></style>
