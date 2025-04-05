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

const router = useRouter();

const props = defineProps({
  balance: {
    type: Number,
    required: true,
  },
});

const navigateToBalance = () => {
  router.push("/balance");
};

// Форматирование числа для отображения с разделителями
const formatNumber = (num: number) => {
  return num.toLocaleString("en-US");
};
</script>
