<template>
  <div
    @click="navigateToBalance"
    class="flex items-center rounded-full bg-white px-4 py-2 shadow-md border border-slate-200 cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors"
  >
    <div class="text-blue-500 mr-2">
      <Icon icon="mdi:currency-usd" class="h-5 w-5" />
    </div>
    <span class="font-bold text-blue-600">${{ formatNumber(balance) }}</span>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
import { formatNumber } from "@/utils/formatNumber";
import { useBalanceStore } from "@/stores/balance";
import { computed } from "vue";

const router = useRouter();

const balanceStore = useBalanceStore();
const balance = computed(() => {
  return balanceStore.balance;
});

const navigateToBalance = () => {
  router.push("/balance");
};
</script>
