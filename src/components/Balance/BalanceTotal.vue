<template>
  <div
    class="bg-white rounded-xl shadow-md p-5 mb-4 scale-in"
    style="animation-delay: 0.1s"
  >
    <div class="text-sm text-slate-500 mb-1">Текущий баланс</div>
    <div class="flex items-center justify-between">
      <div class="text-3xl font-bold text-blue-600">${{ formatNumber(balance) }}</div>
      <button
        @click="openTopUpModal"
        class="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
      >
        <Icon icon="mdi:plus" class="mr-1.5" />
        Пополнить
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBalanceStore } from "@/stores/balance";
import { formatNumber } from "@/utils/formatNumber";
import { computed } from "vue";

const balanceStore = useBalanceStore();

const openTopUpModal = () => {
  balanceStore.openTopUpModal();
};
const balance = computed(() => {
  return balanceStore.balance;
});
</script>

<style scoped></style>
